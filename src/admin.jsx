/*
* @Author: guhang
* @Date:   2018-11-02 15:57:02
* @Last Modified by:   guhang
* @Last Modified time: 2018-11-02 16:03:39
*/

import React from 'react';

import './common.less';

import {Row, Col} from 'antd';

import Header from './components/Header';
import Footer from './components/Footer';
import NavLeft from './components/NavLeft';

import {Route, Switch, Redirect, withRouter} from "react-router-dom";

import Oauth from './components/xy/common/oauth';

import {connect} from 'react-redux';

// import {LocalStorage} from './util';

import Welcome from './components/Welcome';

import Prescribe from "./components/xy/core/prescribe";

import { WrappedCoreTools } from "./components/xy/core/tools";

@withRouter
@connect(
	state=>state
)
class Admin extends React.Component {

	render() {
		const reduxMain = this.props.main;
		const routerConfig = [
			{
				id: 1,
				path: '/admin/welcome',
				component: Welcome
			},
			{
				id: 14,
				path: '/admin/core/prescribe',
				component: Prescribe
			},
			{
				id: 15,
				path: '/admin/core/tools',
				component: WrappedCoreTools
			}
		];

	    // console.log(this.props.main.memuConfig);
		const memuConfig = this.props.main.memuConfig;
		let _width = true;
		if (memuConfig.type === 'small'){
			_width = false;
		} else if (memuConfig.type === 'large') {
			_width = true;
		}
	    return (
			<Row className="container">
				{/*<Oauth />*/}
				<Col span={3} className={`${_width?'nav-left':'nav-left width0'}`}>
					<NavLeft />
					<div className='version rex-text-overflow' title={reduxMain.version} style={{color: '#777'}}>Version: {reduxMain.version}</div>
				</Col>
				<Col span={21} className="main">
					<Header />
					<Row className="content">
						<Switch>
							<Route exact
								path="/"
								render={()=><Redirect to='/admin/core/prescribe' />}
							></Route>
							{
								routerConfig.map(v=>
									<Route exact key={v.id} path={v.path} component={v.component}></Route>
								)
							}
						</Switch>
					</Row>
					<Footer />
				</Col>
			</Row>
		);
	}
}

export default Admin;