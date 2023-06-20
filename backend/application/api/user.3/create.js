({
	method: lib.utils.wrapErrorForApi(async (user) => {
		await lib.permission.assert(context?.session?.state?.accountId, ['admin']);
		const { password, ...account } = user;

		const data = await domain.query.Account.create({
			password: await metarhia.metautil.hashPassword(password),
			...account,
		});

		return { data };
	}),
});
