({
	create: async (table, data) => {
		const stringifinedData = Object.fromEntries(
			Object.entries(data).map(([key, value]) => [
				key,
				typeof value === 'object' ? JSON.stringify(value) : value,
			])
		);
		const {
			rows: [{ id: resultId }],
		} = await domain.db.insert(table, stringifinedData).returning('id');
		return resultId;
	},

	delete: async (table, id) => {
		const {
			rows: [deletedItem],
		} = await domain.db.delete(table, { id }).returning('id');
		if (deletedItem) {
			return deletedItem.id;
		}
		return null;
	},

	update: async (table, { id, delta, filters = null }) => {
		const schema = application.schemas.model.entities.get(table);
		const { clause: whereClause, args } = filters
			? lib.queryBuilder.where(filters, schema)
			: {
				clause: 'WHERE id = $1',
				args: [id],
			};
		const sql = Object.entries(delta)
			.filter(([, value]) => value !== undefined)
			.map(([field, value]) => {
				const i = args.push(
					typeof value === 'object' ? JSON.stringify(value) : value
				);
				return `"${field}" = $${i}`;
			})
			.join(', ');
		await domain.db.query(
			`UPDATE "${table}" SET ${sql} ${whereClause}`,
			args
		);
		return id;
	},

	deleteWhere: async (table, filters) => {
		const schema = application.schemas.model.entities.get(table);
		const { clause, args } = lib.queryBuilder.where(
			filters,
			schema,
			1,
			't.'
		);

		const query = `
        DELETE FROM "${table}" t
        ${clause}
      `;

		await domain.db.query(query, args);
		return null;
	},

	get: async (table, id) => {
		if (id === null) throw new Error(lib.error.NOT_FOUND);
		const { rows: [data] } = await domain.db.query(`SELECT * FROM "${table}" WHERE id = $1 LIMIT 1`, [id]);
		if (!data) throw new Error(lib.error.NOT_FOUND);
		return data;
	},

	getList: async (
		table,
		filters = [],
		{ orderBy, limit, offset, distinct } = {},
		columns = ['*']
	) => {
		const { where } = lib.queryBuilder;
		const schema = application.schemas.model.entities.get(table);
		const { clause, args } = where(filters, schema, 1, 't.');
		const distinctClause = lib.queryBuilder.distinct(distinct, 't.');
		const columnsList = lib.queryBuilder.columnsList(columns, 't.');
		const { rows } = await domain.db.query(
			`SELECT ${distinctClause} ${columnsList} FROM "${table}" t
            ${clause}
            ${lib.queryBuilder.orderBy(orderBy)}
            ${lib.queryBuilder.limit(limit)}
            ${lib.queryBuilder.offset(offset)}`,
			args
		);
		return rows;
	},

	count: async (table, filters = []) => {
		const schema = application.schemas.model.entities.get(table);
		const { clause, args } = lib.queryBuilder.where(
			filters,
			schema,
			1,
			't.'
		);
		const {
			rows: [{ count }],
		} = await domain.db.query(
			`SELECT count(*) as count FROM "${table}" t ${clause}`,
			args
		);
		return parseInt(count, 10);
	},
});
