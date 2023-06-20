import { UnwrapPromise } from '@reduxjs/toolkit/dist/query/tsHelpers';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Api, INTERFACES, MetaAPI } from '../api/metaApi';
import { metaBaseQuery } from './metaBaseQuery';

export const api = createApi({
	baseQuery: metaBaseQuery({ MetaApi: MetaAPI }),
	tagTypes: INTERFACES,
	endpoints: (builder) => {
		return {
			signIn: builder.mutation<
				UnwrapPromise<ReturnType<Api['auth']['signin']>>,
				Parameters<Api['auth']['signin']>[0]
			>({
				query: (params) => ({
					iface: 'auth',
					method: 'signin',
					params,
				}),
				invalidatesTags: [],
			}),
			restore: builder.mutation<
				UnwrapPromise<ReturnType<Api['auth']['restore']>>,
				Parameters<Api['auth']['restore']>[0]
			>({
				query: (params) => ({
					iface: 'auth',
					method: 'restore',
					params,
				}),
				invalidatesTags: [],
			}),
			signOut: builder.mutation<
				UnwrapPromise<ReturnType<Api['auth']['signOut']>>,
				Parameters<Api['auth']['signOut']>[0]
			>({
				query: (params) => ({
					iface: 'auth',
					method: 'signOut',
					params,
				}),
				invalidatesTags: [],
			}),
			validatePassword: builder.mutation<
				UnwrapPromise<ReturnType<Api['auth']['validatePassword']>>,
				Parameters<Api['auth']['validatePassword']>[0]
			>({
				query: (params) => ({
					iface: 'auth',
					method: 'validatePassword',
					params,
				}),
				invalidatesTags: [],
			}),
			changePassword: builder.mutation<
				UnwrapPromise<ReturnType<Api['auth']['changePassword']>>,
				Parameters<Api['auth']['changePassword']>[0]
			>({
				query: (params) => ({
					iface: 'auth',
					method: 'changePassword',
					params,
				}),
				invalidatesTags: [],
			}),
			checkPasswordResetToken: builder.query<
				UnwrapPromise<ReturnType<Api['auth']['check']>>,
				Parameters<Api['auth']['check']>[0]
			>({
				query: (params) => ({
					iface: 'auth',
					method: 'check',
					params,
				}),
				providesTags: [],
			}),
			resetPassword: builder.mutation<
				UnwrapPromise<ReturnType<Api['auth']['reset']>>,
				Parameters<Api['auth']['reset']>[0]
			>({
				query: (params) => ({
					iface: 'auth',
					method: 'reset',
					params,
				}),
				invalidatesTags: [],
			}),

			// user
			getUser: builder.query<
				UnwrapPromise<ReturnType<Api['user']['get']>>,
				Parameters<Api['user']['get']>[0]
			>({
				query: (params) => ({
					iface: 'user',
					method: 'get',
					params,
				}),
				providesTags: (result) =>
					result ? [{ type: 'user', id: result.data.id }] : [],
			}),
			getUsers: builder.query<
				UnwrapPromise<ReturnType<Api['user']['getList']>>,
				Parameters<Api['user']['getList']>[0]
			>({
				query: (params) => ({
					iface: 'user',
					method: 'getList',
					params,
				}),
				providesTags: (result) => [
					...(result?.data || []).map(({ id }) => ({
						type: 'user' as const,
						id,
					})),
					{ type: 'user', id: 'LIST' },
				],
			}),
			createUser: builder.mutation<
				UnwrapPromise<ReturnType<Api['user']['create']>>,
				Parameters<Api['user']['create']>[0]
			>({
				query: (params) => ({
					iface: 'user',
					method: 'create',
					params,
				}),
				invalidatesTags: [{ type: 'user', id: 'LIST' }],
			}),
			deleteUser: builder.mutation<
				UnwrapPromise<ReturnType<Api['user']['delete']>>,
				Parameters<Api['user']['delete']>[0]
			>({
				query: (params) => ({
					iface: 'user',
					method: 'delete',
					params,
				}),
				invalidatesTags: [{ type: 'user', id: 'LIST' }],
			}),
			updateUser: builder.mutation<
				UnwrapPromise<ReturnType<Api['user']['update']>>,
				Parameters<Api['user']['update']>[0]
			>({
				query: (params) => ({
					iface: 'user',
					method: 'update',
					params,
				}),
				invalidatesTags(result, error, delta) {
					return [{ type: 'user', id: delta?.id }];
				},
			}),

			// schema
			getSchema: builder.query<
				UnwrapPromise<ReturnType<Api['schema']['get']>>,
				Parameters<Api['schema']['get']>[0]
			>({
				query: (params) => ({
					iface: 'schema',
					method: 'get',
					params,
				}),
				providesTags: [],
			}),
			getSchemas: builder.query<
				UnwrapPromise<ReturnType<Api['schema']['getList']>>,
				Parameters<Api['schema']['getList']>[0]
			>({
				query: (params) => ({
					iface: 'schema',
					method: 'getList',
					params,
				}),
				providesTags: [],
			}),

			// world
			generateWorld: builder.mutation<
				UnwrapPromise<ReturnType<Api['world']['generate']>>,
				Parameters<Api['world']['generate']>[0]
			>({
				query: (params) => ({
					iface: 'world',
					method: 'generate',
					params,
				}),
				invalidatesTags: [{ type: 'world', id: 'LIST' }],
			}),
			deleteWorldSave: builder.mutation<
				UnwrapPromise<ReturnType<Api['world']['delete']>>,
				Parameters<Api['world']['delete']>[0]
			>({
				query: (params) => ({
					iface: 'world',
					method: 'delete',
					params,
				}),
				invalidatesTags: [{ type: 'world', id: 'LIST' }],
			}),
			getWorld: builder.query<
				UnwrapPromise<ReturnType<Api['world']['get']>>,
				Parameters<Api['world']['get']>[0]
			>({
				query: (params) => ({
					iface: 'world',
					method: 'get',
					params,
				}),
				providesTags: (result) =>
					result ? [{ type: 'world', id: result.data.id }] : [],
			}),
			getWorlds: builder.query<
				UnwrapPromise<ReturnType<Api['world']['getList']>>,
				Parameters<Api['world']['getList']>[0]
			>({
				query: (params) => ({
					iface: 'world',
					method: 'getList',
					params,
				}),
				providesTags: (result) => [
					...(result?.data || []).map(({ id }) => ({
						type: 'world' as const,
						id,
					})),
					{ type: 'world', id: 'LIST' },
				],
			}),
			getWorldLastSave: builder.query<
				UnwrapPromise<ReturnType<Api['world']['getLastSave']>>,
				Parameters<Api['world']['getLastSave']>[0]
			>({
				query: (params) => ({
					iface: 'world',
					method: 'getLastSave',
					params,
				}),
			}),
			getBiomes: builder.query<
				UnwrapPromise<ReturnType<Api['world']['getBiomes']>>,
				Parameters<Api['world']['getBiomes']>[0]
			>({
				query: (params) => ({
					iface: 'world',
					method: 'getBiomes',
					params,
				}),
				providesTags: (result) => [{ type: 'world', id: 'BIOMES' }],
			}),
			setBiomes: builder.mutation<
				UnwrapPromise<ReturnType<Api['world']['setBiomes']>>,
				Parameters<Api['world']['setBiomes']>[0]
			>({
				query: (params) => ({
					iface: 'world',
					method: 'setBiomes',
					params,
				}),
				invalidatesTags: [{ type: 'world', id: 'BIOMES' }],
			}),
		};
	},
});
