async () => {
	if (application.worker.id === 'W1') {
		console.debug('Connecting to pg...');
	}

	const options = {
		...config.database,
		console,
		model: application.schemas.model,
	};

	const database = new metarhia.metasql.Database(options);
	domain.db = database;
	if (application.worker.id === 'W1') {
		const {
			rows: [{ now }],
		} = await domain.db.query(`SELECT now()`);
		console.debug(
			`Connected to pg at ${new Date(now).toLocaleTimeString()}`
		);
	}
};
