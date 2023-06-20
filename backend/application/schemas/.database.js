({
	name: 'app',
	description: 'Core Database',
	version: 1,
	driver: 'pg',

	extensions: ['hstore', 'postgis', 'postgis_topology', 'pg_trgm'],

	connection: {
		host: '127.0.0.1',
		port: 5432,
		database: 'app',
		user: 'postgres',
		password: 'postgres',
	},
});
