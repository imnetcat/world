({
	method: lib.utils.wrapErrorForApi(async ({ name, width, height, generatorConfig }) => {
		const terrain = await domain.world.terrain.generate(width, height, generatorConfig);
		const worldId = await domain.world.save({
			...terrain,
			accountId: context?.session?.state?.accountId,
			name,
		});
		const { data } = await domain.world.get(worldId);
		const time = new Date().getTime();
		return { data, time };
	}),
});