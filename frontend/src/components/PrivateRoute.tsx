import React from 'react';
import { useSelector } from 'react-redux';
import { RouteProps } from 'react-router';
import { Route, Redirect } from 'react-router-dom';
import { selectIsAuthenticated } from '../app/auth';

const PrivateRoute = (props: RouteProps): JSX.Element => {
	const isAuth = useSelector(selectIsAuthenticated);
	return isAuth ? <Route {...props} /> : <Redirect to="/login" />;
};

export default PrivateRoute;
