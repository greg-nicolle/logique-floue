var RenderTarget = function (width, height, withDepth, withStencil) {
    Texture.apply(this);
    this.hasDepthBuffer = false;
    this.width = width;
    this.height = height;
    this.withDepth = withDepth;
    this.withStencil = withStencil;

    this.format = GL.RGBA;
};

RenderTarget.prototype = new Texture();

RenderTarget.prototype.initialize = function (gl) {
    this.webglTexture = gl.createTexture();
    this.webglFramebuffer = gl.createFramebuffer();

    gl.bindTexture(GL.TEXTURE_2D, this.webglTexture);
    gl.texImage2D(GL.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, GL.UNSIGNED_BYTE, null);

    gl.bindFramebuffer(GL.FRAMEBUFFER, this.webglFramebuffer);
    gl.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.webglTexture, 0);

    if (this.withDepth) {
        this.webglRenderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(GL.RENDERBUFFER, this.webglRenderbuffer);
        if (this.withStencil) {
            gl.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_STENCIL, this.width, this.height);
            gl.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_STENCIL_ATTACHMENT, GL.RENDERBUFFER, this.webglRenderbuffer);
        } else {
            gl.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, this.width, this.height);
            gl.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.webglRenderbuffer);
        }
    }
    gl.bindTexture(GL.TEXTURE_2D, null);
    gl.bindRenderbuffer(GL.RENDERBUFFER, null);
    gl.bindFramebuffer(GL.FRAMEBUFFER, null);
};

RenderTarget.prototype.resize = function (gl, width, height) {
    this.width = width;
    this.height = height;

    gl.deleteTexture(this.webglTexture);
    this.webglTexture = null;
    gl.deleteFramebuffer(this.webglFramebuffer);
    this.webglFramebuffer = null;
    gl.deleteRenderbuffer(this.webglRenderbuffer);
    this.webglRenderbuffe = null;
};
