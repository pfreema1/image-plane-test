uniform sampler2D image;
uniform sampler2D textCanvasTexture;
uniform vec2 gridDimension;
uniform vec2 id;
uniform vec2 imageResolution;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
    vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
        min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
    );

    vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // scale according to gridDimension
    uv /= gridDimension;
    // offset according to id
    uv.x += id.x;
    uv.y += id.y;

    gl_FragColor = vec4(texture2D(textCanvasTexture, uv).xyz, 1.0);
}