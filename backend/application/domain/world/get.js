async (id) => {
    const data = await lib.crud.get('World', parseInt(id));
    const path = node.path.join(config.world.savesPath, `${id}.json`);
    const tiles = node.fs.readFileSync(path);
    return { ...data, tiles: JSON.parse(tiles) };
}