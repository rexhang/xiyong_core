import React from 'react';

/**
 * 通用权限检测
 */

import {withRouter} from 'react-router-dom';

import { Modal, Button } from 'antd';

import {LocalStorage} from '../../../../util';

@withRouter
class Oauth extends React.Component {

	needLogin = false;

	componentWillMount() {
		const xy_token = LocalStorage.get('xy_token');
		console.log(xy_token);
		// const needLogin = window.JSON.stringify(xy_token) === '{}';
		const needLogin = xy_token === null;
		console.log(needLogin);
		this.needLogin = needLogin;
	}

	componentDidMount() {
		if (this.needLogin){
			// this.props.history.push('/login');
			this.info();
		}
	}

	info = () => {
		Modal.info({
			title: '登录失效，请重新登录',
			content:
				<div>
				</div>
			,
			okText: '去登录',
			onOk: () => {
				this.goLogin();
			}
		});
	};

	goLogin = () => {
		this.props.history.push('/login');
	};

	render() {
		return (
			<div className="Oauth" />
		);
	}
}

export default Oauth;