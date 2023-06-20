const retry = async <T>(
	fn: () => Promise<T>,
	retryCount = 2,
	timeout = 1000
): Promise<T> => {
	for (let i = 0; i < retryCount - 1; i++) {
		try {
			return await fn();
		} catch (error) {
			console.error(error);
			await new Promise((resolve) => setTimeout(resolve, timeout));
		}
	}
	return fn();
};

export default retry;
