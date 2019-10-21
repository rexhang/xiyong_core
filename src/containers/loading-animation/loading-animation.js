/**
 * @author Rexhang(GuHang)
 * @date 2018/7/25 下午5:20
 * @Description: Loading 组件
*/

import React from 'react';

import PropTypes from 'prop-types';

import './loading-animation.scss';

class LoadingAnimation extends React.PureComponent {

    static proptypes = {
    	width: PropTypes.string,
    	hide: PropTypes.boolean
    };

    static defaultProps = {
    	width: '80',
    	hide: false
    };

    render() {
    	return (
    		<div className="LoadingAnimation" style={ {display: `${this.props.hide?'none':'block'}`} }>
    			<div className="loading-ctn runloading"></div>
    		</div>
    	);
    }
}

export default LoadingAnimation;