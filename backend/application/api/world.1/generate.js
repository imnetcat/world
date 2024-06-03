({
	method: lib.utils.wrapErrorForApi(async ({ name, width, height, generatorConfig }) => {
		const time1 = new Date().getTime();
		const terrain = await domain.world.terrain.generate(width, height, generatorConfig);
		const time2 = new Date().getTime();
		const id = await domain.world.save({
			...terrain,
			accountId: context?.session?.state?.accountId,
			generationTime: time2 - time1,
			name,
		});
		return { data: { id } };
	}),
});