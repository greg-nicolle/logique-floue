attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 objectMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec3 lightDir;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 cameraPosition;

varying vec2 vUv;
varying vec3 vColor;
varying vec3 vEyeDir;
varying vec3 wNormal;


void main(void) {
    wNormal = (objectMatrix * vec4(normal, 0.0)).xyz;
    float nDotL = clamp( dot(normalize(lightDir), normalize(wNormal)), 0.0, 1.0);
    vColor = ambientColor + lightColor * nDotL;

    vUv = uv;

    vec4 pos = vec4(position, 1.0);
    vec4 worldPosition = objectMatrix * pos;
    vEyeDir = cameraPosition.xyz - worldPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * objectMatrix * vec4(position, 1.0);
}
