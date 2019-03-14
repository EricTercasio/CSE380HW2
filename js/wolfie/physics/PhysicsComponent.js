'use strict'

class PhysicsComponent {
    constructor() { 
        this.gravity = 5.0;
        this.windOrCurrent = 0.0;
        this.currentTime = 0.0;

        // WE'LL KEEP OUR COLLIDABLE OBJECTS SORTED BY X-COORDINATE USING THEIR SWEPT SHAPES
        this.collidableObjects = new Array();
        this.collisions = new Array();
        this.recyclableCollisions = new Array();
        for (var i = 0; i < 1000; i++) {
            var recyclableCollision = new Collision();
            this.recyclableCollisions.push(recyclableCollision);
        }
    }

    addCollidableObject(collidableObjectToAdd) {
        this.collidableObjects.push(collidableObjectToAdd);
    }

    removeCollidableObject(collidableObjectToRemove) {
        var indexOfItemToRemove = this.collidableObjects.indexOf(collidableObjectToRemove);
        this.collidableObjects.splice(indexOfItemToRemove, 1);
    }

    getCollidableObject(index) {
        return this.collidableObjects[index];
    }

    // YOU MUST DEFINE THE METHODS BELOW

    /*
     * sortCollidableObjects - this method must sort the collidable objects by their
     *                         swept shape's left edge.
     */
    sortCollidableObjects() {
        // YOU MUST DEFINE THIS METHOD
        var sortedCollidables = new Array();
        for(var i = 0; i < this.collidableObjects.length; i++){
            var currentCollidable = this.collidableObjects[i];
            if(sortedCollidables.length == 0){
                sortedCollidables.push(currentCollidable);
            }else{
                var lessThanFound = false;
                for(var k = 0; k < sortedCollidables.length; k++){
                    var currentLeft = currentCollidable.sweptShape.getLeft();
                    var sortedLeft = sortedCollidables[k].sweptShape.getLeft();
                    if(currentLeft < sortedLeft){
                        lessThanFound = true;
                        sortedCollidables.splice(k,0,currentCollidable);
                        break;

                    }
                }
                if(lessThanFound == false){
                    //Insert into the end
                    sortedCollidables.push(currentCollidable);
                }

            }
        }
        this.collidableObjects = sortedCollidables;
    }

    /*
     * sortCollisions - this method must sort collisions by their time of collision.
     */
    sortCollisions() {
        // YOU MUST DEFINE THIS METHOD
        var sortedCollisions = new Array();
        for(var i = 0; i < this.recyclableCollisions.length; i++) {
            var currentCollision = this.recyclableCollisions[i];
            if (currentCollision.timeOfCollision > 0 && currentCollision.timeOfCollision <= 1) { // Only care if between 0 and 1
                if (sortedCollisions.length == 0) {
                    if (currentCollision.timeOfCollision > 0.0 && currentCollision.timeOfCollision <= 1)
                        sortedCollisions.push(currentCollision);
                } else {
                    var lessThanFound = false;
                    for (var k = 0; k < sortedCollisions.length; k++) {
                        var currentTime = currentCollision.timeOfCollision;
                        var sortedTime = sortedCollisions[k].timeOfCollision;
                        if (currentTime < sortedTime) {
                            if (currentCollision.timeOfCollision > 0.0 && currentCollision.timeOfCollision <= 1) {
                                lessThanFound = true;
                                sortedCollisions.splice(k, 0, currentCollision);
                                break;
                            }
                        }
                    }
                    if (lessThanFound == false) {
                        //Insert into the end
                        if (currentCollision.timeOfCollision > 0.0 && currentCollision.timeOfCollision <= 1)
                            sortedCollisions.push(currentCollision);
                    }

                }
            }
        }
        this.collisions = sortedCollisions;
    }

    /*
     * moveAll - this method moves all the collidable objects up to the time provided.
     */
    moveAll(time) {
        // YOU MUST DEFINE THIS METHOD
        for(var i = 0; i < this.collidableObjects.length; i++){
            this.collidableObjects[i].move(this.currentTime,time);
        }

        //update current time
        this.currentTime = time;
    }

