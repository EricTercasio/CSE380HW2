'use strict'

class GraphicsComponent {
    constructor() { }

    init(renderingCanvasId, textCanvasId, math) {
        // FIRST SETUP webGL
        this.renderingCanvas = document.getElementById(renderingCanvasId);
        if (this.renderingCanvas.width <= 0) {
            this.renderingCanvas.width = window.innerWidth;
            this.renderingCanvas.height = window.innerHeight;
        }
        this.canvasWidth = this.renderingCanvas.width;
        this.canvasHeight = this.renderingCanvas.height;
        this.webGL = this.renderingCanvas.getContext("webgl");

        // IF THE USER'S MACHINE/BROWSER DOESN'T SUPPORT
        // WebGL THEN THERE'S NO POINT OF GOING ON
        if (!this.webGL) {
            // PROVIDE SOME FEEDBACK THAT WebGL WON'T WORK BECAUSE
            // THE USER'S' GRAPHICS CARD IS FOR THE BIRDS
            console.error("WebGL is not supported by this device");

            // AND END INITIALIZATION
            return;
        }
        else {
            this.webGL = WebGLDebugUtils.makeDebugContext(this.webGL, undefined, this.logGLCall);
            console.log(this.webGL.getParameter(this.webGL.VERSION));
            console.log(this.webGL.getParameter(this.webGL.SHADING_LANGUAGE_VERSION));
            console.log(this.webGL.getParameter(this.webGL.VENDOR));
        }

        // WebGL IS SUPPORTED, SO INIT EVERYTHING THAT USES IT

        // MAKE THE CLEAR COLOR BLACK
        this.setClearColor(0.0, 0.0, 0.0, 1.0);

        // ENABLE DEPTH TESTING
        this.webGL.disable(this.webGL.DEPTH_TEST);
        this.webGL.enable(this.webGL.BLEND);
        this.webGL.blendFunc(this.webGL.SRC_ALPHA, this.webGL.ONE_MINUS_SRC_ALPHA);

        // TURN ON BACKFACE CULLING
        this.webGL.enable(this.webGL.CULL_FACE);

        // THIS SPECIFIES THAT WE'RE USING THE ENTIRE CANVAS
        this.webGL.viewport(0, 0, this.canvasWidth, this.canvasHeight);

        // NOW MAKE THE SHADER FOR DRAWING THIS THING
        this.spriteRenderer = new SpriteRenderer();
        this.spriteRenderer.init(this, math);
        
        // THIS WILL STORE OUR TEXT
        this.textRenderer = new TextRenderer(textCanvasId, "serif", "18", "#FFFF00");

        // WE'LL USE THIS TO RENDER OUR SPRITES EACH FRAME
        this.renderList = new Array();
    }

    loadTextures(scene, texturePaths, callback) {
        // THEN LOAD THE TEXTURES WE'LL BE USING
        this.numTexturesToLoad = texturePaths.length;
        this.numTexturesLoaded = 0;
        var graphics = this;
        for (var i = 0; i < this.numTexturesToLoad; i++) {
            var textureToLoad = new Texture();
            textureToLoad.init(graphics, texturePaths[i], i, function () { graphics.completeLoadingTextures(callback); });
            scene.addTexture(texturePaths[i], textureToLoad);
        }
    }

    completeLoadingTextures(callback) {
        this.numTexturesLoaded++;
        if (this.numTexturesLoaded === this.numTexturesToLoad) {
            callback();
        }
    }

    setClearColor(r, g, b, a) {
        this.webGL.clearColor(r, g, b, a);
    }

    logGLCall(functionName, args) {
//        console.log("webGL." + functionName + "(" +
//            WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
    }

    renderScene(scene) {
        // CLEAR THE CANVAS
        this.webGL.clear(this.webGL.COLOR_BUFFER_BIT | this.webGL.DEPTH_BUFFER_BIT);

        // FIRST CLEAR THE RENDER LIST
        this.renderList.length = 0;

        // NOW ASK THE SCENE FOR ALL THE SPRITES TO RENDER
        scene.fillRenderList(this.renderList);

        // CHOOSE THE SHADER PROGRAM`
        this.webGL.useProgram(this.spriteRenderer.shader.program);

        // AND NOW RENDER ONLY THE MODELS THAT WERE IN THE FRUSTUM
        for (var i = 0; i < this.renderList.length; i++) {
            // NOTE THAT IT MIGHT BE A GOOD IDEA TO SORT THESE BACK TO FRONT,
            // BUT WE'LL JUST DEPTH BUFFER TEST THEM AND HOPE FOR THE BEST
            var sprite = this.renderList[i];
            this.spriteRenderer.render(this, sprite);
        }

        // RENDER THE ANIMATED SPRITES
        for (var i = 0; i < scene.animatedSprites.length; i++) {
            var animatedSprite = scene.animatedSprites[i];
            this.spriteRenderer.renderAnimatedSprite(this, animatedSprite);
        }

        // RENDER THE TEXT
        this.textRenderer.render();
    }
}