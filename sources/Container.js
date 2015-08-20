var Container = function() {
  this.mesh = new Mesh('house');
  this.mesh.loadFromObjFile('data/Container.obj');
  this.mat = new Material('house', 'data/shader/default.vShader', 'data/shader/default.fShader',
    function (mat) {
      mat.uniforms['texture0'].texture = new Texture('data/Container.BMP');
    });
  this.mat.blendEquation = GL.FUNC_ADD;
  this.mat.dstBlend = GL.ZERO;
  this.mat.srcBlend = GL.ONE;

  this.Object = new Object3D(this.mesh,this.mat);
  this.Object.setPosition(Math.random() * 25000 - 12500, 0, Math.random() * 25000 - 12500);
  this.Object.setRotation(0, Math.random() * Math.PI - Math.PI / 2, 0);
  this.Object.setScale(50, 50, 50);
  this.largeur = 500;
  this.longueur = 1200;
};
