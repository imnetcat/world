import { createSlice } from '@reduxjs/toolkit';
import { User } from '../api/user';
import { Optional } from '../utils/types';
import { api } from './api';
import { AppState } from './store';

type AuthState = {
	user: Optional<User>;
};

const initialState: AuthState = {
	user: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			api.endpoints.signIn.matchFulfilled,
			(state, { payload }) => {
				state.user = payload.user;
			}
		);
		builder.addMatcher(
			api.endpoints.restore.matchFulfilled,
			(state, { payload }) => {
				state.user = payload.user;
			}
		);
		builder.addMatcher(api.endpoints.signOut.matchFulfilled, (state) => {
			state.user = null;
			localStorage.removeItem('token');
		});
	},
});

export const selectAuthUser = (state: AppState): Optional<User> =>
	state.auth.user;

export const selectIsAuthenticated = (state: AppState): boolean =>
	Boolean(state.auth.user);

export const reducer = authSlice.reducer;
