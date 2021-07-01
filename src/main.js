import '../style.css'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import SceneManager from './sceneManager/scene';
import gsap from 'gsap';

const gui = new dat.GUI();

//scene
const canvas = document.querySelector('#canvas');
const scene = new SceneManager(canvas);
let conf = { color : '#181818' }; 
scene.scene.background.set('#181818');
scene.addOrbitControl();
scene.addFog(0.5,25,conf.color);


/**
 * Texture
 */
const TextureLoader = new THREE.TextureLoader();

//Door Texture
const doorColorTexture = TextureLoader.load('./texture/door/basecolor.jpg');
const doorAmbientOcclusionTexture = TextureLoader.load('./texture/door/ambientOcclusion.jpg');
const doorHeightTexture = TextureLoader.load('./texture/door/height.png');
const doorMetallicTexture = TextureLoader.load('./texture/door/metallic.jpg');
const doorNormalTexture = TextureLoader.load('./texture/door/normal.jpg');
const doorOpacityTexture = TextureLoader.load('./texture/door/opacity.jpg');
const doorRoughnessTexture = TextureLoader.load('./texture/door/roughness.jpg');

//Wall Texture
const wallColorTexture = TextureLoader.load('./texture/walls/castle_brick_07_diff_1k.jpg');
const wallAmbientOcclusionTexture = TextureLoader.load('./texture/walls/castle_brick_07_ao_1k.jpg');
const wallNormalTexture = TextureLoader.load('./texture/walls/castle_brick_07_nor_1k.jpg');
const wallRoughnessTexture = TextureLoader.load('./texture/walls/castle_brick_07_rough_1k.jpg');
const wallHeightTexture = TextureLoader.load('./texture/walls/castle_brick_07_disp_1k.jpg');

//Grass Texture
const grassAmbientOcclusionTexture = TextureLoader.load('./texture/grass/Stylized_Grass_001_ambientOcclusion.jpg');
const grassColorTexture = TextureLoader.load('./texture/grass/Stylized_Grass_001_basecolor.jpg');
const grassHeightTexture = TextureLoader.load('./texture/grass/Stylized_Grass_001_height.png');
const grassNormalTexture = TextureLoader.load('./texture/grass/Stylized_Grass_001_normal.jpg');
const grassRoughnessTexture = TextureLoader.load('./texture/grass/Stylized_Grass_001_roughness.jpg');

grassColorTexture.repeat.set(20,20);
grassAmbientOcclusionTexture.repeat.set(20,20);
grassHeightTexture.repeat.set(20,20);
grassNormalTexture.repeat.set(20,20);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassHeightTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassHeightTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;

//fog GUI
const fogFolder = gui.addFolder('FOG');
fogFolder.add(scene.scene.fog, 'near').min(0.01).max(100).step(0.01).listen();
fogFolder.add(scene.scene.fog, 'far').min(1).max(100).step(0.01).listen();
fogFolder.addColor(conf, 'color').onChange((color)=>{
	scene.scene.fog.color.set(color);
	scene.scene.background.set(color);
});
const axesHelper = new THREE.AxesHelper(5);

//lights
const directionalLight = new THREE.DirectionalLight(0xb9d5ff,0.12);
directionalLight.position.set(10,10,10);
scene.add(directionalLight);

const ambiantLight = new THREE.AmbientLight(0xb9d5ff,0.12);
scene.add(ambiantLight);

/**
 * Ghosts
 */
 const ghost1 = new THREE.PointLight('#ff00ff',2,3);
 scene.add(ghost1);

 const ghost2 = new THREE.PointLight('#ffff00',2,3);
 scene.add(ghost2);

 const ghost3 = new THREE.PointLight('#00ffff',2,3);
 scene.add(ghost3);



//House
const house = new THREE.Group();
scene.add(house);

//roofs
const roofs = new THREE.Mesh(
	new THREE.ConeBufferGeometry(3.5,1,4),
	new THREE.MeshPhongMaterial( { color:0xff4444 } )
);
roofs.position.y = 3;
roofs.rotation.y = Math.PI * 0.25;
house.add(roofs); 

