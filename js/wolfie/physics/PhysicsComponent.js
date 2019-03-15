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
        this.tempCollisions = new Array();
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
            if(i == 5){
                console.log("...");
            }
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

        var xAlreadyCollide = false;
        var yAlreadyCollide = false;

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
            xAlreadyCollide = true;

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
            yAlreadyCollide = true;

        }
        //When either startTimeOfX or startTimeOfY > 1, then there is no collision...
        var colStarX = collision.startTimeOfCollisionX;
        var colStarY = collision.startTimeOfCollisionY;
        if(0 < colStarX <= 1){
            if(yAlreadyCollide == true){
                collision.timeOfCollision = colStarX;
                return;
            }else{
                if(0 < colStarY <= 1){
                    if(colStarX < colStarY){
                        collision.timeOfCollision = colStarY;
                        return;
                    }else
                        collision.timeOfCollision = colStarX;
                    return;
                }
            }
        }else if(0 < colStarY <= 1){
            if(xAlreadyCollide == true){
                collision.timeOfCollision = colStarY;
                return;
            }else{
                if(0 < colStarX <= 1){
                    if(colStarY < colStarX){
                        collision.timeOfCollision = colStarX;
                        return;
                    }else
                        collision.timeOfCollision = colStarY;
                    return;
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
                        if(this.checkIfCollisionsExists(testCollision) == false && this.broadCollisionCheck(testCollision) == true) {//When we havent already checked this collision in the reverse order, and they are going to collide
                            var collision = this.recyclableCollisions[recyclePosition];
                            collision.collidableObject1 = collidable1;
                            collision.collidableObject2 = collidable2;
                            //There will be a collision...
                            this.calculateTimeOfCollision(collision); //So calculate the time of collision.
                            this.tempCollisions.push(collision);
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
                //this.collisions[i].collidableObject1.sceneObject.state = "DEAD";
                console.log(this.collidableObjects.indexOf(this.collisions[i].collidableObject1) + " " +this.collidableObjects.indexOf(this.collisions[i].collidableObject2) )
                this.collidableObjects[5].boundingVolume.centerY = 600;
            }

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
    //Used for broad check of collisions using 2 objects swept shapes
    broadCollisionCheck(collision){
        var collidable1 = collision.collidableObject1;
        var collidable2 = collision.collidableObject2;
        if(collidable1 == this.collidableObjects[5] && collidable2 == this.collidableObjects[3]){
            console.log("...");
        }

        var swept1 = collidable1.sweptShape;
        var swept2 = collidable2.sweptShape;

        //Check if the swept shape bounds overlap, if they do on both axis, we have a collision and return true;
        var left1 = swept1.getLeft();
        var right1 = swept1.getRight();
        var top1 = swept1.getTop();
        var bottom1 = swept1.getBottom();
        var left2 = swept2.getLeft();
        var right2 = swept2.getRight();
        var top2 = swept2.getTop();
        var bottom2 = swept2.getBottom();

        //Check if they overlap
        if(this.inRange(left1, right1, left2, right2) == true && this.inRange(top1,bottom1,top2,bottom2) == true){
            //They intersect
            return true;
        }else{
            return false;
        }
    }

    doRectanglesOverlap(left1 ,right1, left2, right2){
            // If one rectangle is on left side of other
            if (l1.x > r2.x || l2.x > r1.x) {
                return false;
            }

            // If one rectangle is above other
            if (l1.y < r2.y || l2.y < r1.y) {
                return false;
            }

            return true;
    }

    inRange(l1,r1,l2,r2){
        //Point 1 is (l1,r1) point 2 is (l2,r2)
        if(l1 <= l2 ){
            //l2 must be less than r1
            if(l2 <= r1){
                return true;
            }else{
                return false;
            }
        }else
        {
            //l1 is greater than l2
            if(l1 < r2){
                return true;
            }else{
                return false;
            }
        }
    }

}