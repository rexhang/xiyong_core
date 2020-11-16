import React from "react";

import PropTypes from 'prop-types';

import GlobalContext from "../Context/Context";

class TestComponents extends React.Component{
	static propTypes = {
		width: PropTypes.string.isRequired,
		height: PropTypes.string.isRequired,
		show: PropTypes.bool.isRequired,
		parent: PropTypes.func,
		child: PropTypes.func
	};

	static defaultProps = {
		show: true
	};

	constructor(props) {
		super(props);
		this.state = {
			name: 'TestComponents'
		};
	}

	componentDidMount() {
		const parent = this.props.parent(); // 获取父级对象
		// parent.say(); // 调用父级方法
		this.props.child(this); // 传递子集方法给父级
	}

	say = () => {
	    console.log('i am child methods');
	};

	render() {
		return (
			<GlobalContext.Consumer>
				{
					context=>{
						// console.log(context.target.say());
						context.target.say();
						return (
							<div className='TestComponents'>
								<h1 data-info={JSON.stringify({width: this.props.width, height: this.props.height, show: this.props.show})}>TestComponents</h1>
								<a href="#/admin/core/tools">Go</a>
							</div>
						);
					}
				}
			</GlobalContext.Consumer>
		);
	}
}

export default TestComponents;