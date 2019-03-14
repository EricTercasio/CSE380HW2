'use strict'

class PhysicsTests {
    constructor(initPhysics, initTextRenderer) { 
        this.physics = initPhysics;
        this.textRenderer = initTextRenderer;
        this.tests = new Array();
        this.currentTest = -1;
        this.SUCCESS_COLOR = "#ffff00";
        this.FAILURE_COLOR = "#ff88bb";
        this.FLOAT_TOLERANCE = 0.0001;

        // GET ALL THE TEST METHOD NAMES
        var thisPrototype = Object.getPrototypeOf(this);
        var testFunctions = Object.getOwnPropertyNames(thisPrototype);
        for (var i = 0; i < testFunctions.length; i++) {
            var functionName = testFunctions[i];
            if (functionName.startsWith("test")) {
                this.tests.push(functionName);
            }
        }

        console.log("PhysicsTests - Test Method Names:\n");
        for (var i = 0; i < this.tests.length; i++) {
            console.log("\t" + this.tests[i] + "\n");
        }

        // WE'LL SETUP 15 LINES OF TEXT FOR OUTPUT
        var textX = 50;
        var textY = 50;
        for (var i = 0; i < 30; i++) {
            var id = "id (" + i + ")";
            var text =  "";
            var textToRender = new TextToRender(id, text, textX, textY, function() {

            });
            this.textRenderer.addTextToRender(textToRender);
            textY += 30;
        }
    }

    runPreviousTest() {
        this.currentTest--;
        if (this.currentTest < 0) {
            this.currentTEst = this.currentTest.length-1;
        }
        this.runTest();
    }

    runNextTest() {
        this.currentTest++;
        if (this.currentTest == this.tests.length) {
            this.currentTest = 0;
        }
        this.runTest();
    }

    runTest() {
        // FIRST CLEAR THE OLD TEXT
        this.clearOldText();

        // FIRST GET THE METHOD
        var testMethodName = this.tests[this.currentTest];

        // THE FIRST LINE OF TEXT ALWAYS SHOWS THE NAME OF THE TEST
        this.textRenderer.textToRender[0].text = testMethodName;


        this[testMethodName]();

        this.textRenderer.render();
    }

    clearOldText() {
        for (var i = 0; i < this.textRenderer.textToRender.length; i++) {
            var textToRender = this.textRenderer.textToRender[i];
            textToRender.text = "";
            textToRender.fontColor = this.SUCCESS_COLOR;        
        }
    }

    printSweptShape(title, aabb, i) {
        var tTR = this.textRenderer.textToRender;
        tTR[i].text = " --" + title + ": (" + aabb.centerX + ", " + aabb.centerY + ")"
                    + ", width: " + aabb.width + ", height: " + aabb.height;
    }

    printAABB(title, aabb, pp, i) {
        var tTR = this.textRenderer.textToRender;
        tTR[i].text = " --" + title + ": (" + aabb.centerX + ", " + aabb.centerY + ")"
                    + ", width: " + aabb.width + ", height: " + aabb.height
                    + ", velocityX: " + pp.velocityX + ", velocityY: " + pp.velocityY;
    }

    printSweptShapeForAABB(title, aabb, expectedSweptShape, actualSweptShape, pp, i) {
        var tTR = this.textRenderer.textToRender;
        tTR[i].text = title;
        this.printAABB("--aabb: ", aabb, pp, i+1);
        this.printSweptShape("--expected sweptShape: ", expectedSweptShape, i+2);
        this.printSweptShape("--actual sweptShape: ", actualSweptShape, i+3);
    }

    makeCollidableObject(centerX, centerY, width, height, velocityX, velocityY) {
        var collidableObject = new CollidableObject(null);
        var aabb = collidableObject.boundingVolume;
        aabb.centerX = centerX;
        aabb.centerY = centerY;
        aabb.width = width;
        aabb.height = height;
        var pp = collidableObject.physicalProperties;
        pp.velocityX = velocityX;
        pp.velocityY = velocityY;
        return collidableObject;
    }

    isWithinTolerance(expectedValue, actualValue) {
        return Math.abs(expectedValue - actualValue) < this.FLOAT_TOLERANCE;
    }

