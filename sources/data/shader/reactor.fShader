precision highp float;
uniform sampler2D texture0;
varying vec4 vColor;

void main() {
    gl_FragColor = vColor * texture2D( texture0, gl_PointCoord );
}