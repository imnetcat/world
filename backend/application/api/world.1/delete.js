({
	method: lib.utils.wrapErrorForApi(async ({ id }) => {
		const data = await domain.world.delete(id);
		return { data };
	}),
});