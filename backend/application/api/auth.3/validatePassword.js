({
	access: 'public',
	method: async ({ password }) => {
		const user = await domain.db.row('Account', { id: context?.session?.state?.accountId });
		const { password: hash } = user;
		const valid = await metarhia.metautil.validatePassword(password, hash);

		return { status: valid ? 'correct' : 'incorrect' };
	},
});
