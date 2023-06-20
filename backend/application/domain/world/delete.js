async (id) => {
	await lib.crud.delete('World', id);
	return { data: 'ok' };
}