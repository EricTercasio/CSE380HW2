'use strict'

var TestConstants = {
    GREEN_BLOCK: "Green Block",
    RED_BLOCK: "Red Block",
    YELLOW_TILE: "Yellow Tile",
    LIVING_STATE: "LIVING",
    DEAD_STATE: "DEAD"
};

class PhysicsDemoSceneBuilder {
    constructor() {}

    buildScene(graphics, scene, physics, callback) {
        var texturePaths = ["resources/images/EightBlocks.png"];
        var builder = this;
        graphics.loadTextures(scene, texturePaths, function () {            
            builder.buildAnimatedSpriteTypes(scene, function() {
                builder.buildAnimatedSprites(scene, physics);
                builder.buildLevel(scene, physics);
                callback();
            });
        });
    }

    buildAnimatedSpriteTypes(scene, callback) {
        // IN THIS EXAMPLE WE WILL BUILD 4 SPRITE TYPES,
        // TWO FOR EACH TEXTURE. NOTE THAT THEY WILL
        // ALL SHARE THE SAME GEOMETRY
        var wolfieFileManager = new WolfieFileManager();
        var animatedSpriteTypeNames = ["resources/animated_sprites/GreenBlock.json", "resources/animated_sprites/RedBlock.json"];
        var numSpriteTypes = 2;
        for (var i = 0; i < animatedSpriteTypeNames.length; i++) {
            wolfieFileManager.loadSpriteType(scene, animatedSpriteTypeNames[i], function() {
                if (scene.numAnimatedSpriteTypes === numSpriteTypes) {
                    callback();
                }
            });
        }
    }

    buildAnimatedSprites(scene, physics) {
        // THE PLAYER IS A RED BLOCK (FOR NOW)
        var redBlockSpriteType = scene.getAnimatedSpriteType(TestConstants.RED_BLOCK);
        scene.player = new AnimatedSprite(redBlockSpriteType, TestConstants.LIVING_STATE);
        scene.player.position.set(100.0, 100.0, 0.0, 1.0);
        scene.addAnimatedSprite(scene.player);
        this.fitTightAABB(scene.player, physics);

        // THE ENEMIES ARE GREEN BLOCKS
        scene.bots = new Array();
        var greenBlockSpriteType = scene.getAnimatedSpriteType(TestConstants.GREEN_BLOCK);
        for (var i = 400; i < 2600; i+= 400) {
            var bot = new AnimatedSprite(greenBlockSpriteType, TestConstants.LIVING_STATE);
            bot.position.set(i, 100.0, 0.0, 1.0);
            scene.bots.push(bot);
            scene.addAnimatedSprite(bot);
            this.fitTightAABB(bot, physics);
        }
        for (var i = 200; i < 2600; i+= 700) {
            var bot = new AnimatedSprite(greenBlockSpriteType, TestConstants.LIVING_STATE);
            bot.position.set(i, 700.0, 0.0, 1.0);
            scene.bots.push(bot);
            scene.addAnimatedSprite(bot);
            this.fitTightAABB(bot, physics);
        }
    }

    fitTightAABB(sprite, physics) {
        // MAKE A BOUNDING BOX FOR THE SPRITE
        var collidableObject = new CollidableObject(sprite);
        var spriteType = sprite.spriteType;
        var aabb = collidableObject.boundingVolume;
        aabb.init(sprite.position[0] + (spriteType.spriteWidth/2.0), sprite.position[1] + (spriteType.spriteHeight/2.0), spriteType.spriteWidth, spriteType.spriteHeight);
        physics.addCollidableObject(collidableObject);
    }

    buildLevel(scene, physics) {
        var eightBlocksTexture = scene.getTexture("resources/images/EightBlocks.png");
        var yellowTileSpriteType = new StaticSpriteType(eightBlocksTexture, 64, 64, 192, 64);
        scene.addStaticSpriteType(TestConstants.YELLOW_TILE, yellowTileSpriteType);
        this.addWall(scene, physics, yellowTileSpriteType, 0, 20, 0, 0);     // LEFT WALL
        this.addWall(scene, physics, yellowTileSpriteType, 0, 20, 39, 39);   // RIGHT WALL
        this.addWall(scene, physics, yellowTileSpriteType, 0, 0, 1, 38);     // TOP WALL
        this.addWall(scene, physics, yellowTileSpriteType, 19, 19, 1, 38);   // FLOOR
        this.addWall(scene, physics, yellowTileSpriteType, 13, 13, 1, 5);
        this.addWall(scene, physics, yellowTileSpriteType, 15, 15, 7, 11);
        this.addWall(scene, physics, yellowTileSpriteType, 13, 13, 34, 38);
        this.addWall(scene, physics, yellowTileSpriteType, 15, 15, 28, 32);
        this.addWall(scene, physics, yellowTileSpriteType, 13, 13, 15, 24);
        this.addWall(scene, physics, yellowTileSpriteType, 8, 8, 4, 9);
        this.addWall(scene, physics, yellowTileSpriteType, 8, 8, 30, 35);
        this.addWall(scene, physics, yellowTileSpriteType, 5, 7, 10, 12);
        this.addWall(scene, physics, yellowTileSpriteType, 5, 7, 27, 29);
        for (var i = 15; i <= 24; i+=3) {
            this.addWall(scene, physics, yellowTileSpriteType, 5, 5, i, i);
        }
    }

    addWall(scene, physics, wallTileSpriteType, startRow, endRow, startColumn, endColumn) {
        var counter = scene.staticSprites.length;
        for (var i = startRow; i <= endRow; i++) {
            var top = wallTileSpriteType.spriteHeight * i;
            for (var j = startColumn; j <= endColumn; j++) {
                var left = wallTileSpriteType.spriteWidth * j;
                var tile = new StaticSprite(wallTileSpriteType);
                tile.position.set(left, top);
                scene.addStaticSprite(tile);
                counter++;
            }
        }

        // MAKE A BOUNDING VOLUME FOR THIS WALL
        var minX = startColumn * wallTileSpriteType.spriteWidth;
        var maxX = (endColumn * wallTileSpriteType.spriteWidth) + wallTileSpriteType.spriteWidth;
        var minY= startRow * wallTileSpriteType.spriteHeight;
        var maxY = (endRow * wallTileSpriteType.spriteHeight) + wallTileSpriteType.spriteHeight;
        var centerX = (maxX + minX)/2.0;
        var centerY = (maxY + minY)/2.0;
        var wall = new CollidableObject(null);
        wall.boundingVolume.init(centerX, centerY, maxX-minX, maxY-minY);
        physics.addCollidableObject(wall);
    }
}