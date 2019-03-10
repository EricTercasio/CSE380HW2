'use strict'

class SceneComponent {
    constructor() {       
        // THIS WILL STORE THE TEXTURES USED FOR RENDERING SPRITES. NOTE
        // THAT WE WILL ONLY HAVE 8 TEXTURES PER WebGL 1.0 STANDARD LIMITATIONS
        this.textures = new Array();

        // THESE WILL STORE THE ANIMATED SPRITE TYPES THAT WILL BE USED
        // FOR DYNAMIC CONTENT
        this.animatedSpriteTypes = new Array();
        this.animatedSprites = new Array();
        this.numAnimatedSpriteTypes = 0;

        // THIS WILL STORE THE STATIC SPRITE TYPES THAT WILL BE USED
        // FOR STATIC CONTENT
        this.staticSpriteTypes = new Array();
        this.staticSprites = new Array();
        this.numStaticSpriteTypes = 0;
    }

    addTexture(id, texture) {
        this.textures[id] = texture;
        this.numTextres++;
    }

    addStaticSpriteType(id, staticSpriteType) {
        this.staticSpriteTypes[id] = staticSpriteType;
        this.numStaticSpriteTypes++;
    }

    addAnimatedSpriteType(id, animatedSpriteType) {
        this.animatedSpriteTypes[id] = animatedSpriteType;
        this.numAnimatedSpriteTypes++;
    }

    addStaticSprite(staticSprite) {
        this.staticSprites.push(staticSprite);
    }

    addAnimatedSprite(animatedSprite) {
        this.animatedSprites.push(animatedSprite);
    }

    getTexture(id) {
        return this.textures[id];
    }

    getStaticSpriteType(id) {
        return this.staticSpriteTypes[id];
    }

    getAnimatedSpriteType(id) {
        return this.animatedSpriteTypes[id];
    }

    /**
     * step - This function will update the animation states of all
     * animated sprites.
     */
    step() {
        // UPDATE THE SPRITES ACCORDING TO THEIR CURRENT ANIMATION STATE
        for (var i = 0; i < this.animatedSprites.length; i++) {
            var animatedSprite = this.animatedSprites[i];
            animatedSprite.step();
        }
    }

    fillRenderList(renderList) {
        // FIRST THE STATIC SPRITES, SINCE WE ARE USING THEM FOR THE LEVEL TILES
        for (var i = 0; i < this.staticSprites.length; i++) {
            var staticSprite = this.staticSprites[i];
            renderList.push(staticSprite);
        }
        // AND THEN THE ANIMATED SPRITES
        for (var i = 0; i < this.animatedSprites.length; i++) {
            var animatedSprite = this.animatedSprites[i];
            renderList.push(animatedSprite);
        }
    }

    getFirstSpriteAt(sceneX, sceneY) {
        var sprite = this.findSprite(this.staticSprites, sceneX, sceneY);
        if (sprite === null) {
            sprite = this.findSprite(this.animatedSprites, sceneX, sceneY);
        }
        return sprite;
    }

    findSprite(array, sceneX, sceneY) {
        for (var i = array.length-1; i >= 0; i--) {
            var sprite =array[i];
            var left = sprite.position.getX();
            var right = sprite.position.getX() + sprite.spriteType.spriteWidth;
            var top = sprite.position.getY();
            var bottom = sprite.position.getY() + sprite.spriteType.spriteHeight;

            // FOR (sceneX, sceneY) TO BE INSIDE THE SPRITE BOUNDARIES FOUR THINGS MUST BE TRUE
            if ((left < sceneX) && (sceneX < right) && (top < sceneY) && (sceneY < bottom)) {
                return sprite;
            }
        }    
        return null;    
    }
}