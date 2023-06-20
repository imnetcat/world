({
	access: 'public',
	method: async ({ token }) => {
		if (!token) {
			throw new Error('Token wasn`t provided');
		}
		await api.auth.provider.deleteSession(token);
		return { status: 'logOut' };
	},
});
