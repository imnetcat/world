({
	method: lib.utils.wrapErrorForApi(async ({ id }) => {
		const data = await domain.world.get(id);
		return { data };
	}),
});