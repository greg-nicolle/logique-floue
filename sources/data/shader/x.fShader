precision highp float;

uniform sampler2D texture0;
uniform vec3 lightDir;
uniform vec3 specularColor;

varying vec3 vColor;
varying vec2 vUv;

varying vec3 vEyeDir;
varying vec3 wNormal;


void main()
{

    vec3 eyeDir = normalize(vEyeDir);


    float spec = pow(max(dot(reflect(normalize(lightDir),wNormal), -eyeDir), 0.0), 20.0);


    gl_FragColor = texture2D( texture0, vUv );
    gl_FragColor.rgb *= vColor;

    gl_FragColor.xyz += specularColor * spec;


}