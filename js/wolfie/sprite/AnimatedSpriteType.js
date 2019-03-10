'use strict'

class AnimationFrame {
    constructor(initLeft, initTop, initDuration) {
        this.left = initLeft;
        this.top = initTop;
        this.duration = initDuration;
    }
}

class AnimatedSpriteType {
    constructor(initSpriteSheetTexture, initSpriteWidth, initSpriteHeight) {
        this.spriteSheetTexture = initSpriteSheetTexture;
        this.animations = new Array();
        this.spriteWidth = initSpriteWidth;
        this.spriteHeight = initSpriteHeight;
    }

    addAnimation(state, framesArray) {
        this.animations[state] = new Array();
    }

    addAnimationFrame(state, index, frameDuration) {
        var columns = this.spriteSheetTexture.width/this.spriteWidth;
        var rows = this.spriteSheetTexture.height/this.spriteHeight;
        var col = index % columns;
        var row = Math.floor(index /  columns);
        var left = col * this.spriteWidth;
        var top = row * this.spriteHeight;
        this.animations[state].push(new AnimationFrame(left, top, frameDuration));
    }

    getAnimation(state) {
        return this.animations[state];
    }

    getLeft(state, frameIndex) {
        var animationFrame = this.animations[state][frameIndex];
        return animationFrame.left;
    }

    getTop(state, frameIndex) {
        var animationFrame = this.animations[state][frameIndex];
        return animationFrame.top;
    }
}