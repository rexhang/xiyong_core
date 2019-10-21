/**
 * @author Rexhang(GuHang)
 * @date 2018-12-25 16:29
 * @Description: 高阶组件 @装饰器模式
*/

import React from 'react';

const asyncStateHoc = WrappedComponent => {
	// 反向继承
	// console.log('asyncStateHoc inject...');
	return class extends WrappedComponent {
		/*constructor(props) {
			super(props);
			console.log(this);
		}*/
		setStateAsync = (state) => {
			// 异步state
			return new Promise((resolve, reject)=>{
				const res = true;
				if (res) {
					this.setState(state, resolve(true));
				} else {
					reject(false);
				}
			});
		};
		textover = (contents='', Maximum_length_allowed=8) => {
			const isOver = contents.length > Maximum_length_allowed;
			if (isOver) {
				return contents.slice(0, Maximum_length_allowed) + '...';
			}
			return contents;
		};
		setState_extendOBJ = (stateName, key, value) => {
			// 设置state对象内容
			// const isObject = window.jQuery.isPlainObject(stateName); // 纯对象
			let _data = {...this.state[stateName]};
			console.log(_data);
			if (_data) {
				_data[key] = value;
				this.setState({
					[stateName]: _data
				});
			} else {
				throw new Error('数据错误或类型不正确');
			}
		};
		render() {
			return super.render();
		}
	};
};

const proxyPropertyHoc = WrappedComponent => {
	// 属性代理
	return class extends React.Component {
		constructor(props) {
			// 调用 父对象/父类 的构造函数
			// 在构造函数中使用时，super关键字将单独出现，并且必须在使用this关键字之前使用。super关键字也可以用来调用父对象上的函数。
			super(props);
			this.name = 'propertyProxy';
		}
		getTime = () => {
			return new Date().getTime();
		};
		render() {
			const props = {
				...this.props,
				getTime: this.getTime
			};
			return <WrappedComponent {...props} />;
		}
	};
};

const hijackRenderHoc = config => WrappedComponent => class extends WrappedComponent {
	// 渲染劫持
	render() {
		const { style = {} } = config;
		// 调用 父对象/父类 上的方法
		const elementsTree = super.render();
		console.log(elementsTree, 'elementsTree');
		if (config.type === 'add-style') {
			return <div style={{...style}}>
				{elementsTree}
			</div>;
		}
		return elementsTree;
	}
};

export {
	asyncStateHoc,
	proxyPropertyHoc,
	hijackRenderHoc
};