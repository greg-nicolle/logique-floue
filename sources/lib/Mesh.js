var Mesh = function (name) {
    this.name = name || "Generated Mesh";
    this._positions = [];
    this._normals = [];
    this._colors = [];
    this._uvs = [];

    this.primitiveType = GL.TRIANGLES;
};

Mesh.prototype.pointsCount = function () {
    return this._positions.length / 3;
};

Mesh.prototype.initializeWebGL = function (gl) {
    var drawType = GL.STATIC_DRAW;

    if (this._positions.length > 0) {
        this.__positionBuffer = gl.createBuffer();
        gl.bindBuffer(GL.ARRAY_BUFFER, this.__positionBuffer);
        gl.bufferData(GL.ARRAY_BUFFER, new Float32Array(this._positions), drawType);
    }
    if (this._normals.length > 0) {
        this.__normalBuffer = gl.createBuffer();
        gl.bindBuffer(GL.ARRAY_BUFFER, this.__normalBuffer);
        gl.bufferData(GL.ARRAY_BUFFER, new Float32Array(this._normals), drawType);
    }
    if (this._colors.length > 0) {
        this.__colorBuffer = gl.createBuffer();
        gl.bindBuffer(GL.ARRAY_BUFFER, this.__colorBuffer);
        gl.bufferData(GL.ARRAY_BUFFER, new Float32Array(this._colors), drawType);
    }
    if (this._uvs.length > 0) {
        this.__uvBuffer = gl.createBuffer();
        gl.bindBuffer(GL.ARRAY_BUFFER, this.__uvBuffer);
        gl.bufferData(GL.ARRAY_BUFFER, new Float32Array(this._uvs), drawType);
    }
    this.webglInitialized = true;
};

Mesh.prototype.render = function (gl, material) {
    // render
    var location = material.attributes["position"] && material.attributes["position"].location;
    if (this.__positionBuffer && location >= 0) {
        gl.bindBuffer(GL.ARRAY_BUFFER, this.__positionBuffer);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 3, GL.FLOAT, false, 0, 0);
    }

    location = material.attributes["normal"] && material.attributes["normal"].location;
    if (this.__normalBuffer && location >= 0) {
        gl.bindBuffer(GL.ARRAY_BUFFER, this.__normalBuffer);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 3, GL.FLOAT, false, 0, 0);
    }

    location = material.attributes["color"] && material.attributes["color"].location;
    if (this.__colorBuffer && location >= 0) {
        gl.bindBuffer(GL.ARRAY_BUFFER, this.__colorBuffer);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 4, GL.FLOAT, false, 0, 0);
    }

    location = material.attributes["uv"] && material.attributes["uv"].location;
    if (this.__uvBuffer && location >= 0) {
        gl.bindBuffer(GL.ARRAY_BUFFER, this.__uvBuffer);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 2, GL.FLOAT, false, 0, 0);
    }
    gl.drawArrays(this.primitiveType, 0, this.pointsCount());
};

Mesh.prototype.loadFromObjFile = function (url, callback) {
    this.name = url;
    this.isLoading = true;
    this.onloadedCbk = callback;
    new FileLoader(url, _.bind(this.onLoaded, this));
};

