({
	datetime: {
		metadata: { pg: 'timestamp with time zone' },
		construct() {},
		checkType() {},
	},
	json: {
		metadata: { pg: 'jsonb' },
		construct() {},
		checkType() {},
	},
	ip: {
		js: 'string',
		metadata: { pg: 'inet' },
		construct() {},
		checkType() {},
	},
});
