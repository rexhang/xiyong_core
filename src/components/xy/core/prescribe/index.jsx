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
	Radio
} from 'antd';

import Placeholder from '../../common/Placeholder';

import Empty from '../../../../containers/Empty';

import API, {$http} from "../../../../api";

import reqwest from 'reqwest';

import logjs from 'myloggerjs';

import moment from 'moment';

const _ = require('lodash');

const { confirm } = Modal;

const { Option } = Select;

const { TabPane } = Tabs;

class Prescribe extends React.Component {

	static searchUserPageSize = 5;

	static blPageSize = 3;

	static getDrugPageSize = 10;

	static dateformat = 'YYYY-MM-DD';

	SCALE = 1;

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
		logjs.info('info', 'i am log');
		logjs.success('success', 'i am log');
		logjs.warn('warn', 'i am log');
		logjs.error('error', 'i am log');
	}

	domWidth = 1165;

	domHeight = 1000;

	componentDidMount() {
		this.initData();
		this.domWidth = document.getElementById('Prescribe').offsetWidth;
		this.domHeight = document.getElementById('Prescribe').offsetHeight;
		document.addEventListener('click', this.handleOtherClick, false);
		window.addEventListener('resize', this.handleWinResize, false);
	}

	handleWinResize = () => {
		this.domWidth = document.getElementById('Prescribe').offsetWidth;
		this.domHeight = document.getElementById('Prescribe').offsetHeight;
		// console.log(this.domWidth);
	};

	handleOtherClick = (e) => {
		// console.log(e.target.getAttribute('class'));
		const CLASSNAME = e.target.getAttribute('class');
		// 简单的判断几个可能点击的空白区域
		if(CLASSNAME === 'content' || CLASSNAME === 'main' || CLASSNAME === 'Prescribe' || CLASSNAME === 'main-box' || CLASSNAME === 'infomations'){
			this.setState({
				shouldShowSearchBox: false
			});
		}
	};

	componentWillUnmount() {
		document.removeEventListener('click', this.handleOtherClick, false);
		window.removeEventListener('resize', this.handleWinResize, false);
	}

	state = {
		user_list: [],
		currentUserName: '',
		shouldShowSearchBox: false,
		searchLoading: false,
		currentUserInfo: {
			id: null,
			username: '',
			sex: '',
			age: '',
			job: '',
			mobile: '',
			id_num: '',
			balance: '',
			avatar_pic: ''
		},
		blList: [],
		blList_current_page: 1,
		blList_total_page: 0,
		sickBook_current_page: 1,
		sickBook_total_page: 0,
		/*stage1: true,
		stage_title1: '病历簿信息',*/
		stage1: false,
		stage_title1: '',
		stage2: false,
		stage_title2: '',
		/*stage2: true,
		stage_title2: '新建处方',*/
		previewVisible: false,
		previewImage: '',
		fileList: [],
		fileList_videos: [],
		diagnosis: [],
		formQueryDatas: {
			patient_desc: '',
			disease_history: '',
			inspection_result: '',
			diagnosis_id: undefined,
			advise: '',
			files: [],
			disease_record_id: '',
			pid: '',
			disease_past: '',
			disease_family: '',
			tcm_id: undefined,
			treatment_id: undefined,
			western_diagnosis_id: undefined,
			drug_reaction: '',
			update_time: '',
			current_date: undefined,
			dates: []
		},
		activeKey: '1',
		activeKey2: '1',
		cfList: [],
		cfList_dates: [],
		cfList_dates_cacheValue: undefined,
		cfList_typings_cacheValue: {
			value: undefined,
			data: {}
		},
		cfList_total_page: 0,
		/*处方内容是否保密*/
		cf_private: true,
		/*药物服用方式数据源*/
		drinkStyle: [],
		/*药物服用方式*/
		drinkStyle_id: undefined,
		/*处方药物类型*/
		me_type: '0',
		/*处方备注信息*/
		cf_remark: '無需備註信息',
		/*处方付数设置*/
		cf_nums: '1',
		/*处方折扣数据源*/
		coupon_data: [
			{value: '100', label: '无折扣', keys: '10'},
			{value: '90', label: '九折', keys: '9'},
			{value: '80', label: '八折', keys: '8'},
			{value: '70', label: '七折', keys: '7'},
			{value: '60', label: '六折', keys: '6'},
			{value: '50', label: '五折', keys: '5'},
			{value: '40', label: '四折', keys: '4'},
			{value: '30', label: '三折', keys: '3'},
			{value: '20', label: '二折', keys: '2'},
			{value: '10', label: '一折', keys: '1'},
			{value: '0', label: '免费', keys: '0'}
		],
		/*折扣选择*/
		coupon_data_id: '100',
		coupon_data_id2: '100',
		/*成药列表*/
		drug_group_list: [],
		/*成药选择*/
		drug_group_list_id: undefined,
		/*搜索的药物列表*/
		drug_list: [],
		/*处方清单*/
		cf_info_list: [
			/*{drug_id: "1664", weight: 15, price: 0.202, empty: false},
			{drug_id: "1667", weight: "1", price: 0.235, empty: false},
			{drug_id: "1992", weight: "2", price: 12, empty: false},
			{drug_id: "1712", weight: "3", price: 2.352, empty: false},
			{drug_id: "1580", weight: "4", price: 0.403, empty: false},
			{drug_id: "1612", weight: "5", price: 0.806, empty: false},*/
		],
		hide_cf_list: false,
		thumb: '',
		poster: '',
		total_money: '0',
		real_money: '0',
		unit_money: '0',
		youhui_money: '0',
		code: '',
		status: '0',
		drugData2: [],
		drugData2_id: undefined,
		cf_days: '1',
		xuewei_list_id: undefined,
		xuewei_list: [],
		ll_count: '1',
		ll_count_doing: '0',
		only_show: '100',
		tcm_list: [],
		treatment_list: [],
		western_list: [],
		ll_list: [],
		ll_list_id: undefined,
		ll_unit_price: 0,
		me_type5_money: 0,
		me_type2_money: 0,
		viewUserAvatar: false,
		viewUserAvatar_url: '',
		previewVideo: false,
		videoPreviewUrl: '',
		cameraModal: false,
		cameraFile: null,
		cameraFileUploading: false,
		addOpt1: false,
		addOpt2: false,
		addOpt3: false,
		addOpt4: false,
		addOpt_val1: '',
		addOpt_val2: '',
		addOpt_val3: '',
		addOpt_val4: '',
		associate_id: undefined,
		associate_price: '',
		associate_weight: '',
		associate_datas: {
			price: '',
			auto_weight: '',
			name: '',
			id: undefined
		},
		doing_ll_loading: false
	};

	searchbox = null;

	initData = () => {
	    // 初始化
		this.searchbox.focus();
		this.dataCenter.diagnosisGet();
		this.dataCenter.takingmethodGet();
		this.dataCenter.drugGroupGet();
		this.dataCenter.drugGet();
		this.dataCenter.getDrugs2();
		this.dataCenter.getXuewei();
		this.dataCenter.getTcms();
		this.dataCenter.getTreatmentList();
		this.dataCenter.getWests();
		this.dataCenter.getLlList();
	};

	handleForm = (key, val) => {
	    this.setState({
		    formQueryDatas: {
		    	...this.state.formQueryDatas,
			    [key]: val
		    }
	    });
	};

	savediseaserecordlist_Lock = false;

	dataCenter = {
		diagnosisGet: () => {
			// 获取诊断列表
			$http.get(API.diagnosisGet).then(res=>{
				if (res.data.code === 200) {
					this.setState({
						diagnosis: res.data.data
					});
				}
			});
		},
		takingmethodGet: () => {
			$http.get(API.takingmethodGet).then(res=>{
				if (res.data.code === 200) {
					this.setState({
						drinkStyle: res.data.data
					});
				}
			});
		},
		getXuewei: (name='') => {
			$http.get(API.acupointGet, {
				name,
				pn: 1,
				cn: 10
			}).then(res=>{
				if (res.data.code === 200){
					this.setState({
						xuewei_list: res.data.data.list
					});
				}
			});
		},
		getTcms: (name='') => {
			$http.get(API.zyzxList, {
				name,
				pn: 1,
				cn: 10
			}).then(res=>{
				if (res.data.code === 200){
					this.setState({
						tcm_list: res.data.data.list
					});
				}
			});
		},
		getTreatmentList: (name='') => {
			$http.get(API.treatmentList, {
				name,
				pn: 1,
				cn: 10
			}).then(res=>{
				if (res.data.code === 200) {
					this.setState({
						treatment_list: res.data.data.list
					});
				}
			});
		},
		getWests: (name='') => {
			$http.get(API.westerndiagnosisList, {
				name,
				pn: 1,
				cn: 10
			}).then(res=>{
				if (res.data.code === 200){
					this.setState({
						western_list: res.data.data.list
					});
				}
			});
		},
		getLlList: (name='') => {
			$http.get(API.liliaoList, {
				name,
				pn: 1,
				cn: 20
			}).then(res=>{
				if (res.data.code === 200){
					this.setState({
						ll_list: res.data.data.list
					});
				}
			});
		},
		getDrugs2: (name='') => {
			$http.get(API.drugGet, {
				name,
				pn: 1,
				cn: 100,
				type: '2'
			}).then(res=>{
				if (res.data.code === 200){
					this.setState({
						drugData2: res.data.data.list
					});
				}
			});
		},
		drugGroupGet: (page=1, name='') => {
			$http.get(API.drugGroupGet, {
				pn: page,
				cn: 100,
				name
			}).then(res=>{
				if (res.data.code === 200) {
					this.setState({
						drug_group_list: res.data.data.list
					});
				}
			});
		},
		drugGet: (page=1, name='', search=false, index=false) => {
			if (search && index!==false) {
				// 如果是搜索模式 加个loading
				// let cf_info_list = _.cloneDeep(this.state.cf_info_list);
				let cf_info_list = window.Array.from([...this.state.cf_info_list]);
				cf_info_list[index].empty = true;
				this.setState({
					cf_info_list
				});
			}
			$http.get(API.drugGet, {
				pn: page,
				cn: Prescribe.getDrugPageSize,
				name
			}).then(res=>{
				if (res.data.code === 200) {
					this.setState({
						drug_list: res.data.data.list
					}, ()=>{
						if (search && index!==false && res.data.data.list.length > 0) {
							// let cf_info_list = _.cloneDeep(this.state.cf_info_list);
							let cf_info_list = window.Array.from([...this.state.cf_info_list]);
							cf_info_list[index].empty = false;
							this.setState({
								cf_info_list
							});
						}
					});
				}
			});
		},
		getPatients: (keyword='') => {
			this.setState({
				searchLoading: true
			});
			$http.get(API.getPatients, {
				pn: 1,
				cn: Prescribe.searchUserPageSize,
				keyword
			}).then(res=>{
				if (res.data.code === 200){
					this.setState({
						user_list: res.data.data.list
					}, ()=>{
						this.setState({
							searchLoading: false
						});
					});
				}
			});
		},
		getdiseaserecordlist: (page=1, uid='') => {
			$http.get(API.getdiseaserecordlist, {
				pn: page,
				cn: Prescribe.blPageSize,
				uid
			}).then(res=>{
				if (res.data.code === 200) {
					this.setState({
						blList: res.data.data.medicalRecordList.list,
						blList_current_page: res.data.data.medicalRecordList.page.pn,
						blList_total_page: res.data.data.medicalRecordList.page.tc
					});
				}
			});
		},
		getdiseaserecordlistPages: (page=1, id=this.editSickBookId, is_getPageOne=false, date='') => {
			let queryParams = {
				id,
				pn: page,
				cn: 1
			};
			if (date) {
				queryParams.date = date;
			}
			$http.get(API.getDiseaseRecordInfo, queryParams).then(res=>{
				if (res.data.code === 200) {
					const D = res.data.data.list[0];
					let files = [];
					let files_videos = [];
					if (D.images) {
						files = D.images.split(",").map((v, i)=>{
							return {
								url: v,
								uid: (i+1).toString()
							};
						});
					}
					if (D.videos) {
						files_videos = D.videos.split(",").map((v, i)=>{
							return {
								url: v,
								name: '视频'+(i+1).toString(),
								uid: (i+1).toString()
							};
						});
					}
					let dates = [];
					if (res.data.data.dates.length > 0) {
						dates = res.data.data.dates;
					}
					let setState = {
						formQueryDatas: {
							...this.state.formQueryDatas,
							patient_desc: D.patient_desc,
							disease_history: D.disease_history,
							disease_past: D.disease_past,
							disease_family: D.disease_family,
							inspection_result: D.inspection_result,
							diagnosis_id: D.diagnosis_id,
							tcm_id: D.tcm_id!=='0' && D.tcm_id !== ''?D.tcm_id:undefined,
							treatment_id: D.treatment_id!=='0' && D.treatment_id !== ''?D.treatment_id:undefined,
							western_diagnosis_id: D.western_diagnosis_id!=='0' && D.western_diagnosis_id !== ''?D.western_diagnosis_id:undefined,
							advise: D.advise,
							drug_reaction: D.drug_reaction,
							disease_record_id: D.id,
							pid: D.pid,
							update_time: D.update_time,
							files,
							current_date: res.data.data.date?res.data.data.date:undefined,
							dates
						},
						fileList: files,
						fileList_videos: files_videos,
						sickBook_current_page: res.data.data.page.pn,
						sickBook_total_page: res.data.data.page.tc
					};
					if (is_getPageOne) {
						// 只获取关键信息
						this.setState({
							formQueryDatas: {
								patient_desc: D.patient_desc,
								disease_history: D.disease_history,
								disease_past: D.disease_past,
								disease_family: D.disease_family,
								inspection_result: D.inspection_result,
								diagnosis_id: D.diagnosis_id,
								tcm_id: D.tcm_id!=='0' && D.tcm_id !== ''?D.tcm_id:undefined,
								treatment_id: D.treatment_id!=='0' && D.treatment_id !== ''?D.treatment_id:undefined,
								western_diagnosis_id: D.western_diagnosis_id!=='0' && D.western_diagnosis_id !== ''?D.western_diagnosis_id:undefined,
								advise: D.advise,
								drug_reaction: D.drug_reaction?D.drug_reaction:'',
								update_time: D.update_time,
								files,
								current_date: res.data.data.date?res.data.data.date:undefined,
								dates: []
							},
							fileList: files,
							fileList_videos: files_videos
						});
					} else {
						this.setState(setState);
					}
				}
			});
		},
		getcfList: (page=1, disease_record_id, date=null, typing=null) => {
			let queryParams = {
				pn: page,
				cn: 100,
				disease_record_id
			};
			if (date){
				queryParams.date = date;
			}
			// 判断类型
			if (typing){
				if (typing.mtype === 1){
					// 接口根据type判断 门诊 or 理疗
					queryParams.type = typing.type;
				}
				if (typing.mtype === 2){
					// 接口根据type判断 中草药 成药等
					queryParams.drug_group_type = typing.type;
					queryParams.type = 0;
				}
			}
			$http.get(API.prescriptionListGet, queryParams).then(res=>{
				let cfList_dates = res.data.data.dates;
				try {
					if (!window.Array.isArray(cfList_dates)){
						let arrs = [];
						for (let item in cfList_dates){
							arrs.push(cfList_dates[item]);
						}
						cfList_dates = arrs;
					}
				} catch (e) {
					cfList_dates = [];
				}
				this.setState({
					cfList: res.data.data.list,
					cfList_dates,
					cfList_total_page: res.data.data.page.tc
				});
			});
		},
		getCfInfo: (id) => {
			$http.get(API.prescriptionListInfoGet, {
				id
			}).then(res=>{
				if (res.data.code === 200){
					const datas = res.data.data;
					/*xuewei_list_id: undefined,
						xuewei_list: [],
						ll_count: '1',*/
					let setObj = {
						cf_private: datas.private === '1' || datas.private === 1,
						drinkStyle_id: datas.taking_method,
						me_type: datas.drug_group_type,
						cf_remark: datas.remark,
						cf_nums: datas.nums,
						coupon_data_id: datas.zhekou_id,
						drug_group_list_id: datas.drug_group_id==='0'||datas.drug_group_id===0||datas.drug_group_id===''?undefined:datas.drug_group_id,
						hide_cf_list: datas.drug_group_type === '5' || datas.drug_group_type === '2',
						thumb: datas.thumb,
						poster: datas.poster,
						/*total_money: datas.total_money,
						real_money: datas.real_money,
						unit_money: datas.unit_money,*/
						code: datas.code,
						status: datas.status,
						activeKey2: '1',
					};
					if (datas.drug_group_type === '2') {
						// 成品药 才有days
						setObj.cf_days = datas.days;
						setObj.me_type2_money = datas.unit_money;

					}
					if (datas.drug_group_type === '5') {
						// 单独处理2种药物的价格
						setObj.me_type5_money = datas.unit_money;
					}
					if (datas.type === '1'){
						// 理疗类型
						setObj.xuewei_list = datas.acupoints.map(v=>{
							return {
								id: v.acupoint_id,
								name: v.acupoint_name
							};
						}); // 为了显示源氏数据数组
						setObj.xuewei_list_id = datas.acupoints.map(v=>{
							return v.acupoint_id;
						}); // 为了显示value值
						setObj.ll_count = datas.nums;
						setObj.ll_count_doing = datas.done_nums;
						setObj.coupon_data_id2 = datas.zhekou_id;
						setObj.activeKey2 = '2';
						setObj.ll_list_id = datas.liliao_id !== '0' && datas.liliao_id !== ''?datas.liliao_id:undefined;
						if (setObj.ll_list_id) {
							setObj.ll_unit_price = datas.unit_money * 1;
						}
					}
					setObj.only_show = datas.type;
					// 非成品药
					if (datas.drug_group_type !== '2') {
						setObj.cf_info_list = datas.drugs.map(v=>{
							return {
								...v,
								name: v.drug_name,
								drug_id: v.drug_id,
								price: v.price,
								empty: false
							};
						});
					} else {
						setObj.cf_info_list = [
							{drug_id: undefined, weight: '', price: 0, empty: false},
							{drug_id: undefined, weight: '', price: 0, empty: false}
						];
					}
					// 搜索用数据
					if (datas.drugs.length>0) {
						setObj.drug_list = datas.drugs.map(v=>{
							return {
								id: v.drug_id,
								name: v.drug_name,
								price: v.price
							};
						});
					}
					if (datas.drug_group_type === '2') {
						// 如果是成品药
						setObj.drugData2_id = datas.drugs[0].drug_id;
					}
					this.setState(setObj);
				}
			});
		},
		deletediseaserecordlist: (id, is_inside=false) => {
			// 删除病历簿
			if (!id) {
				return false;
			}
			confirm({
				title: '提示',
				content: '确定删除此病历簿吗？',
				okText: '确认',
				cancelText: '取消',
				okType: 'danger',
				onOk: () => {
					$http.post(API.delDiseaseRecord, {
						uid: this.state.currentUserInfo.id,
						id,
						is_record_book: is_inside?'0':'1'
					}).then(res=>{
						if (res.data.code === 200) {
							if (is_inside) {
								// 获取病历内页列表
								this.dataCenter.getdiseaserecordlistPages(this.state.sickBook_current_page);
							} else {
								// 获取病历簿列表
								this.dataCenter.getdiseaserecordlist(this.state.blList_current_page, this.state.currentUserInfo.id);
							}
							message.success('删除成功');
						}
					});
				}
			});
		},
		saveCfContent: (postdata, cb, type='create') => {
			if (type==='create') {
				$http.post(API.prescriptionCreate, postdata).then(res=>{
					if(res.data.code === 200){
						// 处方开具成功 取货码: res.data.data.code
						cb(res.data.data.code);
					} else if (res.data.code === 420) {
						// 拦截十八反十九畏
						Modal.confirm({
							title: `检测到`+res.data.msg,
							content: '是否确定开具此互斥属性药材',
							okText: '确定开具',
							okType: 'danger',
							cancelText: '返回修改',
							onOk: () => {
								$http.post(API.prescriptionCreate, {...postdata, ignore_drug_warning: '1'}).then(res=>{
									if(res.data.code === 200){
										cb(res.data.data.code);
									}
								});
							},
							onCancel: () => {
								// Canceled
							}
						});
					}
				});
			} else if (type==='edit') {
				$http.post(API.prescriptionSave, postdata).then(res=>{
					if(res.data.code === 200){
						// 处方更新成功
						cb('update_success');
					} else if (res.data.code === 420) {
						// 拦截十八反十九畏
						Modal.confirm({
							title: `检测到`+res.data.msg,
							content: '是否确定开具此互斥属性药材',
							okText: '确定开具',
							okType: 'danger',
							cancelText: '返回修改',
							onOk: () => {
								$http.post(API.prescriptionSave, {...postdata, ignore_drug_warning: '1'}).then(res=>{
									if(res.data.code === 200){
										// 处方更新成功
										cb('update_success');
									}
								});
							},
							onCancel: () => {
								// Canceled
							}
						});
					}
				});
			}
		},
		savediseaserecordlist: () => {
			// console.log(this.state.fileList);
			// console.log(this.state.fileList_videos);
			// console.log(this.state.currentUserInfo);
			// console.log(this.state.formQueryDatas);
			// return false;
			if (this.savediseaserecordlist_Lock) {
				return false;
			}
			const {patient_desc, disease_history, inspection_result, diagnosis_id, advise, files, disease_record_id, disease_past, disease_family, tcm_id, treatment_id, western_diagnosis_id, drug_reaction } = this.state.formQueryDatas; // 必填字段

			// if (!patient_desc) {
			// 	message.warn('请填写患者主诉');
			// 	return false;
			// }
			// if (!disease_history) {
			// 	message.warn('请填写现病史');
			// 	return false;
			// }
			// if (!disease_past) {
			// 	message.warn('请填写既往史');
			// 	return false;
			// }
			// if (!disease_family) {
			// 	message.warn('请填写家族史');
			// 	return false;
			// }
			// if (!inspection_result) {
			// 	message.warn('请填写实验室检查查信息');
			// 	return false;
			// }
			// if (!treatment_id) {
			// 	message.warn('请选择治法治则');
			// 	return false;
			// }
			if (!diagnosis_id) {
				message.warn('请选择中医诊断');
				return false;
			}
			// if (!tcm_id) {
			// 	message.warn('请选择中医证型');
			// 	return false;
			// }
			// if (!western_diagnosis_id) {
			// 	message.warn('请选择西医诊断');
			// 	return false;
			// }
			// if (!advise) {
			// 	message.warn('请填写医嘱');
			// 	return false;
			// }
			// 拟定保存字段
			let postObject = {
				patient_id: this.state.currentUserInfo.id,
				patient_desc: patient_desc?patient_desc:'',
				disease_history: disease_history?disease_history:'',
				inspection_result: inspection_result?inspection_result:'',
				diagnosis_id,
				advise: advise?advise:'',
				disease_past: disease_past?disease_past:'',
				disease_family: disease_family?disease_family:'',
				tcm_id: tcm_id?tcm_id:undefined,
				treatment_id: treatment_id?treatment_id:undefined,
				western_diagnosis_id: western_diagnosis_id?western_diagnosis_id:undefined,
				drug_reaction: drug_reaction?drug_reaction:''
			};
			// 选填字段
			if (this.state.fileList.length>0) {
				let _files = [];
				this.state.fileList.forEach(v=>{
					if(v.url){
						_files.push(v.url);
					} else if (v.response) {
						if (v.response.code === 200) {
							_files.push(v.response.data.file_url);
						}
					}
				});
				postObject.images = _files.join(',');
			}
			if (this.state.fileList_videos.length>0) {
				let _files = [];
				this.state.fileList_videos.forEach(v=>{
					if(v.url){
						_files.push(v.url);
					} else if (v.response) {
						if (v.response.code === 200) {
							_files.push(v.response.data.file_url);
						}
					}
				});
				postObject.videos = _files.join(',');
			}
			// 此接口三种save模式 1、第一次新建病历簿 2、编辑病历簿内页
			if (disease_record_id) {
				// 编辑模式
				postObject.disease_record_id = disease_record_id;
			}
			if (this.pid){
				// 新建模式
				postObject.pid = this.pid;
			}
			this.savediseaserecordlist_Lock = true;
			$http.post(API.createDiseaseRecord, postObject).then(res=>{
				if (res.data.code === 200) {
					// 获取病历簿列表
					this.dataCenter.getdiseaserecordlist(this.state.blList_current_page, this.state.currentUserInfo.id);
					if (disease_record_id) {
						Modal.success({
							title: '提示',
							content: '编辑病历信息成功',
							okText: '确定',
							onOk: () => {
								// 无需关闭这层模态框
							}
						});
					} else if(this.pid) {
						Modal.success({
							title: '提示',
							content: '新建病历页成功',
							okText: '确定',
							onOk: () => {
								// 关闭这层模态框
								this.exitStage1();
							}
						});
					} else {
						Modal.success({
							title: '提示',
							content: '新建病历簿成功',
							okText: '确定',
							onOk: () => {
								// 关闭这层模态框
								this.exitStage1();
							}
						});
					}
				}
			}).catch(err=>{
				message.error(window.JSON.stringify(err));
			}).finally(()=>{
				this.savediseaserecordlist_Lock = false;
			});
		},
		createLL: (postdata, cb, type='create') => {
			if (type==='create') {
				$http.post(API.acupointcreate, postdata).then(res=>{
					if(res.data.code === 200){
						// 处方开具成功 取货码: res.data.data.code
						cb(res.data.data.code);
					}
				});
			} else if (type==='edit') {
				$http.post(API.acupointcreate, postdata).then(res=>{
					if(res.data.code === 200){
						// 处方更新成功
						cb('update_success');
					}
				});
			}
		},
		createOpts: (name, opt_order) => {
			if (!name){
				message.warn('请输入内容');
				return false;
			}
			if (opt_order === 1){
				this.setState({
					addOpt1: true
				});
				$http.post(API.treatmentSave, {
					name
				}).then(res=>{
					if (res.data.code === 200){
						message.info(`"${name}" 新建成功`);
						this.setState({
							addOpt_val1: ''
						});
						this.dataCenter.getTreatmentList();
					}
				}).finally(()=>{
					this.setState({
						addOpt1: false
					});
				});
			}
			if (opt_order === 2){
				this.setState({
					addOpt2: true
				});
				$http.post(API.diagnosisSave, {
					name
				}).then(res=>{
					if (res.data.code === 200){
						message.info(`"${name}" 新建成功`);
						this.setState({
							addOpt_val2: ''
						});
						this.dataCenter.diagnosisGet();
					}
				}).finally(()=>{
					this.setState({
						addOpt2: false
					});
				});
			}
			if (opt_order === 3){
				this.setState({
					addOpt3: true
				});
				$http.post(API.zyzxSave, {
					name
				}).then(res=>{
					if (res.data.code === 200){
						message.info(`"${name}" 新建成功`);
						this.setState({
							addOpt_val3: ''
						});
						this.dataCenter.getTcms();
					}
				}).finally(()=>{
					this.setState({
						addOpt3: false
					});
				});
			}
			if (opt_order === 4){
				this.setState({
					addOpt4: true
				});
				$http.post(API.westerndiagnosisSave, {
					name
				}).then(res=>{
					if (res.data.code === 200){
						message.info(`"${name}" 新建成功`);
						this.setState({
							addOpt_val4: ''
						});
						this.dataCenter.getWests();
					}
				}).finally(()=>{
					this.setState({
						addOpt4: false
					});
				});
			}

		},
		PhysiotherapyRecord: (name, record) => {
			// console.log(name);
			// console.log(record);
			if (!name){
				message.warn('请输入操作医师');
				return false;
			}
			this.setState({
				doing_ll_loading: true
			});
			$http.post(API.liLiaoAddRecord, {
				prescription_id: record.id,
				doctor_name: name
			}).then(res=>{
				if (res.data.code === 200){
					message.success('操作成功');
					// 刷新进度
					this.dataCenter.getcfList(1, this.state.formQueryDatas.disease_record_id);
				}
			}).finally(()=>{
				this.setState({
					doing_ll_loading: false
				});
			});
		}
	};

	saveLL = () => {
	    /*console.log(this.state.ll_count);
		console.log(this.state.xuewei_list_id);*/
		// xuewei_list_id = 理疗穴位 array
		if (this.state.ll_list_id === undefined || this.state.ll_list_id === '0') {
			message.warn('请选择理疗项目');
			return false;
		}
		let postdata = {
			prescription_id: 0,
			acupoint_ids: this.state.xuewei_list_id !==undefined && this.state.xuewei_list_id.length >0?this.state.xuewei_list_id.join(','):'',
			nums: this.state.ll_count,
			disease_record_id: this.state.formQueryDatas.disease_record_id,
			liliao_id: this.state.ll_list_id,
			zhekou_id: this.state.coupon_data_id2
		};
		if (this.cfEditId !== null) {
			// 编辑
			postdata.prescription_id = this.cfEditId;
			this.dataCenter.createLL(postdata, ()=>{
				// 刷新获取处方列表接口
				this.dataCenter.getcfList(1, this.state.formQueryDatas.disease_record_id);
				Modal.success({
					title: '提示',
					content: '处方更新成功',
					okText: '关闭',
					onOk: () => {
						// this.exitStage2();
					}
				});
			}, 'edit');
		} else {
			// 新建
			this.dataCenter.createLL(postdata, (code)=>{
				// 刷新获取处方列表接口
				this.dataCenter.getcfList(1, this.state.formQueryDatas.disease_record_id);
				Modal.success({
					title: '处方开具成功',
					content: '处方取货码: 『'+code+'』',
					okText: '关闭',
					onOk: () => {
						this.exitStage2();
					}
				});
			}, 'create');
		}

	};

	exitStage1 = () => {
		this.setState({
			stage1: false,
			stage_title1: '',
			formQueryDatas: {
				patient_desc: '',
				disease_history: '',
				inspection_result: '',
				diagnosis_id: undefined,
				advise: '',
				files: [],
				disease_record_id: '',
				pid: '',
				disease_past: '',
				disease_family: '',
				tcm_id: undefined,
				treatment_id: undefined,
				western_diagnosis_id: undefined,
				drug_reaction: '',
				update_time: '',
				current_date: undefined,
				dates: []
			},
			fileList: [],
			fileList_videos: [],
			sickBook_current_page: 1,
			sickBook_total_page: 0,
			activeKey: '1',
			cfList_dates_cacheValue: undefined,
			cfList_typings_cacheValue: {
				value: undefined,
				data: {}
			}
		});
		this.pid = null;
		this.editSickBookId = null;
	};

	exitStage2 = () => {
	    this.setState({
		    stage2: false,
		    stage_title2: '',
		    cf_private: true,
		    drinkStyle_id: undefined,
		    me_type: '0',
		    cf_remark: '無需備註信息',
		    cf_nums: '1',
		    coupon_data_id: '100',
		    drug_group_list_id: undefined,
		    cf_info_list: [
			    /*{drug_id: undefined, weight: '', price: 0, empty: false},
			    {drug_id: undefined, weight: '', price: 0, empty: false}*/
		    ],
		    hide_cf_list: false,
		    thumb: '',
		    poster: '',
		    total_money: '0',
		    real_money: '0',
		    unit_money: '0',
		    youhui_money: '0',
		    code: '',
		    status: '0',
		    drugData2_id: undefined,
		    cf_days: '0',
		    xuewei_list_id: undefined,
		    ll_count: '1',
		    activeKey2: '1',
		    only_show: '100'
	    });
		this.cfEditId = null;
	};

	renderItems = () => {
		return {
			SEARCH: (shouldShowSearchBox, user_list, searchLoading) => {
				if (shouldShowSearchBox) {
					return (
						<div className="filter-list rex-cf">
							<div className="item-list">
								{
									user_list.length === 0?
										<List
											itemLayout="horizontal"
											dataSource={[1]}
											renderItem={item =>
												<List.Item className='rex-item-hover'>
													<List.Item.Meta
														title={<span>无匹配结果...</span>}
													/>
												</List.Item>
											}
										/>:<List
											loading={searchLoading}
											itemLayout="horizontal"
											dataSource={[
												...user_list
											]}
											renderItem={item =>
												<List.Item className='rex-item-hover' onClick={()=>{
													this.handleUserClick(item);
												}}>
													<List.Item.Meta
														title={<span>患者姓名: {item.username}</span>}
														description={`联系电话: ${item.mobile}`}
													/>
												</List.Item>
											}
										/>
								}
							</div>
						</div>
					);
				}
				return null;
			}
		};
	};

	handleUserSearchChangeFor = (val) => {
		if (!this.state.shouldShowSearchBox) {
			this.setState({
				shouldShowSearchBox: true
			});
		}
		this.dataCenter.getPatients(val);
		this.setState({
			currentUserName: val
		});
	};

	handleUserSearchFor = (val) => {
		if (!this.state.shouldShowSearchBox) {
			this.setState({
				shouldShowSearchBox: true
			});
		}
		this.dataCenter.getPatients(val);
	};

	handleUserClick = (data) => {
	    // console.log(data);
	    // 获取病历列表
	    this.dataCenter.getdiseaserecordlist(1, data.id);
		this.setState({
			shouldShowSearchBox: false,
			currentUserName: data.username,
			currentUserInfo: {
				id: data.id,
				username: data.username,
				sex: data.sex,
				age: data.age,
				job: data.job,
				mobile: data.mobile,
				id_num: data.id_num,
				balance: data.balance,
				avatar_pic: data.avatar_pic
			},
		});
	};

	createSickBook = () => {
		this.setState({
			stage1: true,
			stage_title1: '新建病历簿'
		});
	};

	editSickBookId = null;

	getSickBookInfo = (id) => {
		// 查看编辑病历的内页
		console.log(`查看编辑病历的内页,id=${id}`);
		this.editSickBookId = id;
		// 请求病历内页接口
		this.dataCenter.getdiseaserecordlistPages(1);
		this.setState({
			stage1: true,
			stage_title1: '病历簿信息'
		});
		console.warn(`this.pid=${this.pid}`);
	};

	pid = null;

	addSickBookInfo = (id) => {
		// 新增一页病历的内页
		console.log(`新增一页病历的内页,pid=${id}`);
		this.pid = id;
		// 请求病历内页接口: 只获取关键信息
		this.dataCenter.getdiseaserecordlistPages(1, id, true);
		this.setState({
			stage1: true,
			stage_title1: '新增病历簿信息'
		});
		console.warn(`this.editSickBookId=${this.editSickBookId}`);
	};

	handleTabChange = (activeKey) => {
		console.log(activeKey);
		this.setState({activeKey});
		if (activeKey === '2') {
			// 点击了处方信息，开始获取处方列表
			this.dataCenter.getcfList(1, this.state.formQueryDatas.disease_record_id);
		}
	};

	rebackCF = (item, _index) => {
	    // 给处方退款
		if (!item.id) {
			return false;
		}
		if (item.status === '20' || item.status === 20){
			// 已支付状态
			confirm({
				title: '提示',
				content: '确定给此处方退款吗？',
				okText: '确认',
				cancelText: '取消',
				okType: 'danger',
				onOk: () => {
					$http.post(API.rebackCF, {
						id: item.id
					}).then(res=>{
						if (res.data.code === 200) {
							message.success('退款成功');
							// this.dataCenter.getcfList(1, this.state.formQueryDatas.disease_record_id);
							// 无需请求接口只需前端更新数据即可
							// let _cfList = _.cloneDeep(this.state.cfList);
							let _cfList = window.Array.from([...this.state.cfList]);
							_cfList[_index].status = '30';
							this.setState({
								cfList: _cfList
							});
						}
					});
				}
			});
		} else {
			message.warn('非已支付处方不可退款');
		}
	};

	deleteCF = (item, _index) => {
		// console.log(_index);
		if (!item.id) {
			return false;
		}
		if (item.status === '20' || item.status === 20){
			message.warn('已支付的处方无法删除');
			return false;
		}
		confirm({
			title: '提示',
			content: '确定删除此病历簿吗？',
			okText: '确认',
			cancelText: '取消',
			okType: 'danger',
			onOk: () => {
				$http.post(API.prescriptionDelete, {
					id: item.id
				}).then(res=>{
					if (res.data.code === 200) {
						message.success('删除成功');
						// this.dataCenter.getcfList(1, this.state.formQueryDatas.disease_record_id);
						// 无需请求接口只需前端更新数据即可
						// let _cfList = _.cloneDeep(this.state.cfList);
						let _cfList = window.Array.from([...this.state.cfList]);
						_cfList.splice(_index, 1);
						this.setState({
							cfList: _cfList
						});
					}
				});
			}
		});
	};

	createCF = () => {
		this.setState({
			stage2: true,
			stage_title2: '新建处方信息'
		});
	};

	cfEditId = null;

	editCfInfo = (data) => {
		this.cfEditId = data.id;
		// 获取处方详情
		this.dataCenter.getCfInfo(data.id);
		this.setState({
			stage2: true,
			stage_title2: '查看/编辑处方信息',
		});
	};

	checkEmpty = (vars) => {
		// 一些基础默认值的检测
		return vars !== '' && vars !== undefined && vars !== null && vars !== false;
	};

	handleMeTypeChange = (e) => {
		// 草药、成药的切换回调
		const value = e.target.value;

		if (this.state.drugData2_id !== undefined && this.state.drugData2_id !== null) {
			message.warn('您已勾选成品药, 不可切换其他类型');
			return false;
		}
		if (value === '5') {
			// 如果切换成药, 成药字段必须有值
			if (this.checkEmpty(this.state.drug_group_list_id)) {
				// 隐藏清单域
				this.setState({
					hide_cf_list: true,
					me_type: value
				});
			} else {
				message.warn('采用成药必须选择');
				return false;
			}
		} else if (value === '0'){
			this.setState({
				hide_cf_list: false,
				me_type: value
			});
		} else if (value === '2'){
			// 如果切换成品药, 成品药字段必须有值
			if (this.checkEmpty(this.state.drugData2_id)) {
				// 隐藏清单域
				this.setState({
					hide_cf_list: true,
					me_type: value
				});
			} else {
				message.warn('采用成品药必须选择');
				return false;
			}
		}
	};

	handleDrugGroup2Change = (v) => {
	    this.setState({
		    drugData2_id: v
	    }, () => {
	    	if (this.state.drugData2_id !== undefined && this.state.drugData2_id !== null) {
	    		// 必须强制勾选成品药
			    const money = this.state.drugData2.find(val=>val.id===v).price;
	    		this.setState({
				    me_type: '2',
				    hide_cf_list: true,
				    me_type2_money: money
			    });
		    } else {
	    		// 回到默认
			    this.setState({
				    me_type: '0',
				    hide_cf_list: false,
				    me_type2_money: 0
			    });
		    }
	    });
	};

	handleXueweiGroupChange = (v) => {
		this.setState({
			xuewei_list_id: v
		});
	};

	handleDrugGroupChange = (v) => {
		// 成药选择的回调
		this.setState({
			drug_group_list_id: v
		});
		if (v === undefined || v === null) {
			this.setState({
				me_type5_money: 0
			});
		} else {
			const money = this.state.drug_group_list.find(val=>val.id===v).money;
			this.setState({
				me_type5_money: money
			});
		}
		// 追加逻辑: 如果是草药类型，铺散，如果是成药类型啥也不管就行了...
		if (this.state.me_type === '0'){
			// 获取素材列表并铺散至处方清单,清单成员数量尽量小于100 利于CPU计算
			const drugs = this.state.drug_group_list.find(val=>val.id===v).drugs.map(val=>{
				return {
					...val,
					drug_id: val.id,
					empty: false,
					price: val.price * 1 / 1000
				};
			});
			// 更新drug_list，因为可能选择的到的素材列表下拉框没相关联的数据，会导致显示为id而不是labelNAME
			console.warn(drugs);
			let drug_list = drugs.map(val=>{
				return {
					id: val.drug_id,
					name: val.name,
					price: val.price
				};
			});
			const money = this.state.drug_group_list.find(val=>val.id===v).money;
			this.setState({
				cf_info_list: [...drugs],
				drug_list,
				me_type5_money: money
			}, ()=>{

			});
		}
	};

	addCfRows = () => {
	    // 增加一行处方
		/*this.setState({
			cf_info_list: [...this.state.cf_info_list, ...[{
				drug_id: undefined, weight: '', price: 0, empty: false
			}]]
		});*/
		// 增加一行处方 添加的时候重新构造list
		// console.log(this.state.drug_list);
		// console.log(this.state.cf_info_list); // id x
		// 判断重复id = 重复药材检测
		const resCheck =this.state.cf_info_list.findIndex(val=>val.drug_id*1===this.state.associate_id*1);
		if (resCheck !== -1){
			message.warn('请勿重复添加药材');
			return false;
		}
		this.setState({
			cf_info_list: [...this.state.cf_info_list, ...[{
				drug_id: this.state.associate_id, weight: this.state.associate_weight, price: this.state.associate_price, datas: this.state.associate_datas, empty: false
			}]]
		}, ()=>{
			// 添加完毕清空 + 构造新drug_list
			const cf_info_list = this.state.cf_info_list;
			// console.log(cf_info_list); // drug_id ok
			let _drug_list = [];
			cf_info_list.forEach(values=>{
				if (values['datas']){
					_drug_list.push(values.datas);
				} else {
					_drug_list.push({
						price: values.price,
						auto_weight: values.weight,
						name: values.name,
						id: values.drug_id
					});
				}
			});
			// console.log(_drug_list);
			this.setState({
				associate_id: undefined,
				associate_weight: '',
				associate_price: '',
				associate_datas: {
					price: '',
					auto_weight: '',
					name: '',
					id: undefined
				},
				drug_list: _drug_list
			});
		});
	};

	removeCfRows = (index) => {
		// 移除一行处方 删除的时候 不重新构造drug_list 没必要 只需要重构cf_info_list
		// let cf_info_list = _.cloneDeep(this.state.cf_info_list);
		let cf_info_list = window.Array.from([...this.state.cf_info_list]);
		cf_info_list.splice(index, 1);
		this.setState({
			cf_info_list
		});
	};

	saveCfContent = () => {
		const state = this.state;
		let {drug_group_list_id, cf_info_list, cf_private, me_type, drinkStyle_id, cf_remark, cf_nums, coupon_data_id, thumb, poster, cf_days, drugData2_id} = state;
		// console.log(cf_info_list);
		// 基本检测
		if (!this.checkEmpty(drinkStyle_id)) {
			message.warn('选择正确的服用方式');
			return false;
		}
		if (!(window.parseInt(cf_nums) >= 1)) {
			message.warn('选择设置正确的处方付数');
			return false;
		}
		if (!['0', '5', '2'].includes(me_type)){
			message.warn('非法药物类型');
			return false;
		}
		// 空药材内容检测并且自动去重
		let _drugs = [];
		cf_info_list.forEach(val=>{
			if (val.weight && val.drug_id){
				_drugs.push(val);
			}
		});
		// console.log(_drugs);
		let drugs = _drugs.map(val=>{
			return window.JSON.stringify({
				id: val.drug_id,
				weight: val.weight
			});
		});
		drugs = '['+drugs.join(',')+']';
		if (me_type === '0') {
			// 仅针对草药类型药物重复检测
			const drug_ids = cf_info_list.map(v=>{
				return v.drug_id;
			});
			if (drug_ids.length !== window.Array.from(new Set(drug_ids)).length) {
				// 出现重复
				message.warn('成分表中出现重复药材，请统一后重试', 1.2);
				return false;
			}
		}
		if (me_type === '2' || me_type === 2) {
			// 如果选择成品药
			drugs = '['+[
				window.JSON.stringify({id: drugData2_id, weight: '1'})
			].join(',')+']';
		}
		let postdata = {
			patient_id: this.state.currentUserInfo.id,
			disease_record_id: this.state.formQueryDatas.disease_record_id,
			taking_method: drinkStyle_id,
			drug_group_id: drug_group_list_id?drug_group_list_id:'',
			drugs,
			remark: cf_remark?cf_remark:'',
			zhekou_id: coupon_data_id,
			private: cf_private?'1':'0',
			nums: cf_nums,
			thumb: thumb?thumb:'default_thumb',
			drug_group_type: me_type,
			poster: poster?poster:'default_poster',
		};
		if (me_type === '2' || me_type === 2) {
			postdata.days = cf_days;
		}
		// 如果是成药 忽略drugs 只取成药内容 (drugs清空，drug_group_id必须有值)
		if (me_type === '5' || me_type === 5) {
			if (!postdata.drug_group_id) {
				message.warn('成药处方必须选择成药');
				return false;
			}
			postdata.drugs = '[]';
		}
		// console.log(postdata);
		if (this.cfEditId !== null) {
			// 编辑
			postdata.prescription_id = this.cfEditId;
			this.dataCenter.saveCfContent(postdata, ()=>{
				// 刷新获取处方列表接口
				this.dataCenter.getcfList(1, this.state.formQueryDatas.disease_record_id);
				Modal.success({
					title: '提示',
					content: '处方更新成功',
					okText: '关闭',
					onOk: () => {
						// this.exitStage2();
					}
				});
			}, 'edit');
		} else {
			// 新建
			this.dataCenter.saveCfContent(postdata, (code)=>{
				// 刷新获取处方列表接口
				this.dataCenter.getcfList(1, this.state.formQueryDatas.disease_record_id);
				Modal.success({
					title: '处方开具成功',
					content: '处方取货码: 『'+code+'』',
					okText: '关闭',
					onOk: () => {
						this.exitStage2();
					}
				});
			});
		}
	};

	supportCamera = false;
	mediaStreamTrack = null;

	openCamera = () => {
	    // 打开摄像头拍照
		const initCamera = () => {
			//  判断浏览器是否支持
			let isSupport = navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			if (isSupport) {
				const constraintsOpts = {audio: false, video: {width: 310, height: 310}};
				//  调用摄像头  成功后获取视频流：mediaStream
				navigator.mediaDevices.getUserMedia(constraintsOpts).then(mediaStream => {
					this.mediaStreamTrack = mediaStream;
					console.log('初始化完毕...');
					this.supportCamera = true;
					// 显示按钮
					const video = document.getElementById('cameraVideo');
					//  赋值 video 并开始播放
					video.srcObject = mediaStream;
					video.onloadedmetadata = () => {
						video.play();
					};

					//  录像api的调用
					// const mediaRecorder = new MediaStreamRecorder(mediaStream);
					// mediaRecorder.mimeType = 'video/mp4';

					//  录像以后的回调函数
					// mediaRecorder.ondataavailable = function (blob) {
					// 	const blobURL = URL.createObjectURL(blob);
					// 	console.log(blobURL);
					// };

					// $("#startBtn").click(function () {
					// 	//  开始录像
					// 	mediaRecorder.start();
					// 	console.log('开始录像');
					// });

					// $("#stopBtn").click(function () {
					// 	//  停止录像
					// 	mediaRecorder.stop();
					// 	console.log('结束录像');
					// });

					// 上传开始
					/*function uploadToPHPServer(blob) {
							const file = new File([blob], 'msr-' + (new Date).toISOString().replace(/:|\./g, '-') + '.mp4', {
								type: 'video/mp4'
							});

							// create FormData
							const formData = new FormData();
							formData.append('video-filename', file.name);
							formData.append('video-blob', file);
							console.log(file.name);
							console.log(file);
							console.log(formData);
							makeXMLHttpRequest('https:/你的地址/data/save.php', formData, function () {
								var downloadURL = 'https://你的地址' + file.name;
								console.log('File uploaded to this path:', downloadURL);
							});
						}*/
					/*function makeXMLHttpRequest(url, data, callback) {
							const request = new XMLHttpRequest();
							request.onreadystatechange = function () {
								if (request.readyState == 4 && request.status == 200) {
									callback();
								}
							};
							request.open('POST', url);
							request.send(data);
						}*/
					// 上传结束
				}).catch(err => {
					// catch error
					Modal.info({
						title: err.name,
						content: err.message,
						okText: '确定'
					});
					console.log(err);
					this.supportCamera = false;
				});
				// 扩展小知识
				/*file => blob (blob:xxx...) [window.URL.createObjectURL(file)]
				file => base64 (data:image/xxx...) [new FileReader(file).readAsDataURL()]
				canvas => dataurl [canvas.toDataURL('image/png')]
				canvas => blob [canvas.toBlob(blobObj=>{ let uploadFile = blobObj; let showFile = window.URL.createObjectURL(blobObj) })]*/
			} else {
				Modal.error({
					title: '警告',
					content: '您的设备不支持此功能, 请更换后重试~',
					okText: '确定'
				});
				this.supportCamera = false;
			}
		};
		this.setState({
			cameraModal: true
		},()=>initCamera());
	};

	takePhoto = () => {
		if (!this.supportCamera){
			Modal.error({
				title: '警告',
				content: '您的设备当前无法进行拍摄',
				okText: '确定'
			});
			return false;
		}
		//获得Canvas对象
		document.getElementById("canvas-camera").style.display = 'block';
		let video = document.getElementById('cameraVideo');
		let canvas = document.getElementById("canvas-camera");
		let ctx = canvas.getContext('2d');
		const drawRange = [310, 310];
		ctx.drawImage(video, 0, 0, drawRange[0], drawRange[1]);
		// const image = new Image();
		const base64SRC = canvas.toDataURL("image/jpeg", 0.4); // DataUrl
		// image.src = base64SRC;
		// console.log(base64SRC);
		// $('#img').append(image);
		canvas.toBlob(blob => {
			// console.log(blob);
			// blob 变 DataUrl
			// console.log(window.URL.createObjectURL(blob));
			// base64 变 file
			let arr = base64SRC.split(','), mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			while(n--){
				u8arr[n] = bstr.charCodeAt(n);
			}
			const fileName = new Date().getTime();
			const cameraFile = new File([u8arr], fileName.toString()+'.jpg', {type:mime});
			this.setState({
				cameraFile
			});
			console.log(cameraFile);
		});
	};

	uploadPhoto = () => {
		if (!this.supportCamera){
			Modal.error({
				title: '警告',
				content: '您的设备当前无法进行上传',
				okText: '确定'
			});
			return false;
		}
	    // 上传所拍摄完成的图片
		const uploadFile = this.state.cameraFile;
		if (uploadFile === null) {
			message.warn('还未拍摄照片');
			return false;
		}
		this.setState({
			cameraFileUploading: true
		});
		const formData = new FormData();
		formData.append('file_name', uploadFile);
		formData.append('type', 'image');
		reqwest({
			url: API.uploadFile,
			method: 'post',
			processData: false,
			data: formData,
			headers: {
				'Http-Authorization': LocalStorage.getObject('xy_userinfo').token || 'token not found'
			},
			success: res => {
				this.setState({
					cameraFileUploading: false
				});
				if (res.code === 200) {
					const fileURL = res.data.file_url;
					message.success(res.data.file_name+'文件上传成功', .8, ()=>{
						console.log(this.state.fileList);
						document.getElementById("canvas-camera").style.display = 'none';
						this.setState({
							cameraFile: null,
							fileList: [...this.state.fileList, ...[{url: fileURL, uid: res.data.file_name}]]
						});
					});
				} else {
					// 接口主动异常 || 错误
					message.error(res.msg);
				}
			},
			error: err => {
				// 接口异常 || 错误
				this.setState({
					cameraFileUploading: false
				});
				message.error('上传失败，请检查网络是否通畅~');
				console.error(err);
			}
		});
	};

	testBTN = () => {
	    console.log('test');
	};

	render() {
		const state = this.state;

		// 患者查询输入框配置
		const searchInputProps = {
			className: 'search-input',
			placeholder: '请输入关键字进行患者查询',
			enterButton: <Button type='primary' icon='search'>查询</Button>,
			size: "large",
			ref: self => this.searchbox = self,
			onFocus: () => {
				if (this.state.user_list.length>0){
					this.setState({
						shouldShowSearchBox: true
					});
				}
			}
		};
		// 患者信息展示内容
		let {id, username, sex, age, job, mobile, id_num, balance, avatar_pic} = state.currentUserInfo;
		// sex, age = '身份证格式有误，年龄显示异常';
		if (sex === '0') {
			sex = '该患者未更新资料';
		} else {
			if (sex === '2'){
				sex = '女';
			} else {
				sex = '男';
			}
		}
		if (id_num) {
			const _age = id_num.substring(6, 10); // '1993'
			if( !/(^[1-9]\d*$)/.test(_age) ){
				// Toast.info('身份证格式不正确', 1);
				age = '身份证有误年龄显示异常';
			} else {
				const year = new Date().getFullYear(); // 2019
				age = year - _age*1 + '岁'; // 周岁
			}
		} else {
			age = '身份证有误年龄显示异常';
		}

		let total_drugs = 0;
		let unit_money = state.unit_money * 1;
		let real_money = state.real_money * 1;
		let youhui_money = state.youhui_money * 1;
		if (state.me_type === '0' || state.me_type === 0){
			// 单价 猜测应该是中草药的计价模式
			unit_money = state.unit_money * 1;
			// 针对草药、成药、成品药、state.me_type  0-草药 5-成药 2-成品药 cf_info_list
			// console.log(state.cf_info_list);
			// console.log(state.me_type);
			state.cf_info_list.forEach(v=>{
				let weight = 0;
				let price = 0;
				if (v.weight) {
					console.log('weight yes');
					weight = v.weight*1;
				}
				if (v.price) {
					console.log('price yes');
					price = v.price*1;
				}
				if (v.drug_id) {
					console.log('drug_id yes');
					total_drugs+=1;
				}
				// console.log(`unit_money: ${unit_money}、unit_money: ${state.unit_money}`);
				unit_money += weight*price;
				// console.log('----');
			});

			// 总价 = 单价 * 付数 state.cf_nums * 折扣
			real_money = (unit_money * (state.cf_nums * 1) * (state.coupon_data_id * 1 / 100)).toFixed(2);
			unit_money = unit_money.toFixed(2);

		}
		// 2种成药单独计价
		if (state.me_type === '5' || state.me_type === 5) {
			unit_money = (state.me_type5_money * 1).toFixed(2);
			real_money = (unit_money * (state.cf_nums * 1) * (state.coupon_data_id * 1 / 100)).toFixed(2);
		}
		if (state.me_type === '2' || state.me_type === 2) {
			unit_money = (state.me_type2_money * 1).toFixed(2);
			real_money = (unit_money * (state.cf_nums * 1) * (state.coupon_data_id * 1 / 100)).toFixed(2);
		}

		let current_cf_update_time = null, last_cf_update_time = null;
		if (state.formQueryDatas.update_time) {
			if (this.pid) {
				current_cf_update_time = moment().format(Prescribe.dateformat);
			} else {
				current_cf_update_time = state.formQueryDatas.update_time;
			}
			last_cf_update_time = state.formQueryDatas.update_time;
		} else {
			current_cf_update_time = moment().format(Prescribe.dateformat);
		}

		youhui_money = state.coupon_data_id*1 === 100?0:window.Math.abs(state.cf_nums * 1 * (unit_money * 1) - real_money*1).toFixed(2);

		return (
			<div className="Prescribe" id='Prescribe'>
				<h2 className='title'>门诊就诊系统</h2>
				<div className="content">
					<div className="filter-box">
						<Input.Search
							{...searchInputProps}
							value={state.currentUserName}
							onChange={ asval => this.handleUserSearchChangeFor(asval.target.value) }
							onSearch={ val => this.handleUserSearchFor(val) } />
						{
							this.renderItems().SEARCH(state.shouldShowSearchBox, state.user_list, state.searchLoading)
						}
					</div>
					{
						state.currentUserInfo.id!==null?
							<div className="main-box">
								<Placeholder height={15} />
								<div className="infomations">
									<div className="userinfo">
										<Descriptions title="患者资料" size='middle' bordered column={4}>
											<Descriptions.Item label="患者(ID)">{id}</Descriptions.Item>
											<Descriptions.Item label="患者姓名">{username}</Descriptions.Item>
											<Descriptions.Item label="性别">{sex}</Descriptions.Item>
											<Descriptions.Item label="年龄">{age}</Descriptions.Item>
											<Descriptions.Item label="职业">{job?job:'该患者未更新资料'}</Descriptions.Item>
											<Descriptions.Item label="联系电话">{mobile}</Descriptions.Item>
											<Descriptions.Item label="身份证号码">{id_num?id_num:'该患者未更新资料'}</Descriptions.Item>
											<Descriptions.Item label="就诊卡余额">{balance}</Descriptions.Item>
											<Descriptions.Item label="头像信息"><div onClick={()=>{
												this.setState({
													viewUserAvatar: true,
													viewUserAvatar_url: avatar_pic
												});
											}} style={{border: '1px solid #ddd8d8', borderRadius: '4px', width: 'min-content', height: 120, padding: '4px', cursor: `url(${require('./assets/pointer_mouse.cur')}), pointer`}}><img src={avatar_pic} height={'100%'} alt=""/></div></Descriptions.Item>
										</Descriptions>
									</div>
									<Placeholder height={25} />
									<div className="sick-list">
										<div className='name'>患者病历簿{state.blList_total_page>=1?`(共${state.blList_total_page}条)`:''}</div>
										<Button icon={'plus'} onClick={()=>this.createSickBook()}>新增病历簿</Button>
										<div className="rex-cf">
											<Row>
												{
													state.blList.map(v=>{
														return (
															<Col key={v.id} span={8}>
																<Card
																	style={{ width: 300, marginTop: 16 }}
																	actions={[
																		<Button type='link' onClick={ () => this.addSickBookInfo(v.id) }>新增一页</Button>,
																		<Button type='link' onClick={ () => this.getSickBookInfo(v.id) }>查看/编辑</Button>,
																		<Button type='link' onClick={()=>this.dataCenter.deletediseaserecordlist(v.id)}>删除</Button>
																	]}
																>

																	<Card.Meta
																		title={`${v.department_name}-${v.doctor_name}(${v.doctor_job})`}
																		description={
																			<div>
																				<div>诊断结果: {v.diagnosis_name}</div>
																				<div>最后一次编辑于 {v.update_time}</div>
																			</div>
																		}
																	/>
																</Card>
															</Col>
														);
													})
												}
												{
													state.blList.length === 0?
														<Col span={24}>
															<Empty title={'暂无就诊记录'} />
														</Col>:null
												}
											</Row>
											<Placeholder height={15} />
											<div className="paginationLeft">
												<Pagination hideOnSinglePage={true} pageSize={Prescribe.blPageSize} current={state.blList_current_page} total={state.blList_total_page} onChange={page=>{
													this.dataCenter.getdiseaserecordlist(page, state.currentUserInfo.id);
												}} />
											</div>
										</div>
									</div>
								</div>
							</div>:null
					}
				</div>
				<Drawer
					mask={true}
					getContainer={()=>document.getElementById('Prescribe')}
					maskClosable={true}
					title={state.stage_title1}
					placement="right"
					width={this.domWidth - 200}
					onClose={()=>this.exitStage1()}
					visible={this.state.stage1}
				>
					<div className="createSickBook">
						<div className='form-ctrls rex-cf'>
							<div className='item rex-fl'>
								<span className='rex-fl name'>当前就诊患者: </span>
								<Input className='rex-fl' readOnly style={{width: 120}} value={this.state.currentUserName} />
							</div>
							<div className='item rex-fl'>
								<span className='rex-fl name'>当前就诊科室: </span>
								<Input className='rex-fl' readOnly style={{width: 200}} value={`${LocalStorage.getObject('xy_userinfo').department_name}/${LocalStorage.getObject('xy_userinfo').username}(${LocalStorage.getObject('xy_userinfo').job})`} />
							</div>
						</div>
						<Placeholder height={15} />
						<div className='form-ctrls rex-cf'>
							<div className='item rex-fl' style={{display: 'flex', alignItems: 'center'}}>
								<span className='rex-fl name'>当前系统日期: {moment().format(Prescribe.dateformat)}</span>
							</div>
						</div>
						{
							this.state.formQueryDatas.current_date?
								<React.Fragment>
									<Placeholder height={15} />
									<div className='form-ctrls rex-cf'>
										<div className='item rex-fl' style={{display: 'flex'}}>
											<span className='rex-fl name'>上次就诊日期: {this.state.formQueryDatas.current_date}</span>
										</div>
									</div>
								</React.Fragment>:null
						}
						{/*this.pid=true 代表是新增一页的*/}
						{/*{
							this.pid?
								<React.Fragment>
									<Placeholder height={15} />
									<div className='form-ctrls rex-cf'>
										<div className='item rex-fl' style={{display: 'flex'}}>
											<span className='rex-fl name'>上次就诊日期: {this.state.formQueryDatas.current_date}</span>
										</div>
									</div>
								</React.Fragment>:null
						}*/}
						{/*<Placeholder height={15} />
						<div className='form-ctrls rex-cf'>
							<div className='item rex-fl' style={{display: 'flex'}}>
								<span className='rex-fl name'>此次就诊日期: {current_cf_update_time}</span>
							</div>
						</div>*/}
						<Placeholder height={30} />
						<div className="user-infomations">
							<div className="userinfo">
								<Descriptions title="患者资料" size='middle' bordered column={4}>
									<Descriptions.Item label="患者(ID)">{id}</Descriptions.Item>
									<Descriptions.Item label="患者姓名">{username}</Descriptions.Item>
									<Descriptions.Item label="性别">{sex}</Descriptions.Item>
									<Descriptions.Item label="年龄">{age}</Descriptions.Item>
									<Descriptions.Item label="职业">{job?job:'该患者未更新资料'}</Descriptions.Item>
									<Descriptions.Item label="联系电话">{mobile}</Descriptions.Item>
									<Descriptions.Item label="身份证号码">{id_num?id_num:'该患者未更新资料'}</Descriptions.Item>
									<Descriptions.Item label="就诊卡余额">{balance}</Descriptions.Item>
									<Descriptions.Item label="头像信息"><div onClick={()=>{
										this.setState({
											viewUserAvatar: true,
											viewUserAvatar_url: avatar_pic
										});
									}} style={{border: '1px solid #ddd8d8', borderRadius: '4px', width: 'min-content', height: 120, padding: '4px', cursor: `url(${require('./assets/pointer_mouse.cur')}), pointer`}}><img src={avatar_pic} height={'100%'} alt=""/></div></Descriptions.Item>
								</Descriptions>
							</div>
						</div>
						<Placeholder height={30} />
						<div className="wrap-tabs">
							<Tabs activeKey={state.activeKey} onChange={(activeKey)=>this.handleTabChange(activeKey)}>
								<TabPane tab="就诊信息" key="1" className="tb-1">
									{
										state.formQueryDatas.dates.length>0?
											<div>
												<div className="form-ctrls">
													<div className="label-box rex-cf align-center">
														<span className="label-name rex-fl w154" style={{textAlign: 'left', width: 118}}>就诊日期关联查询: </span>
														<div className="label-forms rex-fl">
															<Select
																showSearch
																placeholder='可根据就诊日期查询'
																optionFilterProp='label'
																style={{width: 410}}
																value={state.formQueryDatas.current_date}
																onChange={(date) => {
																	this.dataCenter.getdiseaserecordlistPages(this.state.sickBook_current_page, this.editSickBookId, false, date);
																}}
															>
																{
																	state.formQueryDatas.dates.map((v, i)=>{
																		// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																		const hunpinCode= window.Pinyin.GetJP(v);
																		return(
																			<Option key={i} value={v} label={hunpinCode}>{v}</Option>
																		);
																	})
																}
															</Select>
														</div>
													</div>
												</div>
											</div>:null
									}
									<div className="DivFieldset1">
										<div className="DivFieldset1_title">基本信息</div>
										<div className="DivFieldset1_content">
											<div className="rex-fctns">
												<div className="form-ctrls">
													<div className="label-box rex-cf">
														<span className="label-name rex-fl w154">患者主诉: </span>
														<div className="label-forms rex-fl">
															<Input.TextArea style={{width: 410}} value={state.formQueryDatas.patient_desc} onChange={(v)=>this.handleForm('patient_desc', v.target.value)} placeholder='请输入患者主诉信息' autoSize={{ minRows: 2, maxRows: 6 }} />
														</div>
													</div>
												</div>
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf">
														<span className="label-name rex-fl w154">现病史: </span>
														<div className="label-forms rex-fl">
															<Input.TextArea style={{width: 410}} value={state.formQueryDatas.disease_history} onChange={(v)=>this.handleForm('disease_history', v.target.value)} placeholder='请输入患者现病史信息' autoSize={{ minRows: 2, maxRows: 6 }} />
														</div>
													</div>
												</div>
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf">
														<span className="label-name rex-fl w154">既往史: </span>
														<div className="label-forms rex-fl">
															<Input.TextArea style={{width: 410}} value={state.formQueryDatas.disease_past} onChange={(v)=>this.handleForm('disease_past', v.target.value)} placeholder='请输入患者既往史信息' autoSize={{ minRows: 2, maxRows: 6 }} />
														</div>
													</div>
												</div>
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf">
														<span className="label-name rex-fl w154">家族史: </span>
														<div className="label-forms rex-fl">
															<Input.TextArea style={{width: 410}} value={state.formQueryDatas.disease_family} onChange={(v)=>this.handleForm('disease_family', v.target.value)} placeholder='请输入患者家族史信息' autoSize={{ minRows: 2, maxRows: 6 }} />
														</div>
													</div>
												</div>
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf">
														<span className="label-name rex-fl w154">实验室检查: </span>
														<div className="label-forms rex-fl">
															<Input.TextArea style={{width: 410}} value={state.formQueryDatas.inspection_result} onChange={(v)=>this.handleForm('inspection_result', v.target.value)} placeholder='请输入患者实验室检查信息' autoSize={{ minRows: 2, maxRows: 6 }} />
														</div>
													</div>
												</div>
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf align-center">
														<span className="label-name rex-fl w154">治法治则: </span>
														<div className="label-forms rex-fl">
															<Select
																showSearch
																placeholder='请选择治法治则'
																optionFilterProp='label'
																style={{width: 260}}
																value={state.formQueryDatas.treatment_id}
																onChange={(v) => this.handleForm('treatment_id', v)}
															>
																{
																	state.treatment_list.map(v=>{
																		// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																		const hunpinCode= window.Pinyin.GetJP(v.name);
																		return(
																			<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																		);
																	})
																}
															</Select>
														</div>
														<Placeholder width={10} />
														<Spin spinning={state.addOpt1} tip={'数据提交中...'}>
															<Input value={state.addOpt_val1} onChange={e=>this.setState({addOpt_val1: e.target.value})} onPressEnter={(e)=>{
																this.dataCenter.createOpts(e.target.value, 1);
															}} placeholder='新增治法治则选项' style={{width: 140}} />
														</Spin>
													</div>
												</div>
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf align-center">
														<span className="label-name rex-fl w154">中医诊断: </span>
														<div className="label-forms rex-fl">
															<Select
																showSearch
																placeholder='请选择中医诊断'
																optionFilterProp='label'
																style={{width: 260}}
																value={state.formQueryDatas.diagnosis_id}
																onChange={(v) => this.handleForm('diagnosis_id', v)}
															>
																{
																	state.diagnosis.map(v=>{
																		// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																		const hunpinCode= window.Pinyin.GetJP(v.name);
																		return(
																			<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																		);
																	})
																}
															</Select>
														</div>
														<Placeholder width={10} />
														<Spin spinning={state.addOpt2} tip={'数据提交中...'}>
															<Input value={state.addOpt_val2} onChange={e=>this.setState({addOpt_val2: e.target.value})} onPressEnter={(e)=>{
																this.dataCenter.createOpts(e.target.value, 2);
															}} placeholder='新增中医诊断选项' style={{width: 140}} />
														</Spin>
													</div>
												</div>
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf align-center">
														<span className="label-name rex-fl w154">中医证型: </span>
														<div className="label-forms rex-fl">
															<Select
																showSearch
																placeholder='请选择中医证型'
																optionFilterProp='label'
																style={{width: 260}}
																value={state.formQueryDatas.tcm_id}
																onChange={(v) => this.handleForm('tcm_id', v)}
															>
																{
																	state.tcm_list.map(v=>{
																		// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																		const hunpinCode= window.Pinyin.GetJP(v.name);
																		return(
																			<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																		);
																	})
																}
															</Select>
														</div>
														<Placeholder width={10} />
														<Spin spinning={state.addOpt3} tip={'数据提交中...'}>
															<Input value={state.addOpt_val3} onChange={e=>this.setState({addOpt_val3: e.target.value})} onPressEnter={(e)=>{
																this.dataCenter.createOpts(e.target.value, 3);
															}} placeholder='新增中医证型选项' style={{width: 140}} />
														</Spin>
													</div>
												</div>
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf align-center">
														<span className="label-name rex-fl w154">西医诊断: </span>
														<div className="label-forms rex-fl">
															<Select
																showSearch
																placeholder='请选择西医诊断'
																optionFilterProp='label'
																style={{width: 260}}
																value={state.formQueryDatas.western_diagnosis_id}
																onChange={(v) => this.handleForm('western_diagnosis_id', v)}
															>
																{
																	state.western_list.map(v=>{
																		// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																		const hunpinCode= window.Pinyin.GetJP(v.name);
																		return(
																			<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																		);
																	})
																}
															</Select>
														</div>
														<Placeholder width={10} />
														<Spin spinning={state.addOpt4} tip={'数据提交中...'}>
															<Input value={state.addOpt_val4} onChange={e=>this.setState({addOpt_val4: e.target.value})} onPressEnter={(e)=>{
																this.dataCenter.createOpts(e.target.value, 4);
															}} placeholder='新增西医诊断选项' style={{width: 140}} />
														</Spin>
													</div>
												</div>
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf">
														<span className="label-name rex-fl w154">医嘱: </span>
														<div className="label-forms rex-fl">
															<Input.TextArea style={{width: 410}} value={state.formQueryDatas.advise} onChange={(v)=>this.handleForm('advise', v.target.value)} placeholder='请输入患者医嘱信息' autoSize={{ minRows: 2, maxRows: 6 }} />
														</div>
													</div>
												</div>
												{/*state.sickBook_current_page === state.sickBook_total_page 代表最后一页 因为是倒序 实则是第一页*/}
												{/*第一页没有药后反应*/}
												{/*新建病历簿的时候也没药后反应*/}
												{/*新增一页的时候需要药后反应*/}
												{
													state.sickBook_current_page === state.sickBook_total_page || state.sickBook_total_page===0?null:
														<React.Fragment>
															<Placeholder height={15} />
															<div className="form-ctrls">
																<div className="label-box rex-cf">
																	<span className="label-name rex-fl w154">药后反应: </span>
																	<div className="label-forms rex-fl">
																		<Input.TextArea style={{width: 410}} value={state.formQueryDatas.drug_reaction} onChange={(v)=>this.handleForm('drug_reaction', v.target.value)} placeholder='请输入患者药后反应信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																	</div>
																</div>
															</div>
														</React.Fragment>
												}
												{
													this.pid === null?null:
														<React.Fragment>
															<Placeholder height={15} />
															<div className="form-ctrls">
																<div className="label-box rex-cf">
																	<span className="label-name rex-fl w154">药后反应: </span>
																	<div className="label-forms rex-fl">
																		<Input.TextArea style={{width: 410}} value={state.formQueryDatas.drug_reaction} onChange={(v)=>this.handleForm('drug_reaction', v.target.value)} placeholder='请输入患者药后反应信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																	</div>
																</div>
															</div>
														</React.Fragment>
												}
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf">
														<span className="label-name rex-fl w154">图像资料: </span>
														<div className="label-forms rex-fl" style={{width: 410}}>
															<Upload
																action={API.uploadFile}
																accept={'image/*'}
																listType="picture-card"
																fileList={state.fileList}
																name='file_name'
																data={{type: 'image'}}
																headers={{
																	'Http-Authorization': LocalStorage.getObject('xy_userinfo').token || 'token not found'
																}}
																onPreview={async (file)=>{
																	console.log(file);
																	this.setState({
																		previewImage: file.url || await this.getBase64(file.originFileObj),
																		previewVisible: true,
																	});
																}}
																onChange={(info)=>{
																	this.setState({ fileList: [...info.fileList] });
																	if (info.file.status !== 'uploading') {
																		// console.log(info.file, info.fileList);
																	}
																	if (info.file.status === 'done') {
																		message.success(`${info.file.name} 文件上传成功~`, 1);
																		const res = info.file.response;
																		if (res.code === 200) {
																			/*const _fileURL = res.data.file_url;
																			// 保存新建数据中的文件地址
																			console.log(_fileURL);*/
																		} else {
																			// 接口异常 || 错误
																			message.error(res.msg);
																		}
																	} else if (info.file.status === 'error') {
																		message.error(`${info.file.name} 文件上传失败~`);
																	}
																}}
															>
																{state.fileList.length >= 5 ? null : <div>
																	<Icon type="plus" />
																	<div className="ant-upload-text">上传图像</div>
																</div>}
															</Upload>
															<Button icon='camera' onClick={()=>this.openCamera()} title='拍摄照片'>拍摄照片</Button>
															<Modal title='图像预览' visible={state.previewVisible} footer={null} onCancel={()=>{
																rdom.findDOMNode(this.bigImg).style.transform = `scale(1)`;
																this.SCALE = 1;
																this.setState({
																	previewVisible: false
																});
															}}>
																<div>
																	<img onMouseDown={ev=>{
																		if(ev.nativeEvent.button === 1){
																			rdom.findDOMNode(this.bigImg).style.transform = `scale(1)`;
																			this.SCALE = 1;
																		}
																	}} onWheel={(ev)=>{
																		// console.log(ev.nativeEvent.deltaY);
																		const OffsetY = ev.nativeEvent.deltaY;
																		if (OffsetY < 0){
																			// 向上滚动, 进行放大
																			if(this.SCALE >= 1.7){
																				message.info('不可继续放大了~');
																			} else {
																				this.SCALE += 0.1;
																				// rdom.findDOMNode(this.bigImg).css('transform', `scale(${this.SCALE})`);
																				rdom.findDOMNode(this.bigImg).style.transform = `scale(${this.SCALE})`;
																			}
																		} else {
																			// 向下滚动, 进行缩小
																			if(this.SCALE <= 0.2){
																				message.info('不可继续缩小了~');
																			} else {
																				this.SCALE -= 0.1;
																				// rdom.findDOMNode(this.bigImg).css('transform', `scale(${this.SCALE})`);
																				rdom.findDOMNode(this.bigImg).style.transform = `scale(${this.SCALE})`;
																			}
																		}
																	}} alt="example" ref={self => this.bigImg = self} style={{ width: '100%', padding: 15, transition: 'transform .2s linear' }} src={state.previewImage} />
																</div>
															</Modal>
															<Modal title='拍摄照片' width={800} visible={state.cameraModal} footer={null} onCancel={()=>{
																document.getElementById("canvas-camera").style.display = 'none';
																if(this.mediaStreamTrack!==null){
																	this.mediaStreamTrack.getTracks().forEach(function (track) {
																		track.stop();
																	});
																}
																this.setState({
																	cameraModal: false,
																	cameraFile: null
																});
															}}>
																<div>
																	<Spin spinning={state.cameraFileUploading} tip={'上传中...'}>
																		<div className="c-center" style={{width: 310, margin: '0 auto'}}>
																			<video width="310" height="310" id="cameraVideo" />
																			<div>
																				<canvas id="canvas-camera" style={{display: 'none'}} width="310" height="310" />
																			</div>
																			<Placeholder height={15} />
																			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
																				<Button.Group style={{display: 'block', margin: '0 auto'}}>
																					<Button type='primary' icon='camera' onClick={()=>this.takePhoto()}>拍摄一张照片</Button>
																					<Button type='primary' icon='upload' onClick={()=>this.uploadPhoto()}>上传</Button>
																				</Button.Group>
																			</div>
																		</div>
																	</Spin>
																</div>
															</Modal>
														</div>
													</div>
												</div>
												<Placeholder height={15} />
												<div className="form-ctrls">
													<div className="label-box rex-cf">
														<span className="label-name rex-fl w154">视频资料: </span>
														<div className="label-forms rex-fl">
															<Upload
																action={API.uploadFile}
																accept={'video/mp4'}
																fileList={state.fileList_videos}
																name='file_name'
																data={{type: 'video'}}
																headers={{
																	'Http-Authorization': LocalStorage.getObject('xy_userinfo').token || 'token not found'
																}}
																onPreview={async (file)=>{
																	console.log(file);
																	this.setState({
																		previewVideo: true,
																		videoPreviewUrl: file.url || file.response.data.file_url
																	});
																}}
																onChange={(info)=>{
																	this.setState({ fileList_videos: [...info.fileList] });
																	if (info.file.status !== 'uploading') {
																		// console.log(info.file, info.fileList_videos);
																	}
																	if (info.file.status === 'done') {
																		message.success(`${info.file.name} 文件上传成功~`, 1);
																		const res = info.file.response;
																		if (res.code === 200) {
																			const _fileURL = res.data.file_url;
																			// 保存新建数据中的文件地址
																			console.log(_fileURL);
																		} else {
																			// 接口异常 || 错误
																			message.error(res.msg);
																		}
																	} else if (info.file.status === 'error') {
																		message.error(`${info.file.name} 文件上传失败~`);
																	}
																}}
															>
																{state.fileList_videos.length >= 5 ? null : <Button icon='plus'>
																	上传视频
																</Button>}
															</Upload>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<Placeholder height={15} />
									<Button icon='save' onClick={()=>this.dataCenter.savediseaserecordlist()}>保存</Button>
									&nbsp;&nbsp;&nbsp;&nbsp;
									{/*保留一页不能删除: 保留最新的一页*/}
									{
										state.sickBook_total_page > 1 && state.sickBook_current_page > 1?
											<Button icon='delete' type='danger' onClick={()=>this.dataCenter.deletediseaserecordlist(this.state.formQueryDatas.disease_record_id, true)}>删除</Button>:null
									}
									<Placeholder height={15} />
									<div className='sick-book-paging'>
										<Pagination hideOnSinglePage={true} pageSize={1} current={state.sickBook_current_page} total={state.sickBook_total_page} onChange={page=>{
											this.dataCenter.getdiseaserecordlistPages(page);
										}} />
									</div>
								</TabPane>
								{
									state.formQueryDatas.disease_record_id?
										<TabPane tab="处方信息" key="2" className="tb-2">
											<div name="w-800">
												<Button icon='plus' onClick={()=>this.createCF()}>添加处方</Button>
												{/*筛选器*/}
												<div>
													<Select
														showSearch
														placeholder='可根据日期查询'
														optionFilterProp='label'
														style={{width: 160, marginTop: 12}}
														value={state.cfList_dates_cacheValue}
														allowClear={true}
														onChange={(date) => {
															this.setState({
																cfList_dates_cacheValue: date
															});
															this.dataCenter.getcfList(1, this.state.formQueryDatas.disease_record_id, date, this.state.cfList_typings_cacheValue.value?this.state.cfList_typings_cacheValue.data:null);
														}}
													>
														{
															state.cfList_dates.map((v, i)=>{
																// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																const hunpinCode= window.Pinyin.GetJP(v);
																return(
																	<Option key={i} value={v} label={hunpinCode}>{v}</Option>
																);
															})
														}
													</Select>
													<Select
														showSearch
														placeholder='可根据处方类型'
														optionFilterProp='label'
														style={{width: 160, marginTop: 12, marginLeft: 12}}
														value={state.cfList_typings_cacheValue.value}
														onChange={(typing, record) => {
															const bind_data = record.props.bindvalue;
															this.setState({
																cfList_typings_cacheValue: {
																	value: typing,
																	data: bind_data
																}
															});
															this.dataCenter.getcfList(1, this.state.formQueryDatas.disease_record_id, this.state.cfList_dates_cacheValue, bind_data);
														}}
													>
														{
															[{id: 0, mtype: 0, type: 0, name: '全部'}, {id: 1, mtype: 1, type: 1, name: '理疗'}, {id: 2, mtype: 1, type: 0, name: '门诊'}, {id: 3, mtype: 2, type: 0, name: '中草药'}, {id: 4, mtype: 2, type: 2, name: '成品药'}, {id: 5, mtype: 2, type: 5, name: '成药'},].map((v, i)=>{
																// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																const hunpinCode= window.Pinyin.GetJP(v.name);
																return(
																	<Option key={v.id} value={v.id} bindvalue={v} label={hunpinCode}>{v.name}</Option>
																);
															})
														}
													</Select>
												</div>
												{
													state.cfList.length>0?
														<div className='rex-scroll-bar' style={{
															maxHeight: 600,
															overflowY: "auto"
														}}>
															<List
																header={<div className='ant-descriptions-title'>{`本页已开处方(共${state.cfList_total_page}条)`}</div>}
																itemLayout="horizontal"
																dataSource={state.cfList}
																renderItem={(item, _index)=>{
																	let mode_name = null;
																	if (item.type === '1'){
																		mode_name = '理疗';
																	} else if (item.drug_group_type === '0') {
																		mode_name = '中草药';
																	} else if (item.drug_group_type === '2') {
																		mode_name = '成品药';
																	} else if (item.drug_group_type === '5') {
																		mode_name = '成药';
																	}
																	const ll_progress = `(理疗进度: ${item.done_nums}/${item.nums})`;
																	return (
																		<List.Item
																			actions={[
																				<Input onPressEnter={e=>this.dataCenter.PhysiotherapyRecord(e.target.value, item)} className={item.type === '1'?'':'rex-hide'} placeholder='进行一次理疗,填写操作医师名' style={{width: 220}} />,
																				<Button type='primary' className={item.status==='20'||item.status===20?'':'rex-hide'} onClick={()=>this.rebackCF(item, _index)}>退款处理</Button>,
																				<Button type='primary' onClick={()=>this.editCfInfo(item)}>查看/编辑处方</Button>,
																				<Button type='danger' onClick={()=>this.deleteCF(item, _index)}>删除处方</Button>
																			]}
																		>
																			<List.Item.Meta
																				title={<span>处方取货码:{item.code}</span>}
																				description={
																					<span>
															中医诊断结果: {item.diagnosis_name}
																						<br/>
															处方开具时间: {item.create_time}
																						<br/>
															支付状态: {item.status === '20' || item.status === 20?'已支付':item.status === '30' || item.status === 30?'已退款':'未支付'}
																						<br/>
															处方模式: {mode_name} {item.type === '1'?ll_progress:''}
																					</span>
																				}
																			/>
																		</List.Item>
																	);
																}}
															/>
														</div>:<Empty title='暂无处方记录' src={require('../../../../img/norecord.svg')} />
												}
											</div>
										</TabPane>:null
								}
							</Tabs>
						</div>
						<Drawer
							mask={true}
							getContainer={()=>document.getElementById('Prescribe')}
							maskClosable={true}
							title={state.stage_title2}
							placement="right"
							width={this.domWidth - 200}
							onClose={()=>this.exitStage2()}
							visible={this.state.stage2}
						>
							<div className="cf-content">
								<div className="user-infomations">
									{/*患者资料*/}
									<div className="userinfo">
										<Descriptions title="患者资料" size='middle' bordered column={4}>
											<Descriptions.Item label="患者(ID)">{id}</Descriptions.Item>
											<Descriptions.Item label="患者姓名">{username}</Descriptions.Item>
											<Descriptions.Item label="性别">{sex}</Descriptions.Item>
											<Descriptions.Item label="年龄">{age}</Descriptions.Item>
											<Descriptions.Item label="职业">{job?job:'该患者未更新资料'}</Descriptions.Item>
											<Descriptions.Item label="联系电话">{mobile}</Descriptions.Item>
											<Descriptions.Item label="身份证号码">{id_num?id_num:'该患者未更新资料'}</Descriptions.Item>
											<Descriptions.Item label="就诊卡余额">{balance}</Descriptions.Item>
											<Descriptions.Item label="头像信息"><div onClick={()=>{
												this.setState({
													viewUserAvatar: true,
													viewUserAvatar_url: avatar_pic
												});
											}} style={{border: '1px solid #ddd8d8', borderRadius: '4px', width: 'min-content', height: 120, padding: '4px', cursor: `url(${require('./assets/pointer_mouse.cur')}), pointer`}}><img src={avatar_pic} height={'100%'} alt=""/></div></Descriptions.Item>
										</Descriptions>
									</div>
								</div>
								<Placeholder height={30} />
								<Tabs
									activeKey={state.activeKey2}
									onChange={(activeKey2)=>{
										this.setState({
											activeKey2
										});
									}}
								>
									{
										state.only_show === '100' || state.only_show === '0'?
											<TabPane tab="中医药处方" key="1">
												<div className="choice-content rex-cf">
													<div className="rex-fl">
														<div className="cy rex-cf">
															<span className='rex-fl' style={{fontSize: 16, color: '#333'}}>采用成药:</span>
															<Select
																className='rex-fl'
																allowClear
																showSearch={true}
																value={state.drug_group_list_id}
																placeholder={'选择成药'}
																optionFilterProp='label'
																style={{ width: 160, textIndent: 0, marginLeft: 12 }}
																onChange={(v)=>this.handleDrugGroupChange(v)}
															>
																{
																	state.drug_group_list.map(v=>{
																		// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																		const hunpinCode= window.Pinyin.GetJP(v.name);
																		return(
																			<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																		);
																	})
																}
															</Select>
															&nbsp;&nbsp;&nbsp;&nbsp;
															<span className='rex-fl' style={{fontSize: 16, color: '#333'}}>采用成品药:</span>
															<Select
																className='rex-fl'
																allowClear
																showSearch={true}
																value={state.drugData2_id}
																placeholder={'选择成品药'}
																optionFilterProp='label'
																style={{ width: 160, textIndent: 0, marginLeft: 12 }}
																onChange={(v)=>this.handleDrugGroup2Change(v)}
															>
																{
																	state.drugData2.map(v=>{
																		// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																		const hunpinCode= window.Pinyin.GetJP(v.name);
																		return(
																			<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																		);
																	})
																}
															</Select>
														</div>
														<div className="DivFieldset1" style={{display: `${state.hide_cf_list?'none':'block'}`}}>
															<div className="DivFieldset1_title">中药材成分表</div>
															<div className="DivFieldset1_content" style={{width: 530}}>
																<div className="rex-fctns">
																	<div className="cf-tools rex-scroll-bar" id='cf-ctrlbox'>
																		{/*固定的一行*/}
																		<div className="cf-rows rex-cf" style={{marginBottom: 10}}>
																			<span style={{
																				float: 'left',
																				width: 20,
																				overflow: 'hidden',
																				height: 24,
																				display: 'block',
																				lineHeight: '24px'
																			}} />
																			<Select
																				className='sel rex-fl'
																				size='small'
																				showSearch={true}
																				placeholder={'选择药材'}
																				filterOption={false}
																				style={{ width: 100, textIndent: 0 }}
																				notFoundContent={'暂无此药材'}
																				value={state.associate_id}
																				onChange={(val)=>{
																					if(!val){
																						return false;
																					}
																					console.warn(state.drug_list);
																					let _price = state.drug_list.find(_v=>_v.id===val).price;
																					_price = _price * 1 / 1000;
																					let _associate_weight = state.drug_list.find(_v=>_v.id===val).auto_weight;
																					let name = state.drug_list.find(_v=>_v.id===val).name;
																					// console.log(_price);
																					// console.log(_associate_weight);
																					// console.log(name);
																					this.setState({
																						associate_id: val,
																						associate_price: _price,
																						associate_weight: _associate_weight,
																						associate_datas: {
																							price: _price,
																							auto_weight: _associate_weight,
																							name: name,
																							id: val
																						}
																					});
																					// 添加一行
																					window.setTimeout(()=>{
																						this.addCfRows();
																					}, 60);
																				}}
																				onSearch={(val)=>{
																					$http.get(API.drugGet, {
																						pn: 1,
																						cn: Prescribe.getDrugPageSize,
																						name: val
																					}).then(res=>{
																						if (res.data.code === 200) {
																							// console.log(res.data.data.list);
																							this.setState({
																								drug_list: res.data.data.list
																							});
																						}
																					});
																				}}
																			>
																				{
																					state.drug_list.map((v, _sortindex)=>{
																						return (
																							<Option key={_sortindex} value={v.id}>{v.name}</Option>
																						);
																					})
																				}
																			</Select>
																			<Input
																				size='small'
																				value={state.associate_weight}
																				className='weight-put rex-fl'
																				placeholder='克数'
																				style={{ width: 100, textIndent: 0 }}
																				maxLength={4}
																				max={1000}
																				min={0}
																				precision={0}
																				addonAfter={<span>克</span>}
																			/>
																			<Input
																				size='small'
																				value={state.associate_price}
																				readOnly
																				style={{width: 124}}
																				className='weight-put rex-fl'
																				placeholder='单价'
																				maxLength={4}
																				max={1000}
																				min={0}
																				precision={0}
																				addonAfter={<span>元/克</span>}
																			/>
																			<Button className='rex-fl' type='default' size='small' icon='plus' style={{marginLeft: 12}} onClick={() => this.addCfRows()}>添加</Button>
																		</div>
																		<hr className='cf_hr' />
																		{
																			state.cf_info_list.map((vx, i)=>{
																				return (
																					<div key={i} className="cf-rows rex-cf" style={{marginBottom: 4}}>
																						<span style={{
																							float: 'left',
																							width: 20,
																							overflow: 'hidden',
																							height: 24,
																							display: 'block',
																							lineHeight: '24px'
																						}}>{i+1}.</span>
																						<Select
																							className='sel rex-fl'
																							size='small'
																							showSearch={true}
																							placeholder={'选择药材'}
																							filterOption={false}
																							style={{ width: 100, textIndent: 0 }}
																							notFoundContent={vx.empty?'暂无此药材':null}
																							value={vx.drug_id}
																							onChange={(val)=>{
																								// let cf_info_list = _.cloneDeep(this.state.cf_info_list);
																								let cf_info_list = window.Array.from([...this.state.cf_info_list]);
																								const _price = state.drug_list.find(_v=>_v.id===val).price;
																								cf_info_list[i].drug_id = val; // drug_id
																								cf_info_list[i].price = _price * 1 / 1000; // price
																								this.setState({
																									cf_info_list
																								});
																							}}
																							onSearch={(val)=>{
																								this.dataCenter.drugGet(1, val, true, i);
																							}}
																						>
																							{
																								state.drug_list.map(vms=>{
																									return (
																										<Option key={vms.id} value={vms.id}>{vms.name}</Option>
																									);
																								})
																							}
																						</Select>
																						<Input
																							value={vx.weight}
																							size='small'
																							onChange={val=>{
																								// let cf_info_list = _.cloneDeep(this.state.cf_info_list);
																								let cf_info_list = window.Array.from([...this.state.cf_info_list]);
																								cf_info_list[i].weight = val.target.value;
																								this.setState({
																									cf_info_list
																								});
																							}}
																							className='weight-put rex-fl weight-focus'
																							placeholder='克数'
																							style={{ width: 100, textIndent: 0 }}
																							maxLength={4}
																							max={1000}
																							min={0}
																							precision={0}
																							addonAfter={<span>克</span>}
																							onKeyUp={(e)=>{
																								// e.preventDefault();
																								// console.log(e.keyCode);
																								const allowCode = [40, 13, 38];
																								if (!allowCode.includes(e.keyCode)){
																									return false;
																								}
																								const listDATA = state.cf_info_list;
																								if (listDATA.length === 1){
																									return false;
																								}
																								// console.log(listDATA); // data
																								// console.log(i); // index
																								// console.log(document.getElementById('cf-ctrlbox').getElementsByClassName('cf-rows')[i+2].getElementsByClassName('weight-focus')[0].getElementsByTagName('input')[0].focus()); // dom
																								if (e.keyCode === 40 || e.keyCode === 13){
																									// keyCode: 40 = ↓
																									if(i+1 === listDATA.length){
																										// 最后一个 不允许下
																										return false;
																									}
																									document.getElementById('cf-ctrlbox').getElementsByClassName('cf-rows')[i+2].getElementsByClassName('weight-focus')[0].getElementsByTagName('input')[0].select();
																								}
																								if (e.keyCode === 38){
																									// keyCode: 38 = ↑
																									if(i===0){
																										// 最后一个 不允许上
																										return false;
																									}
																									document.getElementById('cf-ctrlbox').getElementsByClassName('cf-rows')[i].getElementsByClassName('weight-focus')[0].getElementsByTagName('input')[0].select();
																								}
																							}}
																						/>
																						<Input
																							value={vx.price}
																							size='small'
																							readOnly
																							style={{width: 124}}
																							className='weight-put rex-fl'
																							maxLength={4}
																							max={1000}
																							min={0}
																							precision={0}
																							addonAfter={<span>元/克</span>}
																						/>
																						<Button size='small' className='remove-cf-rows rex-fl' type='link' onClick={()=>this.removeCfRows(i)}>移除</Button>
																					</div>
																				);
																			})
																		}
																	</div>
																</div>
															</div>
														</div>
														<Placeholder height={15} />
														<div className='cf-list-unit'>
															<span className='names'>是否保密处方:</span>
															<Switch checkedChildren="是" unCheckedChildren="否" checked={state.cf_private} onChange={(v)=>this.setState({cf_private: v})} />
														</div>
														<Placeholder height={15} />
														<div className='cf-list-unit'>
															<span className='names'>处方药物类型:</span>
															<Radio.Group onChange={(e)=>this.handleMeTypeChange(e)} value={state.me_type}>
																<Radio value={'0'}>草药</Radio>
																<Radio value={'5'}>成药</Radio>
																<Radio value={'2'}>成品药</Radio>
															</Radio.Group>
														</div>
														<Placeholder height={15} />
														<div className='cf-list-unit'>
															<span className='names'>处方服用方式:</span>
															<Select
																className='sel rex-fl'
																value={state.drinkStyle_id}
																placeholder={'选择处方服用方式'}
																showSearch
																optionFilterProp='label'
																style={{ width: 160, textIndent: 0 }}
																onChange={(v)=>this.setState({drinkStyle_id: v})}
															>
																{
																	state.drinkStyle.map(v=>{
																		// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																		const hunpinCode= window.Pinyin.GetJP(v.name);
																		return(
																			<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																		);
																	})
																}
															</Select>
														</div>
														<Placeholder height={15} />
														<div className='cf-list-unit'>
															<span className='names'>处方备注信息:</span>
															<Input style={{width: 160}} value={state.cf_remark} onChange={e=>this.setState({cf_remark: e.target.value})} placeholder='输入处方备注信息' />
														</div>
														<Placeholder height={15} />
														<div className='cf-list-unit'>
															<span className='names'>处方付数设置:</span>
															<InputNumber style={{width: 160}} value={state.cf_nums} onChange={e=>this.setState({cf_nums: e})} placeholder='输入处方付数' maxLength={4} max={100} min={1} precision={0} />
														</div>
														{
															state.drugData2_id !== undefined && state.drugData2_id !== null?
																<React.Fragment>
																	<Placeholder height={15} />
																	<div className='cf-list-unit'>
																		<span className='names'>处方天数设置:</span>
																		<InputNumber style={{width: 160}} value={state.cf_days} onChange={e=>this.setState({cf_days: e})} placeholder='输入处方天数' maxLength={4} max={100} min={1} precision={0} />
																	</div>
																</React.Fragment>:null
														}
														<Placeholder height={15} />
														<div className='cf-list-unit'>
															<span className='names'>处方折扣信息:</span>
															<Select
																className='sel rex-fl'
																showSearch
																optionFilterProp='label'
																placeholder={'选择处方折扣'}
																value={state.coupon_data_id}
																style={{ width: 160, textIndent: 0 }}
																notFoundContent={false?<Spin size="small" />:null}
																onChange={(v)=>this.setState({coupon_data_id: v})}
															>
																{
																	state.coupon_data.map(v=>{
																		return (
																			<Option key={v.value} value={v.value} label={v.keys}>{v.label}</Option>
																		);
																	})
																}
															</Select>
														</div>
														<Placeholder height={15} />
														<div className='cf-list-unit'>
															<span className='names'>处方单价信息:</span>
															<Input
																className='sel rex-fl'
																value={'￥'+unit_money}
																style={{ width: 160, textIndent: 0 }}
																readOnly
															/>
														</div>
														<Placeholder height={15} />
														<div className='cf-list-unit'>
															<span className='names'>处方总价信息:</span>
															<Input
																className='sel rex-fl'
																value={'￥'+real_money}
																style={{ width: 160, textIndent: 0 }}
																readOnly
															/>
														</div>
														<Placeholder height={15} />
														<div className='cf-list-unit'>
															<span className='names'>处方优惠金额:</span>
															<Input
																className='sel rex-fl'
																value={'￥'+youhui_money}
																style={{ width: 160, textIndent: 0 }}
																readOnly
															/>
														</div>
														{
															state.me_type === '0' || state.me_type === 0?
																<React.Fragment>
																	<Placeholder height={15} />
																	<div className='cf-list-unit'>
																		<span className='names'>药材种类数目:</span>
																		<Input
																			className='sel rex-fl'
																			value={total_drugs+'种'}
																			style={{ width: 160, textIndent: 0 }}
																			readOnly
																		/>
																	</div>
																</React.Fragment>:null
														}
														<Placeholder height={15} />
														<Button icon='save' disabled={state.status === '20' || state.status === 20 || state.status === '30' || state.status === 30} onClick={()=>this.saveCfContent()}>{state.status === '20' || state.status === 20?'已支付':state.status === '30' || state.status === 30?'已退款':'保存/修改'}</Button>
													</div>
													<div className="rex-fl" style={{marginLeft: 44}}>
														{
															state.formQueryDatas.dates.length>0?
																<div>
																	<div className="form-ctrls">
																		<div className="label-box rex-cf align-center">
																			<span className="label-name rex-fl w154" style={{textAlign: 'left', width: 118}}>就诊日期关联查询: </span>
																			<div className="label-forms rex-fl">
																				<Select
																					showSearch
																					placeholder='可根据就诊日期查询'
																					optionFilterProp='label'
																					style={{width: 410}}
																					value={state.formQueryDatas.current_date}
																					onChange={(date) => {
																						this.dataCenter.getdiseaserecordlistPages(this.state.sickBook_current_page, this.editSickBookId, false, date);
																					}}
																				>
																					{
																						state.formQueryDatas.dates.map((v, i)=>{
																							// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																							const hunpinCode= window.Pinyin.GetJP(v);
																							return(
																								<Option key={i} value={v} label={hunpinCode}>{v}</Option>
																							);
																						})
																					}
																				</Select>
																			</div>
																		</div>
																	</div>
																</div>:null
														}
														<div className="DivFieldset1">
															<div className="DivFieldset1_title">基本信息</div>
															<div className="DivFieldset1_content">
																<div className="rex-fctns">
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">患者主诉: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.patient_desc} onChange={(v)=>this.handleForm('patient_desc', v.target.value)} placeholder='请输入患者主诉信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">现病史: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.disease_history} onChange={(v)=>this.handleForm('disease_history', v.target.value)} placeholder='请输入患者现病史信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">既往史: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.disease_past} onChange={(v)=>this.handleForm('disease_past', v.target.value)} placeholder='请输入患者既往史信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">家族史: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.disease_family} onChange={(v)=>this.handleForm('disease_family', v.target.value)} placeholder='请输入患者家族史信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">实验室检查: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.inspection_result} onChange={(v)=>this.handleForm('inspection_result', v.target.value)} placeholder='请输入患者实验室检查信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf align-center">
																			<span className="label-name rex-fl w154">治法治则: </span>
																			<div className="label-forms rex-fl">
																				<Select
																					showSearch
																					placeholder='请选择治法治则'
																					optionFilterProp='label'
																					style={{width: 410}}
																					value={state.formQueryDatas.treatment_id}
																					onChange={(v) => this.handleForm('treatment_id', v)}
																				>
																					{
																						state.treatment_list.map(v=>{
																							// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																							const hunpinCode= window.Pinyin.GetJP(v.name);
																							return(
																								<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																							);
																						})
																					}
																				</Select>
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf align-center">
																			<span className="label-name rex-fl w154">中医诊断: </span>
																			<div className="label-forms rex-fl">
																				<Select
																					showSearch
																					placeholder='请选择中医诊断'
																					optionFilterProp='label'
																					style={{width: 410}}
																					value={state.formQueryDatas.diagnosis_id}
																					onChange={(v) => this.handleForm('diagnosis_id', v)}
																				>
																					{
																						state.diagnosis.map(v=>{
																							// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																							const hunpinCode= window.Pinyin.GetJP(v.name);
																							return(
																								<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																							);
																						})
																					}
																				</Select>
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf align-center">
																			<span className="label-name rex-fl w154">中医证型: </span>
																			<div className="label-forms rex-fl">
																				<Select
																					showSearch
																					placeholder='请选择中医证型'
																					optionFilterProp='label'
																					style={{width: 410}}
																					value={state.formQueryDatas.tcm_id}
																					onChange={(v) => this.handleForm('tcm_id', v)}
																				>
																					{
																						state.tcm_list.map(v=>{
																							// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																							const hunpinCode= window.Pinyin.GetJP(v.name);
																							return(
																								<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																							);
																						})
																					}
																				</Select>
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf align-center">
																			<span className="label-name rex-fl w154">西医诊断: </span>
																			<div className="label-forms rex-fl">
																				<Select
																					showSearch
																					placeholder='请选择西医诊断'
																					optionFilterProp='label'
																					style={{width: 410}}
																					value={state.formQueryDatas.western_diagnosis_id}
																					onChange={(v) => this.handleForm('western_diagnosis_id', v)}
																				>
																					{
																						state.western_list.map(v=>{
																							// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																							const hunpinCode= window.Pinyin.GetJP(v.name);
																							return(
																								<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																							);
																						})
																					}
																				</Select>
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">医嘱: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.advise} onChange={(v)=>this.handleForm('advise', v.target.value)} placeholder='请输入患者医嘱信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	{/*state.sickBook_current_page === state.sickBook_total_page 代表最后一页 因为是倒序 实则是第一页*/}
																	{/*第一页没有药后反应*/}
																	{/*新建病历簿的时候也没药后反应*/}
																	{/*新增一页的时候需要药后反应*/}
																	{
																		state.sickBook_current_page === state.sickBook_total_page || state.sickBook_total_page===0?null:
																			<React.Fragment>
																				<Placeholder height={15} />
																				<div className="form-ctrls">
																					<div className="label-box rex-cf">
																						<span className="label-name rex-fl w154">药后反应: </span>
																						<div className="label-forms rex-fl">
																							<Input.TextArea style={{width: 410}} value={state.formQueryDatas.drug_reaction} onChange={(v)=>this.handleForm('drug_reaction', v.target.value)} placeholder='请输入患者药后反应信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																						</div>
																					</div>
																				</div>
																			</React.Fragment>
																	}
																	{
																		this.pid === null?null:
																			<React.Fragment>
																				<Placeholder height={15} />
																				<div className="form-ctrls">
																					<div className="label-box rex-cf">
																						<span className="label-name rex-fl w154">药后反应: </span>
																						<div className="label-forms rex-fl">
																							<Input.TextArea style={{width: 410}} value={state.formQueryDatas.drug_reaction} onChange={(v)=>this.handleForm('drug_reaction', v.target.value)} placeholder='请输入患者药后反应信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																						</div>
																					</div>
																				</div>
																			</React.Fragment>
																	}
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">图像资料: </span>
																			<div className="label-forms rex-fl" style={{width: 410}}>
																				<Upload
																					action={API.uploadFile}
																					accept={'image/*'}
																					listType="picture-card"
																					fileList={state.fileList}
																					name='file_name'
																					data={{type: 'image'}}
																					headers={{
																						'Http-Authorization': LocalStorage.getObject('xy_userinfo').token || 'token not found'
																					}}
																					onPreview={async (file)=>{
																						console.log(file);
																						this.setState({
																							previewImage: file.url || await this.getBase64(file.originFileObj),
																							previewVisible: true,
																						});
																					}}
																					onChange={(info)=>{
																						this.setState({ fileList: [...info.fileList] });
																						if (info.file.status !== 'uploading') {
																							// console.log(info.file, info.fileList);
																						}
																						if (info.file.status === 'done') {
																							message.success(`${info.file.name} 文件上传成功~`, 1);
																							const res = info.file.response;
																							if (res.code === 200) {
																								/*const _fileURL = res.data.file_url;
																								// 保存新建数据中的文件地址
																								console.log(_fileURL);*/
																							} else {
																								// 接口异常 || 错误
																								message.error(res.msg);
																							}
																						} else if (info.file.status === 'error') {
																							message.error(`${info.file.name} 文件上传失败~`);
																						}
																					}}
																				>
																					{state.fileList.length >= 5 ? null : <div>
																						<Icon type="plus" />
																						<div className="ant-upload-text">上传图像</div>
																					</div>}
																				</Upload>
																				<Button icon='camera' onClick={()=>this.openCamera()} title='拍摄照片'>拍摄照片</Button>
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">视频资料: </span>
																			<div className="label-forms rex-fl">
																				<Upload
																					action={API.uploadFile}
																					accept={'video/mp4'}
																					fileList={state.fileList_videos}
																					name='file_name'
																					data={{type: 'video'}}
																					headers={{
																						'Http-Authorization': LocalStorage.getObject('xy_userinfo').token || 'token not found'
																					}}
																					onPreview={async (file)=>{
																						console.log(file);
																						this.setState({
																							previewVideo: true,
																							videoPreviewUrl: file.url || file.response.data.file_url
																						});
																					}}
																					onChange={(info)=>{
																						this.setState({ fileList_videos: [...info.fileList] });
																						if (info.file.status !== 'uploading') {
																							// console.log(info.file, info.fileList_videos);
																						}
																						if (info.file.status === 'done') {
																							message.success(`${info.file.name} 文件上传成功~`, 1);
																							const res = info.file.response;
																							if (res.code === 200) {
																								const _fileURL = res.data.file_url;
																								// 保存新建数据中的文件地址
																								console.log(_fileURL);
																							} else {
																								// 接口异常 || 错误
																								message.error(res.msg);
																							}
																						} else if (info.file.status === 'error') {
																							message.error(`${info.file.name} 文件上传失败~`);
																						}
																					}}
																				>
																					{state.fileList_videos.length >= 5 ? null : <Button icon='plus'>
																						上传视频
																					</Button>}
																				</Upload>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</TabPane>:null
									}
									{
										state.only_show === '100' || state.only_show === '1'?
											<TabPane tab="理疗处方" key="2">
												<div className="choice-content rex-cf">
													<div className="rex-fl">
														<div className="cy rex-cf">
															<span className='rex-fl' style={{fontSize: 16, color: '#333'}}>理疗穴位:</span>
															<Select
																mode="multiple"
																className='rex-fl'
																allowClear
																showSearch={true}
																value={state.xuewei_list_id}
																placeholder={'选择穴位'}
																filterOption={false}
																optionFilterProp='label'
																style={{ width: 400, textIndent: 0, marginLeft: 12 }}
																onChange={(v)=>this.handleXueweiGroupChange(v)}
																onSearch={(v)=> {
																	this.dataCenter.getXuewei(v);
																}}
																notFoundContent={null}
																defaultActiveFirstOption={false}
																showArrow={true}
															>
																{
																	state.xuewei_list.map(v=>{
																		return (
																			<Option key={v.id} value={v.id} label={v.name}>{v.name}</Option>
																		);
																	})
																}
															</Select>
														</div>
														<Placeholder height={15} />
														<div className="cy rex-cf">
															<span className='rex-fl' style={{fontSize: 16, color: '#333'}}>理疗项目:</span>
															<Select
																className='rex-fl'
																allowClear
																showSearch={true}
																value={state.ll_list_id}
																placeholder={'选择理疗项目'}
																filterOption={true}
																optionFilterProp='label'
																style={{ width: 400, textIndent: 0, marginLeft: 12 }}
																onChange={(v)=>{
																	let setOBJ = {
																		ll_list_id: v,
																		ll_unit_price: 0
																	};
																	if (v) {
																		setOBJ.ll_unit_price = state.ll_list.find(val=>val.id === v).price;
																	}
																	this.setState(setOBJ);
																}}
																notFoundContent={null}
																defaultActiveFirstOption={false}
																showArrow={true}
															>
																{
																	state.ll_list.map(v=>{
																		// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																		const hunpinCode= window.Pinyin.GetJP(v.name);
																		return(
																			<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}({v.price}元/每次)</Option>
																		);
																	})
																}
															</Select>
														</div>
														<Placeholder height={15} />
														<div className="cy rex-cf">
															<span className='rex-fl' style={{fontSize: 16, color: '#333'}}>理疗次数:</span>
															<InputNumber className='rex-fl' style={{width: 160, marginLeft: 12}} value={state.ll_count} onChange={v=>this.setState({ll_count: v})} placeholder='输入理疗次数' maxLength={4} max={100} min={1} precision={0} />
														</div>
														<Placeholder height={15} />
														<div className="cy rex-cf">
															<span className='rex-fl' style={{fontSize: 16, color: '#333'}}>完成次数:</span>
															<InputNumber className='rex-fl' style={{width: 160, marginLeft: 12}} value={state.ll_count_doing} readOnly maxLength={4} max={100} min={0} precision={0} />
														</div>
														<Placeholder height={15} />
														<div className='cf-list-unit'>
															<span className='names'>处方折扣:</span>
															<Select
																className='sel rex-fl'
																showSearch
																optionFilterProp='label'
																placeholder={'选择处方折扣'}
																value={state.coupon_data_id2}
																style={{ width: 160, textIndent: 0 }}
																onChange={(v)=>this.setState({coupon_data_id2: v})}
															>
																{
																	state.coupon_data.map(v=>{
																		return (
																			<Option key={v.value} value={v.value} label={v.keys}>{v.label}</Option>
																		);
																	})
																}
															</Select>
														</div>
														<Placeholder height={15} />
														<div className="cy rex-cf">
															<span className='rex-fl' style={{fontSize: 16, color: '#333'}}>理疗价格:</span>
															<InputNumber className='rex-fl' style={{width: 160, marginLeft: 12}} value={state.ll_unit_price * 1 * (state.ll_count * 1) * (state.coupon_data_id2*1/100)+'元'} readOnly />
														</div>
														<Placeholder height={15} />
														<div className="cy rex-cf">
															<span className='rex-fl' style={{fontSize: 16, color: '#333'}}>优惠金额:</span>
															<InputNumber className='rex-fl' style={{width: 160, marginLeft: 12}} value={state.ll_unit_price * 1 * (state.ll_count * 1) * ((100-state.coupon_data_id2*1)/100)+'元'} readOnly />
														</div>
														<Placeholder height={15} />
														<Button icon='save' disabled={state.status === '20' || state.status === 20 || state.status === '30' || state.status === 30} onClick={()=>this.saveLL()}>{state.status === '20' || state.status === 20?'已支付':state.status === '30' || state.status === 30?'已退款':'保存/修改'}</Button>
													</div>
													<div className="rex-fl" style={{marginLeft: 44}}>
														{
															state.formQueryDatas.dates.length>0?
																<div>
																	<div className="form-ctrls">
																		<div className="label-box rex-cf align-center">
																			<span className="label-name rex-fl w154" style={{textAlign: 'left', width: 118}}>就诊日期关联查询: </span>
																			<div className="label-forms rex-fl">
																				<Select
																					showSearch
																					placeholder='可根据就诊日期查询'
																					optionFilterProp='label'
																					style={{width: 410}}
																					value={state.formQueryDatas.current_date}
																					onChange={(date) => {
																						this.dataCenter.getdiseaserecordlistPages(this.state.sickBook_current_page, this.editSickBookId, false, date);
																					}}
																				>
																					{
																						state.formQueryDatas.dates.map((v, i)=>{
																							// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																							const hunpinCode= window.Pinyin.GetJP(v);
																							return(
																								<Option key={i} value={v} label={hunpinCode}>{v}</Option>
																							);
																						})
																					}
																				</Select>
																			</div>
																		</div>
																	</div>
																</div>:null
														}
														<div className="DivFieldset1">
															<div className="DivFieldset1_title">基本信息</div>
															<div className="DivFieldset1_content">
																<div className="rex-fctns">
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">患者主诉: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.patient_desc} onChange={(v)=>this.handleForm('patient_desc', v.target.value)} placeholder='请输入患者主诉信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">现病史: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.disease_history} onChange={(v)=>this.handleForm('disease_history', v.target.value)} placeholder='请输入患者现病史信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">既往史: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.disease_past} onChange={(v)=>this.handleForm('disease_past', v.target.value)} placeholder='请输入患者既往史信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">家族史: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.disease_family} onChange={(v)=>this.handleForm('disease_family', v.target.value)} placeholder='请输入患者家族史信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">实验室检查: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.inspection_result} onChange={(v)=>this.handleForm('inspection_result', v.target.value)} placeholder='请输入患者实验室检查信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf align-center">
																			<span className="label-name rex-fl w154">治法治则: </span>
																			<div className="label-forms rex-fl">
																				<Select
																					showSearch
																					placeholder='请选择治法治则'
																					optionFilterProp='label'
																					style={{width: 410}}
																					value={state.formQueryDatas.treatment_id}
																					onChange={(v) => this.handleForm('treatment_id', v)}
																				>
																					{
																						state.treatment_list.map(v=>{
																							// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																							const hunpinCode= window.Pinyin.GetJP(v.name);
																							return(
																								<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																							);
																						})
																					}
																				</Select>
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf align-center">
																			<span className="label-name rex-fl w154">中医诊断: </span>
																			<div className="label-forms rex-fl">
																				<Select
																					showSearch
																					placeholder='请选择中医诊断'
																					optionFilterProp='label'
																					style={{width: 410}}
																					value={state.formQueryDatas.diagnosis_id}
																					onChange={(v) => this.handleForm('diagnosis_id', v)}
																				>
																					{
																						state.diagnosis.map(v=>{
																							// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																							const hunpinCode= window.Pinyin.GetJP(v.name);
																							return(
																								<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																							);
																						})
																					}
																				</Select>
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf align-center">
																			<span className="label-name rex-fl w154">中医证型: </span>
																			<div className="label-forms rex-fl">
																				<Select
																					showSearch
																					placeholder='请选择中医证型'
																					optionFilterProp='label'
																					style={{width: 410}}
																					value={state.formQueryDatas.tcm_id}
																					onChange={(v) => this.handleForm('tcm_id', v)}
																				>
																					{
																						state.tcm_list.map(v=>{
																							// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																							const hunpinCode= window.Pinyin.GetJP(v.name);
																							return(
																								<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																							);
																						})
																					}
																				</Select>
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf align-center">
																			<span className="label-name rex-fl w154">西医诊断: </span>
																			<div className="label-forms rex-fl">
																				<Select
																					showSearch
																					placeholder='请选择西医诊断'
																					optionFilterProp='label'
																					style={{width: 410}}
																					value={state.formQueryDatas.western_diagnosis_id}
																					onChange={(v) => this.handleForm('western_diagnosis_id', v)}
																				>
																					{
																						state.western_list.map(v=>{
																							// 拼 音 码 -> GetJP || 拼音全码 -> GetQP || 混 拼 码 -> GetHP
																							const hunpinCode= window.Pinyin.GetJP(v.name);
																							return(
																								<Option key={v.id} value={v.id} label={hunpinCode}>{v.name}</Option>
																							);
																						})
																					}
																				</Select>
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">医嘱: </span>
																			<div className="label-forms rex-fl">
																				<Input.TextArea style={{width: 410}} value={state.formQueryDatas.advise} onChange={(v)=>this.handleForm('advise', v.target.value)} placeholder='请输入患者医嘱信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																			</div>
																		</div>
																	</div>
																	{/*state.sickBook_current_page === state.sickBook_total_page 代表最后一页 因为是倒序 实则是第一页*/}
																	{/*第一页没有药后反应*/}
																	{/*新建病历簿的时候也没药后反应*/}
																	{/*新增一页的时候需要药后反应*/}
																	{
																		state.sickBook_current_page === state.sickBook_total_page || state.sickBook_total_page===0?null:
																			<React.Fragment>
																				<Placeholder height={15} />
																				<div className="form-ctrls">
																					<div className="label-box rex-cf">
																						<span className="label-name rex-fl w154">药后反应: </span>
																						<div className="label-forms rex-fl">
																							<Input.TextArea style={{width: 410}} value={state.formQueryDatas.drug_reaction} onChange={(v)=>this.handleForm('drug_reaction', v.target.value)} placeholder='请输入患者药后反应信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																						</div>
																					</div>
																				</div>
																			</React.Fragment>
																	}
																	{
																		this.pid === null?null:
																			<React.Fragment>
																				<Placeholder height={15} />
																				<div className="form-ctrls">
																					<div className="label-box rex-cf">
																						<span className="label-name rex-fl w154">药后反应: </span>
																						<div className="label-forms rex-fl">
																							<Input.TextArea style={{width: 410}} value={state.formQueryDatas.drug_reaction} onChange={(v)=>this.handleForm('drug_reaction', v.target.value)} placeholder='请输入患者药后反应信息' autoSize={{ minRows: 2, maxRows: 6 }} />
																						</div>
																					</div>
																				</div>
																			</React.Fragment>
																	}
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">图像资料: </span>
																			<div className="label-forms rex-fl" style={{width: 410}}>
																				<Upload
																					action={API.uploadFile}
																					accept={'image/*'}
																					listType="picture-card"
																					fileList={state.fileList}
																					name='file_name'
																					data={{type: 'image'}}
																					headers={{
																						'Http-Authorization': LocalStorage.getObject('xy_userinfo').token || 'token not found'
																					}}
																					onPreview={async (file)=>{
																						console.log(file);
																						this.setState({
																							previewImage: file.url || await this.getBase64(file.originFileObj),
																							previewVisible: true,
																						});
																					}}
																					onChange={(info)=>{
																						this.setState({ fileList: [...info.fileList] });
																						if (info.file.status !== 'uploading') {
																							// console.log(info.file, info.fileList);
																						}
																						if (info.file.status === 'done') {
																							message.success(`${info.file.name} 文件上传成功~`, 1);
																							const res = info.file.response;
																							if (res.code === 200) {
																								/*const _fileURL = res.data.file_url;
																								// 保存新建数据中的文件地址
																								console.log(_fileURL);*/
																							} else {
																								// 接口异常 || 错误
																								message.error(res.msg);
																							}
																						} else if (info.file.status === 'error') {
																							message.error(`${info.file.name} 文件上传失败~`);
																						}
																					}}
																				>
																					{state.fileList.length >= 5 ? null : <div>
																						<Icon type="plus" />
																						<div className="ant-upload-text">上传图像</div>
																					</div>}
																				</Upload>
																				<Button icon='camera' onClick={()=>this.openCamera()} title='拍摄照片'>拍摄照片</Button>
																			</div>
																		</div>
																	</div>
																	<Placeholder height={15} />
																	<div className="form-ctrls">
																		<div className="label-box rex-cf">
																			<span className="label-name rex-fl w154">视频资料: </span>
																			<div className="label-forms rex-fl">
																				<Upload
																					action={API.uploadFile}
																					accept={'video/mp4'}
																					fileList={state.fileList_videos}
																					name='file_name'
																					data={{type: 'video'}}
																					headers={{
																						'Http-Authorization': LocalStorage.getObject('xy_userinfo').token || 'token not found'
																					}}
																					onPreview={async (file)=>{
																						console.log(file);
																						this.setState({
																							previewVideo: true,
																							videoPreviewUrl: file.url || file.response.data.file_url
																						});
																					}}
																					onChange={(info)=>{
																						this.setState({ fileList_videos: [...info.fileList] });
																						if (info.file.status !== 'uploading') {
																							// console.log(info.file, info.fileList_videos);
																						}
																						if (info.file.status === 'done') {
																							message.success(`${info.file.name} 文件上传成功~`, 1);
																							const res = info.file.response;
																							if (res.code === 200) {
																								const _fileURL = res.data.file_url;
																								// 保存新建数据中的文件地址
																								console.log(_fileURL);
																							} else {
																								// 接口异常 || 错误
																								message.error(res.msg);
																							}
																						} else if (info.file.status === 'error') {
																							message.error(`${info.file.name} 文件上传失败~`);
																						}
																					}}
																				>
																					{state.fileList_videos.length >= 5 ? null : <Button icon='plus'>
																						上传视频
																					</Button>}
																				</Upload>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</TabPane>:null
									}
									{/*<TabPane tab="病历信息" key="3"></TabPane>*/}
								</Tabs>
							</div>
						</Drawer>
					</div>
				</Drawer>
				<Placeholder height={50} />

				<Modal
					title={'查看用户头像'}
					footer={null}
					visible={this.state.viewUserAvatar}
					onOk={()=>this.setState({
						viewUserAvatar: false
					})}
					onCancel={()=>this.setState({
						viewUserAvatar: false
					})}
				>
					<div className='wxrefundqrcode' style={{width: '100%'}}>
						<img src={this.state.viewUserAvatar_url} style={{width: '100%'}} className='rex-block' alt=""/>
					</div>
				</Modal>

				<Modal
					title={'视频预览'}
					footer={null}
					visible={this.state.previewVideo}
					width={800}
					onOk={()=>this.setState({
						previewVideo: false
					}, ()=>{
						document.getElementById('preview-video').currentTime = 0;
						document.getElementById('preview-video').pause();
					})}
					onCancel={()=>this.setState({
						previewVideo: false
					}, ()=>{
						document.getElementById('preview-video').currentTime = 0;
						document.getElementById('preview-video').pause();
					})}
				>
					<div className='video-preview' style={{width: '100%'}}>
						<video id='preview-video' style={{width: '100%'}} controls loop src={state.videoPreviewUrl} />
					</div>
				</Modal>

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

export default Prescribe;