({
	generateToken() {
		const { characters, secret, length } = config.sessions;
		return metarhia.metautil.generateToken(secret, characters, length);
	},

	async saveSession(token, data) {
		await domain.db.update(
			'Session',
			{ data: JSON.stringify(data) },
			{ token }
		);
	},

	async startSession(token, data, fields = {}) {
		const record = { token, data: JSON.stringify(data), ...fields };
		await domain.db.insert('Session', record);
	},

	async restoreSession(token) {
		const record = await domain.db.row('Session', ['data'], { token });
		if (record && record.data) return record.data;
		return null;
	},

	async deleteSession(token) {
		await domain.db.delete('Session', { token });
	},

	async registerUser(login, password) {
		return domain.db.insert('Account', { login, password });
	},

	async getUser(login) {
		return domain.db.row('Account', { login });
	},
});
