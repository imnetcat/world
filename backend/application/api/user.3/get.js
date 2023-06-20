({
	method: lib.utils.wrapErrorForApi(async ({ id }) => {
		await lib.permission.assert(context?.session?.state?.accountId, ['admin']);

		const data = await domain.query.Account.get({ id });

		return { data };
	}),
});
