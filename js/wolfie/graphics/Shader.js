'use strict'

class Shader {
    constructor() { 
        // WE ARE DECLARING ALL THE THINGS WE'LL BE CREATING HERE JUST FOR CLARIFICATION
        this.program = null;
        this.locations = null;
    }

    init(webGL, vSource, fSource) {
        var vertexShader = this.createShader(webGL, webGL.VERTEX_SHADER, vSource);
        var fragmentShader = this.createShader(webGL, webGL.FRAGMENT_SHADER, fSource);
        this.createShaderProgram(webGL, vertexShader, fragmentShader);
    }

    createShader(webGL, type, source) {
        // MAKE A NEW SHADER OBJECT, LOAD IT'S SOURCE, AND COMPILE IT
        var shader = webGL.createShader(type);
        webGL.shaderSource(shader, source);
        webGL.compileShader(shader);

        // DID IT COMPILE?
        var success = webGL.getShaderParameter(shader, webGL.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        // DISASTER
        console.log(webGL.getShaderInfoLog(shader));
        webGL.deleteShader(shader);
        return null;
    }

    createShaderProgram(webGL, vertexShader, fragmentShader) {
        // MAKE THE GLSL SHADER PROGRAM
        this.program = webGL.createProgram();

        // LINK THE VERT AND FRAG
        webGL.attachShader(this.program, vertexShader);
        webGL.attachShader(this.program, fragmentShader);

        // NOW WE CAN LINK THE SHADER PROGRAM
        webGL.linkProgram(this.program);
        var linked = webGL.getProgramParameter(this.program, webGL.LINK_STATUS);

        // IS IT LINKED?
        if (!linked) {
            // DISASTER
            var errorFeedback = webGL.getProgramInfoLog(this.program);
            console.log(errorFeedback);

            // DISASTER
            console.log(webGL.getProgramInfoLog(this.program));
            webGL.deleteProgram(this.program);
        }
    }
}