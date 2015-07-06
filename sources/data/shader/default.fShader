precision highp float;

uniform sampler2D texture0;

varying vec3 vColor;
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D( texture0, vUv );
    gl_FragColor.rgb *= vColor;
}
