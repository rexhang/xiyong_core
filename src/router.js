/**
 * @author Rexhang(GuHang)
 * @date 2019/1/14 17:41
 * @Description: 路由配置
 */

/*import ErrorBoundary component*/
import ErrorBoundary from './containers/errorboundary';

import WatchRouter from './watch-router';

import Index from './components/Index';

import Admin from './admin';

import Login from './components/Login';

import React from 'react';

import {HashRouter, Route, Switch} from 'react-router-dom';

import {createStore, applyMiddleware, compose} from 'redux';

import {Provider} from 'react-redux';

import thunk from 'redux-thunk';

import reducer from './reducer';

/*配合ChromeExtension Redux工具进行开发*/
const store = createStore(reducer, compose(
	applyMiddleware(thunk),
	window.__REDUX_DEVTOOLS_EXTENSION__?window.__REDUX_DEVTOOLS_EXTENSION__():f=>f
));

class Router extends React.Component {
	render() {
		const routerConfig = [
			{
				id: 1,
				path: '/admin',
				component: Admin
			},
	        {
		        id: 2,
		        path: '/login',
		        component: Login
	        }
		];
		return (
			<div className="Router">
				<ErrorBoundary>
		            <Provider store={store}>
			            <HashRouter>
				            <React.Fragment>
					            <WatchRouter />
					            <Switch>
						            <Switch>
							            <Route exact path="/" component={Admin} />
							            {
								            routerConfig.map(v=>
									            <Route key={v.id} path={v.path} component={v.component} />
								            )
							            }
						            </Switch>
					            </Switch>
				            </React.Fragment>
			            </HashRouter>
		            </Provider>
				</ErrorBoundary>
			</div>
		);
	}
}

export default Router;