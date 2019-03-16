'use strict'

class UIComponent {
    constructor() {}

    init(canvasId, scene, physics) {
        var canvas = document.getElementById(canvasId);
        this.spriteToDrag = null;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;

        canvas.onmousedown = function(event) {
            var mousePressX = event.clientX;
            var mousePressY = event.clientY;

            var sprite = scene.getFirstSpriteAt(mousePressX, mousePressY);
            if (sprite != null) {
                // START DRAGGING IT
                this.spriteToDrag = sprite;

                this.dragOffsetX = sprite.position.getX() - mousePressX;
                this.dragOffsetY = sprite.position.getY() - mousePressY;
            }
        }

        canvas.onmousemove = function(event) {
            window.wolfie.ui.currentMouseX = event.clientX;
            window.wolfie.ui.currentMouseY = event.clientY;
            if (this.spriteToDrag != null) {
                this.spriteToDrag.position.set(event.clientX + this.dragOffsetX, event.clientY + this.dragOffsetY, this.spriteToDrag.position.getZ(), this.spriteToDrag.position.getW());
                window.wolfie.graphics.renderScene(window.wolfie.scene);
            }
        }

        canvas.onmouseup = function(event) {
            this.spriteToDrag = null;
        }

        canvas.onmouseleave = function(event) {
            this.spriteToDrag = null;
        }

        document.onkeydown = function (event){
            event = event || window.event
            var keyPressed = event.which || event.keyCode
            if (keyPressed == 32){
                var collidableObj = physics.findCollidableObjectBySceneObject(scene.player);
                collidableObj.physicalProperties.velocityY = -30;
                if(collidableObj.isWalking()){
                    collidableObj.walking = false; // So we regain gravity...
                }
                console.log(collidableObj);
            }

        }
    }
}