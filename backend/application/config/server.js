({
	host: '0.0.0.0',
	protocol: process.env.HTTPS,
	balancer: 8000,
	ports: [8001, 8002],
	nagle: false,
	timeouts: {
		bind: 2000,
		start: 30000,
		stop: 5000,
		request: 300000,
		watch: 1000,
	},
	scheduler: {
		concurrency: 1000,
		size: 2000,
		timeout: 3000,
	},
	queue: {
		concurrency: 1000,
		size: 2000,
		timeout: 3000,
	},
	workers: {
		pool: 4,
		wait: 2000,
		timeout: 5000,
	},
	cors: {
		origin: '*',
	},
});
