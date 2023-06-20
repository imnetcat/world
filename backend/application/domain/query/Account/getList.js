async ({ filters, condition, fields }) => {
	const data = await lib.crud.getList(
		'Account',
		filters,
		condition,
		fields.includes('id') ? fields : ['id', ...fields]
	);

	const usersWithRoles = await Promise.all(
		data.map(async (user) => {
			const roles = await domain.db.select(
				'AccountRole',
				['role', 'subscriptionEndDate'],
				{ accountId: user.id }
			);

			return { ...user, roles };
		})
	);

	return usersWithRoles;
};
