import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { Api, MetaAPI } from '../api/metaApi';
import { FirstParameter } from '../utils/types';

type MetaBaseQueryArgs<A extends Api = Api> = {
	MetaApi: { getInstance(): MetaAPI<A> };
};

/**
 * Creates a baseQuery to be used with metacom.
 */
export const metaBaseQuery =
	<
		A extends Api,
		I extends keyof A,
		M extends keyof A[I],
		F extends A[I][M]
	>({
		MetaApi,
	}: MetaBaseQueryArgs<A>): BaseQueryFn<{
		iface: I;
		method: M;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		params: FirstParameter<F>;
	}> =>
	async (args) => {
		const metaApi = MetaApi.getInstance();
		await metaApi.ready();

		try {
			const response = await metaApi.call(
				args.iface,
				args.method,
				args.params
			);
			if (response.error) {
				const getMessage =
					typeof response.error === 'object'
						? JSON.stringify
						: String;
				throw new Error(getMessage(response.error));
			}
			return { data: response };
		} catch (e) {
			console.error(e);
			return { error: e };
		}
	};
