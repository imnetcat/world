({
	columnsList: (columns, fieldPrefix = '') =>
		columns
			.map((column) =>
				column === '*' ? `${fieldPrefix}*` : `${fieldPrefix}"${column}"`
			)
			.join(', '),

	expandSchemaColumns: (schema, fieldPrefix = '') =>
		Object.entries(schema.fields)
			.flatMap(([column, type]) => {
				if (lib.dynamicData.isNestedSchema(type)) {
					return Object.keys(type.fields).map(
						(key) =>
							`${fieldPrefix}"${column}" #> '{${key}}' as "${key}"`
					);
				}
				const name = lib.dynamicData.getFieldName(column, type);
				return `${fieldPrefix}"${name}"`;
			})
			.join(', '),

	limit: (value) => (value ? `LIMIT ${Number(value)}` : ''),

	offset: (value) => (value ? `OFFSET ${Number(value)}` : ''),

	orderBy: (fields = [], defaultPrefix = '') => {
		const orderMapper = {
			descend: 'DESC',
			ascend: 'ASC',
		};
		const fieldMapper = {
			default: ({ field, prefix = defaultPrefix }) =>
				`${prefix}"${field}"`,
			json: ({ field, prefix = defaultPrefix }) =>
				`${prefix}(${field})::text`,
		};
		return fields && fields.length !== 0
			? `ORDER BY ${fields
				.map(
					({
						type = 'default',
						desc,
						order = 'ascend',
						mapper,
						...data
					}) =>
						`${(
							mapper ??
							fieldMapper?.[type] ??
							fieldMapper.default
						)(data)} ${desc
							? orderMapper['descend']
							: orderMapper[order]
						}`
				)
				.join(', ')}`
			: '';
	},

	distinct: (fields = [], prefix = '') =>
		fields.length === 0
			? ''
			: `DISTINCT ON (${fields
				.map((field) => `${prefix}"${field}"`)
				.join(', ')})`,

	where: (
		filters,
		schema,
		firstArgIndex = 1,
		fieldPrefix = '',
		fieldMapper = (v) => v
	) => {
		const operators = lib.queryBuilder.whereOperators;

		const getFieldTypeFromSchema = (fields) => {
			if (fields.length === 1) {
				const field = fields[0];
				if (field === 'id' || field.endsWith('Id')) return 'id';
				return schema?.fields[field]?.type || 'string';
			}
			return lib.utils.schemas.getField(schema, fields)?.type ?? 'string';
		};

		const typeCasts = {
			date: 'timestamp',
			time: 'timestamp',
			datetime: 'timestamp',
		};

		const schemaCast = (fields, type) => {
			if (!type) type = getFieldTypeFromSchema(fields);
			return typeCasts[type] ? `::${typeCasts[type]}` : '';
		};

		const schemaConvertJson = (fields, value, type) => {
			if (type) type = getFieldTypeFromSchema(fields);
			if (value === null) {
				// Return null as undefined to fallback to SQL NULL behavior
				// where =null will also find keys without target key present.
				return undefined;
			}
			if (typeCasts[type] === 'timestamp') {
				return value instanceof Date
					? value.toISOString()
					: String(value);
			}
			// TODO: add unsupported types with `return undefined`.
			return value;
		};

		const args = [];
		const addArg = (value) => args.push(value) + firstArgIndex - 1;
		const getLastArgIndex = () => args.length + firstArgIndex - 1;
		const normalizeSchemaName = (type, fields) => {
			if (fields.length === 1) {
				const isEntity = application.schemas.model.entities.has(type);
				return isEntity ? `${fields[0]}Id` : fields[0];
			}
			return fields[0];
		};

		const formatName = (fields, type) => {
			if (!type) type = getFieldTypeFromSchema(fields);
			const name = normalizeSchemaName(type, fields);
			const typeCast = schemaCast(fields, type);
			if (name.includes('"data"')) return name;
			if (fields.length === 1) {
				return `${fieldPrefix}"${name}"${typeCast}`;
			}
			const jsonPath = fields.slice(1).join(', ');
			return `(${fieldPrefix}"${name}" #>> '{${jsonPath}}')${typeCast}`;
		};
		const formatValue = (value, fields, type) => {
			const typeCast = type !== undefined ? type : schemaCast(fields);
			return `$${addArg(value)}${typeCast}`;
		};

		const buildFilter = (filter, parentOperator = null) => {
			const isOperator = (operator) => operator in operators;

			const normalizeFieldCondition = (condition) => {
				const [operator, value] =
					Object.prototype.toString.call(condition) !==
						'[object Object]'
						? ['=', condition]
						: Object.entries(condition)[0]; // support only one value in condition object

				if (!isOperator(operator)) {
					throw new Error(`Unexpected operator ${operator}`);
				}

				return [operator, value];
			};

			if (filter === undefined || filter === null) return '';

			const conditions = Object.entries(filter);

			if (conditions.length > 1) {
				// If we have an object full of keys we treat it as an array items
				// under the same 'parentOperator'.
				if (parentOperator) {
					return buildFilter({
						[parentOperator]: conditions.map(([key, value]) => ({
							[key]: value,
						})),
					});
				}
				throw new Error(
					'Multiple keys for filter values is not supported'
				);
			}
			if (conditions.length === 0) return '';

			const [[conditionKey, conditionValue]] = conditions;
			if (conditionValue === undefined) return '';

			if (!isOperator(conditionKey)) {
				conditions[0] = normalizeFieldCondition(conditionValue);
			} else if (
				typeof conditionValue === 'object' &&
				!Array.isArray(conditionValue) &&
				(conditionKey === '$and' || conditionKey === '$or')
			) {
				conditions[0][1] = Object.entries(conditionValue).map(
					([key, value]) => ({ [key]: value })
				);
			}
			let fields = conditionKey.split('.');
			let [[operator, value]] = conditions;
			if (!isOperator(conditionKey) && fieldMapper) {
				({
					fields = fields,
					operator = operator,
					value = value,
				} = fieldMapper(
					{ fields, operator, value, path: conditionKey },
					{ schema }
				) ?? {});
			}
			return operators[operator](fields, value, {
				buildFilter,
				prefix: fieldPrefix,
				formatName,
				formatValue,
				addArg,
				getLastArgIndex,
				getFieldTypeFromSchema,
				schema,
				schemaCast,
				schemaConvertJson,
			});
		};

		if (!Array.isArray(filters)) {
			if (!filters) {
				return { clause: '', args };
			}
			filters = [filters];
		}
		const where = buildFilter({ $and: filters });

		const clause = where === '' || where === '()' ? '' : `WHERE ${where}`;

		return { clause, args };
	},

	utils: {
		formatBound(fields, bound, { formatName, formatValue }) {
			const {
				value = fields,
				interval,
				operator = '+',
			} = bound instanceof Date || typeof bound === 'string'
					? { value: bound }
					: bound;

			const formatMappers = {
				now: () => 'NOW()',
				$default: (value, fields) => formatValue(value, fields),
			};

			const formatMapper =
				value === fields
					? formatName(fields)
					: formatMappers[value] ?? formatMappers.$default;

			const formattedValue = formatMapper(value, fields);

			const formattedInterval = interval
				? ` ${operator} ${formatValue(interval, fields, '::interval')}`
				: '';
			return `${formattedValue}${formattedInterval}`;
		},

		DATE_FIELDS: new Set([
			'century',
			'day',
			'decade',
			'dow',
			'doy',
			'epoch',
			'hour',
			'isodow',
			'isoyear',
			'julian',
			'microseconds',
			'millennium',
			'milliseconds',
			'minute',
			'month',
			'quarter',
			'second',
			'timezone',
			'timezone_hour',
			'timezone_minute',
			'week',
			'year',
		]),
	},

	whereOperators: {
		$and: (fields, value, { buildFilter }) =>
			`(${lib.utils
				.iterate(value)
				.filterMap((v) => buildFilter(v, '$and'), null, '')
				.join(' AND ')})`,

		$or: (fields, value, { buildFilter }) =>
			`(${lib.utils
				.iterate(value)
				.filterMap((v) => buildFilter(v, '$or'), null, '')
				.join(' OR ')})`,

		$not: (fields, value, options) =>
			`NOT (${lib.queryBuilder.whereOperators.$and(
				fields,
				value,
				options
			)} IS TRUE)`,

		$in: (fields, value, { formatName, formatValue }) => {
			if (fields.length === 1) {
				return `${formatName(fields)} = ANY(${formatValue(
					value,
					fields
				)})`;
			}
			const jsonValues = value.map((v) => {
				const nestedObj = {};
				lib.utils.setByPath(nestedObj, fields.slice(1), v);
				return nestedObj;
			});
			const jsonField = formatName(fields.slice(0, 1), null);
			const jsonArg = formatValue(jsonValues, fields.slice(0, 1), '');
			return `${jsonField} @> ANY(${jsonArg})`;
		},

		$like: (fields, value, { formatName, formatValue }) =>
			`${formatName(fields)} LIKE ${formatValue(value, fields)}`,

		$ilike: (fields, value, { formatName, formatValue }) =>
			`${formatName(fields)} ILIKE ${formatValue(value, fields)}`,

		$jsonilike: (name, [fields, value], { formatName, formatValue }) => {
			const jsonField = formatName(name.slice(0, 1));
			return `(${jsonField}${fields.length !== 0 ? ' ->' : ''} ${fields
				.map((field) => `'${field}'`)
				.join(' -> ')})::text ILIKE ${formatValue(value, name)}`;
		},

		$between: (fields, [low, high], { formatName, formatValue }) =>
			`${formatName(fields)} BETWEEN ${formatValue(
				low,
				fields
			)} AND ${formatValue(high, fields)}`,

		$contains: (fields, value, { formatName, formatValue }) => {
			const formattedValue = formatValue(
				value.map((s) => `%${s}%`),
				fields
			);
			return `${formatName(fields)} ILIKE ANY(${formattedValue})`;
		},

		'=': (
			fields,
			value,
			{
				formatName,
				formatValue,
				getFieldTypeFromSchema,
				schemaConvertJson,
			}
		) => {
			const type = getFieldTypeFromSchema(fields);
			const jsonValue = schemaConvertJson(fields, value, type);
			if (fields.length === 1 || jsonValue === undefined) {
				return value === null
					? `${formatName(fields)} IS NULL`
					: `${formatName(fields)} = ${formatValue(value, fields)}`;
			}
			const nestedObj = {};
			lib.utils.setByPath(nestedObj, fields.slice(1), jsonValue);
			const jsonField = formatName(fields.slice(0, 1), null);
			const jsonArg = formatValue(nestedObj, fields, '');
			return `${jsonField} @> ${jsonArg}`;
		},

		'!=': (
			fields,
			value,
			{
				formatName,
				formatValue,
				getFieldTypeFromSchema,
				schemaConvertJson,
			}
		) => {
			const type = getFieldTypeFromSchema(fields);
			const jsonValue = schemaConvertJson(fields, value, type);
			if (fields.length === 1 || jsonValue === undefined) {
				return value === null
					? `${formatName(fields)} IS NOT NULL`
					: `${formatName(fields)} != ${formatValue(value, fields)}`;
			}
			const nestedObj = {};
			lib.utils.setByPath(nestedObj, fields.slice(1), jsonValue);
			const jsonField = formatName(fields.slice(0, 1), null);
			const jsonArg = formatValue(nestedObj, fields, '');
			return `(NOT ${jsonField} @> ${jsonArg})`;
		},

		'>': (fields, value, { formatName, formatValue }) =>
			`${formatName(fields)} > ${formatValue(value, fields)}`,

		'<': (fields, value, { formatName, formatValue }) =>
			`${formatName(fields)} < ${formatValue(value, fields)}`,

		'>=': (fields, value, { formatName, formatValue }) =>
			`${formatName(fields)} >= ${formatValue(value, fields)}`,

		'<=': (fields, value, { formatName, formatValue }) =>
			`${formatName(fields)} <= ${formatValue(value, fields)}`,
	},
});
