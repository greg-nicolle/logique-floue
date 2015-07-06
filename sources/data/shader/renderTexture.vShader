attribute vec3 position;
varying vec2 vUv;
void main(void) {
    vUv = 0.5 + position.xy * 0.5;
    gl_Position = vec4(position, 1.0);
}
