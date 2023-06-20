({
	method: lib.utils.wrapErrorForApi(
		async ({ name }) => await domain.minio.presignedUrl(name)
	),
});
