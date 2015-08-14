var Sensor  = function (longueur,largeur,rotation){
    this.Mesh = new Mesh("capteur");
    this.Mesh.loadFromObjFile("data/cone.obj");
    this.Mat = new Material("capteur", "data/shader/default.vShader", "data/shader/default.fShader",
        function (mat) {
          var texture = new Texture("data/grass_diffuse.png");
          texture.minFilter = GL.LINEAR_MIPMAP_LINEAR;
          mat.uniforms["texture0"].texture = texture;
        });
    this.Mat.blendEquation = GL.FUNC_ADD;
    this.Mat.dstBlend = GL.ZERO;
    this.Mat.srcBlend = GL.ONE;

    this.appartenance = {};
    this.appartenance.e1 = 0;
    this.appartenance.e2 = 0;
    this.appartenance.e3 = 0;

    this.Object = new Object3D(this.Mesh, this.Mat);
    this.Object.setScale(10, 10, 10);

    this.xOffset = longueur;
    this.yOffset = largeur;
    this.rotation = rotation;
};