var Object3D = function (mesh, material) {
    this.mesh = mesh;
    this.material = material;
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.scale = vec3.create();
    this.worldMatrix = mat4.create();
    this.isMatrixDirty = true;
    this.setPosition(0, 0, 0);
    this.setRotation(0, 0, 0);
    this.setScale(1, 1, 1);
};

Object3D.prototype.updateMatrix = function () {
    if (this.isMatrixDirty) {
        mat4.identity(this.worldMatrix);
        mat4.translate(this.worldMatrix, this.worldMatrix, this.position);
        mat4.rotateX(this.worldMatrix, this.worldMatrix, this.rotation[0]);
        mat4.rotateY(this.worldMatrix, this.worldMatrix, this.rotation[1]);
        mat4.rotateZ(this.worldMatrix, this.worldMatrix, this.rotation[2]);
        mat4.scale(this.worldMatrix, this.worldMatrix, this.scale);
        this.isMatrixDirty = false;
    }
};

Object3D.prototype.setPosition = function (x, y, z) {
    vec3.set(this.position, x, y, z);
    this.isMatrixDirty = true;
};

Object3D.prototype.setRotation = function (x, y, z) {
    vec3.set(this.rotation, x, y, z);
    this.isMatrixDirty = true;
};

Object3D.prototype.setScale = function (x, y, z) {
    vec3.set(this.scale, x, y, z);
    this.isMatrixDirty = true;
};

