({
	strictStringify: (obj) => JSON.stringify(obj, Object.keys(obj).sort()),

	omit: (obj, keys) =>
		Object.fromEntries(
			Object.entries(obj).filter(([key]) => !keys.includes(key))
		),

	omitBy: (obj, satisfies) =>
		Object.fromEntries(
			Object.entries(obj).filter((entry) => !satisfies(entry))
		),

	dropFields: (obj, keys) =>
		Object.fromEntries(
			Object.entries(obj).filter(([key]) => !keys.includes(key))
		),

	isNotEmpty: (s) => s?.length > 0,

	isObject: (val) =>
		val !== null && typeof val === 'object' && !Array.isArray(val),

	isDate: (val) => Object.prototype.toString.call(val) === '[object Date]',

	asyncMap: async (arr, mapper) => {
		const mappedArray = [];
		for (const item of arr) {
			mappedArray.push(await mapper(item));
		}
		return mappedArray;
	},

	mapObj: (obj, mapper) =>
		Object.fromEntries(Object.entries(obj).map(mapper)),

	asyncMapObj: async (obj, mapper) =>
		Object.fromEntries(
			await lib.utils.asyncMap(Object.entries(obj), mapper)
		),

	filterMapObj: (obj, mapper) =>
		Object.fromEntries(Object.entries(obj).flatMap(mapper)),

	capitalize: (s) => `${s[0].toUpperCase()}${s.slice(1)}`,

	unzip: (array) => {
		const [left, right] = [[], []];
		for (const [leftItem, rightItem] of array) {
			if (leftItem) left.push(leftItem);
			if (rightItem) right.push(rightItem);
		}
		return [left, right];
	},

	arraysEqual(a, b) {
		if (a === b) return true;
		if (a === null || b === null) return false;
		if (a.length !== b.length) return false;

		// If you don't care about the order of the elements inside
		// the array, you should sort both arrays here.
		// Please note that calling sort on an array will modify that array.
		// you might want to clone your array first.

		for (let i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	},

	async retry(fn, { retryCount = 1, condition = () => true }) {
		for (let retries = 0; retries < retryCount; retries++) {
			const result = await fn().catch((error) => error);
			if (condition(result)) return result;
		}
		throw new Error('Maximum retries count reached');
	},

	randomInteger(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	},

	pickRandom(values) {
		return values[lib.utils.randomInteger(0, values.length)];
	},

	wait(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},

	replacers: {
		dictionary: (dict) => (key) => {
			const keys = key.split('.');
			const property = keys.reduce((obj, key) => obj?.[key], dict);
			return typeof property === 'string'
				? property
				: JSON.stringify(property);
		},
		localizator: (dict, locale) => (key) => {
			if (!dict[key]) {
				console.log(`Localization: no such key ${key}`);
				return '';
			}
			if (!dict[key][locale]) {
				console.log(`No such locale for key ${key} ${locale}`);
				return '';
			}
			return dict[key][locale];
		},
		localizatorWithDefault:
			(dict, locale, defaultLocale = config.bot.defaultLanguage) =>
				(key) => {
					if (!dict[key]) throw new Error(`No such key ${key}`);
					const localized = dict[key][locale];
					if (!localized) {
						if (!dict[key][defaultLocale]) {
							console.log(
								`No default locale ${defaultLocale} and user locale ${locale} for key ${key}`
							);
							return '';
						}
						return dict[key][defaultLocale];
					}
					return localized;
				},
		localizatorWithDefaultLocalization:
			(dict, locale) => (key, defaultLocalization) => {
				if (!dict[key]) key = defaultLocalization;
				if (!dict[key][locale]) {
					console.log(`No such locale for key ${key} ${locale}`);
					return '';
				}
				return dict[key][locale];
			},
	},

	replace(data, matcher, replacer) {
		if (typeof data === 'string') {
			while (data !== (data = data.replace(matcher, replacer))) {
				continue;
			}
			return data;
		} else if (Array.isArray(data)) {
			return data.map((it) => lib.utils.replace(it, matcher, replacer));
		} else if (typeof data === 'object') {
			return lib.utils.mapObj(data, ([key, value]) => [
				key,
				lib.utils.replace(value, matcher, replacer),
			]);
		} else {
			return data;
		}
	},

	getLocalization: (data, lang) => {
		if (!data) throw new Error(`No data to take localization from`);
		const localization =
			data[lib.utils.getLanguage(lang)] ??
			data[config.bot.defaultLanguage];
		if (!localization) {
			console.log(`No localization found for language ${lang}`);
		}
		return localization;
	},

	getLanguage: (lang) =>
		lang && config.bot.allowedLanguages.has(lang.toUpperCase())
			? lang.toUpperCase()
			: config.bot.defaultLanguage,

	isNil: (value) => value === null || value === undefined,

	normalizeFilters: (filters) => {
		const operators = ['$or', '$and', '$not'];

		return filters
			.map((filter) => {
				const [[field, value]] = Object.entries(filter);
				if (operators.includes(field)) {
					const nestedFilters = value;
					if (nestedFilters.length === 0) {
						return null;
					}
					const normalized =
						lib.utils.normalizeFilters(nestedFilters);
					return normalized.length === 0
						? null
						: { [field]: normalized };
				}
				const exactValue = value;
				if (lib.utils.isNil(exactValue)) {
					return null;
				}
				const [innerValue] = Object.values(exactValue);
				if (lib.utils.isNil(innerValue)) {
					return null;
				}
				return { [field]: exactValue };
			})
			.filter((filter) => filter !== null);
	},

	filters: {
		union: (items) => ({ $or: items }),

		excludeFrom: (a, b) => ({ $and: [a, { $not: [b] }] }),

		ids: (ids) => ({ id: { $in: ids } }),
	},

	clamp: (num, { min = 0, max = 1 }) => {
		if (num < min) return min;
		if (num > max) return max;
		return num;
	},

	chunk: (array, chunkSize) =>
		array.reduce((acc, item, index) => {
			if (index % chunkSize === 0) {
				acc.push([]);
			}
			acc[acc.length - 1].push(item);
			return acc;
		}, []),

	delay: (ms, ...args) =>
		new Promise((resolve) => setTimeout(resolve, ms, ...args)),
	timeout: (ms, ...args) =>
		new Promise((_, reject) => setTimeout(reject, ms, ...args)),

	throttledRun: async (fns, opsPerSecond) => {
		const chunks = lib.utils.chunk(fns, opsPerSecond);
		for (const chunk of chunks) {
			const tasks = chunk.map((fn) => fn());
			const started = new Date();
			await Promise.allSettled(tasks);
			const elapsed = new Date() - started;
			if (elapsed < 1000) {
				await lib.utils.delay(1000 - elapsed);
			}
		}
	},

	asyncRateLimit: (fn, maxConcurrency) => {
		const pendingPromises = new Set();
		return async (...args) => {
			while (pendingPromises.size >= maxConcurrency) {
				await Promise.race(pendingPromises);
			}

			const workPromise = fn(...args);
			const taskPromise = workPromise.catch(() => { });
			pendingPromises.add(taskPromise);
			await taskPromise;
			pendingPromises.delete(taskPromise);
			return workPromise;
		};
	},

	replaceAsync: async (str, regex, asyncFn) => {
		const promises = [];
		str.replace(regex, (match, ...args) => {
			const promise = asyncFn(match, ...args);
			promises.push(promise);
		});
		const data = await Promise.all(promises);
		return str.replace(regex, () => data.shift());
	},

	periodicChecker: (fn, interval) => {
		setInterval(fn, interval);
		// const started = new Date();
		// try {
		//   await fn();
		// } catch {
		//   console.log('periodic error');
		//   // do nothing
		// } finally {
		//   const elapsed = new Date() - started;
		//   const nextStart = Math.max(0, interval - elapsed);
		//   // await lib.utils.delay(nextStart);
		//
		//   setTimeout(() => {
		//     lib.utils.periodicChecker(fn, interval);
		//   }, nextStart);
		// }
	},

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_content-disposition_and_link_headers
	encodeRFC5987ValueChars: (str) =>
		encodeURIComponent(str)
			// Note that although RFC3986 reserves "!", RFC5987 does not,
			// so we do not need to escape it
			.replace(/['()]/g, escape) // i.e., %27 %28 %29
			.replace(/\*/g, '%2A')
			// The following are not required for percent-encoding per RFC5987,
			// so we can allow for a little better readability over the wire: |`^
			.replace(/%(?:7C|60|5E)/g, unescape),

	safeParseJSON: (data, fallback = null) => {
		if (!data) return fallback;
		try {
			return JSON.parse(data);
		} catch {
			return fallback;
		}
	},

	iterate: npm['@metarhia/iterator'].iter,
	iterateEntries: npm['@metarhia/iterator'].iterEntries,
	iterateAsync: npm['@metarhia/iterator'].asyncIter,
	iterateRange: npm['@metarhia/iterator'].Iterator.range,

	combineAllSettledErrors(errors) {
		const SEPARATOR = `\n${'-'.repeat(80)}\n`;

		return errors
			.map(({ reason: { message, code, stack } }) =>
				[code && `(${code})`, message, `at ${stack}`]
					.filter(Boolean)
					.join(' ')
			)
			.join(SEPARATOR);
	},

	wrapErrorReturn:
		(fn) =>
			async (...args) => {
				const res = await fn(...args);
				if (res.error) throw res;
				return res.data;
			},

	wrapErrorForApi:
		(fn) =>
			async (...args) => {
				try {
					return await fn(...args);
				} catch (err) {
					const userError = err?.error ?? err;
					if (typeof userError?.toUserFormat === 'function') {
						console.info('API request error', err);
						return { error: userError.toUserFormat() };
					}
					if (userError.code && userError.code < 500) {
						console.info('API request error', err);
						return { error: userError.message };
					}
					console.error('API request error', err);
					throw err;
				}
			},

	wrapExternalReqError(name, reqErr) {
		const code = reqErr.statusCode || 500;
		const errorMessage = reqErr.data?.message || reqErr.statusMessage;
		const err = new lib.errors.ServiceError(
			`${name} request failed ${code} ${errorMessage}`,
			reqErr
		);
		err.code = code;
		return err;
	},

	schemas: {
		validate: (definition, data) => {
			if (!definition) return null;

			const namespaces = application.schemas
				? [application.schemas.model]
				: [];
			const schema = metarhia.metaschema.Schema.from(
				definition,
				namespaces
			);

			const { valid, errors } = schema.check(data);
			return valid
				? null
				: new lib.errors.InvalidArgumentError('SCHEMA_MISSMATCH', {
					errors,
				});
		},
	},

	getByPath: (obj, path = [], defaultValue) => {
		const objPath =
			path instanceof Array ? path : path.toString().split('.');
		return (
			objPath.reduce((acc, field) => acc?.[field], obj) ?? defaultValue
		);
	},

	lookup: async (entities, { prop, lookupAs, idProp = 'id' }, getNested) => {
		const nestedIds = entities
			.map((entry) => entry[prop])
			.filter((id) => !lib.utils.isNil(id));
		const nestedObjects = await getNested([...new Set(nestedIds)]);
		const nestedById = new Map(
			nestedObjects.map((entry) => [entry[idProp], entry])
		);
		return entities.map((entry) => ({
			...entry,
			[lookupAs]: nestedById.get(entry[prop]) ?? null,
		}));
	},
});
