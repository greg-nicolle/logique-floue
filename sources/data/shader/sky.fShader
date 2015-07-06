precision highp float;

uniform float currentTime;
uniform sampler2D texture0;
uniform sampler2D texture1;

uniform vec3 lightDir;
uniform float cloudDensity;
uniform vec2 windSpeed;

varying vec4 vSunColor;
varying vec4 vHorizonColor;
varying vec2 vSkyGradientUv;

varying vec3 vPos;

void main()
{
    float sunDot = max( 0.0, dot(normalize(lightDir),normalize(vPos)) );
    float sunPower = mix(0.5, 16.0, lightDir.y);
    float minStep = mix(0.985, 0.995, lightDir.y);
    float sunRate = smoothstep(minStep, 0.999, pow(sunDot, sunPower));

    vec4 baseColor = texture2D(texture0, vSkyGradientUv) + (vSunColor + vHorizonColor)* sunRate;

    vec2 noiseUvs = vPos.xz + currentTime * windSpeed.xy;
    float noisy = 0.7 * texture2D( texture1, noiseUvs).r;

    gl_FragColor = mix( baseColor, vHorizonColor, noisy);
}
