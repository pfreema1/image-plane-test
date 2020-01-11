uniform sampler2D image;
uniform sampler2D textCanvasTexture1;
uniform sampler2D textCanvasTexture2;
uniform vec2 gridDimension;
uniform vec2 id;
uniform vec2 gridId;
uniform vec2 imageResolution;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
    // vec2 ratio = vec2(
    //     min((resolution.x / resolution.y) / (resolution.x / resolution.y), 1.0),
    //     min((resolution.y / resolution.x) / (resolution.y / resolution.x), 1.0)
    // );

    vec2 ratio = vec2(1.0);

    vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // scale according to gridDimension
    uv /= gridDimension;
    // offset according to id
    uv.x += id.x;
    uv.y += id.y;

    vec4 texture1Color = texture2D(textCanvasTexture1, uv);
    vec4 texture2Color = texture2D(textCanvasTexture2, uv);

    /*
    // testing flipped colors here
    vec4 finalColor;

    if(mod(gridId.x, 2.0) == 0.0) {
        finalColor = texture1Color;
    } else {
        finalColor = texture2Color;
    }
    */

    gl_FragColor = vec4(texture1Color.xyz, 1.0);
}