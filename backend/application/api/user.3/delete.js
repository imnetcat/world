({
	method: lib.utils.wrapErrorForApi(async ({ id }) => {
		await lib.permission.assert(context?.session?.state?.accountId, ['admin']);

		const data = await lib.crud.delete('Account', { id });

		return { data };
	}),
});