Mesh.prototype.onLoaded = function (data) {
    data = data.replace(/\ \\\r\n/g, ''); // trick : rhino adds ' \\r\n' some times.
    // v float float float
    var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/;
    // vn float float float
    var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/;
    // vt float float
    var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/;
    // f vertex vertex vertex ...
    var face_pattern1 = /f( +[\d]+)( [\d]+)( [\d]+)( [\d]+)?/;
    // f vertex/uv vertex/uv vertex/uv ...
    var face_pattern2 = /f( +([\d]+)\/([\d]+))( ([\d]+)\/([\d]+))( ([\d]+)\/([\d]+))( ([\d]+)\/([\d]+))?/;
    // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
    var face_pattern3 = /f( +([\d]+)\/([\d]+)\/([\d]+))( ([\d]+)\/([\d]+)\/([\d]+))( ([\d]+)\/([\d]+)\/([\d]+))( ([\d]+)\/([\d]+)\/([\d]+))?/;
    // f vertex//normal vertex//normal vertex//normal ...
    var face_pattern4 = /f( +([\d]+)\/\/([\d]+))( ([\d]+)\/\/([\d]+))( ([\d]+)\/\/([\d]+))( ([\d]+)\/\/([\d]+))?/;

    var lines = data.split("\n");

    var positions = [];
    var normals = [];
    var uvs = [];
    var posIndexes = [];
    var normalsIndexes = [];
    var uvsIndexes = [];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[ i ];
        line = line.trim();
        var result;
        if (line.length === 0 || line.charAt(0) === '#') {
            //nothing to do
        } else if (( result = vertex_pattern.exec(line) ) !== null) {
            // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
            positions.push(vec3.fromValues(parseFloat(result[ 1 ]), parseFloat(result[ 2 ]), parseFloat(result[ 3 ])));
        } else if (( result = normal_pattern.exec(line) ) !== null) {
            // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
            normals.push(vec3.fromValues(parseFloat(result[ 1 ]), parseFloat(result[ 2 ]), parseFloat(result[ 3 ])));
        } else if (( result = uv_pattern.exec(line) ) !== null) {
            // ["vt 0.1 0.2", "0.1", "0.2"]
            uvs.push(vec2.fromValues(parseFloat(result[ 1 ]), parseFloat(result[ 2 ])));
        } else if (( result = face_pattern1.exec(line) ) !== null) {
            // ["f 1 2 3", "1", "2", "3", undefined]
            if (result[ 4 ] === undefined) {
                // triangle
                posIndexes.push(parseInt(result[ 1 ]) - 1, parseInt(result[ 2 ]) - 1, parseInt(result[ 3 ]) - 1);
            } else {
                // quad todo : check index order
                posIndexes.push(parseInt(result[ 1 ]) - 1, parseInt(result[ 2 ]) - 1, parseInt(result[ 3 ]) - 1);
                posIndexes.push(parseInt(result[ 1 ]) - 1, parseInt(result[ 3 ]) - 1, parseInt(result[ 4 ]) - 1);
            }
        } else if (( result = face_pattern2.exec(line) ) !== null) {
            // ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

            if (result[ 10 ] === undefined) {
                // triangle
                posIndexes.push(parseInt(result[ 2 ]) - 1, parseInt(result[ 5 ]) - 1, parseInt(result[ 8 ]) - 1);
                uvsIndexes.push(parseInt(result[ 3 ]) - 1, parseInt(result[ 6 ]) - 1, parseInt(result[ 9 ]) - 1);
            } else {
                // quad todo : check index order
                posIndexes.push(parseInt(result[ 2 ]) - 1, parseInt(result[ 5 ]) - 1, parseInt(result[ 8 ]) - 1);
                posIndexes.push(parseInt(result[ 2 ]) - 1, parseInt(result[ 8 ]) - 1, parseInt(result[ 11 ]) - 1);
                uvsIndexes.push(parseInt(result[ 3 ]) - 1, parseInt(result[ 6 ]) - 1, parseInt(result[ 9 ]) - 1);
                uvsIndexes.push(parseInt(result[ 3 ]) - 1, parseInt(result[ 9 ]) - 1, parseInt(result[ 12 ]) - 1);
            }
        } else if (( result = face_pattern3.exec(line) ) !== null) {
            // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]
            if (result[ 13 ] === undefined) {
                // triangle
                posIndexes.push(parseInt(result[ 2 ]) - 1, parseInt(result[ 6 ]) - 1, parseInt(result[ 10 ]) - 1);
                uvsIndexes.push(parseInt(result[ 3 ]) - 1, parseInt(result[ 7 ]) - 1, parseInt(result[ 11 ]) - 1);
                normalsIndexes.push(parseInt(result[ 4 ]) - 1, parseInt(result[ 8 ]) - 1, parseInt(result[ 12 ]) - 1);

            } else {
                // quad todo : check index order
                posIndexes.push(parseInt(result[ 2 ]) - 1, parseInt(result[ 6 ]) - 1, parseInt(result[ 10 ]) - 1, parseInt(result[ 14 ]) - 1);
                uvsIndexes.push(parseInt(result[ 3 ]) - 1, parseInt(result[ 7 ]) - 1, parseInt(result[ 11 ]) - 1, parseInt(result[ 15 ]) - 1);
                normalsIndexes.push(parseInt(result[ 4 ]) - 1, parseInt(result[ 8 ]) - 1, parseInt(result[ 12 ]) - 1, parseInt(result[ 16 ]) - 1);
            }
        } else if (( result = face_pattern4.exec(line) ) !== null) {
            // ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]
            if (result[ 10 ] === undefined) {
                // triangle
                posIndexes.push(parseInt(result[ 2 ]) - 1, parseInt(result[ 5 ]) - 1, parseInt(result[ 8 ]) - 1);
                normalsIndexes.push(parseInt(result[ 3 ]) - 1, parseInt(result[ 6 ]) - 1, parseInt(result[ 9 ]) - 1);
            } else {
                // quad todo : check index order
                posIndexes.push(parseInt(result[ 2 ]) - 1, parseInt(result[ 5 ]) - 1, parseInt(result[ 8 ]) - 1);
                posIndexes.push(parseInt(result[ 2 ]) - 1, parseInt(result[ 8 ]) - 1, parseInt(result[ 11 ]) - 1);
                normalsIndexes.push(parseInt(result[ 3 ]) - 1, parseInt(result[ 6 ]) - 1, parseInt(result[ 9 ]) - 1);
                normalsIndexes.push(parseInt(result[ 3 ]) - 1, parseInt(result[ 9 ]) - 1, parseInt(result[ 12 ]) - 1);
            }
        } else {
            // unused
        }
    }

    var hasNormal = normalsIndexes.length > 0;
    var hasUv = uvsIndexes.length > 0;
    var pos, uv, normal;
    for (var idx = 0; idx < posIndexes.length; ++idx) {
        pos = positions[posIndexes[idx]];
        this._positions.push(pos[0], pos[1], pos[2]);
        this._colors.push(1, 1, 1, 1);
        if (hasNormal) {
            normal = normals[normalsIndexes[idx]];
            this._normals.push(normal[0], normal[1], normal[2]);
        }
        if (hasUv) {
            uv = uvs[uvsIndexes[idx]];
            this._uvs.push(uv[0], uv[1]);
        }
    }
    delete this.isLoading;
    if(this.onloadedCbk){
        this.onloadedCbk(this);
        delete this.onloadedCbk;
    }
};

