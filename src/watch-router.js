/**
 * @author Rexhang(GuHang)
 * @date 2019/1/11 15:38
 * @Description: 路由中间管理模块 只有当强刷刷新或者首次进入才会加载，路由切换则不会执行内部逻辑
*/

import React, {version} from 'react';

import PubSub from 'pubsub-js';

import {withRouter} from 'react-router-dom';

import Vconsole from '../node_modules/vconsole/dist/vconsole.min';

import {connect} from 'react-redux';

import {changeVersion, changeUnreadMessage} from './redux/main.redux';

// import {Log, GetUrlParams, LocalStorage} from './util';
import {Log, GetUrlParams} from './util';

// import {Modal} from 'antd';

// 初始化手机调试工具
if( GetUrlParams('tools') ){
	new Vconsole();
}

// const asyncGet = (uri) => {
// 	return fetch(uri);
// };
@withRouter
@connect(
	state=>state.main,
	{changeVersion, changeUnreadMessage}
)
class WatchRouter extends React.Component {
	constructor(props) {
		super(props);
		Log(`React_version: ${version}`);
	}

	state = {
		new_version: '',
		new_version_msg: []
	};

	componentWillMount() {
		window.onload = () => {
			PubSub.publishSync('ON_LOAD', {msg: 'window.onload completed'});
		};
		this.props.changeUnreadMessage();
	};

	componentDidMount = async () => {
		// console.log(this.props);
	};

	render() {
		return (
			<div className="WatchRouter rex-text-center rex-text-color-red">
				{/*WatchRouter init*/}
			</div>
		);
	}
}

export default WatchRouter;