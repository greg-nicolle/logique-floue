 attribute vec3 position;

uniform float currentTime;
uniform mat4 objectMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

varying vec4 vColor;

void main() {
    const float height = 400.0;
    const float startSize = 16000.0;
    const float endSize = 1500.0;
    const vec4 startColor = vec4( 0.94, 0.07, 1.0, 0.50 );
    const vec4 endColor = vec4( 0.07, 0.85, 1.0, 0.10 );

    //const vec4 endColor = vec4( 1, 1.0, 1.0, 0.50 );
    //const vec4 startColor = vec4( 0.0, 0.0, 0.0, 0.10 );


    vec4 pos4 = vec4(position, 1.0);
    float life01 = fract( currentTime + pos4.z );
    pos4.z = life01 * height;
    vColor = mix(startColor, endColor, life01);
    vColor.a *= min( life01 * 4.0, 1.0 - life01 );
    gl_Position = projectionMatrix * viewMatrix * objectMatrix * pos4;
    gl_PointSize = mix(startSize, endSize, life01) / (gl_Position.z);
}