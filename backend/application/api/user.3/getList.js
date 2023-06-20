({
	method: lib.utils.wrapErrorForApi(async ({ filters, ...condition }) => {
		await lib.permission.assert(context?.session?.state?.accountId, ['admin']);

		const [data, total] = await Promise.all([
			domain.query.Account.getList({ fields: ['*'], filters, condition }),
			domain.query.Account.count(filters),
		]);

		return { data, total };
	}),
});
