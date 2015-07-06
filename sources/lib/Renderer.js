var Renderer = function (canvas, glParams) {
    this.keyboardManager = new KeyboardManager();
    this.mouseManager = new MouseManager();

    window.requestRender = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };

    this.gl = null;
    this.canvas = canvas;
    this.programs = {};
    this.viewport = {x: 0, y: 0, width: canvas.width, height: canvas.height};
    this.initialize(glParams);
    this.glDebugEnable = false;

    this.globalUniforms = {
        currentTime: 0,
        objectMatrix: null,
        viewMatrix: null,
        projectionMatrix: null,
        cameraPosition: null,
    };
    this.timer = Date.now();
    window.onresize = _.bind(this.resize, this);
    this.resize();
    this.loop();
};

Renderer.prototype.initialize = function (glParams) {
    try {
        this.gl = this.canvas.getContext("webgl", glParams);
        if (!this.gl)
            this.gl = this.canvas.getContext("experimental-webgl", glParams);
    }
    catch (e) {
        console.error("Could not initialise WebGL" + e);
        return;
    }
    this.gl.bindFramebuffer(GL.FRAMEBUFFER, null);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(GL.CULL_FACE);
    this.gl.cullFace(GL.BACK);

    this.gl.depthMask(true);
    this.gl.depthRange(0, 1);
    this.gl.enable(GL.DEPTH_TEST);
};

Renderer.prototype.resize = function () {
    this.canvas.width = this.viewport.width = window.innerWidth;
    this.canvas.height = this.viewport.height = window.innerHeight;
    Events.FireEvent(Events.onResize, { w: this.canvas.width, h: this.canvas.height });
};

Renderer.prototype.loop = function () {
    var now = Date.now();
    var deltaTime = now - this.timer;
    this.timer = now;
    this.keyboardManager.compute(deltaTime);
    this.globalUniforms.currentTime += deltaTime / 1000;
    Events.FireEvent(Events.onRender, deltaTime);
    requestRender(_.bind(this.loop, this));
};

Renderer.prototype.clear = function (rgba) {
    this.gl.depthMask(true);
    if (rgba != null)
        this.gl.clearColor(rgba.r, rgba.g, rgba.b, rgba.a);
    this.gl.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    if (rgba != null)
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
};

Renderer.prototype.setCamera = function (camera) {
    camera.updateMatrix();
    this.globalUniforms.viewMatrix = camera.worldMatrix;
    this.globalUniforms.projectionMatrix = camera.projectionMatrix;
    this.globalUniforms.cameraPosition = camera.position;
};

Renderer.prototype.setMaterial = function (material) {
    var program = material.program;
    this.gl.useProgram(program);

    _.each(material.uniforms, function (u, name) {
        var value = u.value;
        if (value == null && this.globalUniforms[name] != null)
            value = this.globalUniforms[name];
        if (null != value) {
            if (u.type == "float") {
                this.gl.uniform1f(u.location, value);
            } else if (u.type == "vec2") {
                this.gl.uniform2fv(u.location, value);
            } else if (u.type == "vec3") {
                this.gl.uniform3fv(u.location, value);
            } else if (u.type == "vec4") {
                this.gl.uniform4fv(u.location, value);
            } else if (u.type == "mat3") {
                this.gl.uniformMatrix3fv(u.location, false, value);
            } else if (u.type == "mat4") {
                this.gl.uniformMatrix4fv(u.location, false, value);
            } else if (u.type == "sampler2D") {
                this.gl.uniform1i(u.location, value);
                if (u.texture)
                    u.texture.activateOnSlot(u.value, this.gl);
                else {
                    this.gl.activeTexture(GL.TEXTURE0 + u.value);
                    this.gl.bindTexture(GL.TEXTURE_2D, null);
                }
            }
        } else
            console.warn("No value for uniform ", name);
    }, this);

    material.setStates(this.gl);
};

Renderer.prototype.releaseMesh = function (mesh) {
    if (!mesh.webglInitialized)
        return;

    if (mesh.positionBuffer)
        this.gl.deleteBuffer(mesh.positionBuffer);
    if (mesh.normalBuffer)
        this.gl.deleteBuffer(mesh.normalBuffer);
    if (mesh.colorBuffer)
        this.gl.deleteBuffer(mesh.colorBuffer);
    if (mesh.uvBuffer)
        this.gl.deleteBuffer(mesh.uvBuffer);

    mesh.webglInitialized = false;
};

Renderer.prototype.releaseTexture = function (texture) {
    if (texture.webglTexture) {
        this.gl.deleteTexture(texture.webglTexture);
        delete texture.webglTexture;
    }
};

Renderer.prototype.setRenderTarget = function (renderTarget) {
    if (renderTarget && !renderTarget.webglTexture)
        renderTarget.initialize(this.gl);

    var framebuffer = null;
    var width = this.viewport.width;
    var height = this.viewport.height;
    var x = this.viewport.x;
    var y = this.viewport.y;
    if (renderTarget) {
        framebuffer = renderTarget.webglFramebuffer;
        width = renderTarget.width;
        height = renderTarget.height;
    }
    this.gl.bindFramebuffer(GL.FRAMEBUFFER, framebuffer);
    this.gl.viewport(x, y, width, height);
};

Renderer.prototype.renderObject = function (object, material) {
    var mesh = object.mesh;
    var mat = material || object.material;
    if (mesh && !mesh.isLoading && mat.initialize(this)) {
        object.updateMatrix();
        this.globalUniforms.objectMatrix = object.worldMatrix;
        this.setMaterial(mat);

        if (!mesh.webglInitialized)
            mesh.initializeWebGL(this.gl);

        mesh.render(this.gl, mat);

        if (this.glDebugEnable) {
            var e = this.gl.getError();
            if (e != GL.NO_ERROR)
                console.error("ERROR", e, "drawing mesh", _.clone(mesh));
        }
    }
};
