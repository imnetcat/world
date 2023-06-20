({
	method: lib.utils.wrapErrorForApi(async ({ id }) => {
		const data = await domain.world.get({ id });
		const time = new Date().getTime();
		return { data, time };
	}),
});