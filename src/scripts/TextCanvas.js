import TextLine from './TextLine';
import * as THREE from 'three';

export default class TextCanvas {
    constructor(webGlView, str, textColor, bgColor) {
        this.webGlView = webGlView;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.needsUpdate = true;

        this.string = str;
        let fontSize = 300;

        this.ctx.font = fontSize + 'px Oswald';
        this.ctx.fillStyle = textColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        let textMetric = this.ctx.measureText(this.string);
        let textSnippetWidth = textMetric.width;
        let textSnippetsPerLine = Math.ceil(this.width / textSnippetWidth + 2);
        let textLineCount = Math.ceil(this.height / fontSize) + 1;
        let textLineHeight = fontSize;
        let snippetPadding = 45;
        let scrollSpeed = 5;
        this.textLine = new TextLine(
            0,
            this.height * 0.5,
            textSnippetWidth,
            snippetPadding,
            scrollSpeed,
            -1,
            this.ctx,
            fontSize,
            this.string,
            textColor,
            bgColor
        );
    }
}
