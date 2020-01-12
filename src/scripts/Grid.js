import * as THREE from 'three';
import fitPlaneToScreen from './utils/fitPlaneToScreen';
import TextureCube from './TextureCube';


export default class Grid {
    constructor(webGLView) {
        this.webGLView = webGLView;

        this.init();
    }

    async init() {

        const zVal = -10;

        // await this.loadTextures();

        // planeDimensions
        this.pD = fitPlaneToScreen(this.webGLView.bgCamera, zVal, window.innerWidth, window.innerHeight);

        this.cubeRows = 10;
        this.cubeColumns = 10;
        this.cubes = [];
        const gridDim = {
            width: this.cubeRows,
            height: this.cubeColumns
        };

        for (let i = 0; i < this.cubeRows; i++) {
            for (let j = 0; j < this.cubeColumns; j++) {
                const id = { i, j };
                const cubeWidth = this.pD.width / this.cubeRows;
                const cubeHeight = this.pD.height / this.cubeColumns;
                const textureCube = new TextureCube(this.webGLView, cubeWidth, cubeHeight, gridDim, id, zVal, this.pD);

                this.webGLView.bgScene.add(textureCube.mesh);
                this.cubes.push(textureCube);
            }
        }

    }


}