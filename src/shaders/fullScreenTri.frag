precision highp float;
uniform sampler2D uScene;
uniform sampler2D uMouseCanvas;
uniform sampler2D uTextCanvas;
uniform vec2 uResolution;
uniform float uTime;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec4 color = vec4(0.0);
    // vec4 sceneColor = texture2D(uScene, uv);
    vec4 mouseCanvasColor = texture2D(uMouseCanvas, uv);
    // vec4 textCanvasColor = texture2D(uTextCanvas, uv);


    // color = sceneColor + canvasTextureColor;

    // color = mix(color, textCanvasColor, step(0.7, uv.x));

    vec4 refractColor1 = texture2D(uScene, uv + (mouseCanvasColor.r * 0.009 * 2.8));
    vec4 refractColor2 = texture2D(uScene, uv + (mouseCanvasColor.r * 0.013 * 2.8));
    vec4 refractColor3 = texture2D(uScene, uv + (mouseCanvasColor.r * 0.017 * 2.8));

    color = vec4(refractColor1.r, refractColor2.g, refractColor3.b, 1.0);
    
    gl_FragColor = vec4(color);
}