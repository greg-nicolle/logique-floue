var Texture = function (url, loadedCbk) {
    if (url) {
        this.url = url;
        this.image = new Image();
        this.image.onload = _.bind(this.onLoaded, this, loadedCbk);
        this.image.src = this.url;
    }
    this.magFilter = GL.LINEAR;
    this.minFilter = GL.LINEAR;
    this.wrapping = GL.CLAMP_TO_EDGE;

    this.isPow2 = false;
};

Texture.prototype.onLoaded = function (loadedCbk) {
    this.needWebGLUpdate = true;

    function isPow2(size) {
        return (size & (size - 1)) == 0;
    }
    this.isPow2 = isPow2(this.image.width) && isPow2(this.image.height);

    if (loadedCbk)
        loadedCbk(this);
};

Texture.prototype.activateOnSlot = function (slotIndex, gl) {
    if (this.needWebGLUpdate) {
        this.webglTexture = gl.createTexture();
        gl.activeTexture(GL.TEXTURE0 + slotIndex);
        gl.bindTexture(GL.TEXTURE_2D, this.webglTexture);

        gl.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, 1);
        gl.pixelStorei(GL.UNPACK_ALIGNMENT, 4);
        gl.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, this.image);

        gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, this.magFilter);
        gl.generateMipmap(GL.TEXTURE_2D);

        this.needWebGLUpdate = false;
    } else {
        gl.activeTexture(GL.TEXTURE0 + slotIndex);
        gl.bindTexture(GL.TEXTURE_2D, this.webglTexture);
    }

    if (this.webglTexture) {
        gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, this.magFilter);

        gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, this.wrapping);
        gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, this.wrapping);
    }
};