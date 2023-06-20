({
	method: lib.utils.wrapErrorForApi(async ({ id }) => {
		// const terrain = await domain.world.terrain.generate(width, height);
		// await domain.world.save(terrain);
		// const data = await domain.world.terrain.draw(terrain, tileSize);
		return { data: 'ok' };
	}),
});