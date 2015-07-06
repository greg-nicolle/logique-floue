var Material = function (name, vShaderUrl, fShaderUrl, onLoaded) {
    this.name = name;
    this.program = null;

    this.vertexCode = null;
    this.fragmentCode = null;
    this.uniforms = {};
    this.attributes = {};

    this.zTest = true;
    this.zWrite = true;
    this.doubleSided = false;
    this.srcBlend = GL.SRC_ALPHA;
    this.dstBlend = GL.ONE_MINUS_SRC_ALPHA;
    this.blendEquation = false;

    this.onLoaded = onLoaded;
    this.isLoading = true;

    new FileLoader(vShaderUrl, _.bind(this.onVertexCodeLoaded, this));
    new FileLoader(fShaderUrl, _.bind(this.onFragmentCodeLoaded, this));
};

Material.prototype.onVertexCodeLoaded = function (code) {
    this.readShaderInput(code);
    this.vertexCode = code;
    if (this.fragmentCode)
        delete this.isLoading;
};

Material.prototype.onFragmentCodeLoaded = function (code) {
    this.readShaderInput(code);
    this.fragmentCode = code;
    if (this.vertexCode)
        delete this.isLoading;
};

Material.prototype.readShaderInput = function (code) {
    var lines = code.split("\n");
    var uniform_pattern = /uniform\s([\w]*)\s([\w]*)/; // "uniform"_"type"_"name"
    var attribute_pattern = /attribute\s([\w]*)\s([\w]*)/; // "attribute"_"type"_"name"

    var samplerIndex = 0;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[ i ];
        line = line.trim();
        var result = attribute_pattern.exec(line);
        if (result)
            this.attributes[result[2]] = {type: result[1], value: null, location: null};
        else {
            result = uniform_pattern.exec(line);
            if (result) {
                var uniform = {type: result[1], value: null, location: null};
                this.uniforms[result[2]] = uniform;
                if (uniform.type == "sampler2D") {
                    uniform.value = samplerIndex;
                    uniform.texture = null;
                    samplerIndex++;
                }
            }
        }
    }
};

Material.prototype.buildShader = function (gl, code, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    var shaderInfo = gl.getShaderInfoLog(shader);
    if (shaderInfo) {
        window.alert("buildShader error:" + this.name + "\n" + shaderInfo);
        return null;
    }
    return shader;
};

Material.prototype.initialize = function (renderer) {
    if (this.program)
        return true;

    if (this.isLoading)
        return false;

    var gl = renderer.gl;
    var program = renderer.programs[this.name];
    if (!program) {
        var fragmentShader = this.buildShader(gl, this.fragmentCode, GL.FRAGMENT_SHADER);
        var vertexShader = this.buildShader(gl, this.vertexCode, GL.VERTEX_SHADER);

        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        var programLog = gl.getProgramInfoLog(program);
        if (programLog)
            window.alert("linProgram error:" + this.name + "\n" + programLog);

        renderer.programs[this.name] = program;
    }

    _.each(this.attributes, function (a, name) {
        a.location = gl.getAttribLocation(program, name);
    });

    _.each(this.uniforms, function (u, name) {
        u.location = gl.getUniformLocation(program, name);
    });

    this.program = program;
    if (this.onLoaded)
        this.onLoaded(this);
    return true;
};

Material.prototype.setStates = function (gl) {
    if (this.doubleSided)
        gl.disable(GL.CULL_FACE);
    else
        gl.enable(GL.CULL_FACE);

    gl.depthMask(this.zWrite);
    if (this.zTest)
        gl.enable(GL.DEPTH_TEST);
    else
        gl.disable(GL.DEPTH_TEST);

    if (this.blendEquation === false)
        gl.disable(GL.BLEND);
    else {
        gl.enable(GL.BLEND);
        gl.blendEquation(this.blendEquation);
        gl.blendFunc(this.srcBlend, this.dstBlend);
    }
};
