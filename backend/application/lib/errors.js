({
	ServiceError: class ServiceError extends Error {
		constructor(message, context) {
			super(message);
			this.name = 'ServiceError';
			this.context = context;
		}
	},
});
