import React from 'react';

class Placeholder extends React.Component {

	render() {
		let style = {
		};
		if (this.props.height){
			style.height = this.props.height;
			style.width = 0;
		}
		if (this.props.width){
			style.width = this.props.width;
			style.height = 1;
			style.float = 'left';
		}
		return (
			<div style={style} />
		);
	}
}

export default Placeholder;