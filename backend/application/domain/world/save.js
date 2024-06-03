async ({ tiles, ...worldData }) => {
    const id = await lib.crud.create('World', worldData);
    if (!node.fs.existsSync(config.world.savesPath)) {
        node.fs.mkdirSync(config.world.savesPath, { recursive: true });
    }
    const path = node.path.join(config.world.savesPath, `${id}.json`);
    node.fs.writeFileSync(path, JSON.stringify(tiles), { flag: 'w+' });
    return id;
};