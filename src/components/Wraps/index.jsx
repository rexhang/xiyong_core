import React from 'react';

import './index.scss';

import { Divider } from 'antd';

import {withRouter} from 'react-router-dom';

import {connect} from 'react-redux';

@withRouter
@connect(
	state=>state.main
)
class Wraps extends React.PureComponent {

	state = {
	};

	render() {
		return (
			<div className="Wraps">
				<div className="c_body">
	                <div className="c_head">
		                <Divider orientation="left">{this.props.title}</Divider>
	                </div>
					<div className="c_ctn rex-cf">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default Wraps;