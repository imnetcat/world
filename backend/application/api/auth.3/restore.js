({
	access: 'public',
	method: async ({ token }) => {
		const restored = context.client.restoreSession(token);
		const {
			rows: [account],
		} = await domain.db.query(
			`
      SELECT * FROM "Account" 
      WHERE "id" = (
        SELECT "accountId" FROM "Session" WHERE "token" = $1
      )`,
			[token]
		);
		if (restored)
			return {
				status: 'signed',
				user: lib.utils.dropFields(account, ['password']),
			};
		const data = await api.auth.provider.restoreSession(token);
		if (!data) return { status: 'not signed' };
		context.client.startSession(token, data);
		return {
			token,
			status: 'signed',
			user: lib.utils.dropFields(account, ['password']),
		};
	},
});
