async ({ id }) => {
	const data = await lib.crud.get('Account', id);

	const roles = await domain.db.select(
		'AccountRole',
		['role', 'subscriptionEndDate'],
		{ accountId: id }
	);

	return { ...data, roles };
};
