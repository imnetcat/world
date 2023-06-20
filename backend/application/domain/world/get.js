async (id) => {
	const data = await lib.crud.get('World', parseInt(id));
	return { data };
}