import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import glslify from 'glslify';
import Tweakpane from 'tweakpane';
import OrbitControls from 'three-orbitcontrols';
import TweenMax from 'TweenMax';
import baseDiffuseFrag from '../../shaders/basicDiffuse.frag';
import basicDiffuseVert from '../../shaders/basicDiffuse.vert';
import MouseCanvas from '../MouseCanvas';
import TextCanvas from '../TextCanvas';
import RenderTri from '../RenderTri';
import fitPlaneToScreen from '../utils/fitPlaneToScreen';
import imageTextureFrag from '../../shaders/imageTexture.frag';
import imageTextureVert from '../../shaders/imageTexture.vert';
import Grid from '../Grid';

export default class WebGLView {
	constructor(app) {
		this.app = app;
		this.PARAMS = {
			rotSpeed: 0.005
		};

		this.init();
	}

	async init() {
		this.initThree();
		this.initBgScene();
		this.initLights();
		this.initTweakPane();
		this.setupTextCanvas();
		this.initMouseMoveListen();
		this.initMouseCanvas();
		this.initRenderTri();
		await this.loadTexture();
		// this.initCubes();
		this.initGrid();
		// this.initPlaneWithTexture();
	}

	initGrid() {
		this.grid = new Grid(this);
	}

	async loadTexture() {
		return new Promise((res, rej) => {
			let loader = new THREE.TextureLoader();

			loader.load('./cau.png', (texture) => {
				this.imageTexture = texture;
				this.imageTexture.generateMipmaps = false;
				this.imageTexture.minFilter = THREE.LinearFilter;
				this.imageTexture.needsUpdate = true;
				console.log('this.imageTexture:  ', this.imageTexture);
				res();
			});
		});
	}

