attribute vec3 position;
attribute vec3 color;
attribute vec2 uv;

uniform mat4 objectMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;

varying vec3 vColor;
varying vec2 vUv;
void main(void) {
    vColor = color;
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * objectMatrix * vec4(position, 1.0);
}
