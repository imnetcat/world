/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { api } from './api';
import { reducer as authReducer } from './auth';

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	auth: authReducer,
});

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultmiddleware) => [
		...getDefaultmiddleware(),
		api.middleware,
	],
});

const token = localStorage.getItem('token');
if (token) {
	// store.dispatch(api.endpoints.restore.initiate({ token }));
}

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
