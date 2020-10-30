import React from 'react';

import { Select } from 'antd';

const { Option } = Select;

export class Opt extends React.Component {

	render() {
	  const { placeholder = '请选择', value = undefined, options = [], configs = { showSearch: true, allowClear: true, optionFilterProp: 'label', style: {width: 260} }, onChange = (typeId)=>typeId } = this.props;
		return (
			<Select
				{...configs}
				value={value}
				placeholder={placeholder}
				onChange={(typeId) => onChange(typeId)}
			>
				{
					options.map(v=>{
						const hunpinCode = window.Pinyin.GetJP(v.typeName?v.typeName:v.name);
						return(
							<Option key={v.typeId?v.typeId:v.id} value={v.typeId?v.typeId:v.id} label={hunpinCode}>{v.typeName?v.typeName:v.name}</Option>
						);
					})
				}
			</Select>
		);
	}

}