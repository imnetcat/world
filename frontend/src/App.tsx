// keep theme import first to ensure it has the lowest priority
import 'antd/dist/antd.dark.css';
import { useRestoreMutation } from 'app/hooks';
import store from 'app/store';
import { Error } from 'components/Error';
import { Loader } from 'components/Loader';
import PrivateRoute from 'components/PrivateRoute';
import LoginPage from 'pages/LoginPage';
import World from 'pages/World';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import {
	Redirect,
	Route,
	BrowserRouter as Router,
	Switch,
} from 'react-router-dom';
import './App.css';

function App(): React.ReactElement {
	const [status, setStatus] = useState('pending');
	const [restore] = useRestoreMutation();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			restore({ token })
				.then(async (result) => {
					if ('error' in result) {
						setStatus('error');
					} else {
						setStatus(result.data.status);
					}
				})
				.catch(() => setStatus('error'));
		} else {
			setStatus('not signed');
		}
	}, [restore]);

	if (status === 'pending') {
		return <Loader />;
	}

	if (status === 'error') {
		return <Error />;
	}

	return (
		<Provider store={store}>
			<div className="app">
				<Router>
					<Switch>
						<PrivateRoute
							path="/"
							exact
							component={World}
						/>
						<Route path="/login" exact component={LoginPage} />
						<Redirect to="/" />
					</Switch>
				</Router>
			</div>
		</Provider>
	);
}

export default App;
