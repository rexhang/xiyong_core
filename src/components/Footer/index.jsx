import React from 'react';

import './index.less';

class Footer extends React.PureComponent {
	render() {
		return (
			<div className="Footer rex-text-center">
				{/*版权信息*/}
				Copyright© 2020 power by <a href="//">rexhang</a>
			</div>
		);
	}
}

export default Footer;