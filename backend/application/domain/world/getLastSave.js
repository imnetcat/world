async (accountId) => {
	const [data] = await lib.crud.getList(
		'World',
		[{ accountId }],
		{ orderBy: [{ field: 'createdAt', order: 'descend' }], limit: 1 },
	);
	return { data: data !== undefined ? data : null };
}