//walls
const walls = new THREE.Mesh(
	new THREE.BoxBufferGeometry(4,2.5,4,100,100, 100),
	new THREE.MeshStandardMaterial( { 
		map:wallColorTexture,
		aoMap:wallAmbientOcclusionTexture,
		normalMap:wallNormalTexture,
		roughnessMap:wallRoughnessTexture,
		displacementMap:wallHeightTexture,
		displacementScale:0.2,
		displacementBias:-0.05,
		// wireframe:true
	})
);
walls.geometry.setAttribute(
	'uv2',
	new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2)
);
walls.position.y = 1.25;
house.add(walls);

// door
const door = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(2,2.2,100,100),
	new THREE.MeshStandardMaterial( {
		map:doorColorTexture,
		alphaMap:doorOpacityTexture,
		transparent:true,
		aoMap:doorAmbientOcclusionTexture,
		displacementMap:doorHeightTexture,
		displacementScale:0.1,
		normalMap:doorNormalTexture,
		metalnessMap:doorMetallicTexture,
		roughnessMap:doorRoughnessTexture
	} )
);
door.geometry.setAttribute(
	'uv2',
	new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

//door light
const doorLight = new THREE.PointLight('#ff7d46',3,7);
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight);

// const doorLight2 = new THREE.PointLight('#ff7d46',3,7);
// doorLight2.position.set(0, 2.2, -2.7)
// house.add(doorLight2);

//Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1,16,16);
const bushMaterial = new THREE.MeshStandardMaterial({
	map:grassColorTexture,
	normalMap:grassNormalTexture,
	roughnessMap:grassRoughnessTexture,
});


const bush1 = new THREE.Mesh(bushGeometry,bushMaterial);
bush1.scale.set(0.5,0.5,0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial);
bush2.scale.set(0.15,0.15,0.15);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial);
bush3.scale.set(0.25,0.25,0.25);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial);
bush4.scale.set(0.15,0.15,0.15);
bush4.position.set(- 1, 0.05, 2.6);

house.add(bush1,bush2,bush3,bush4);

//Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxBufferGeometry(0.6,0.8,0.2);
const graveMaterial = new THREE.MeshStandardMaterial({color:0xb2b6b1});

for(let i = 0; i < 150; i++){
	const angle = Math.random() * Math.PI * 2;
	const radius = 5 + Math.random() * 15;
	const x = Math.sin(angle) * radius;
	const z = Math.cos(angle) * radius;

	const grave = new THREE.Mesh(graveGeometry, graveMaterial);
	grave.position.set(x,0.4,z);
	grave.rotation.y = (Math.random() - 0.5) * 0.4;
	grave.rotation.z = (Math.random() - 0.5) * 0.4;
	grave.castShadow = true;
	graves.add(grave);
}

//floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(50,50,50,50),
	new THREE.MeshStandardMaterial( { 
		map:grassColorTexture,
		aoMap:grassAmbientOcclusionTexture,
		normalMap:grassNormalTexture,
		roughnessMap:grassRoughnessTexture,
	})
);
floor.geometry.setAttribute(
	'uv2',
	new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
);
floor.rotation.x = Math.PI * 1.50;
floor.receiveShadow = true;
scene.add(floor);

/**
 * Shadows
 */
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 128; // default
directionalLight.shadow.mapSize.height = 128; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 10; // default
//Set up shadow properties for the light
doorLight.castShadow = true;
doorLight.shadow.mapSize.width = 128; // default
doorLight.shadow.mapSize.height = 128; // default
doorLight.shadow.camera.near = 0.5; // default
doorLight.shadow.camera.far = 10; // default
// doorLight2.castShadow = true;
// ghost1.castShadow = true;
// ghost2.castShadow = true;
// ghost3.castShadow = true;
walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

const clock = new THREE.Clock();

const animate = () => {
	const elapsedTime = clock.getElapsedTime();
	

	//update ghost
	const ghostAngle = elapsedTime;
	ghost1.position.x = Math.cos(ghostAngle) * 10;
	ghost1.position.z = Math.sin(ghostAngle) * 10;
	ghost1.position.y = Math.sin(elapsedTime * 3);

	const ghost2Angle = - elapsedTime * 0.32;
	ghost2.position.x = Math.cos(ghost2Angle) * 15;
	ghost2.position.z = Math.sin(ghost2Angle) * 15;
	ghost2.position.y = Math.sin(elapsedTime  * 4) + Math.sin(elapsedTime * 2.5);

	const ghost3Angle = - elapsedTime * 0.18;
	ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
	ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
	ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);

	scene.onUpdate();
	scene.onUpdateStats();
	requestAnimationFrame( animate );
};

animate();