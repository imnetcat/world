({
	host: process.env.DOMAIN === 'localhost' ? 'db' : process.env.DOMAIN,
	port: process.env.POSTGRES_PORT,
	database: process.env.POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
});
