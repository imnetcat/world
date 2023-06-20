({
	method: lib.utils.wrapErrorForApi(async ({ filters, ...condition }) => {
		const { data, total } = await domain.world.getList(
			context?.session?.state?.accountId,
			filters,
			condition
		);
		return { data, total };
	}),
});