var Camera = function (params) {
    this.fov = params.fov || Math.PI / 4;
    this.aspectRatio = params.aspectRatio || 1;
    this.near = params.near || 1;
    this.far = params.far || 10000;

    this.worldMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.viewProjMatrix = mat4.create();
    this.viewProjMatrixDirty = true;

    this.targetPosition = vec3.fromValues(params.target.x, params.target.y, params.target.z);
    this.up = vec3.fromValues(0, 1, 0);
    this.position = vec3.fromValues(params.pos.x, params.pos.y, params.pos.z);
    this.dirtyMatrix = true;

    Events.AddEventListener(Events.onResize, _.bind(this.resize, this));
};

Camera.prototype.resize = function (data) {
    this.aspectRatio = data.w / data.h;
    this.dirtyMatrix = true;
};

Camera.prototype.setPosition = function (x, y, z) {
    vec3.set(this.position, x, y, z);
    this.dirtyMatrix = true;
};

Camera.prototype.setTarget = function (x, y, z) {
    vec3.set(this.targetPosition, x, y, z);
    this.dirtyMatrix = true;
};

Camera.prototype.project = function(point3D)
{
    this.updateMatrix();
    if(this.viewProjMatrixDirty){
        mat4.multiply(this.viewProjMatrix, this.projectionMatrix, this.worldMatrix);
        this.viewProjMatrixDirty = false;
    }
    var pts4 = vec4.fromValues(point3D[0], point3D[1], point3D[2], 1.0);
    vec4.transformMat4(pts4, pts4, this.viewProjMatrix);
    pts4[0] /= pts4[3];
    pts4[1] /= pts4[3];
    pts4[2] /= pts4[3];
    return vec3.fromValues(pts4[0], pts4[1], pts4[2]);
};

Camera.prototype.updateMatrix = function () {
    if (this.dirtyMatrix) {
        mat4.identity(this.projectionMatrix);
        mat4.perspective(this.projectionMatrix, this.fov, this.aspectRatio, this.near, this.far);
        mat4.identity(this.worldMatrix);
        mat4.lookAt(this.worldMatrix, this.position, this.targetPosition, this.up);
        this.dirtyMatrix = false;
        this.viewProjMatrixDirty = true;
    }
};

Camera.prototype.bindCommands = function (keyboardManager) {
    this.moveSpeed = 2;
    keyboardManager.registerOnKey(KEY_LEFT, _.bind(this.moveLeft, this));
    keyboardManager.registerOnKey(KEY_RIGHT, _.bind(this.moveRight, this));
    keyboardManager.registerOnKey(KEY_UP, _.bind(this.moveForward, this));
    keyboardManager.registerOnKey(KEY_DOWN, _.bind(this.moveBackward, this));
    keyboardManager.registerOnKey(KEY_NUMPAD_PLUS, _.bind(this.zoomIn, this));
    keyboardManager.registerOnKey(KEY_NUMPAD_MINUS, _.bind(this.zoomOut, this));
    keyboardManager.registerOnKey(KEY_PAGE_UP, _.bind(this.moveUp, this));
    keyboardManager.registerOnKey(KEY_PAGE_DOWN, _.bind(this.moveDown, this));

    Events.AddEventListener(Events.mouseLeftDrag, _.bind(function (data) {
        this.moveLeft(data.delta.x * 2.0);
        this.moveForward(data.delta.y * 2.0);
    }, this));

    Events.AddEventListener(Events.mouseRightDrag, _.bind(function (data) {
        this.rotateOnY(data.delta.x * 2.0);
        this.rotateOnX(data.delta.y * 2.0);
    }, this));

    Events.AddEventListener(Events.mouseMiddleDrag, _.bind(function (data) {
        this.moveUp(data.delta.y * 2.0);
        this.moveLeft(data.delta.x * 2.0);
    }, this));

    Events.AddEventListener(Events.mouseWheel, _.bind(function (data) {
        this.zoomIn(data);
    }, this));
};

Camera.prototype.moveRight = function (delta) {
    var right = vec3.fromValues(this.worldMatrix[0], this.worldMatrix[4], this.worldMatrix[8]);
    right[0] *= delta * this.moveSpeed;
    right[2] *= delta * this.moveSpeed;
    vec3.add(this.targetPosition, this.targetPosition, right);
    vec3.add(this.position, this.position, right);
    this.dirtyMatrix = true;
};

Camera.prototype.moveLeft = function (delta) {
    this.moveRight(-delta);
};

Camera.prototype.moveForward = function (delta) {
    var at = vec3.fromValues(this.worldMatrix[2], 0 /*this.worldMatrix[6]*/, this.worldMatrix[10]);
    vec3.scale(at, at, -1 * delta * this.moveSpeed);
    vec3.add(this.targetPosition, this.targetPosition, at);
    vec3.add(this.position, this.position, at);
    this.dirtyMatrix = true;
};

Camera.prototype.moveBackward = function (delta) {
    this.moveForward(-delta);
};

Camera.prototype.zoomIn = function (delta) {
    var at = vec3.fromValues(this.worldMatrix[2], this.worldMatrix[6], this.worldMatrix[10]);
    vec3.scale(at, at, -1 * delta * this.moveSpeed);

    if (delta < 0 || vec3.distance(this.position, this.targetPosition) > vec3.length(at)) {
        vec3.add(this.position, this.position, at);
        this.dirtyMatrix = true;
    }
};

Camera.prototype.zoomOut = function (delta) {
    this.zoomIn(-delta);
};

Camera.prototype.moveUp = function (delta) {
    this.position[1] += delta * this.moveSpeed;
    this.targetPosition[1] += delta * this.moveSpeed;
    this.dirtyMatrix = true;
};
Camera.prototype.moveDown = function (delta) {
    this.moveUp(-delta);
};

Camera.prototype.rotateOnY = function (delta) {

    var angle = delta * 0.001;
    var camToTarget = vec3.create();
    vec3.sub(camToTarget, this.position, this.targetPosition);
    var distance = vec3.length(camToTarget);
    vec3.normalize(camToTarget, camToTarget);

    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var x = c * camToTarget[0] - s * camToTarget[2];
    var z = s * camToTarget[0] + c * camToTarget[2];

    this.position[0] = this.targetPosition[0] + x * distance;
    this.position[2] = this.targetPosition[2] + z * distance;
    this.dirtyMatrix = true;
};

Camera.prototype.rotateOnX = function (delta) {
    var angle = delta * 0.001;
    var camToTarget = vec3.create();
    vec3.sub(camToTarget, this.position, this.targetPosition);
    var distance = vec3.length(camToTarget);
    vec3.normalize(camToTarget, camToTarget);
    camToTarget[1] += Math.sin(angle);
    vec3.normalize(camToTarget, camToTarget);

    vec3.scaleAndAdd(this.position, this.targetPosition, camToTarget, distance);
    this.dirtyMatrix = true;
};
