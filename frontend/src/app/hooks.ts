import { api } from './api';

export const {
	// auth
	useSignInMutation,
	useRestoreMutation,
	useSignOutMutation,
	useValidatePasswordMutation,
	useChangePasswordMutation,
	useResetPasswordMutation,
	useCheckPasswordResetTokenQuery,
	// user
	useCreateUserMutation,
	useDeleteUserMutation,
	useGetUserQuery,
	useGetUsersQuery,
	useUpdateUserMutation,
	// schema
	useGetSchemaQuery,
	useGetSchemasQuery,
	// world
	useGenerateWorldMutation,
	useGetWorldQuery,
	useGetWorldsQuery,
	useDeleteWorldSaveMutation,
	useGetWorldLastSaveQuery,
	useGetBiomesQuery,
	useSetBiomesMutation,
} = api;
