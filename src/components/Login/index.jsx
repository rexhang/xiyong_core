import React from 'react';

import PubSub from 'pubsub-js';

import {Form, Icon, Input, Button, notification, Spin, Checkbox, message} from 'antd';

import Modal from '@src/containers/modal/modal';

import {LocalStorage, transformRequest, getWindowSize} from '../../util';

import './index.scss';

// import DrawBackground from './canvas';

import API, {$http} from '@api';

import {asyncStateHoc} from '@src/advanced';

const FormItem = Form.Item;

@asyncStateHoc
class Login extends React.Component {

	state = {
		ON_LOAD: null,
		login_text: '登 录',
		initLoad: false,
		mrTop: '0',
		remember: true
	};

	componentDidMount() {
		this.ON_LOAD = PubSub.subscribeOnce('ON_LOAD', (type, data)=>{
			console.log(type, data);
			// DrawBackground();
		});
		const mrTop = (getWindowSize().height - 360) / 2 - 60;
		this.setState({
			mrTop
		});
		window.onresize = this.resized;
	}

	componentWillMount(){
		PubSub.unsubscribe(this.ON_LOAD);
		notification.config({
			top: 70
		});
		// 已登录
		if ( LocalStorage.get('token') && LocalStorage.get('uid') && LocalStorage.get('username') && LocalStorage.getObject('menuList') ){
			this.props.history.push('/admin/core/prescribe');
		}
	}

	resized = () => {
		const mrTop = (getWindowSize().height - 360) / 2 - 60;
		this.setState({
			mrTop
		});
	};

	signinLock = false;

	loginin = (logindata) => {
		this.setState({
			login_text: '登 录 中 ...',
			initLoad: true
		});
		const {username, password} = logindata;
		if (!username || !password) {
			message.error('请输入账户和密码');
			return false;
		}
		this.signinLock = true;
		$http.post(API.loginIn, {
			account: username,
			password
		}).then(res=>{
			if (res.data.code === 200) {
				notification.success({
					key: 'login_success',
					message: '登录成功',
					duration: 1
				});
				LocalStorage.setObject('xy_userinfo', res.data.data);
				if (this.state.remember) {
					LocalStorage.set('xy_user', logindata.username);
				} else {
					if (LocalStorage.get('xy_user') !== null){
						LocalStorage.remove('xy_user');
					}
				}
				window.setTimeout(()=>{
					this.props.history.push('/admin/core/prescribe');
				}, 100);
			}
			this.setState({
				login_text: '登 录',
				initLoad: false
			});
			this.signinLock = false;
		}).catch(err=>{
			console.log(window.JSON.stringify(err));
			this.setState({
				login_text: '登 录',
				initLoad: false
			});
			this.signinLock = false;
		});
	};

	handleSubmit = (e) => {
		e?e.preventDefault():window.event.preventDefault();
		const vm = this;
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				vm.loginin(values);
			}
		});
	};

	render() {
		const {getFieldDecorator} = this.props.form;
		return (
			<div className="Login" style={{height: getWindowSize().height}}>
				<div className="center-box" style={{marginTop: this.state.mrTop}}>
					<div className="logo">
						<div className='logobox'>
							<img src={require('../../img/xy/logo.jpg')} className="rex-block rex-radius logoimg" width="100%" alt="" />
						</div>
						<div className='slogan'>
							<span className='name'>医 馆 后 台 仓 库 管 理 系 统</span>
						</div>
					</div>
					<div className="loginbx">
						<h3>用户登录</h3>
						<div>
							<Form onSubmit={this.handleSubmit} className="login-form rex-block"
							      style={{
								      width: '100%'
							      }}
							>
								<FormItem>
									{
										getFieldDecorator('username',
											{
												initialValue: LocalStorage.get('xy_user') !== null ? LocalStorage.get('xy_user') : '',
												rules: [{required: true, message: '请输入账户!'}]
											}
										)(<Input autoFocus autoComplete='off' prefix={<Icon type="mobile" />}
										         placeholder="请输入账户"/>)
									}
								</FormItem>
								<FormItem>
									{getFieldDecorator('password', {
										rules: [{required: true, message: '请输入密码!'}]
									})(
										<Input autoComplete='off' prefix={<Icon type="lock" />} type="password"
										       placeholder="请输入密码"/>
									)}
								</FormItem>
								<div className='remember'>
									<Checkbox onChange={(e)=>{
										this.setState({
											remember: e.target.checked
										});
									}} checked={this.state.remember}>记住用户名</Checkbox>
								</div>
								<FormItem>
									<Spin spinning={this.state.initLoad}>
										<Button block type="primary" htmlType="submit" className="login-form-button">
											{this.state.login_text}
										</Button>
									</Spin>
								</FormItem>
							</Form>
						</div>
					</div>
				</div>
				<div className="footerinfo">
					<div className="info">
						<div className='link-item'><a href="#/login">帮助</a></div>
						<div className='link-item'><a href="#/login">隐私</a></div>
						<div className='link-item'><a href="#/login">条款</a></div>
					</div>
					<div className="copyright">
						Copyright© 2019-2020 rexhang出品
					</div>
				</div>

				<Modal>
					<canvas id='stage'></canvas>
					{/*<div id='stage'></div>*/}
				</Modal>
			</div>
		);
	}
}

export default Form.create()(Login);
