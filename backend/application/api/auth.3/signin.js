({
	access: 'public',
	method: async ({ login, password }) => {
		const user = await api.auth.provider.getUser(login);
		if (!user) return { error: 'Incorrect login or password' };
		const { id, password: hash, ...authUser } = user;
		const valid = await metarhia.metautil.validatePassword(password, hash);
		if (!valid) return { error: 'Incorrect login or password' };
		console.log(`Logged user: ${user.login}`);
		const token = api.auth.provider.generateToken();
		const data = { accountId: user.id };
		context.client.startSession(token, data);
		const { ip } = context.client;
		await api.auth.provider.startSession(token, data, {
			ip,
			accountId: id,
		});
		return { status: 'signed', token, user: { id, ...authUser } };
	},
});
