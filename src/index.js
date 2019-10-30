/*程序入口文件*/

/*import React Base*/
import React from 'react';
import ReactDOM from 'react-dom';

/*import global stylesheet*/
import './index.css';
import './style.less';

/*import router*/
import Router from './router';

/*import global config for axios*/
import './config';

/*import serviceWorker for production*/
import * as serviceWorker from './serviceWorker';

/*import empty components*/

import Empty from './containers/Empty';

// 禁止离线使用
if (window.navigator.onLine) {
	ReactDOM.render(<Router />, document.getElementById('rexhang-wrap'));
} else {
	ReactDOM.render(<div style={{marginTop: 200}}><Empty title='您已离线，停止使用' src={require('./img/notonline.svg')} /></div>, document.getElementById('rexhang-wrap'));
}

/*
 * https: service worker是在后台运行的一个线程，可以用来处理离线缓存、消息推送、后台自动更新等任务。
 * registerServiceWorker就是为react项目注册了一个service worker，用来做资源的缓存，这样你下次访问时，就可以更快的获取资源。
 * 而且因为资源被缓存，所以即使在离线的情况下也可以访问应用（此时使用的资源是之前缓存的资源）。
 * 注意，registerServiceWorker注册的service worker 只在生产环境中生效（process.env.NODE_ENV === 'production'）
 */
// if(process.env.NODE_ENV === 'production'){
// 	serviceWorker.register();
// } else {
// 	serviceWorker.unregister();
// }
serviceWorker.unregister();

/*热加载*/
/*if(module.hot){
    module.hot.accept();
}*/

/*
1. setState的改变会触发4个生命周期钩子
shouldComponentUpdate
componentWillUpdate
render
componentDidUpdate

2. props的改变会触发5个生命周期钩子
componentWillReveiceProps
shouldComponentUpdate
componentWillUpdate
render
componentDidUpdate*/
