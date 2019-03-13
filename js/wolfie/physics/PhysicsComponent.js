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
                sortedCollidables[0] == currentCollidable;
            }else{
                var lessThanFound = false;
                for(var k = 0; k < sortedCollidables.length; k++){
                    var currentLeft = currentCollidable.sweptShape.getLeft();
                    var sortedLeft = currentCollidable.sweptShape.getLeft();
                    if(currentLeft < sortedLeft){
                        lessThanFound = true;
                        for(var j = k; j < sortedCollidables.length; j++){
                            //TODO finish sorting
                        }
                    }
                }
            }
        }
    }

    /*
     * sortCollisions - this method must sort collisions by their time of collision.
     */
    sortCollisions() {
        // YOU MUST DEFINE THIS METHOD
    }

    /*
     * moveAll - this method moves all the collidable objects up to the time provided.
     */
    moveAll(time) {
        // YOU MUST DEFINE THIS METHOD
    }

    /*
     * calculateTimeOfCollision - this method calculates the time of collision between
     *                            the two collidable objects referenced in the collision
     *                            argument.
     */
    calculateTimeOfCollision(collision) {
        // YOU MUST DEFINE THIS METHOD
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
        this.currentTime = 0.0;

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

        // NOW MOVE EVERYTHING UP TO TIME 1.0
        if (this.currentTime < 1.0) {
            this.moveAll(1.0);
        }
    }
}