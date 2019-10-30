let scene,
	camera,
	renderer,
	container,
	aspect,
	fov,
	plane,
	far,
	mouseX,
	mouseY,
	windowHalfX,
	windowHalfY,
	geometry,
	starStuff,
	materialOptions,
	stars;

export function init() {
	/*container = document.createElement(`div`);
	document.body.appendChild(container);*/

	container = document.querySelector('#stage');

	mouseX = 0;
	mouseY = 0;

	aspect = window.innerWidth / window.innerHeight;
	fov = 40;
	plane = 1;
	far = 800;

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera = new window.THREE.PerspectiveCamera(
		fov,
		aspect,
		plane,
		far
	);

	camera.position.z = far / 2;

	scene = new window.THREE.Scene({ antialias: true });
	scene.fog = new window.THREE.FogExp2(0x1b1b1b, 0.0001);

	starForge();

	renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.autoClear = false;
	renderer.setClearColor(0x000000, 0.0);
	container.appendChild(renderer.domElement);

	document.addEventListener('mousemove', onMouseMove, false);
}

export function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	camera.position.x += (mouseX - camera.position.x) * 0.005;
	camera.position.y += (-mouseY - camera.position.y) * 0.005;
	camera.lookAt(scene.position);
	renderer.render(scene, camera);
}

function starForge() {
	let amount = 45000;
	geometry = new window.THREE.SphereGeometry(1000, 100, 50);

	materialOptions = {
		color: new window.THREE.Color(0xffffff),
		size: 1.1,
		transparency: true,
		opacity: 0.8
	};

	starStuff = new window.THREE.PointsMaterial(materialOptions);

	for (let i = 0; i < amount; i++) {
		let item = new window.THREE.Vector3();
		item.x = Math.random() * 2000 - 1000;
		item.y = Math.random() * 2000 - 1000;
		item.z = Math.random() * 2000 - 1000;

		geometry.vertices.push(item);
	}

	stars = new window.THREE.PointCloud(geometry, starStuff);
	scene.add(stars);
}

function onMouseMove(e) {
	mouseX = e.clientX - windowHalfX;
	mouseY = e.clientY - windowHalfY;
}