    /*
     * calculateTimeOfCollision - this method calculates the time of collision between
     *                            the two collidable objects referenced in the collision
     *                            argument.
     */
    calculateTimeOfCollision(collision) {
        // YOU MUST DEFINE THIS METHOD
        var collidable1 = collision.collidableObject1;
        var collidable2 = collision.collidableObject2;
        if(collidable1 == this.collidableObjects[5] && collidable2 == this.collidableObjects[3]){
            console.log("...");
        }

        var xA = collidable1.boundingVolume.centerX;
        var xB = collidable2.boundingVolume.centerX;
        var yA = collidable1.boundingVolume.centerY;
        var yB = collidable2.boundingVolume.centerY;
        var widthA = collidable1.boundingVolume.width;
        var widthB = collidable2.boundingVolume.width;
        var heightA = collidable1.boundingVolume.height;
        var heightB = collidable2.boundingVolume.height;
        /*
        var xA = collidable1.sweptShape.centerX;
        var xB = collidable2.sweptShape.centerX;
        var yA = collidable1.sweptShape.centerY;
        var yB = collidable2.sweptShape.centerY;
        var widthA = collidable1.sweptShape.width;
        var widthB = collidable2.sweptShape.width;
        var heightA = collidable1.sweptShape.height;
        var heightB = collidable2.sweptShape.height;
        */
        var velXA = collidable1.physicalProperties.velocityX;
        var velXB = collidable2.physicalProperties.velocityX;
        var velYA = collidable1.physicalProperties.velocityY;
        var velYB = collidable2.physicalProperties.velocityY;

        if((xA === 932) && (yA === 772) && (xB === 224) && (yB === 772)){
            console.log("..");
        }

        //Calculate X collisions
        if((xB - (widthB/2)) > (xA + (widthA/2))) { //If they are not currently overlapping on the x axis..
            //Will they?
            var startTimeOfCollisionX = ((xB - (widthB / 2)) - (xA + (widthA / 2))) / (velXA - velXB);
            var endTimeOfCollisionX = ((xB + (widthB / 2)) - (xA - (widthA / 2))) / (velXA - velXB);
            collision.startTimeOfCollisionX = startTimeOfCollisionX;
            collision.endTimeOfCollisionX = endTimeOfCollisionX;
        }else{
            collision.startTimeOfCollisionX = 0; //0 for "already overlapping"
            collision.endTimeOfCollisionX = 0;

        }
        if((yB - (heightB/2)) > (yA + (heightA/2))) { //If they are not currently overlapping on the y axis..
            //Will they?
            var startTimeOfCollisionY = ((yB - (heightB / 2)) - (yA + (heightA / 2))) / (velYA - velYB);
            var endTimeOfCollisionY = ((yB + (heightB / 2)) - (yA - (heightA / 2))) / (velYA - velYB);
            collision.startTimeOfCollisionY = startTimeOfCollisionY;
            collision.endTimeOfCollisionY = endTimeOfCollisionY;
        }else{

            collision.startTimeOfCollisionY = 0;
            collision.endTimeOfCollisionY = 0;

        }
        //When either startTimeOfX or startTimeOfY > 1, then there is no collision...
        var colStarX = collision.startTimeOfCollisionX;
        var colStarY = collision.startTimeOfCollisionY;
        if((colStarX > 0) && colStarY > 0){
            if(colStarX <= 1 && colStarY <= 1){
                if(colStarX > colStarY){
                    collision.timeOfCollision = startTimeOfCollisionX;
                }else {
                    collision.timeOfCollision = startTimeOfCollisionY;
                }
            }
        }
        /*if((0.0 < collision.startTimeOfCollisionX <= 1.0) && (0.0 < collision.startTimeOfCollisionY <= 1.0)){  //When both < 1, there is a collision.
            //When they are both < 1, the higher # is the time of collision.

            if(collision.startTimeOfCollisionX > collision.startTimeOfCollisionY){
                collision.timeOfCollision = startTimeOfCollisionX;
            }else
                collision.timeOfCollision = startTimeOfCollisionY;
        }*/else
        collision.timeOfCollision = -1; //-1 for no collision



    }

