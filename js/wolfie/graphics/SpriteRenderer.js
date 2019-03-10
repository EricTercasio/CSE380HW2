'use strict'

var SpriteDefaults = {
    A_POSITION: "a_Position",
    A_TEX_COORD: "a_TexCoord",
    U_SPRITE_TRANSFORM: "u_SpriteTransform",
    U_TEX_COORD_FACTOR: "u_TexCoordFactor",
    U_TEX_COORD_SHIFT: "u_TexCoordShift",
    U_SAMPLER: "u_Sampler",
    NUM_VERTICES: 4,
    FLOATS_PER_VERTEX: 2,
    FLOATS_PER_TEXTURE_COORDINATE: 2,
    TOTAL_BYTES: 16,
    VERTEX_POSITION_OFFSET: 0,
    TEXTURE_COORDINATE_OFFSET: 8,
    INDEX_OF_FIRST_VERTEX: 0
};
// https://stackoverflow.com/questions/27771902/opengl-changing-texture-coordinates-on-the-fly
//
// TO FIX THIS, FIRST< NOTE THAT THERE WILL NEED TO BE A SET OF ATTRIBUTES FOR EACH
// CELL IF WE CONTINUE TO RENDERING IT THE WAY WE CURRENTLY ARE, BUT A BETTER WAY
// WOULD BE TO SEND IN A SCALING FACTOR IN THE spriteTransform TO SCALE THE RECTANGLE
// AND THEN SEND A TEXTURE COORDINATE SHIFT PER THE SHADER EXAMPLE ABOVE IN ORDER
// TO EXTRACT DIFFERENT PARTS OF THE SHADER


// ALSO**** 
// PUT NOTICABLE MARKS ON THE SPRITES SO THAT WE KNOW WHICH END IS UP/DOWN AND LEFT/RIGHT

class SpriteRenderer {
    constructor() {}
    
    init(graphics, math) {
        var webGL = graphics.webGL;
        this.shader = new Shader();
        var vertexShaderSource =
            'uniform mat4 ' + SpriteDefaults.U_SPRITE_TRANSFORM + ';\n' +
            'uniform vec2 ' + SpriteDefaults.U_TEX_COORD_FACTOR + ';\n' +
            'uniform vec2 ' + SpriteDefaults.U_TEX_COORD_SHIFT + ';\n' +
            'attribute vec4 ' + SpriteDefaults.A_POSITION + ';\n' +
            'attribute vec2 ' + SpriteDefaults.A_TEX_COORD + ';\n' +
            'varying vec2 v_TexCoord;\n' +
            'void main() {\n' +
            '  gl_Position = ' + SpriteDefaults.U_SPRITE_TRANSFORM + ' * ' + SpriteDefaults.A_POSITION + ';\n' +
            '  vec2 tempTexCoord = ' + SpriteDefaults.A_TEX_COORD + ' * ' + SpriteDefaults.U_TEX_COORD_FACTOR + ';\n' +
            '  v_TexCoord = tempTexCoord + ' + SpriteDefaults.U_TEX_COORD_SHIFT + ';\n' +
            '}\n';
        var fragmentShaderSource =
            '#ifdef GL_ES\n' +
            'precision mediump float;\n' +
            '#endif\n' +
            'uniform sampler2D ' + SpriteDefaults.U_SAMPLER + ';\n' +
            'varying vec2 v_TexCoord;\n' +
            'void main() {\n' +
            '  gl_FragColor = texture2D(' + SpriteDefaults.U_SAMPLER + ', v_TexCoord);\n' +
            '}\n';
        this.shader.init(webGL, vertexShaderSource, fragmentShaderSource);

        // GET THE webGL OBJECT TO USE
        var verticesTexCoords = new Float32Array([
            -0.5,  0.5, 0.0, 0.0,
            -0.5, -0.5, 0.0, 1.0,
             0.5,  0.5, 1.0, 0.0,
             0.5, -0.5, 1.0, 1.0
        ]);

        // CREATE THE BUFFER ON THE GPU
        this.vertexTexCoordBuffer = webGL.createBuffer();

        // BIND THE BUFFER TO BE VERTEX DATA
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexTexCoordBuffer);

        // AND SEND THE DATA TO THE BUFFER WE CREATED ON THE GPU
        webGL.bufferData(webGL.ARRAY_BUFFER, verticesTexCoords, webGL.STATIC_DRAW);

        // SETUP THE SHADER ATTRIBUTES AND UNIFORMS
        this.locations = new Array();
        this.loadLocations(webGL, [SpriteDefaults.A_POSITION, SpriteDefaults.A_TEX_COORD], "Attrib");
        this.loadLocations(webGL, [SpriteDefaults.U_SPRITE_TRANSFORM, SpriteDefaults.U_SAMPLER, SpriteDefaults.U_TEX_COORD_FACTOR, SpriteDefaults.U_TEX_COORD_SHIFT], "Uniform");

