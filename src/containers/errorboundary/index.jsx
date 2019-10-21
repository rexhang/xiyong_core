/**
 * @author Rexhang(GuHang)
 * @date 2019/1/14 17:41
 * @Description: ErrorBoundary纯组件
*/

import React from 'react';

// 导入监控BUG插件
// import {fundebugAPIKEY} from '../../define';
// const fundebug = require("fundebug-javascript");
// fundebug.apikey = fundebugAPIKEY;

class ErrorBoundary extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error, info) {
		this.setState({ hasError: true });
		// 将component中的报错发送到Fundebug
		// fundebug.notifyError(error, {
		//     metaData: {
		//         info: info
		//     }
		// });
	}
	componentDidMount(){
		// fundebug.notify("Test React", "Hello, Fundebug! From React");
	}

	render() {
		if (this.state.hasError) {
			// 也可以在出错的component处展示出错信息
			return (
				<h1 className="ErrorBoundary rex-text-center rex-text-color-red">
					<img src={require('../../img/rainy-preloader.svg')} className="rex-block" style={{margin: '0 auto'}} width="20%" alt="" />
					<img src={require('../../img/error-fill.svg')} className="rex-block" style={{margin: '0 auto'}} width="6%" alt="" />
					<p>
						页面出错啦，请联系管理员！
						{/*authorQQ: 1134916452*/}
					</p>
				</h1>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;