import React from 'react';

import { Select, Form, Input, message, Alert } from 'antd';

import Placeholder from './Placeholder';

const { Option } = Select;

const DefaultFormValidate = {
	validateFirst: true,
	rules: [
		{
			required: true,
			whitespace: true,
			message: '该字段必须有值!'
		}
	]
};

export class Opt extends React.Component {

	render() {
	  const { placeholder = '请选择', value = undefined, options = [], configs = { showSearch: true, allowClear: true, optionFilterProp: 'label', style: {width: 260} }, onChange = (templateId)=>templateId } = this.props;
		return (
			<Select
				{...configs}
				value={value}
				placeholder={placeholder}
				onChange={(templateId) => onChange(templateId)}
			>
				{
					options.map(v=>{
						const hunpinCode = window.Pinyin.GetJP(v.templateAliasName?v.templateAliasName:v.name);
						return(
							<Option key={v.templateId?v.templateId:v.id} value={v.templateId?v.templateId:v.id} label={hunpinCode?hunpinCode:''}>{v.templateAliasName?v.templateAliasName:v.name}</Option>
						);
					})
				}
			</Select>
		);
	}

}

@Form.create({name: 'commont-input'})
class CommonInputs extends React.Component{

	componentDidMount() {
		this.props.onRef && this.props.onRef(this);
	}

  actions = {
  	submit: () => {
  		this.props.form.validateFields((errors, values)=>{
  			if (errors){
  				console.error(window.JSON.stringify(errors, null, '\t'));
  				return message.error('表单数据不正确, 修改后再试', 2);
  			}
  			console.warn(values);
  		});
  	},
  };

	factory = (data) => {
	  const keys = Object.keys(data);
	  const names = keys.filter(v=>!v.includes('_OPTIONS'));
	  return names;
	}

	render() {
	  const { form, ...props } = this.props;
  	const { getFieldDecorator, getFieldValue, getFieldsValue, validateFields, resetFields } = form;
  	const { templatedata = { head: {}, content: {} } } = props;
  	console.log(templatedata);
  	const { head = {}, content = {} } = templatedata;

  	const names = this.factory(content);

  	console.log(names);

  	const ErrorComponent = <Alert message={'Error'} description="This is an error component." type="error" showIcon />;

	  return (
  		<div className={'common-CommontInputs'}>

  			{
					names.map((v, i)=>{
					  const options = content[`${v}_OPTIONS`];
					  console.log(options);
					  const { key, keyAliasName, keyDefaultValue, keyRange, keyStyle } = options;
					  const initialValue = !['undefined', 'null', ''].includes(keyDefaultValue) && keyDefaultValue ? keyDefaultValue : undefined;
						return (
  						<div className="form-ctrls" key={key}>
  							<div className="label-box rex-cf">
  								<span className="label-name rex-fl w154">{keyAliasName}:</span>
  								<div className="label-forms rex-fl">
										{
											keyStyle === 'Input'?
												<Form.Item>
													{
														getFieldDecorator(v, { ...DefaultFormValidate, initialValue })(
															<Input.TextArea placeholder={`请输入${keyAliasName}`} style={{width: 410}} autoSize={{ minRows: 2, maxRows: 6 }} />
														)
													}
												</Form.Item>: null
										}
										{
											keyStyle === 'Select'?
												<Form.Item>
													{
														getFieldDecorator(v, { ...DefaultFormValidate, initialValue })(
															<Select
																placeholder={`请选择${keyAliasName}选项`}
																style={{width: 410}}
																showSearch
																allowClear
																optionFilterProp={'label'}
															>
																{
																	keyRange.map(({name: optName, id: optId})=>{
																		const hunpinCode = window.Pinyin.GetJP(optName);
																		return <Option key={optId} value={optId} label={hunpinCode ? hunpinCode : optName}>{optName}</Option>;
																	})
																}
															</Select>
														)
													}
												</Form.Item>: null
										}
										{
											keyStyle === 'MultipleSelect'?
												<Form.Item>
													{
														getFieldDecorator(v, { validateFirst: true, rules: [
															{
																validator: (rule, val, callback) => {
																	let validateResult = Array.isArray(val) && val.length > 0 || val === undefined;
																	if (!validateResult) {
																		callback('该字段必须有值!');
																	} else {
																		callback();
																	}
																}
															}
														], initialValue })(
															<Select
																placeholder={`请选择${keyAliasName}选项`}
																style={{width: 410}}
																showSearch
																allowClear
																optionFilterProp={'label'}
																mode={'multiple'}
															>
																{
																	keyRange.map(({name: optName, id: optId})=>{
																		const hunpinCode = window.Pinyin.GetJP(optName);
																		return <Option key={optId} value={optId} label={hunpinCode ? hunpinCode : optName}>{optName}</Option>;
																	})
																}
															</Select>
														)
													}
												</Form.Item>: null
										}
										{
											!['Input', 'Select', 'MultipleSelect'].includes(keyStyle)?ErrorComponent:null
										}
  								</div>
  							</div>
  						</div>
  					);
  				})
  			}

  		</div>
  	);
	}

}

export const FormWrapCommonInputs = CommonInputs;

export function setTitle (title) {
	window.document.title = title;
}

export function saveDataToJson (data, filename) {
	if (!data) {
		alert("数据为空");
		return;
	}
	if (!filename) {filename = "json.json";}
	if (typeof data === "object") {
		data = JSON.stringify(data, null, '\t');
	}
	// 要创建一个 blob 数据
	const blob = new Blob([data], { type: "text/json" }),
		// 添加鼠标事件
		e = document.createEvent("MouseEvents"),
		a = document.createElement("a");
	a.download = filename;
	// 将blob转换为地址
	// 创建 URL 的 Blob 对象
	a.href = window.URL.createObjectURL(blob);
	a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
	// web 标准中已废弃
	// 用以在鼠标事件创建时初始化其属性的值
	e.initMouseEvent(
		"click",
		true, // 是否可以冒泡
		false,// 是否可以阻止事件默认行为
		window,// 指向window对象
		0, // 事件的鼠标点击数量
		0, // 事件的屏幕的x坐标
		0,
		0, // 事件的客户端x坐标
		0,
		false, // 事件发生时 control 键是否被按下
		false, // 事件发生时 alt 键是否被按下
		false, // 事件发生时 shift 键是否被按下
		false, // 事件发生时 meta 键是否被按下
		0, // 鼠标按键值
		null
	);
	// 向一个指定的事件目标派发一个事件
	a.dispatchEvent(e);
}