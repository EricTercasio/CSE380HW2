'use strict'

class Texture {
    constructor() {}

    /**
     * Initializes the texture such that it can be rendered onto
     * a polygon using a GLSL shader. Note that before this object
     * can be consturcted the shader program must already have been
     * created on the GPU and must be passed to the constructor. Note
     * that this GLSLTexture can be shared among multiple things that
     * need to be rendered.
     * 
     * @param {WebGLGraphics} graphics The graphics manager, which has access to the browser's
     * WebGL library and this engine's shaders.
     * @param {GLSLShader} shader The GLSLShader used for rendering this texture.
     * @param {string} path Image path of the texture.
     * @param {function} callback Function called after the image loading completes.
     */
    init(graphics, path, textureId, callback) {
        // MAKE THE IMAGE
        var image = new Image();

        // ONCE WE START IMAGE LOADING, initTexture WILL GET CALLED
        var glslTexture = this;
        image.onload = function () { glslTexture.initTexture(graphics, textureId, image, callback); }

        // START IMAGE LOADING
        image.src = path;
    }

    initTexture(graphics, textureId, image, callback) {
        this.width = image.width;
        this.height = image.height;

        // CREATE A TEXTURE OBJECT
        var webGL = graphics.webGL;
        this.glslTexture = webGL.createTexture();
        this.glslTextureId = textureId;

        // FLIP THE IMAGE'S y-AXIS
        //webGL.pixelStorei(webGL.UNPACK_FLIP_Y_WEBGL, 1);

        // ACTIVATE THE WebGL TEXTURE ON THE GPU
        var textureNumName = "TEXTURE" + textureId;
        webGL.activeTexture(webGL[textureNumName]);

        // BIND THE TEXTURE TO A 2D TYPE
        webGL.bindTexture(webGL.TEXTURE_2D, this.glslTexture);

        // SPECIFY RENDERING SETTINGS
        webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER, webGL.LINEAR);

        // SET THE IMAGE FOR THE TEXTURE
        webGL.texImage2D(webGL.TEXTURE_2D, 0, webGL.RGBA, webGL.RGBA, webGL.UNSIGNED_BYTE, image);

        // KEEP IT FOR WHEN WE RENDER
        callback();
    }
}