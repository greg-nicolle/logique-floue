var Obstables = function(){
  this.Object = new Object3D(groundMesh, groundMat);
  this.Object.setPosition(0, 0, 0);
  this.Object.setRotation(0, Math.PI, 0);
  this.Object.setScale(12000, 0, 12000);
  this.largeur = 25000;
  this.longueur = 25000;

  this.mesh = new Mesh('house');
  this.Mesh.loadFromObjFile('data/Container.obj');
  this.mat = new Material('house', 'data/shader/default.vShader', 'data/shader/default.fShader',
    function (mat) {
      mat.uniforms['texture0'].texture = new Texture('data/Container.BMP');
    });
  this.mat.blendEquation = GL.FUNC_ADD;
  this.mat.dstBlend = GL.ZERO;
  this.mat.srcBlend = GL.ONE;

    obstacles[i].Object.setPosition(Math.random() * 25000 - 12500, 0, Math.random() * 25000 - 12500);
    obstacles[i].Object.setRotation(0, Math.random() * Math.PI - Math.PI / 2, 0);
    obstacles[i].Object.setScale(50, 50, 50);
    obstacles[i].largeur = 500;
    obstacles[i].longueur = 1200;

};
