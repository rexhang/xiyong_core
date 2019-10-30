import React from 'react';

import './index.scss';

import {withRouter} from 'react-router-dom';

import {connect} from 'react-redux';

@withRouter
@connect(
	state=>state.main
)
class RexForm extends React.PureComponent {

	state = {
	};

	componentDidMount() {

	}

	componentWillUnmount() {
	}

	render() {
		let f_lable_style = {},f_body_style={};
		if (this.props.lableWidth){
			f_lable_style = {
				width: this.props.lableWidth,
				textAlign: 'center'
			};
		}
		if (this.props.extra !== 'special-list') {
			f_body_style = {
				display: 'flex',
				alignItems: 'center'
			};
		}
		return (
			<div className="RexForm" style={this.props.style}>
				<div className="f_body rex-cf" style={f_body_style}>
					<div className="f_lable" style={f_lable_style}>
						{this.props.lableText}
					</div>
					<div className="f_ctn">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default RexForm;