import React from 'react';

import './index.scss';

import {
	Input,
	Table,
	Alert,
	Button,
	Tag,
	Form,
	Icon,
	Popover,
	message,
	Modal,
} from 'antd';

import API, { $http } from "../../../../api";

import Placeholder from '../../common/Placeholder';

import { setTitle, Opt, saveDataToJson } from "../../common";

class CoreTools extends React.Component {

  static Title = '表单字段批量处理工具Beta 0.0.1';

  static OptionsList = [
  	{id: 'Input', name: '普通表单'},
  	{id: 'Select', name: '单选表单'},
  	{id: 'MultipleSelect', name: '多选表单'},
  ];

  static DefaultValidate = {
  	validateFirst: true,
  	rules: [
  		{
  			required: true,
  			whitespace: true,
  			message: '该字段必须有值!'
  		}
  	]
  }

  static PrintError = (error) => {
  	console.error(window.JSON.stringify(error));
  	message.error('服务器连接时发生错误, 请查看开发者控制台信息。');
  };

  componentDidMount() {
  	setTitle(CoreTools.Title);
  }

  state = {
  	datas: [
  		{
  		  key: '1',
  			keyAliasName: undefined,
  			keyName: undefined,
  			keyStyle: undefined,
  			keyRange: undefined,
  			keyDefaultValue: undefined,
  		},
  	]
  };

  actions = {
  	appendKeyToLine: () => {
  		const { datas } = this.state;
  		const datasLastKey = datas[datas.length-1]['key'];
  		const newData = [...datas, {
  		  key: String(Number(datasLastKey) + 1),
  			keyAliasName: undefined,
  			keyName: undefined,
  			keyStyle: undefined,
  			keyRange: undefined,
  			keyDefaultValue: undefined,
  		}];
  		this.setState({
  			datas: newData
  		});
  	},
  	removeKeyToLine: record => {
  	  console.log(record);
  	  const { key } = record;
  	  const { datas } = this.state;
  	  if (!key) {return message.error('移除错误, 刷新重试');}
  	  this.setState({
  			datas: datas.filter(v=>Number(v['key'])!==Number(key))
  		});
  	},
  	dataProcessing: (type) => {
  		switch (type) {
  		case 'import':
  			// coding
  			Modal.info({
  				title: '导入数据',
  				content:
            <div>
            	<p>1.仅支持导入标准数据模板；</p>
            	<p>2.联系上方QQ咨询导入模板规范。</p>
            </div>
  				,
  			});
  			break;
  		case 'export':
  			// coding
  			this.props.form.validateFields((errors, values)=>{
  				if (errors){
  					console.error(window.JSON.stringify(errors, null, '\t'));
  					return message.error('表单数据不正确, 修改后再试', 2);
  				}

  				console.log(values);
  				const { templateId = 'undefined', templateName = 'undefined', templateAliasName = 'undefined' } = values || {};
  				const { datas: dataSource } = this.state;
  				const styles = ['Input', 'Select', 'MultipleSelect'];
  				const selectStyles = [styles[1], styles[2]];
  				const baseKey = ['keyAliasName', 'keyDefaultValue', 'keyName', 'keyRange', 'keyStyle'];

  				let apiKeyMaps = {
  					templateId,
  					templateName,
  					templateAliasName,
  				};
  				dataSource.forEach(v=>{
  					const { key } = v;
  					const reSetKeyName = values[`keyName${key}`];
  					apiKeyMaps[reSetKeyName] = 'undefined';
  					let keyRange = [];
  					let keyDefaultValue = 'undefined';
  					if (values[baseKey[3]+key] && values[baseKey[3]+key] !== 'undefined'){
  						if (selectStyles.includes(values[baseKey[4]+key])){
  							values[baseKey[3]+key].split(',').forEach((optionName, index)=>{
  								keyRange.push({
  									id: String(index+1),
  									name: optionName
  								});
  							});
  						} else {
  							keyRange = values[baseKey[3]+key].split(',');
  						}
  					}
  					if (values[baseKey[1]+key] && values[baseKey[1]+key] !== 'undefined'){
  						if (selectStyles.includes(values[baseKey[4]+key])){
  						  if (values[baseKey[4]+key] === 'Select'){
  								const findConfig = keyRange.find(selectConfig=>selectConfig.name===values[baseKey[1]+key]);
  								keyDefaultValue = findConfig ? findConfig['id'] : 'undefined';
  							} else {
  								// 单、多选
  								keyDefaultValue = [];
  								values[baseKey[1]+key].split(',').forEach(selectedName=>{
  									const findConfig = keyRange.find(selectConfig=>selectConfig.name===selectedName);
  									if (findConfig){
  										keyDefaultValue.push(findConfig['id']);
  									}
  								});
  							}
  						} else {
  							keyDefaultValue = values[baseKey[1]+key];
  						}
  					}
  					apiKeyMaps[`${reSetKeyName}_OPTIONS`] = {
  						key: String(key),
  						keyAliasName: values[baseKey[0]+key],
  						keyStyle: values[baseKey[4]+key],
  						keyRange,
  						keyDefaultValue
  					};
  				});
  				console.log(apiKeyMaps);
  				try {
  					saveDataToJson(apiKeyMaps, `${templateAliasName}(${templateName})-${templateId}.json`);
  				} catch (err){
  					CoreTools.PrintError(err);
  				}
  			});

  			break;
  		default:
  			return false;
  		}
  	},
  	renderTemplateData: async () => {
  		const datas = [
  			{
  				key: '1',
  				keyAliasName: '姓名',
  				keyName: 'name',
  				keyStyle: 'Input',
  				keyRange: undefined,
  				keyDefaultValue: undefined,
  			},
  			{
  				key: '2',
  				keyAliasName: '性别',
  				keyName: 'sex',
  				keyStyle: 'Select',
  				keyRange: '男,女',
  				keyDefaultValue: "男",
  			},
  			{
  				key: '3',
  				keyAliasName: '爱好',
  				keyName: 'hobby',
  				keyStyle: 'MultipleSelect',
  				keyRange: '打篮球,踢足球,玩游戏',
  				keyDefaultValue: "踢足球",
  			}
  		];
  		this.setState({
  			datas
  		});
  	},
  }

