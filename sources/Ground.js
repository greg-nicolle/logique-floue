var Ground = function () {
  this.Mesh = new Mesh('ground');
  this.Mesh.loadFromObjFile('data/plateau.obj');
  this.mat = new Material('ground', 'data/shader/default.vShader', 'data/shader/default.fShader',
    function (mat) {
      var texture = new Texture('data/grass_diffuse.png');
      texture.minFilter = GL.LINEAR_MIPMAP_LINEAR;
      mat.uniforms['texture0'].texture = texture;
    });
  this.Object = new Object3D(this.Mesh, this.mat);
  this.Object.setPosition(0, 0, 0);
  this.Object.setRotation(0, Math.PI, 0);
  this.Object.setScale(12000, 0, 12000);
  this.largeur = 25000;
  this.longueur = 25000;
};
