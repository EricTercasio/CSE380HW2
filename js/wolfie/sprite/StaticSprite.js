'use strict'

/**
 * StaticSprite
 * 
 * A Sprite represents a textured billboard that can be positioned, rotated, and scaled.
 */
class StaticSprite {
    constructor(initSpriteType) {
        this.spriteType = initSpriteType;

        // NOTE THAT THESE VALUES USE WORLD COORDINATES, WHICH WOULD CORRESPOND TO PIXEL COORDINATES
        var math = window.wolfie.math;
        this.position = math.createPositionVector();
        this.rotation = math.createRotationVector();
        this.scale = math.createPositionVector();

        // CLEAR ALL VALUES
        this.position.set(0.0, 0.0, 0.0, 1.0);
        this.rotation.set(0.0, 0.0, 0.0, 1.0);
        this.scale.set(1.0, 1.0, 1.0, 1.0);
    }
}