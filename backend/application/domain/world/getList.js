async (accountId, filters = [], condition) => {
	const data = await lib.crud.getList(
		'World',
		[...filters, { accountId }],
		condition,
		['id', 'name', 'generatorConfig', 'height', 'width', 'generationTime', 'createdAt']
	);
	const total = await lib.crud.count('World', [{ accountId }]);
	return { data, total };
}