'use strict'

class AABB {
    constructor(){}

    init(initCenterX, initCenterY, initWidth, initHeight) { 
        this.centerX = initCenterX;
        this.centerY = initCenterY;
        this.width = initWidth;
        this.height = initHeight;
    }

    moveBy(incX, incY) {
        this.centerX += incX;
        this.centerY += incY;
    }

    moveTo(initX, initY) {
        this.centerX = initX;
        this.centerY = initY;
    }

    getLeft() {
        return this.centerX - (this.width/2);
    }

    getRight() {
        return this.centerX + (this.width/2);
    }

    getTop() {
        return this.centerY - (this.height/2);
    }

    getBottom() {
        return this.centerY + (this.height/2);
    }
}