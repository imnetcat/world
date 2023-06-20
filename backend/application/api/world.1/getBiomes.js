({
    method: lib.utils.wrapErrorForApi(async () => {
        const data = domain.world.getBiomes();
        const indexed = data.reduce((acc, { biome, color }) => ({ ...acc, [biome]: color }), {});
        return { data, indexed };
    }),
});