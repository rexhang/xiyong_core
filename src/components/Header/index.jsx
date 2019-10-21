import React from 'react';

import './index.scss';

import {Link, withRouter} from 'react-router-dom';

import {connect} from 'react-redux';

import {changeMenuSize} from '@src/redux/main.redux';

import {Icon, Badge} from 'antd';

import {LocalStorage} from '../../util';

@withRouter
@connect(
	state=>state,
	{changeMenuSize}
)
class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
	        username: '',
	        smallType: this.props.main.memuConfig.type || 'large',
			sidebar_visible: false
		};
	}

	componentWillMount() {
	    const username = LocalStorage.get('xy_user') || '';
	    if (username){
		    this.setState({
			    username
		    });
	    }
	}

	componentDidMount() {

	}

	changeMenuStatus = () => {
    	// 改变menu状态
		if (this.state.smallType === 'large'){
			this.props.changeMenuSize({type: 'small', status: 'small'});
			this.setState({
				smallType: 'small'
			});

		} else if (this.state.smallType === 'small') {
			this.props.changeMenuSize({type: 'large', status: 'large'});
			this.setState({
				smallType: 'large'
			});
		}
	};

	render() {
		return (
			<div className="Header">
				<div className="bar-menu rex-cf">
					<div className="menuctrl rex-fl">
						{
							this.state.smallType === 'large'?
								<Icon style={{color: '#fff', display: `${this.state.sidebar_visible?'block':'none'}`}} onClick={ this.changeMenuStatus } type='menu-fold' name='收起' className='slide-icon'>{/*{收起}*/}</Icon>:
								<Icon style={{color: '#fff', display: `${this.state.sidebar_visible?'block':'none'}`}} onClick={ this.changeMenuStatus } type='menu-unfold' name='展开' className='slide-icon'>{/*{展开}*/}</Icon>
						}
					</div>
					<div className="rmenu rex-cf">
						<div className="rex-fl avatar rex-disable-select" style={{marginRight: 15}}>
							{/*<img src={require('../../img/react.png')} className="rex-inlineblock pic" alt="" />*/}
							<img src={require('../../img/xy/logo.jpg')} className="rex-inlineblock pic" alt="" />
							&nbsp;&nbsp;
							<span className="user" style={{color: '#fff'}}>{this.state.username?`hi, ${this.state.username}`:''}</span>
						</div>
						{
							this.state.sidebar_visible?
								<Link to={{pathname: `/admin/system/message`}}>
									<div className="rex-fl sys-msg">
										<Badge count={this.props.main.unread_message}>
											<img title="消息通知" src={require('../../img/msg.svg')} className="rex-inlineblock" width="23" height="17" alt="" />
										</Badge>
									</div>
								</Link>:null
						}
						<div className="rex-fl sys-exit">
							<Link onClick={ () => {
								// LocalStorage.set('token', '');
								// LocalStorage.set('uid', '');
								// LocalStorage.set('username', '');
								// LocalStorage.set('vr_host', '');
								LocalStorage.remove('xy_userinfo');
							} } to={{pathname: `/login`}}>
								<img title='注销用户' className="rex-inlineblock rex-fl" src={require('../../img/poweroff.svg')} width="21" height="21" alt="" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;