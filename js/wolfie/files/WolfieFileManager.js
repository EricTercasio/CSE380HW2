'use strict'

class WolfieFileManager {
    constructor() {}

    loadSpriteType(scene, jsonFilePath, callback) {
        $.getJSON(jsonFilePath, function (json) {
            var texture = scene.textures[json.spriteSheetImage];
            var spriteWidth = json.spriteWidth;
            var spriteHeight = json.spriteHeight;
            var animatedSpriteType = new AnimatedSpriteType(texture, spriteWidth, spriteHeight);
            for (var i = 0; i < json.animations.length; i++) {
                var animation = json.animations[i];
                animatedSpriteType.addAnimation(animation.name);
                for (var j = 0; j < animation.frames.length; j++) {
                    var frame = animation.frames[j];
                    animatedSpriteType.addAnimationFrame(animation.name, frame.index, frame.duration);
                }
            }
            scene.addAnimatedSpriteType(json.name, animatedSpriteType);
            callback();
        });
    }
}