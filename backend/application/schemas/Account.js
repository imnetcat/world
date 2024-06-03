({
	Entity: {},

	login: {
		type: 'string',
		length: { min: 8, max: 64 },
		unique: true,
	},
	password: { type: 'string', note: 'Password hash' },
	isBlocked: { type: 'boolean', default: false },
	roles: { many: 'Role' },
});