  render() {

  	const { getFieldDecorator, getFieldValue, getFieldsValue, validateFields } = this.props.form;

  	const { datas } = this.state;

  	const columns = [
  		{
  			title: '序号',
  			dataIndex: 'serialNumber',
  			key: 'serialNumber',
  			render: (text, record, index) => {
  				return (
  					<Tag color={'geekblue'}>{index+1}</Tag>
  				);
  			},
  		},
  		{
  			title:
  			  <span>
  			  	<span>KEY</span>
  			  	<Popover placement={'right'} content={[<div key={1}>1.数据索引依赖此值进行取值/赋值；</div>, <div key={2}>2.KEY在首次被添加的时候会自动生成不重复的数字符号用来表示在此模板字段的唯一性。</div>, <div key={3}>......</div>]} title={'KEY什么意思?'}>
  			  		<Button icon={'question'} type={'link'} />
  			  	</Popover>
  			  </span>
  			,
  			dataIndex: 'key',
  			key: 'key',
  			render: (text, record, index) => {
  				return '['+text+']';
  			},
  		},
  		{
  			title: '字段中文名(zh)',
  			dataIndex: 'keyAliasName',
  			key: 'keyAliasName',
  			render: (text, record, index) => {
  				return <Form.Item help="请务必填写, 如: 姓名">{getFieldDecorator('keyAliasName'+record['key'], {...CoreTools.DefaultValidate, initialValue: text})(<Input placeholder={'输入字段中文名(zh)'} />)}</Form.Item>;
  			},
  		},
  		{
  			title: '字段英文名(en)',
  			dataIndex: 'keyName',
  			key: 'keyName',
  			render: (text, record) => {
  				return <Form.Item help="请务必填写, 如: name">{getFieldDecorator('keyName'+record['key'], {...CoreTools.DefaultValidate, initialValue: text})(<Input placeholder={'输入字段英文名(en)'} />)}</Form.Item>;
  			},
  		},
  		{
  			title: '渲染类型',
  			dataIndex: 'keyStyle',
  			key: 'keyStyle',
  			render: (text, record) => {
  				return <Form.Item help="请务必选择选项, 如: 选择普通表单">{getFieldDecorator('keyStyle'+record['key'], {...CoreTools.DefaultValidate, initialValue: text})(<Opt placeholder={'选择渲染类型'} options={CoreTools.OptionsList} />)}</Form.Item>;
  			},
  		},
  		{
  			title:
          <span>
  			  	<span>字段值域</span>
  			  	<Popover placement={'top'} content={[<div key={1}>1.如果是单选或者多选表单类型那么需要定义下拉内容；</div>, <div key={2}>2.下拉内容英文逗号分割即可(英文逗号不要带空格噢~)。</div>, <div key={3}>3.示例 => 如：给性别使用的单选下拉框的话就填入“男,女”即可(注意是!是双引号内的内容噢~)以此类推...</div>]} title={'字段值域什么意思?'}>
  			  		<Button icon={'question'} type={'link'} />
  			  	</Popover>
  			  </span>
  			,
  			dataIndex: 'keyRange',
  			key: 'keyRange',
  			render: (text, record) => {
  				return <Form.Item help="请务必填写, 如: 小明,小李 或 undefined">{getFieldDecorator('keyRange'+record['key'], {...CoreTools.DefaultValidate, initialValue: text || 'undefined'})(<Input placeholder={'输入字段值域'} />)}</Form.Item>;
  			},
  		},
  		{
  			title:
          <span>
  			  	<span>字段默认值</span>
  			  	<Popover placement={'left'} content={[<div key={1}>1.如果是单选或者多选表单类型那么定义此字段说明如下(普通表单类型直接输入默认内容即可)；</div>, <div key={2}>2.根据逗号分隔的数目来进行输入；</div>, <div key={3}>3.如果单选或者多选定义的值域是“男,女”, 那么可以解释为男对应1, 女对应2, 以此类推...</div>, <div key={4}>4.示例 => 如果想默认为男那么就填写1在此字段, 如果想默认为女就填写2在此字段, 以此类推...</div>]} title={'字段值域什么意思?'}>
  			  		<Button icon={'question'} type={'link'} />
  			  	</Popover>
  			  </span>
  			,
  			dataIndex: 'keyDefaultValue',
  			key: 'keyDefaultValue',
  			render: (text, record) => {
  				return <Form.Item help="请务必填写, 如: 小李 或 undefined">{getFieldDecorator('keyDefaultValue'+record['key'], {...CoreTools.DefaultValidate, initialValue: text || 'undefined'})(<Input placeholder={'输入字段默认值'} />)}</Form.Item>;
  			},
  		},
  		{
  			title: '操作',
  			key: 'actions',
  			render: (text, record, index) => {
  				const isLast = datas.length - 1 === index;
  				const minAllowed = datas.length > 1;
  				const Delete = () => minAllowed ? <Button key={1} block size={'small'} icon={'minus'} type={'danger'} onClick={()=>this.actions.removeKeyToLine(record)}>移除字段</Button> : null;
  				return isLast ? [Delete(), minAllowed ? <Placeholder key={2} height={8} /> : null, <Button key={3} block size={'small'} icon={'plus'} type={'dashed'} onClick={this.actions.appendKeyToLine}>追加字段</Button>] : Delete();
  			},
  		},
  	];

  	return <div className={'core-tools'}>
  		<Placeholder height={30} />
  		<h1 className={'title'}>{CoreTools.Title}</h1>
  		<Placeholder height={30} />
  		<div className="core-contents">
  			<div className="templateFlag">
  				<span className={'keys'}>模板代号(ID):</span>
  				<Form.Item help="请务必填写, 如: 1">{getFieldDecorator('templateId', CoreTools.DefaultValidate)(<Input className={'values'} placeholder={'输入模板代号(ID)'} />)}</Form.Item>
  				<span className={'keys'}>模板名称(en):</span>
  				<Form.Item help="请务必填写, 如: commonTemplate">{getFieldDecorator('templateName', CoreTools.DefaultValidate)(<Input className={'values'} placeholder={'输入模板名称(en)'} />)}</Form.Item>
  				<span className={'keys'}>模板别名(zh):</span>
  				<Form.Item help="请务必填写, 如: 普通模板">{getFieldDecorator('templateAliasName', CoreTools.DefaultValidate)(<Input className={'values'} placeholder={'输入模板别名(zh)'} />)}</Form.Item>
  			</div>
  			<br/>
  			<hr/>
  			<br/>
  			<Alert type="info" showIcon message={(
  			  <div>
  					<div>1.每个字段尽可能都进行填写(为了兼容软件运行默认值都预先赋值为了“undefined”)</div>
  					<div>2.如果疑问添加QQ(1134916452)咨询 或 直接点击 <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1134916452&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:1134916452:51" alt="点击这里给我发消息" title="点击这里给我发消息"/></a></div>
  				</div>
  			)} />
  			<Placeholder height={30} />
  			<div className={'top-btns'}>
  				<Button.Group style={{float: 'left'}}>
  					<Button icon={'import'} type={'primary'} ghost onClick={()=>this.actions.dataProcessing('import')}>导入数据</Button>
  					<Button icon={'export'} type={'primary'} ghost onClick={()=>this.actions.dataProcessing('export')}>导出数据</Button>
  				</Button.Group>
  				<Button style={{float: 'right'}} icon={'table'} type={'primary'} ghost onClick={this.actions.renderTemplateData}>不会填写?填充数据范例</Button>
  			</div>
  			<Placeholder height={30} />
  			<div className={'table-ctrl'}>
  				<Table
  					columns={columns}
  					dataSource={datas}
  					pagination={false}
  				/>
  			</div>
  		</div>

  		<Placeholder height={30} />
  		{
  			false ?
  				<Button onClick={async ()=>{
  					this.props.form.validateFields((err, values) => {
  						console.log(values);
  						if (!err) {
  							console.info('success');
  						}
  					});

  					// const xx = await this.props.form.validateFields();
  					// console.log(xx);

  					// console.log(getFieldsValue());
  					// console.log(getFieldsValue()[`name${String(0)}`]);
  					// console.log(getFieldsValue()[`name${String(1)}`]);
  				}}>测试按钮</Button> : null
  		}

  	</div>;
  }
}

export const WrappedCoreTools = Form.create({name: 'core_tools'})(CoreTools);
