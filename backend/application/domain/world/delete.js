async (id) => {
	await lib.crud.delete('World', id);
	const path = node.path.join(config.world.savesPath, `${id}.json`);
	if (node.fs.existsSync(path)) {
		node.fs.unlinkSync(path);
	}
	return { data: 'ok' };
}