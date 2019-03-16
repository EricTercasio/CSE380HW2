'use strict'

var WolfieStatus = {
    READY:    'READY',
    LOADED:         'LOADED',
    FAILED:         'FAILED'
};

class Wolfie {
    constructor() {}
    
    init(gameCanvasId, textCanvasId) {
        // BUILD THE COMPONENTS
        this.math = new MathComponent();
        this.graphics = new GraphicsComponent();
        this.physics = new PhysicsComponent();
        this.scene = new SceneComponent();
        this.ui = new UIComponent();

        // AND NOW INITIALIZE THEM IN THE PROPER ORDER
        this.graphics.init(gameCanvasId, textCanvasId, this.math);

        // SETUP THE UI EVENT HANDLERS
        this.ui.init(gameCanvasId, this.scene, this.physics);
    }

    step() {
        // ADVANCE SPRITE ANIMATION        
        this.scene.step();

        // DO PHYSICS
        this.physics.step();

        // RENDER THE SCENE
        this.graphics.renderScene(this.scene);
    }

}