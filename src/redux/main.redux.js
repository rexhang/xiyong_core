// import axios from 'axios';

import API, {$http} from "../api";

import {LocalStorage} from '../util';

const DATA_INIT = 'DATA_INIT';

const MSG_ERROR = 'MSG_ERROR';

const MENU_CHANGE = 'MENU_CHANGE';

const LINK_LAUNCH = 'LINK_LAUNCH';

const VERSION_CHANGE = 'VERSION_CHANGE';

const admin_version = '1.0.0';

const UNREAD_MESSAGE = 'UNREAD_MESSAGE';

const initState = {
	datas: {},
	errormsg: '',
	userinfo: {},
	memuConfig: {type: 'small', status: 'small'},
	link: '',
	version: LocalStorage.get('admin_version') ? LocalStorage.get('admin_version') : admin_version, /*手动写入版本号和线上进行匹配*/
	unread_message: 0
};

export function main(state=initState, action) {
	switch (action.type){
	case DATA_INIT:
		return {...state, userinfo: action.userinfo};
	case MSG_ERROR:
		return {...state, errormsg: action.msg};
	case MENU_CHANGE:
		return {...state, memuConfig: action.memuConfig};
	case LINK_LAUNCH:
		return {...state, link: action.link};
	case VERSION_CHANGE:
		return {...state, version: action.version};
	case UNREAD_MESSAGE:
		return {...state, unread_message: action.message_count};
	default:
		return state;
	}
}

// 报错提示
function msgError(msg) {
	return {
		type: MSG_ERROR,
		msg: msg
	};
}

// 初始化用户数据
function dataInit(userinfo) {
	return {
		type: DATA_INIT,
		userinfo: userinfo
	};
}

// 改变菜单大小状态
function menuchange(menu_config) {
	return {
		type: MENU_CHANGE,
		memuConfig: menu_config
	};
}

// 链接改变
function linkChange(link) {
	return {
		type: LINK_LAUNCH,
		link
	};
}

// 版本改变
function versionChange(version) {
	return {
		type: VERSION_CHANGE,
		version
	};
}

function unread_messageChange(message_count) {
	return {
		type: UNREAD_MESSAGE,
		message_count
	};
}

export function staticReduxInfo(uid) {
	if(!uid){
		return msgError('暂无UID');
	}
	return dataInit({username: 'admin', uid});
}

export function changeMenuSize(menu_config) {
	return menuchange(menu_config);
}

export function changeLink(link) {
	return linkChange(link);
}

export function changeVersion(version) {
	return versionChange(version);
}

export function changeUnreadMessage() {
	// return unread_messageChange(message_count);
	return dispatch=>{
		$http.get(API.warningcount).then(res=>{
			if (res.data.code === 200) {
				dispatch(unread_messageChange(res.data.data.count));
			}
		}).catch(err=>{
			dispatch(msgError('err: ' + err));
		});
	};
}

/*eg*/
// 获取用户信息初始化state数据
// export function staticUserinfo(uid) {
//
//     if(!uid){
//        return msgError(window.location.href+ '(缺少uid)eg:host://dist/index.html?uid=xx#/routername')
//     }
//
//     return dispatch=>{
//         axios.get(API.getUserInfo, {params: {uid: uid, device_type: '1'}})
//             .then(res=>{
//                 if(res.data.code == 200){
//                     dispatch(dataInit(res.data.data));
//                 } else{
//                     dispatch(msgError(res.data.msg));
//                 }
//             })
//     };
// }
