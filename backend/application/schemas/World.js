({
	Entity: {},

	name: { type: 'string', required: true },
	account: { type: 'Account', required: true },
	height: { type: 'number', required: true },
	width: { type: 'number', required: true },
	tiles: { type: 'json', required: true },
	generatorConfig: { type: 'json', required: true },
	generationTime: { type: 'number', required: true },
	createdAt: { type: 'datetime', default: 'now', required: true },
});