    // BELOW ARE 2 TEST METHODS DEMONSTRATING HOW TO DO SIMPLE TESTS
    // OF INDIVIDUAL METHODS, i.e. PIECES OF THE COLLISION DETECTION ALGORITHM

    testSweep() {
        // GET THE STUFF TO TEST
        var collidableObject = this.makeCollidableObject(20, 25, 100, 200, 15, 30);
        var aabb = collidableObject.boundingVolume;
        var pp = collidableObject.physicalProperties;
        var actualSweptShape = collidableObject.sweptShape;

        // THIS IS THE FUNCTION WE ARE TESTING
        collidableObject.sweep(0.0);

        // COMPARE THE EXPECTED TO ACTUAL RESULTS AND DISPLAY THEM        
        var expectedSweptShape = new AABB();
        expectedSweptShape.init(27.5, 40, 115, 230); //Center x, center y, width, height
        var startTextLineNumber = 2;
        this.printSweptShapeForAABB("-Swept Shape for Positive Vx and Vy", aabb, expectedSweptShape, actualSweptShape, pp, startTextLineNumber);

        if ((!this.isWithinTolerance(expectedSweptShape.centerX, collidableObject.sweptShape.centerX))
        || (!this.isWithinTolerance(expectedSweptShape.centerY, collidableObject.sweptShape.centerY))
        || (!this.isWithinTolerance(expectedSweptShape.width, collidableObject.sweptShape.width))
        || (!this.isWithinTolerance(expectedSweptShape.height, collidableObject.sweptShape.height))) {
            for (var i = startTextLineNumber; i < startTextLineNumber + 4; i++)
                this.textRenderer.textToRender[i].fontColor = this.FAILURE_COLOR;
        }
    }

    testTimeOfCollision() {
        // GET AND SETUP THE STUFF TO TEST
        var a = this.makeCollidableObject(0, 0, 100, 200, 10, 0);
        var b = this.makeCollidableObject(110, 0, 100, 200, -10, 0);//centerX, centerY, width, height, velocityX, velocityY
        var collision = new Collision();
        collision.collidableObject1 = a;
        collision.collidableObject2 = b;

        // THIS IS THE FUNCTION WE ARE TESTING
        this.physics.calculateTimeOfCollision(collision);

        // COMPARE THE EXPECTED TO ACTUAL RESULTS AND DISPLAY THEM        
        var startTextLineNumber = 2;
        var resultsText = this.textRenderer.textToRender[startTextLineNumber];
        var expectedTimeOfCollision = 0.5;
        resultsText.text = "-timeOfCollision for A on Left, B on Right, Moving towards one another: (expected: " + expectedTimeOfCollision + ", actual: " + collision.timeOfCollision + ")";
        this.printAABB("--aabb A: ", a.boundingVolume, a.physicalProperties, startTextLineNumber+1);
        this.printAABB("--aabb B: ", b.boundingVolume, b.physicalProperties, startTextLineNumber+2);

        // IS IT CORRECT? IF NOT, PRINT THIS IN PINK
        if (!this.isWithinTolerance(expectedTimeOfCollision, collision.timeOfCollision)) {
            for (var i = startTextLineNumber; i < startTextLineNumber + 3; i++)
            this.textRenderer.textToRender[i].fontColor = this.FAILURE_COLOR;
        }
    }

    testCollidableSort(){
        var a = this.makeCollidableObject(0,0,100,100,1,1);
        var b = this.makeCollidableObject(10,50,25,200,2,2);
        a.sweep(0.0);
        b.sweep(0.0);
        this.physics.addCollidableObject(a);
        this.physics.addCollidableObject(b);
        this.physics.sortCollidableObjects();
        var resultsTxt = this.textRenderer.textToRender[2];
        var text = "";
        for(var i = 0; i < this.physics.collidableObjects.length; i++){
            text = text.concat("SweptShape : ");
            var current = this.physics.collidableObjects[i];
            text = text.concat(current.sweptShape.centerX + " ");
            text = text.concat(current.sweptShape.centerY + " ");

        }
        resultsTxt.text = text;


    }

    
}