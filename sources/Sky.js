var Sky = function(camera,lightDirection){
  this.cloud = new Texture('data/Noise.jpg');
  this.cloud.wrapping = GL.REPEAT;
  this.cloud.magFilter = GL.LINEAR;
  this.cloud.minFilter = GL.LINEAR_MIPMAP_LINEAR;

  this.texture = new Texture('data/GradientSky.png');

  this.mesh = new Mesh('sky');
  this.mesh.loadFromObjFile('data/Sphere.obj');
  this.mat = new Material('sky', 'data/shader/sky.vShader', 'data/shader/sky.fShader',
    function (mat) {
      mat.uniforms['lightDir'].value = lightDirection;
      mat.uniforms['texture0'].texture = this.texture;
      mat.uniforms['texture1'].texture = this.cloud;

      mat.uniforms['cloudDensity'].value = 0.25;
      mat.uniforms['windSpeed'].value = vec2.fromValues(0.025, 0.015);
    }.bind(this));
  this.mat.doubleSided = true;
  this.object = new Object3D(this.mesh, this.mat);
  this.object.setScale(camera.far * 0.7, camera.far * 0.7, camera.far * 0.7);
  this.object.setPosition(0, -5000, 0);
};
Sky.prototype.render = function() {
  return new Promise(function(resolve,reject){
    resolve(this.object);
  });
};
