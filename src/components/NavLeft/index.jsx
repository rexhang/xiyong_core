import React from 'react';

import './index.less';

import { Menu, Spin } from 'antd';

import API, {$http} from "@api";

import menuList from '../../menu-config';

import {withRouter, Link} from 'react-router-dom';

import {connect} from 'react-redux';

import {changeLink} from '@src/redux/main.redux';

import {LocalStorage} from '../../util';

// import { ossUrl } from '../../util';

import medicine from '@src/img/left-menu-icon-svg/medicine.svg';

import medicalRecord from '@src/img/left-menu-icon-svg/medical-record.svg';

import styles from '@src/img/left-menu-icon-svg/style.svg';

import acupuncturePoint from '@src/img/left-menu-icon-svg/acupuncture-point.svg';

import system from '@src/img/left-menu-icon-svg/system.svg';

import writeoff from '@src/img/left-menu-icon-svg/writeoff.svg';

import core from '@src/img/left-menu-icon-svg/core.svg';

const SubMenu = Menu.SubMenu;

// const _ = require('lodash');

@withRouter
@connect(
	state=>state,
	{changeLink}
)
class NavLeft extends React.Component {

	pathname = this.props.location.pathname;

	state = {
		f_title: `/admin/${this.pathname.split('/')[2]}`,
		c_title: this.pathname,
		menuList: [],
		initLoad: false
	};

	componentDidMount() {
		// this.getMenuList();
		// console.log(`/admin/${this.pathname.split('/')[2]}`); // /admin/registered-list
		// console.log(this.pathname);
	}

    getMenuList = () => {
    	// 获取Menu列表
	    // console.log(LocalStorage.getObject('menuList'));
	    if (LocalStorage.getObject('menuList') && LocalStorage.getObject('menuList').length){
		    this.setState({
			    menuList: LocalStorage.getObject('menuList')
		    });
	    } else {
	    	this.setState({
			    initLoad: true
		    });
		    $http.get(API.getMenu).then(res=>{
			    if (res.data.code === 200){
			    	// 这里必须接口数据格式正确才能继续, 否则继续Loading...
				    this.setState({
					    menuList: res.data.data,
					    initLoad: false
				    }, () => {
					    LocalStorage.setObject('menuList', res.data.data);
				    });
			    }
		    });
	    }
    };

	renderTitleAndIcon = (v) => {
    	// console.log(v.icon);
		switch (v.icon) {
		case 'medicine':
			return (
				<span><img width={24} height={24} style={{marginRight: 5, marginTop: -3}} src={medicine} alt="" /><span>{v.title}</span></span>
			);
		case 'medical-record':
			return (
				<span><img width={20} height={20} style={{marginRight: 5, marginTop: -3}} src={medicalRecord} alt="" /><span>{v.title}</span></span>
			);
		case 'style':
			return (
				<span><img width={20} height={20} style={{marginRight: 5, marginTop: -3}} src={styles} alt="" /><span>{v.title}</span></span>
			);
		case 'acupuncture-point':
			return (
				<span><img width={20} height={20} style={{marginRight: 5, marginTop: -3}} src={acupuncturePoint} alt="" /><span>{v.title}</span></span>
			);
		case 'system':
			return (
				<span><img width={20} height={20} style={{marginRight: 5, marginTop: -3}} src={system} alt="" /><span>{v.title}</span></span>
			);
		case 'writeoff':
			return (
				<span><img width={20} height={20} style={{marginRight: 5, marginTop: -3}} src={writeoff} alt="" /><span>{v.title}</span></span>
			);
		case 'core':
			return (
				<span><img width={20} height={20} style={{marginRight: 5, marginTop: -3}} src={core} alt="" /><span>{v.title}</span></span>
			);
		default:
			return (
				<span><span>{v.title}</span></span>
			);
		}

	};

    renderMenuTreeNode = (arr) => {
    	const arr_ = arr || [];
    	return arr_.map(v => {
    		if(v.children && v.children.length>0){
    			return (
    				<SubMenu key={v.path} title={
                    	this.renderTitleAndIcon(v)
    				}>
    					{
    						this.renderMenuTreeNode(v.children)
    					}
    				</SubMenu>
    			);
    		}
    		return (
    			<Menu.Item key={v.path}>
				    <div onClick={()=>this.handleMenuClick(v)}>
					    <span>
    						{v.title}
    					</span>
				    </div>
    				{/*<Link style={ {color: 'inherit'} } to={v.path}>
    					<span>
    						{v.title}
    					</span>
    				</Link>*/}
    			</Menu.Item>
    		);

    	});
    };

	handleMenuClick = (data) => {
    	// 响应菜单点击
		// console.log(data);
		if (!data.path) {
			alert('缺少PATH配置信息, 无法进行操作~');
			return false;
		}
		if (data.link && data.params){
			// 链接模式 并且 需要拼接参数
			const link = data.link;
			this.props.changeLink(link); // set redux
			this.props.history.push(data.path);
		} else if (data.link){
			// 纯链接模式
			const link = data.link;
			this.props.changeLink(link); // set redux
			this.props.history.push(data.path);
		} else {
			// 其他走Path流模式走路由跳转
			this.props.history.push(data.path);
		}
	};

    clickMenu = (item) => {
    	// console.log(item);
	    // 点击子集菜单
    	this.setState({
	        c_title: item.key
    	});
    };

    onOpenChange = (openKeys) => {
    	// 打开父级
    	this.setState({
    		f_title: openKeys[1]
    	});
    };

    render() {
    	/*const logoStyle = {
		    backgroundImage: `url(${require('../../img/panov-logo.png')})`,
		    backgroundSize: '48% 70%',
		    backgroundRepeat: 'no-repeat',
		    backgroundPosition: 'center center',
		    cursor: 'pointer'
	    };*/
    	return (
    		<div className="NavLeft">
    			<div className="logo">
				    <Link to={{pathname: `/admin/welcome`}} className="logo">
				        <img src={require('../../img/xy/logo.jpg')} className="admin-logo rex-radius" alt="" />
				    </Link>
    			</div>
    			<div>
	                <Spin spinning={this.state.initLoad}>
		                <Menu
			                openKeys={[this.state.f_title]}
			                selectedKeys={[this.state.c_title]}
			                onClick = {this.clickMenu}
			                onOpenChange={this.onOpenChange}
			                mode="inline"
			                theme="dark"
		                >
			                {
				                this.renderMenuTreeNode(menuList)
			                }
		                </Menu>
	                </Spin>
    			</div>
    		</div>
    	);
    }
}

export default NavLeft;