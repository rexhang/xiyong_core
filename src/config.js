import axios from 'axios';

import {message} from 'antd';

message.config({
	top: 80,
	duration: 1,
	maxCount: 3,
});

// import {Toast} from 'antd-mobile';

// axios.defaults.baseURL = 'http://localhost:9577';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
// axios.defaults.headers.post['Accept-Language'] = "zh-cn";
axios.defaults.sendSuscced = true; // 初始化报错后的请求状态
axios.defaults.timeout = 10000;
// axios.defaults.transformRequest = [function(data) {
//     return window.jQuery.param(data)
// }];

// axios.defaults.crossDomain = true;
// axios.defaults.withCredentials  = true;

// 拦截请求
// axios.interceptors.request.use(function (config) {
//     Toast.loading('loading...', 0);
//     return config;
// });
// axios.defaults.withCredentials = true;
// 拦截响应
axios.interceptors.response.use(function (response) {
	if(response.data.code !== 200){
		if (response.data.code === 401){
			// 过期~重新登录
			message.warn('登录失效, 请重新登录');
			window.location.href = '#/login';
		} else {
			message.error(response.data.msg || 'code码错误~', 2);
		}
	}
	return response;
}, function (error) {
	// 根据传回来的错误信息`error`进行判断
	// 意为：`error.code`
	if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
		// console.log('根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案');
		message.error('请求超时了, 请检查网络状态~');
		// `这里我 的方案是，超时后再次请求，所以新建了一个promise`;
		// let newHttp= new Promise(function (resolve){
		// 	resolve();
		// });
		// `newHttp实例执行完成后会再次执行`;
		// // 返回一个promise实例，同时重新发起请求，config请求配置，包扩请求头和请求参数
		// return newHttp.then(function (){
		// 	return axios(config);
		// });
	}
	// 若不是超时,则返回未错误信息
	return Promise.reject(error);
});
// 拦截请求
axios.interceptors.request.use(function (config) {
	return config;
}, function (error) {
	return Promise.reject(error);
});