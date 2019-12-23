import * as THREE from 'three';
import imageTextureCubeFrag from '../shaders/imageTextureCube.frag';
import imageTextureCubeVert from '../shaders/imageTextureCube.vert';
import TweenMax from 'TweenMax';
import glslify from 'glslify';

export default class TextureCube {
    constructor(webGLView, width, height, imageTexture, gridDim, id, zVal, pD) {
        this.webGLView = webGLView;
        this.imageTexture = imageTexture;

        const rows = gridDim.width;
        const columns = gridDim.height;

        const geo = new THREE.BoxBufferGeometry(width, height, 1);
        // const geo = new THREE.PlaneBufferGeometry(width, height, 32);
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                image: {
                    value: this.imageTexture
                },
                gridDimension: {
                    value: new THREE.Vector2(gridDim.width, gridDim.height)
                },
                id: {
                    value: new THREE.Vector2(id.i / rows, 1.0 - (id.j / columns) - (1 / columns))
                },
                imageResolution: {
                    value: new THREE.Vector2(this.imageTexture.image.width, this.imageTexture.image.height)
                },
                resolution: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                }
            },
            fragmentShader: glslify(imageTextureCubeFrag),
            vertexShader: glslify(imageTextureCubeVert),
        });
        this.mesh = new THREE.Mesh(geo, mat);
        const x = -(pD.width / 2) + id.i * width + width / 2;
        const y = pD.height / 2 - id.j * height - height / 2;
        const z = zVal;
        this.mesh.position.set(x, y, z);

        TweenMax.to(this.mesh.rotation, 3.0, {
            repeat: -1,
            yoyo: true,
            delay: 0.5 * id.j + id.i * 0.2,
            y: Math.PI * 0.2
        });
    }
}