'use strict'

class AnimatedSprite {
    constructor(initSpriteType, initState) {
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

        // START RESET
        this.state = initState;
        this.animationFrameIndex = 0;
        this.frameCounter = 0;
    }

    moveBy(incX, incY) {
        this.position.set(this.position[0]+incX, this.position[1]+incY, this.position[2]);
    }

    moveTo(initX, initY) {
        this.position.set(initX, initY, this.position[2]);
    }

    setState(initState) {
        this.state = initState;
        this.animationFrameIndex = 0;
        this.frameCounter = 0;
    }

    step() {
        this.frameCounter++;
        // HAVE WE GONE PAST THE LAST FRAME IN THE ANIMATION?
        var currentAnimation = this.spriteType.getAnimation(this.state);
        var currentFrame = currentAnimation[this.animationFrameIndex];
        if (this.frameCounter > (currentFrame.duration)) {
            this.animationFrameIndex++;
            if (this.animationFrameIndex >= currentAnimation.length) {
                this.animationFrameIndex = 0;
            }
            this.frameCounter = 0;
        }
    }

    getLeft() {
        return this.spriteType.getLeft(this.state, this.animationFrameIndex);
    }

    getTop() {
        return this.spriteType.getTop(this.state, this.animationFrameIndex);
    }
}