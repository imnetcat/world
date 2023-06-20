async ({ biomes }) => {
	domain.world.setBiomes(biomes);
	return { data: 'ok' };
}