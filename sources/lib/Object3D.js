var Object3D = function (mesh, material) {
    this.mesh = mesh;
    this.material = material;
    this.isVisible = true;
    this.isComputedVisible = true;
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.scale = vec3.create();
    this.worldMatrix = mat4.create();
    this.isMatrixDirty = true;
    this.setPosition(0, 0, 0);
    this.setRotation(0, 0, 0);
    this.setScale(1, 1, 1);
    this.parent = null;
    this.children = [];
    this.isAutoMoving = false;
};

Object3D.prototype.updateMatrix = function () {
    if (this.isMatrixDirty) {
        mat4.identity(this.worldMatrix);
        mat4.translate(this.worldMatrix, this.worldMatrix, this.position);
        mat4.rotateX(this.worldMatrix, this.worldMatrix, this.rotation[0]);
        mat4.rotateY(this.worldMatrix, this.worldMatrix, this.rotation[1]);
        mat4.rotateZ(this.worldMatrix, this.worldMatrix, this.rotation[2]);
        mat4.scale(this.worldMatrix, this.worldMatrix, this.scale);

        if(this.parent)
            mat4.multiply(this.worldMatrix, this.parent.worldMatrix, this.worldMatrix);

        _.each(this.children, function(child){
            child.isMatrixDirty = true;
            child.updateMatrix();
        }, this);
        this.isMatrixDirty = false;
    }
};

Object3D.prototype.removeChild = function(child) {
    var idx = this.children.find(child);
    if(idx > -1)
        this.children.splice(idx);
    child.parent = null;
    child.isMatrixDirty = true;
};

Object3D.prototype.addChild = function(child) {
    if(child.parent)
        child.parent.removeChild(child);
    child.parent = this;
    this.children.push(child);
    child.isMatrixDirty = true;
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

Object3D.prototype.moveTo = function (x, y, z, speed, onReached) {
    if(this.isAutoMoving)
        return;

    this.isAutoMoving = true;
    var cbk = null;
    var target = vec3.fromValues(x, y, z);
    var totalDistance = vec3.distance(target, this.position);
    var step = vec3.create();
    vec3.subtract(step, target, this.position);
    vec3.normalize(step, step);

    var advance = function (deltaTime) {
        if(deltaTime>100) deltaTime = 10;
        vec3.normalize(step, step);
        var scaledTime = deltaTime * speed * 0.001;
        step[0] *= scaledTime;
        step[1] *= scaledTime;
        step[2] *= scaledTime;

        vec3.add(this.position, this.position, step);
        this.isMatrixDirty = true;

        var remainingDistance = vec3.distance(target, this.position);
        if (remainingDistance < scaledTime || totalDistance < scaledTime) {
            this.isAutoMoving = false;
            if (onReached)
                onReached(this);
            Events.RemoveEventListener(Events.onRender, cbk);
        }
    };
    cbk = _.bind(advance, this);
    Events.AddEventListener(Events.onRender, cbk);
};

