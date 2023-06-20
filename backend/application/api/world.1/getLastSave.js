({
	method: lib.utils.wrapErrorForApi(async () => {
		const { data } = await domain.world.getLastSave(
			context?.session?.state?.accountId
		);
		const time = new Date().getTime();
		return { data, time };
	}),
});