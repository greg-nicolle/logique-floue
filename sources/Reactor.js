var Reactor = function (longueur, largeur) {
  this.mesh = new Mesh("generatedReactor");
  this.mesh.primitiveType = GL.POINTS;

  for (var i = 0; i < 300; ++i)
    this.mesh._positions.push(this.randomPos(), this.randomPos(), this.randomPos());

  this.mat = new Material("reactor", "data/shader/reactor.vShader", "data/shader/reactor.fShader",
    function (mat) {
      mat.uniforms["texture0"].texture = new Texture("data/smoke.png");
    });
  this.mat.blendEquation = GL.FUNC_ADD;
  this.mat.zWrite = false;
  this.mat.srcBlend = GL.SRC_ALPHA;
  this.mat.dstBlend = GL.ONE_MINUS_SRC_ALPHA;

  this.Object = new Object3D(this.mesh, this.mat);
  this.xOffset = longueur;
  this.zOffset = largeur;
  this.rotation = 0;
};

Reactor.prototype.randomPos = function () {
  return Math.random() - 0.5;
};
Reactor.prototype.render = function(render) {
  return new Promise(function(resolve, reject){
    render(this.Object);
    resolve(render);
  }.bind(this));
};

