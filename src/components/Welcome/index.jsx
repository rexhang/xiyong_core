import React from 'react';

import './index.scss';

class Welcome extends React.Component {
	render() {
		return (
			<div className="Welcome">
				<div className="welcome">
					<img src={require('@src/img/welcome.svg')} alt="" />
					<img src={require('@src/img/xy/logo.jpg')} className='rex-radius' width={'30%'} alt="" />
				</div>
			</div>
		);
	}
}

export default Welcome;