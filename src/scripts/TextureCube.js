import * as THREE from 'three';
import imageTextureCubeFrag from '../shaders/imageTextureCube.frag';
import imageTextureCubeVert from '../shaders/imageTextureCube.vert';
import TweenMax from 'TweenMax';
import glslify from 'glslify';
import { Float32BufferAttribute } from 'three';

export default class TextureCube {
    constructor(webGLView, width, height, gridDim, id, zVal, pD) {
        this.webGLView = webGLView;

        const rows = gridDim.width;
        const columns = gridDim.height;

        const geo = new THREE.BoxBufferGeometry(width, height, 1);
        this.updateUv(geo);
        // const geo = new THREE.PlaneBufferGeometry(width, height, 32);
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                gridDimension: {
                    value: new THREE.Vector2(gridDim.width, gridDim.height)
                },
                id: {
                    value: new THREE.Vector2(id.i / rows, 1.0 - (id.j / columns) - (1 / columns))
                },
                gridId: {
                    value: new THREE.Vector2(id.i, id.j)
                },
                resolution: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                },
                textCanvasTexture1: {
                    value: this.webGLView.textCanvas1.texture
                }
            },
            fragmentShader: glslify(imageTextureCubeFrag),
            vertexShader: glslify(imageTextureCubeVert),
        });
        this.mesh = new THREE.Mesh(geo, mat);

        const x = -(pD.width / 2) + id.i * width + width / 2;
        const y = pD.height / 2 - id.j * height - height / 2;
        const z = zVal - 1;
        this.mesh.position.set(x, y, z);


        // only turn some of the cubes
        if (id.j > 2 && id.j < 7) {

            TweenMax.to(this.mesh.rotation, 5.0, {
                repeat: -1,
                yoyo: true,
                delay: 0.5 * id.j + id.i * 0.2,
                y: Math.PI * 0.2,
                ease: Power4.easeInOut
            });
        }
    }

    updateUv(geo) {
        const uvs = new Float32Array([
            // front
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            // right
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            // back
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            // left
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            // top (this seems to be the front facing face!)
            // 0, 2.5,
            // 2.5, 2.5,
            // 0, 0,
            // 2.5, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            // bottom
            0, 1,
            1, 1,
            0, 0,
            1, 0,
        ]);

        geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    }
}