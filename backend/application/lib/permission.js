({
	// Check is user with provided id has one of provided role
	async assert(accountId, roles) {
		const {
			rows: [result],
		} = await domain.db.query(
			'SELECT role, "subscriptionEndDate" FROM "AccountRole" WHERE "accountId" = $1',
			[accountId]
		);
		const now = Date.now();
		return roles.some(
			(role) =>
				role === result.role &&
				now > new Date(result.subscriptionEndDate).getTime()
		);
	},
});
