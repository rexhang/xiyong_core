/**
 * @author Rexhang(GuHang)
 * @updadate 2018/1/9 15:15
 * @Description: 常用工具函数
 */

/*设置标题*/
export function setTitle(title) {
	window.document.title = title;
}

/*设置html背景*/
export function setHtmlBg(color) {
	window.document.getElementsByTagName('html')[0].style.backgroundColor = color;
}

/*移动端浏览器环境监测*/
export function CheckOperatingEnvironment() {
	let _type = null;
	if(window.ios){
		_type = 'ioswebview';
	}
	if(window.android){
		_type = 'androidwebview';
	}
	return {
		type: _type
	};
}

/*获取url参数(/!*带解析中文的方案*!/)*/
export function GetUrlParams(params) {
	let reg = new RegExp("(^|&)"+params+"=([^&]*)(&|$)");
	let result = window.location.search.substr(1).match(reg);
	return result?decodeURIComponent(result[2]):null;
}

/*获取url参数(/!*带解析中文的方案*!/) for react component search*/
/**
 * @return {string}
 */
export function GetUrlParamsForReactComponent(searchString, params) {
	let reg = new RegExp("(^|&)"+params+"=([^&]*)(&|$)");
	let result = searchString.substr(1).match(reg);
	// if (!result) {
	// 	console.error('can not find <'+params+'> Params!');
	// }
	return result?decodeURIComponent(result[2]):null;
}

/*数据序列化*/
export function transformRequest(data){
	let res = '';
	for (let item in data) {
		if(data.hasOwnProperty(item)){
			res += window.encodeURIComponent(item) + '=' + window.encodeURIComponent(data[item]) + '&';
		}
	}
	return res;
}

/*localStorage的存取*/
export class LocalStorage {
	//存储单个属性
	static set(key, value){
		window.localStorage[key]=value;
	}
	//读取单个属性
	static get(key){
		return window.localStorage[key] || null;
	}
	//存储对象，以JSON格式存储
	static setObject(key, value){
		window.localStorage[key]=JSON.stringify(value);
	}
	//读取对象
	static getObject(key) {
		return JSON.parse(window.localStorage[key] || '{}');
	}
	// 清除指定元素
	static remove(key){
		window.localStorage.removeItem(key);
	}
	// 清除全部
	static clear(){
		window.localStorage.clear();
	}
}

/*sessionStorage的存取*/
export class SessionStorage {
	//存储单个属性
	static set(key, value){
		window.sessionStorage.setItem(key, value);
	}
	//读取单个属性
	static get(key){
		return window.sessionStorage.getItem(key);
	}
}

/*全局注册一个log方法*/
export function Log(msg='') {
	return console.info("%c" + msg, "background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ff7300), color-stop(100%,#f0f0f0));font-size: 0.4rem;color: #000");
}

/*检测工具库*/
export class Verification {
	//验证电话吗是否合格
	static phone(phone){
		const phoneReg = /^1[345789]\d{9}$/;
		return phoneReg.test(phone);
	}
	static webval(url){
		return /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})([A-Za-z0-9-~]\.){0,1}(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~])+$/.test(url);
	}
	static email(email){
		return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email);
	}
}

/*判断对象是否为空*/
export function emptyObject(obj={}){
	return window.JSON.stringify(obj) === "{}";
}

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : '0' + n;
};

/*1532945869398 => 转为 可识别时间
console.log(formatTime(new Date(1532945869398)))*/
export function formatTime(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	/*const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();*/
	/*return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');*/
	return [year, month, day].map(formatNumber).join('/');
}

/*删除url中指定的key&value*/
export function delUrlKeyVal(url, delkey) {
	const locationUrl = url;
	const splitUrl = locationUrl.split("?")[1].split("&");
	const strs = splitUrl.filter( (v) =>{
		return v.includes(delkey);
	});
	// return locationUrl.replace(strs[0]+'&', '');
	return locationUrl.replace(strs[0], '');
}

/*获取可视区域宽高*/
export function getWindowSize() {
	return {
		width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
		height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
		screenAvailHeight: window.screen.availHeight,
		screenAvailWidth: window.screen.availWidth,
		screenHeight: window.screen.height,
		screenWidth: window.screen.width
	};
}

/*oss*/
export function ossUrl(name) {
	return 'https://static.qooboop.com/img/panov/' + name;
}

/*删除数组中指定的元素*/
export function removeOfArr(arr, delVal) {
	let arrs = [...arr];
	const index = arrs.indexOf(delVal);
	if (index > -1) {
		arrs.splice(index, 1);
		return arrs;
	}
	return arrs;

}

/**
 * @author Rexhang(GuHang)
 * More tools are coming soon...
 */