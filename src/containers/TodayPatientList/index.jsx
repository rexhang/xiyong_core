import React from 'react';

import './index.scss';

import API, {$http} from "../../api";

import {LocalStorage} from "../../util";

import {List, Pagination, Avatar, Button, Skeleton} from "antd";

import Today from "../Today";

class TodayPatientList extends React.Component {

	static PAGE_LIMIT = 6;

	state = {
		listDATA: [],
		currentPAGE: 1,
		totalPAGE: 1,
	};

	componentWillMount() {

	}

	componentDidMount() {
		console.log(this.props);
		this.dataCenter.getListData(1);
		// 获取父组件方法
		this.parent = this.props.getParent();
	}

	dataCenter = {
		getListData: (currentPAGE=1) => {
			$http.get(API.todayseedoctor, {
				pn: currentPAGE,
				cn: TodayPatientList.PAGE_LIMIT
			}).then(res=>{
				if (res.data.code === 200){
					this.setState({
						listDATA: res.data.data.list,
						currentPAGE: res.data.data.page.pn * 1,
						totalPAGE: res.data.data.page.tc * 1
					});
				}
			});
		}
	};

	render() {
		const state = this.state;
		const cursorMouse = require('../../img/mouse/pointer_mouse.cur');
		return (
			<div className="TodayPatientList">
				<h3 className='today-title'>今日就诊-患者列表</h3>
				<Today />
				<div className="list-ctrl">
					<List
						className="demo-loadmore-list"
						itemLayout="horizontal"
						dataSource={state.listDATA}
						renderItem={ (item, _index) =>
							<List.Item
								actions={[<a key="list-loadmore-edit" style={{cursor: "url("+cursorMouse+"), pointer"}} onClick={()=>this.parent.autoUserClick(item.member_id)}>选择</a>]}
							>
								<List.Item.Meta
									avatar={<div style={{display: "block", color: "#666", width: "34px", fontSize: "12px", textAlign: "left"}}>No.{TodayPatientList.PAGE_LIMIT * state.currentPAGE - TodayPatientList.PAGE_LIMIT + _index + 1}</div>}
									title={<Button type={'link'} size={'small'}>{item.username}</Button>}
									description={item.mobile}
								/>
							</List.Item>
						}
					/>
					<Pagination
						className={'pageStyle'}
						size={'small'}
						hideOnSinglePage={true}
						pageSize={TodayPatientList.PAGE_LIMIT}
						current={state.currentPAGE}
						total={state.totalPAGE}
						onChange={page_num=>{
							// 翻页
							this.dataCenter.getListData(page_num);
						}}
					/>
				</div>
			</div>
		);
	}
}

export default TodayPatientList;