    /*
     *  step - this method steps the physics system through one time step, meaning one frame.
     *
     *  NOTE, YOU MUST COMPLETE THIS METHOD, IT IS ONLY PARTIALLY DEFINED
     */
    step() {
        // NOTE THAT THIS PHYSICS SYSTEM ASSUMES A FIXED-FRAME RATE, SO ALL VELOCITIES
        // AN ACCELERATIONS USE COORDINATE VALUES THAT ARE CLOCKED PER FRAME. FOR EXAMPLE,
        // A VELOCITY OF 5 WOULD MEAN IT IS MOVING 5 UNITS PER FRAME

        // THE BEGINNING OF THE TIME IS 0.0
        this.currentTime = 0.0; // Current time IN THIS FRAME

        // START BY GOING THROUGH EACH OF THE CollidableObjects AND FOR EACH:
            // ADD GRAVITY AND OTHER ACCELERATION
            // UPDATE THEIR SWEPT SHAPE
        for (var i = 0; i < this.collidableObjects.length; i++) {
            // GET THE COLLIDABLE OBJECT
            var collidableObject = this.collidableObjects[i];
            var pp = collidableObject.physicalProperties;

            // APPLY GRAVITY AND WIND/CURRENT AND ALL OTHER ACCELERATION TO THE DYNAMIC SPRITES
            if (!collidableObject.isStatic()) {
                pp.velocityX += pp.accelerationX + this.windOrCurrent;

                // WE ONLY APPLY Y ACCELERATION TO GRAVITY IF THE OBJECT ISN'T WALKING ON A SURFACE,
                // NOTE THAT THIS CREATES AN ISSUE WHERE THE SPRITE WON'T FALL AFTER WALKING OFF
                // OF A PLATFORM, WHICH YOU'LL HAVE TO DEAL WITH
                if (!collidableObject.isWalking()) {
                    pp.velocityY += pp.accelerationY + this.gravity;
                }
                else {
                    console.log("walking objects get no gravity");
                }
            }

            // NOW UPDATE THE SWEPT SHAPE
            collidableObject.sweep(this.currentTime);
        }
        
        // SORT ALL THE SWEPT SHAPES
        this.sortCollidableObjects();

        // ******************** //
        // COMPLETE THIS METHOD //
        // ******************** //

        //For each moving object, see which objects it might collide with.
        //Put those pairs into a collision object, then sort all those objects with sortCollisions.
        var recyclePosition = 0;
        for(var i = 0; i < this.collidableObjects.length; i++){
            var collidable1 = this.collidableObjects[i];
            if(!collidable1.isStatic()){
                //If it is a moving object..
                for(var k = 0; k < this.collidableObjects.length; k++){
                    var collidable2 = this.collidableObjects[k];
                    if(collidable2 != collidable1){
                        var testCollision = new Collision();
                        testCollision.collidableObject1 = collidable1;
                        testCollision.collidableObject2 = collidable2;
                        if(this.checkIfCollisionsExists(testCollision) == false) {
                            var collision = this.recyclableCollisions[recyclePosition];
                            collision.collidableObject1 = collidable1;
                            collision.collidableObject2 = collidable2;
                            this.calculateTimeOfCollision(collision);
                            recyclePosition++;
                        }
                    }
                }
            }
        }

        this.sortCollisions(); //5   864  3
        if(this.collisions.length != 0) {
            for(var i = 0; i < this.collisions.length; i++) {
                this.collisions[i].collidableObject1.physicalProperties.velocityX = 0;
                this.collisions[i].collidableObject1.physicalProperties.velocityY = 0;
                this.collisions[i].collidableObject1.sceneObject.state = "DEAD";
            }
            console.clear();
            console.log(this.collisions);
        }

        //Reset recycled collisions
        for(var i = 0; i < this.recyclableCollisions.length; i++){
            var recycledCollision = new Collision();
            this.recyclableCollisions[i] = recycledCollision;
        }



        // NOW MOVE EVERYTHING UP TO TIME 1.0
        if (this.currentTime < 1.0) {
            this.moveAll(1.0);
        }
    }
    /* Use this to determine if we've already checked these 2 objects for a collision

     */
    checkIfCollisionsExists(collision){
        var c1 = collision.collidableObject1;
        var c2 = collision.collidableObject2;
        for(var i = 0; i < this.recyclableCollisions.length; i++){
            var collision2 = this.recyclableCollisions[i];
            var c3 = collision2.collidableObject1;
            var c4 = collision2.collidableObject2;
            if(c1 == c3){
                if(c2 == c4){
                    return true;
                }
            }
            if(c2 == c3){
                if(c1 == c4){
                    return true;
                }
            }
        }
        return false;
    }
}