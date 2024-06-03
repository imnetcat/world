// keep theme import first to ensure it has the lowest priority
import 'antd/dist/antd.dark.css';
import { useRestoreMutation } from 'app/hooks';
import store from 'app/store';
import { Error } from 'components/Error';
import { Loader } from 'components/Loader';
import PrivateRoute from 'components/PrivateRoute';
import Editor from 'pages/Editor';
import Generator from 'pages/Generator';
import Inspector from 'pages/Inspector';
import LoginPage from 'pages/LoginPage';
import Saves from 'pages/Saves';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import {
	Route,
	BrowserRouter as Router,
	Switch
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
						<Route path="/login" exact component={LoginPage} />
						<PrivateRoute
							path="/"
							exact
							component={Generator}
						/>
						<PrivateRoute
							path="/generator"
							exact
							component={Generator}
						/>
						<PrivateRoute
							path="/inspector/:id"
							component={Inspector}
						/>
						<PrivateRoute
							path="/editor/:id"
							component={Editor}
						/>
						<PrivateRoute
							path="/saves"
							component={Saves}
						/>
					</Switch>
				</Router>
			</div>
		</Provider>
	);
}

export default App;
