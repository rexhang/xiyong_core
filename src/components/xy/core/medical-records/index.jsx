/**
 * 正式版
 */
import React from 'react';

import rdom from 'react-dom';

import './index.scss';

import {setTitle, getWindowSize, LocalStorage} from '../../../../util';

import {
	Button,
	Input,
	InputNumber,
	List,
	Descriptions,
	Modal,
	Card,
	Icon,
	message,
	Row,
	Col,
	Pagination,
	Drawer,
	Select,
	Upload,
	Tabs,
	Spin,
	Switch,
	Radio,
} from 'antd';

import { FormWrapCommonInputs } from "../../common";

import Placeholder from '../../common/Placeholder';

import Empty from '../../../../containers/Empty';

import TodayPatientList from "../../../../containers/TodayPatientList";

import { Opt } from "../../common";

import API, {$http} from "../../../../api";

import reqwest from 'reqwest';

import logjs from 'myloggerjs';

import moment from 'moment';

import { common_template, vip, } from '../../common/template-configs';

// const _ = require('lodash');

const { confirm } = Modal;

const { Option } = Select;

const { TabPane } = Tabs;

class MedicalRecords extends React.Component {

	static dateformat = 'YYYY-MM-DD';

	static templateInfo = [
		{...common_template},
		{...vip},
	];

	constructor(props) {
		super(props);
		this.R = {
			/*有些场景下，重复使用push或a标签跳转会产生死循环，为了避免这种情况出现，react-router-dom提供了replace。在可能会出现死循环的地方使用replace来跳转*/
			replace: this.props.history.replace,
			/*场景中需要返回上级页面的时候使用*/
			goBack: this.props.history.goBack,
			/*正常路由跳转*/
			push: this.props.history.push,
			mode: this.props.match.params.mode,
		};
	}

	getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	};

	componentWillMount() {
		setTitle('门诊就诊系统');
	}

	componentDidMount() {
		console.log(this);
	}

	state = {

	};

	componentWillUnmount() {

	}

	handleCommonForm = (key, val) => {
	    this.setState({
		    formQueryDatas: {
		    	...this.state.formQueryDatas,
			    [key]: val
		    }
	    });
	};

	render() {
		const state = this.state;
		return (
			<div className="MedicalRecords" id='MedicalRecords'>
				<h2 className='title'>门诊就诊系统</h2>
				{/*<Button className={window.isV8()?'':'rex-hide'} onClick={()=>{*/}
				{/*	if (isV8()) {*/}
				{/*		const { ipcRenderer } = window.electron;*/}
				{/*		ipcRenderer.send('event1', {user: 'xiyong', password: '******'}); // 发送事件给主进程*/}
				{/*		let res = (event, arg) => {*/}
				{/*			// do something*/}
				{/*			console.log(arg);*/}
				{/*			ipcRenderer.removeListener("event1-reply", res); // 移除事件监听*/}
				{/*		};*/}
				{/*		ipcRenderer.on('event1-reply', res); // 主进程接收到发送的时间给与的回调*/}
				{/*	} else {*/}
				{/*		message.warn('非v8环境, 不可用');*/}
				{/*	}*/}
				{/*}}>TEST BTN</Button>*/}
			</div>
		);
	}
}

export default MedicalRecords;