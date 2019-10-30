/**
 * @author Rexhang(GuHang)
 * @date 2019/1/2 10:31
 * @Description: React16.7+新特性
*/

import React, {useState, useEffect} from 'react';

export function UseState(props) {

	const [name, setData] = useState(props.name);

	function handleNameChange(e) {
		setData(e.target.value);
	}

	return (
		<div>
			<input value={name} onChange={handleNameChange} />
		</div>
	);
}

export function UseEffect(props) {

	const [count, setData] = useState(0);

	function handleClick(e) {
		setData(count+1);
	}

	useEffect(()=>{
		document.title = count;
	});

	return (
		<div>
			<p>{count}</p>
			<button onClick={handleClick}>Click Me</button>
		</div>
	);
}
