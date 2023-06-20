({
	method: lib.utils.wrapErrorForApi(async ({ id, delta }) => {
		await lib.permission.assert(context?.session?.state?.accountId, ['admin']);

		const data = await domain.query.Account.update({
			id,
			delta,
		});

		return { data };
	}),
});
