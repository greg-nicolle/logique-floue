attribute vec3 position;
uniform mat4 objectMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

uniform vec3 lightDir;
uniform sampler2D texture0;

varying vec3 vPos;
varying vec4 vSunColor;
varying vec4 vHorizonColor;
varying vec2 vSkyGradientUv;

void main()
{
    vPos = position;
    vSkyGradientUv = vec2(lightDir.y + 0.05, position.y - 0.1);
    vHorizonColor = texture2D(texture0, vec2( lightDir.y + 0.05, 0.0 ) );
    vSunColor = texture2D(texture0, vec2(lightDir.y + 0.05, 1.0));

    gl_Position = projectionMatrix * viewMatrix * objectMatrix * vec4( position, 1.0 );
}
