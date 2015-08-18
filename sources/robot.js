var Robot = function (longueur, largeur, path) {
  this.ratio = 0.75;
  this.longueur = longueur;
  this.largeur = largeur;
  this.Mesh = new Mesh();
  this.Mesh.loadFromObjFile(path);
  this.Mat = new Material('robot', 'data/shader/default.vShader', 'data/shader/default.fShader',
    function (mat) {
      mat.uniforms['texture0'].texture = new Texture('data/0001.BMP');
    });


  this.Mat.blendEquation = GL.FUNC_ADD;
  this.Mat.dstBlend = GL.ZERO;
  this.Mat.srcBlend = GL.ONE;
  this.Object = new Object3D(this.Mesh, this.Mat);
  this.Object.setScale(100, 100, 100);

  this.Object.setPosition(0, 0, 0);
  this.Object.setRotation(0, -Math.PI / 2, 0);

  this.sensors = [];

  this.sensors.push(new Sensor(this.longueur * this.ratio, this.largeur / 2, -Math.PI / 4));
  this.sensors.push(new Sensor(this.longueur * this.ratio, this.largeur / 4, 0));
  this.sensors.push(new Sensor(this.longueur * this.ratio, -this.largeur / 4, 0));
  this.sensors.push(new Sensor(this.longueur * this.ratio, -this.largeur / 2, Math.PI / 4));
  this.sensors.push(new Sensor(this.longueur * this.ratio - this.longueur / 4, -this.largeur / 2, Math.PI / 2));
  this.sensors.push(new Sensor(this.longueur * this.ratio - this.longueur / 2, -this.largeur / 2, Math.PI / 2));
  this.sensors.push(new Sensor(-this.longueur * (1 - this.ratio) + this.longueur / 4, -this.largeur / 2, Math.PI / 2));
  this.sensors.push(new Sensor(this.longueur * this.ratio - this.longueur / 4, this.largeur / 2, -Math.PI / 2));
  this.sensors.push(new Sensor(this.longueur * this.ratio - this.longueur / 2, this.largeur / 2, -Math.PI / 2));
  this.sensors.push(new Sensor(-this.longueur * (1 - this.ratio) + this.longueur / 4, this.largeur / 2, -Math.PI / 2));
  this.sensors.push(new Sensor(-this.longueur * (1 - this.ratio), this.largeur / 2, -3 * Math.PI / 4));
  this.sensors.push(new Sensor(-this.longueur * (1 - this.ratio), this.largeur / 4, Math.PI));
  this.sensors.push(new Sensor(-this.longueur * (1 - this.ratio), -this.largeur / 4, Math.PI));
  this.sensors.push(new Sensor(-this.longueur * (1 - this.ratio), -this.largeur / 2, 3 * Math.PI / 4));

};
Robot.prototype.getPosition = function () {
  return this.Object.position;
};
Robot.prototype.getRotation = function () {
  return this.Object.rotation[1];
};
Robot.prototype.move = function (v) {
  this.Object.setPosition(this.Object.position[0] - v * Math.sin(this.Object.rotation[1]), 0, this.Object.position[2] - v * Math.cos(this.Object.rotation[1]));
};
Robot.prototype.calcul_position = function (input) {
  var vec = {};
  vec.x = -Math.cos(Math.PI / 2) * Math.sin(this.getRotation()) + Math.sin(Math.PI / 2) * Math.cos(this.getRotation());
  vec.z = -Math.sin(Math.PI / 2) * Math.sin(this.getRotation()) - Math.cos(Math.PI / 2) * Math.cos(this.getRotation());

  var position = {};
  position.x = this.Object.position[0] - input.xOffset * Math.sin(this.getRotation()) + vec.x * input.zOffset;
  position.z = this.Object.position[2] - input.xOffset * Math.cos(this.getRotation()) + vec.z * input.zOffset;

  input.Object.setPosition(position.x, 40, position.z);
  input.Object.setRotation(0, this.getRotation() + input.rotation, 0);
};
Robot.prototype.rotate = function(t){
  this.Object.setRotation(0, this.getRotation() + t, 0);
};

