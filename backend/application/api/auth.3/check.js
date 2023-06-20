({
	access: 'public',
	method: async ({ token }) => {
		const where = { token };
		const res = await domain.db.select(
			'PasswordResetToken',
			['accountId'],
			where
		);
		const accountId = res?.[0]?.accountId;
		return { data: accountId };
	},
});
