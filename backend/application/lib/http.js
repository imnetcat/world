({
	fetch(url, { timeout, ...options }) {
		const dest = new URL(url);
		const protocol = node[dest.protocol.slice(0, -1)];
		return new Promise((resolve, reject) => {
			if (!protocol) reject(new Error('Unknown protocol'));
			const req = protocol.request(url, options, async (res) => {
				if (timeout) {
					setTimeout(() => {
						reject(
							Object.assign(new Error('Request Timeout'), {
								statusMessage: 'TIMEOUT',
							})
						);
					}, timeout);
				}
				const { statusCode } = res;
				const buffers = [];
				for await (const chunk of res) {
					buffers.push(chunk);
				}
				const data = Buffer.concat(buffers).toString();

				if (res.statusCode < 400)
					return void resolve({ data, statusCode });

				reject(
					Object.assign(new Error('Request failed'), {
						statusCode: res.statusCode,
						statusMessage: res.statusMessage,
						data,
					})
				);
			});
			req.on('error', reject);
			if (options.body) {
				const isJson =
					options.headers &&
					options.headers['Content-Type'] === 'application/json';
				const data =
					isJson && typeof options.body !== 'string'
						? JSON.stringify(options.body)
						: options.body;
				req.write(data);
			}
			req.end();
		});
	},

	async fetchJSON(url, options) {
		const reqOptions = { ...options, headers: { ...options.headers } };
		if (reqOptions.body) {
			reqOptions.body =
				typeof reqOptions.body === 'string'
					? reqOptions.body
					: JSON.stringify(reqOptions.body);
			reqOptions.headers['Content-Type'] = 'application/json';
			reqOptions.headers['Content-Length'] = Buffer.byteLength(
				reqOptions.body
			);
		}
		const res = await lib.http.fetch(url, reqOptions).then(
			({ data }) => ({ data: lib.utils.safeParseJSON(data, {}) }),
			(err) => ({
				...err,
				data: lib.utils.safeParseJSON(err.data, err.data),
			})
		);
		if (!res.data || res.statusCode >= 400) {
			throw res;
		}
		return res;
	},
});
