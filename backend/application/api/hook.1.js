({
	async router(data) {
		const status = await lib.lowcode.handleHook(data);
		return status || { status: 'nothing to execute' };
	},
});

// You can run this hook from browser:
// fetch('http://127.0.0.1:8001/api/hook/test/f1', { method: 'POST', body: '{ "a": 100 }' });