	initPlaneWithTexture() {
		const pD = fitPlaneToScreen(this.bgCamera, -6, this.width, this.height); // planeDimensions
		const iD = {
			width: this.imageTexture.image.width,
			height: this.imageTexture.image.height,
		};  // imageDimensions
		const normImageDim = {
			width: iD.width / window.innerWidth,
			height: iD.height / window.innerHeight
		};
		const gridDim = {
			width: pD.width * normImageDim.width,
			height: pD.height * normImageDim.height
		};

		this.imagePlanes = [];
		const rows = 4;
		const columns = 6;

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				const planeWidth = gridDim.width / rows;
				const planeHeight = gridDim.height / columns;
				const geo = new THREE.PlaneGeometry(planeWidth, planeHeight, 32);
				const mat = new THREE.ShaderMaterial({
					uniforms: {
						image: {
							value: this.imageTexture
						},
						gridDimension: {
							value: new THREE.Vector2(rows, columns)
						},
						id: {
							value: new THREE.Vector2(i / rows, 1.0 - (j / columns) - (1 / columns))
						},
						imageResolution: {
							value: new THREE.Vector2(this.imageTexture.image.width, this.imageTexture.image.height)
						},
						resolution: {
							value: new THREE.Vector2(window.innerWidth, window.innerHeight)
						}
					},
					fragmentShader: glslify(imageTextureFrag),
					vertexShader: glslify(imageTextureVert)
				})
				const planeMesh = new THREE.Mesh(geo, mat);
				const x = -(gridDim.width / 2) + i * planeWidth + planeWidth / 2;
				const y = gridDim.height / 2 - j * planeHeight - planeHeight / 2;
				const z = -6;
				planeMesh.position.set(x, y, z);

				this.bgScene.add(planeMesh);


				TweenMax.to(planeMesh.rotation, 3.0, {
					repeat: -1,
					yoyo: true,
					delay: 0.5 * j + i * 0.2,
					y: Math.PI * 0.2
				});

			}
		}

	}

	initCubes() {
		const pD = fitPlaneToScreen(this.bgCamera, -10, this.width, this.height); // planeDimensions


		const cubeRows = 6;
		const cubeColumns = 8;
		this.cubes = [];

		for (let i = 0; i < cubeRows; i++) {
			for (let j = 0; j < cubeColumns; j++) {
				const cubeWidth = pD.width / cubeRows;
				const cubeHeight = pD.height / cubeColumns;
				const geo = new THREE.PlaneBufferGeometry(cubeWidth, cubeHeight, 32);
				const mat = new THREE.MeshLambertMaterial({
					color: 0x0000ff,
					side: THREE.DoubleSide,
					transparent: true
				});
				mat.opacity = 0.5;
				const cubeMesh = new THREE.Mesh(geo, mat);
				const x = -(pD.width / 2) + i * cubeWidth + cubeWidth / 2;
				const y = pD.height / 2 - j * cubeHeight - cubeHeight / 2;
				const z = -10;
				cubeMesh.position.set(x, y, z);
				this.bgScene.add(cubeMesh);
				this.cubes.push(cubeMesh);

				TweenMax.to(cubeMesh.rotation, 3.0, {
					repeat: -1,
					delay: 0.5 * j + i * 0.2,
					y: Math.PI * 2
				});
			}
		}
	}

	initTweakPane() {
		this.pane = new Tweakpane();

		this.pane
			.addInput(this.PARAMS, 'rotSpeed', {
				min: 0.0,
				max: 0.5
			})
			.on('change', value => { });
	}

	initMouseCanvas() {
		this.mouseCanvas = new MouseCanvas();
	}

	initMouseMoveListen() {
		this.mouse = new THREE.Vector2();
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		window.addEventListener('mousemove', ({ clientX, clientY }) => {
			this.mouse.x = clientX; //(clientX / this.width) * 2 - 1;
			this.mouse.y = clientY; //-(clientY / this.height) * 2 + 1;

			this.mouseCanvas.addTouch(this.mouse);
		});
	}

	initThree() {
		this.scene = new THREE.Scene();

		this.camera = new THREE.OrthographicCamera();

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.autoClear = true;

		this.clock = new THREE.Clock();
	}

	setupTextCanvas() {
		this.textCanvas1 = new TextCanvas(this, 'IT WAS ALL A DREAM', '#000000', '#FFFFFF');

		this.textCanvas2 = new TextCanvas(this, 'IT WAS ALL A DREAM', '#FFFFFF', '#000000');
	}

	initRenderTri() {
		this.resize();

		this.renderTri = new RenderTri(
			this.scene,
			this.renderer,
			this.bgRenderTarget,
			this.mouseCanvas,
			this.textCanvas1
		);
	}

	initBgScene() {
		this.bgRenderTarget = new THREE.WebGLRenderTarget(
			window.innerWidth,
			window.innerHeight
		);
		this.bgCamera = new THREE.PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight,
			0.01,
			100
		);
		this.controls = new OrbitControls(this.bgCamera, this.renderer.domElement);

		this.bgCamera.position.z = 3;
		this.controls.update();

		this.bgScene = new THREE.Scene();
	}

	initLights() {
		this.pointLight = new THREE.PointLight(0xffffff, 1, 1000);
		this.pointLight.position.set(0, 0, 0);
		this.bgScene.add(this.pointLight);
	}

	resize() {
		if (!this.renderer) return;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.fovHeight =
			2 *
			Math.tan((this.camera.fov * Math.PI) / 180 / 2) *
			this.camera.position.z;
		this.fovWidth = this.fovHeight * this.camera.aspect;

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		if (this.trackball) this.trackball.handleResize();
	}

	updateTestMesh(time) {
		this.testMesh.rotation.y += this.PARAMS.rotSpeed;

		this.testMeshMaterial.uniforms.u_time.value = time;
	}

	updateTextCanvases(time) {
		this.textCanvas1.textLine.update(time);
		this.textCanvas1.textLine.draw(time);
		this.textCanvas1.texture.needsUpdate = true;

		this.textCanvas2.textLine.update(time);
		this.textCanvas2.textLine.draw(time);
		this.textCanvas2.texture.needsUpdate = true;
	}

	updateCubes(time) {
		// for(let i = 0; i < this.cubes.length; i++) {
		// 	let cube = this.cubes[i];
		// 	cube.rotation.y
		// }
	}

	update() {
		const delta = this.clock.getDelta();
		const time = performance.now() * 0.0005;

		this.controls.update();

		if (this.renderTri) {
			this.renderTri.triMaterial.uniforms.uTime.value = time;
		}

		if (this.testMesh) {
			this.updateTestMesh(time);
		}

		// if (this.mouseCanvas) {
		// 	this.mouseCanvas.update();
		// }

		if (this.textCanvas1 && this.textCanvas2) {
			this.updateTextCanvases(time);
		}

		if (this.cubes) {
			this.updateCubes(time);
		}

		if (this.trackball) this.trackball.update();
	}

	draw() {
		this.renderer.setRenderTarget(this.bgRenderTarget);
		this.renderer.render(this.bgScene, this.bgCamera);
		this.renderer.setRenderTarget(null);

		this.renderer.render(this.scene, this.camera);
	}
}
