'use strict'

/**
 * StaticSpriteType
 * 
 * A StaticSpriteType object represents a single cell in a sprite sheet.
 */
class StaticSpriteType {
    constructor(initSpriteSheetTexture, initSpriteWidth, initSpriteHeight, initSpriteLeft, initSpriteTop) {
        this.spriteSheetTexture = initSpriteSheetTexture;
        this.spriteWidth = initSpriteWidth;
        this.spriteHeight = initSpriteHeight;
        this.spriteLeft = initSpriteLeft;
        this.spriteTop = initSpriteTop;
    }
}