        // WE'LL USE THESE FOR TRANSOFMRING OBJECTS WHEN WE DRAW THEM
        this.spriteTransform = math.createMatrix(4, 4);
        this.spriteTranslate = math.createPositionVector();
        this.spriteRotate = math.createRotationVector();
        this.spriteScale = math.createPositionVector();
    }

    loadLocations(webGL, locationNames, type) {
        for (var i = 0; i < locationNames.length; i++) {
            var locationName = locationNames[i];
            var getFunctionName = "get" + type + "Location";
            var getFunction = webGL[getFunctionName];
            var location = getFunction(this.shader.program, locationName);
            this.locations[locationName] = location;
        }
    }

    renderAnimatedSprite(graphics, sprite) {
        var webGL = graphics.webGL;
        var canvasWidth = graphics.canvasWidth;
        var canvasHeight = graphics.canvasHeight;
        var spriteType = sprite.spriteType;
        var texture = spriteType.spriteSheetTexture;

        // CALCULATE HOW MUCH TO TRANSLATE THE QUAD PER THE SPRITE POSITION
        var spriteWidth = spriteType.spriteWidth;
        var spriteHeight = spriteType.spriteHeight;
        var spriteXInPixels = sprite.position.getX() + (spriteWidth/2);
        var spriteYInPixels = sprite.position.getY() + (spriteHeight/2);
        var spriteXTranslate = (spriteXInPixels - (canvasWidth/2))/(canvasWidth/2);
        var spriteYTranslate = (spriteYInPixels - (canvasHeight/2))/(canvasHeight/2);
        this.spriteTranslate.setX(spriteXTranslate);
        this.spriteTranslate.setY(-spriteYTranslate);

        // CALCULATE HOW MUCH TO SCALE THE QUAD PER THE SPRITE SIZE
        var defaultWidth = canvasWidth/2;
        var defaultHeight = canvasHeight/2;
        var scaleX = spriteWidth/defaultWidth;
        var scaleY = spriteHeight/defaultHeight;
        this.spriteScale.setX(scaleX);
        this.spriteScale.setY(scaleY);

        // @todo - COMBINE THIS WITH THE ROTATE AND SCALE VALUES FROM THE SPRITE
        var math = window.wolfie.math;
        math.identity(this.spriteTransform);
        math.model(this.spriteTransform, this.spriteTranslate, this.spriteRotate, this.spriteScale);
        
        // FIGURE OUT THE TEXTURE COORDINATE FACTOR AND SHIFT
        var texCoordFactorX = spriteWidth/texture.width;
        var texCoordFactorY = spriteHeight/texture.height;
        var spriteLeft = sprite.getLeft();
        var spriteTop = sprite.getTop();
        var texCoordShiftX = spriteLeft/texture.width;
        var texCoordShiftY = spriteTop/texture.height;        

        // USE THE ATTRIBUTES
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexTexCoordBuffer);
        webGL.bindTexture(webGL.TEXTURE_2D, texture.glslTexture);

        // HOOK UP THE ATTRIBUTES
        var a_PositionLocation = this.locations[SpriteDefaults.A_POSITION];
        webGL.vertexAttribPointer(a_PositionLocation, SpriteDefaults.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, SpriteDefaults.TOTAL_BYTES, SpriteDefaults.VERTEX_POSITION_OFFSET);
        webGL.enableVertexAttribArray(a_PositionLocation);
        var a_TexCoordLocation = this.locations[SpriteDefaults.A_TEX_COORD];
        webGL.vertexAttribPointer(a_TexCoordLocation, SpriteDefaults.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, SpriteDefaults.TOTAL_BYTES, SpriteDefaults.TEXTURE_COORDINATE_OFFSET);
        webGL.enableVertexAttribArray(a_TexCoordLocation);

        // USE THE UNIFORMS
        var u_SpriteTransformLocation = this.locations[SpriteDefaults.U_SPRITE_TRANSFORM];
        webGL.uniformMatrix4fv(u_SpriteTransformLocation, false, this.spriteTransform);
        var u_SamplerLocation = this.locations[SpriteDefaults.U_SAMPLER];
        webGL.uniform1i(u_SamplerLocation, texture.glslTextureId);
        var u_TexCoordFactorLocation = this.locations[SpriteDefaults.U_TEX_COORD_FACTOR];
        webGL.uniform2f(u_TexCoordFactorLocation, texCoordFactorX, texCoordFactorY);
        var u_TexCoordShiftLocation = this.locations[SpriteDefaults.U_TEX_COORD_SHIFT];
        webGL.uniform2f(u_TexCoordShiftLocation, texCoordShiftX, texCoordShiftY);

        // DRAW THE SPRITE AS A TRIANGLE STRIP USING 4 VERTICES, STARTING AT THE START OF THE ARRAY (index 0)
        webGL.drawArrays(webGL.TRIANGLE_STRIP, SpriteDefaults.INDEX_OF_FIRST_VERTEX, SpriteDefaults.NUM_VERTICES);
    }

    render(graphics, sprite) {
        var webGL = graphics.webGL;
        var canvasWidth = graphics.canvasWidth;
        var canvasHeight = graphics.canvasHeight;
        var spriteType = sprite.spriteType;
        var texture = spriteType.spriteSheetTexture;

        // CALCULATE HOW MUCH TO TRANSLATE THE QUAD PER THE SPRITE POSITION
        var spriteWidth = spriteType.spriteWidth;
        var spriteHeight = spriteType.spriteHeight;
        var spriteXInPixels = sprite.position.getX() + (spriteWidth/2);
        var spriteYInPixels = sprite.position.getY() + (spriteHeight/2);
        var spriteXTranslate = (spriteXInPixels - (canvasWidth/2))/(canvasWidth/2);
        var spriteYTranslate = (spriteYInPixels - (canvasHeight/2))/(canvasHeight/2);
        this.spriteTranslate.setX(spriteXTranslate);
        this.spriteTranslate.setY(-spriteYTranslate);

        // CALCULATE HOW MUCH TO SCALE THE QUAD PER THE SPRITE SIZE
        var defaultWidth = canvasWidth/2;
        var defaultHeight = canvasHeight/2;
        var scaleX = spriteWidth/defaultWidth;
        var scaleY = spriteHeight/defaultHeight;
        this.spriteScale.setX(scaleX);
        this.spriteScale.setY(scaleY);

        // @todo - COMBINE THIS WITH THE ROTATE AND SCALE VALUES FROM THE SPRITE
        var math = window.wolfie.math;
        math.identity(this.spriteTransform);
        math.model(this.spriteTransform, this.spriteTranslate, this.spriteRotate, this.spriteScale);
        
        // FIGURE OUT THE TEXTURE COORDINATE FACTOR AND SHIFT
        var texCoordFactorX = spriteWidth/texture.width;
        var texCoordFactorY = spriteHeight/texture.height;
        var texCoordShiftX = spriteType.spriteLeft/texture.width;
        var texCoordShiftY = spriteType.spriteTop/texture.height;        

        // USE THE ATTRIBUTES
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexTexCoordBuffer);
        webGL.bindTexture(webGL.TEXTURE_2D, texture.glslTexture);

        // HOOK UP THE ATTRIBUTES
        var a_PositionLocation = this.locations[SpriteDefaults.A_POSITION];
        webGL.vertexAttribPointer(a_PositionLocation, SpriteDefaults.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, SpriteDefaults.TOTAL_BYTES, SpriteDefaults.VERTEX_POSITION_OFFSET);
        webGL.enableVertexAttribArray(a_PositionLocation);
        var a_TexCoordLocation = this.locations[SpriteDefaults.A_TEX_COORD];
        webGL.vertexAttribPointer(a_TexCoordLocation, SpriteDefaults.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, SpriteDefaults.TOTAL_BYTES, SpriteDefaults.TEXTURE_COORDINATE_OFFSET);
        webGL.enableVertexAttribArray(a_TexCoordLocation);

        // USE THE UNIFORMS
        var u_SpriteTransformLocation = this.locations[SpriteDefaults.U_SPRITE_TRANSFORM];
        webGL.uniformMatrix4fv(u_SpriteTransformLocation, false, this.spriteTransform);
        var u_SamplerLocation = this.locations[SpriteDefaults.U_SAMPLER];
        webGL.uniform1i(u_SamplerLocation, texture.glslTextureId);
        var u_TexCoordFactorLocation = this.locations[SpriteDefaults.U_TEX_COORD_FACTOR];
        webGL.uniform2f(u_TexCoordFactorLocation, texCoordFactorX, texCoordFactorY);
        var u_TexCoordShiftLocation = this.locations[SpriteDefaults.U_TEX_COORD_SHIFT];
        webGL.uniform2f(u_TexCoordShiftLocation, texCoordShiftX, texCoordShiftY);

        // DRAW THE SPRITE AS A TRIANGLE STRIP USING 4 VERTICES, STARTING AT THE START OF THE ARRAY (index 0)
        webGL.drawArrays(webGL.TRIANGLE_STRIP, SpriteDefaults.INDEX_OF_FIRST_VERTEX, SpriteDefaults.NUM_VERTICES);
    }
}