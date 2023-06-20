({
	access: 'public',
	method: async ({ schema }) => ({
		data: application.schemas.model.entities.get(schema),
	}),
});
