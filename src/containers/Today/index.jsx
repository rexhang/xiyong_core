import React from 'react';

import './index.scss';

import moment from 'moment';

import 'moment/locale/zh-cn';

moment.locale('zh-cn');

class Today extends React.Component {

	static dateformat = 'YYYY-MM-DD';

	componentWillMount() {

	}

	componentDidMount() {

	}

	render() {
		return (
			<div className="Today rex-text-center">
				{moment().format(Today.dateformat)} {moment().format('dddd')}
			</div>
		);
	}
}

export default Today;