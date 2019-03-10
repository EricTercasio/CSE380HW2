'use strict'

class MathComponent {
    constructor() { }
    fmod(a, b) {
        return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
    };
    degreesToRadians(degrees) {
        degrees = this.fmod(degrees, 360.0);
        var radians = (2.0 * Math.PI * degrees) / 360.0;
        return radians;
    }
    radiansToDegrees(radians) {
        radians = Math.fmod(radians, (2 * Math.PI));
        degrees = (radians * 360.0) / (2.0 * Math.PI);
        return degrees;
    }
    calculateDistanceBetweenPoints(point0, point1) {
        var xDiff = point0.getX() - point1.getX();
        var xSquared = xDiff * xDiff;
        var yDiff = point0.getY() - point1.getY();
        var ySquared = yDiff * yDiff;
        var squaredValue = xSquared + ySquared;
        var distance = Math.sqrt(squaredValue);
        return distance;
    }
    createMatrix(rows, columns) {
        var matrix = new Float32Array(rows * columns);
        for (var i = 0; i < (rows * columns); i++)
            matrix[i] = 0.0;
        matrix.rows = rows;
        matrix.columns = columns;
        matrix.getIndex = function (row, column) {
            return (this.rows * column) + row;
        }
        matrix.get = function (row, column) {
            var index = this.getIndex(row, column);
            var valueToReturn = matrix[index];
            return valueToReturn;
        }
        matrix.set = function (value, row, column) {
            var index = this.getIndex(row, column);
            matrix[index] = value;
        }
        matrix.print = function () {
            var maxWidth = 0;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var testNum = matrix.get(j, i) + "";
                    if (testNum.length > maxWidth) {
                        maxWidth = testNum.length;
                    }
                }
            }
            var text = "[ ";
            for (var i = 0; i < matrix.rows; i++) {
                if (i > 0)
                    text += "  ";
                for (var j = 0; j < matrix.columns; j++) {
                    var numText = matrix.get(i, j) + "";
                    while (numText.length < maxWidth) {
                        numText = " " + numText;
                    }
                    text += numText;
                    if (j < (matrix.columns - 1)) {
                        text += ",";
                    }
                    text += " ";
                }
                if (i < (matrix.rows - 1))
                    text += "\n";
            }
            text += "]";
            console.log(text);
        }
        return matrix;
    }
    determinant(result) {
        var det0 = result.get(0, 0) * (
            (result.get(1, 1) * ((result.get(2, 2) * result.get(3, 3)) - (result.get(2, 3) * result.get(3, 2))))
            - (result.get(1, 2) * ((result.get(2, 1) * result.get(3, 3)) - (result.get(2, 3) * result.get(3, 1))))
            + (result.get(1, 3) * ((result.get(2, 1) * result.get(3, 2)) - (result.get(3, 1) * result.get(2, 2)))));
        var det1 = result.get(0, 1) * (
            (result.get(1, 0) * ((result.get(2, 2) * result.get(3, 3)) - (result.get(2, 3) * result.get(3, 2))))
            - (result.get(1, 2) * ((result.get(2, 0) * result.get(3, 3)) - (result.get(3, 0) * result.get(2, 3))))
            + (result.get(1, 3) * ((result.get(2, 0) * result.get(3, 2)) - (result.get(3, 0) * result.get(2, 2)))));
        var det2 = result.get(0, 2) * (
            (result.get(1, 0) * ((result.get(2, 1) * result.get(3, 3)) - (result.get(2, 3) * result.get(3, 1))))
            - (result.get(1, 1) * ((result.get(2, 0) * result.get(3, 3)) - (result.get(2, 3) * result.get(3, 0))))
            + (result.get(1, 3) * ((result.get(2, 0) * result.get(3, 1)) - (result.get(2, 1) * result.get(3, 0)))));
        var det3 = result.get(0, 3) * (
            (result.get(1, 0) * ((result.get(2, 1) * result.get(3, 2)) - (result.get(2, 2) * result.get(3, 1))))
            - (result.get(1, 1) * ((result.get(2, 0) * result.get(3, 2)) - (result.get(2, 2) * result.get(3, 0))))
            + (result.get(1, 2) * ((result.get(2, 0) * result.get(3, 1)) - (result.get(2, 1) * result.get(3, 0)))));
        var det = det0 - det1 + det2 - det3;
        console.log("det = " + det0 + " + " + det1 + " + " + det2 + " + " + det3);
        return det;
    }
    identity(result) {
        if (result.rows === result.columns) {
            for (var i = 0; i < result.rows; i++) {
                for (var j = 0; j < result.columns; j++) {
                    if (i === j)
                        result.set(1.0, i, j);
                    else
                        result.set(0.0, i, j);
                }
            }
        }
    }
    inverse(result, mat) {
        var det = this.determinant(mat);
        var m00 = mat.get(0, 0); var m01 = mat.get(0, 1); var m02 = mat.get(0, 2); var m03 = mat.get(0, 3);
        var m10 = mat.get(1, 0); var m11 = mat.get(1, 1); var m12 = mat.get(1, 2); var m13 = mat.get(1, 3);
        var m20 = mat.get(2, 0); var m21 = mat.get(2, 1); var m22 = mat.get(2, 2); var m23 = mat.get(2, 3);
        var m30 = mat.get(3, 0); var m31 = mat.get(3, 1); var m32 = mat.get(3, 2); var m33 = mat.get(3, 3);
        var temp = this.createMatrix(4, 4);
        temp.set((m12 * m23 * m31) - (m13 * m22 * m31) + (m13 * m21 * m32) - (m11 * m23 * m32) - (m12 * m21 * m33) + (m11 * m22 * m33), 0, 0);
        temp.set((m03 * m22 * m31) - (m02 * m23 * m31) - (m03 * m21 * m32) + (m01 * m23 * m32) + (m02 * m21 * m33) - (m01 * m22 * m33), 0, 1);
        temp.set((m02 * m13 * m31) - (m03 * m12 * m31) + (m03 * m11 * m32) - (m01 * m13 * m32) - (m02 * m11 * m33) + (m01 * m12 * m33), 0, 2);
        temp.set((m03 * m12 * m21) - (m02 * m13 * m21) - (m03 * m11 * m22) + (m01 * m13 * m22) + (m02 * m11 * m23) - (m01 * m12 * m23), 0, 3);
        temp.set((m13 * m22 * m30) - (m12 * m23 * m30) - (m13 * m20 * m32) + (m10 * m23 * m32) + (m12 * m20 * m33) - (m10 * m22 * m33), 1, 0);
        temp.set((m02 * m23 * m30) - (m03 * m22 * m30) + (m03 * m20 * m32) - (m00 * m23 * m32) - (m02 * m20 * m33) + (m00 * m22 * m33), 1, 1);
        temp.set((m03 * m12 * m30) - (m02 * m13 * m30) - (m03 * m10 * m32) + (m00 * m13 * m32) + (m02 * m10 * m33) - (m00 * m12 * m33), 1, 2);
        temp.set((m02 * m13 * m20) - (m03 * m12 * m20) + (m03 * m10 * m22) - (m00 * m13 * m22) - (m02 * m10 * m23) + (m00 * m12 * m23), 1, 3);
        temp.set((m11 * m23 * m30) - (m13 * m21 * m30) + (m13 * m20 * m31) - (m10 * m23 * m31) - (m11 * m20 * m33) + (m10 * m21 * m33), 2, 0);
        temp.set((m03 * m21 * m30) - (m01 * m23 * m30) - (m03 * m20 * m31) + (m00 * m23 * m31) + (m01 * m20 * m33) - (m00 * m21 * m33), 2, 1);
        temp.set((m01 * m13 * m30) - (m03 * m11 * m30) + (m03 * m10 * m31) - (m00 * m13 * m31) - (m01 * m10 * m33) + (m00 * m11 * m33), 2, 2);
        temp.set((m03 * m11 * m20) - (m01 * m13 * m20) - (m03 * m10 * m21) + (m00 * m13 * m21) + (m01 * m10 * m23) - (m00 * m11 * m23), 2, 3);
        temp.set((m12 * m21 * m30) - (m11 * m22 * m30) - (m12 * m20 * m31) + (m10 * m22 * m31) + (m11 * m20 * m32) - (m10 * m21 * m32), 3, 0);
        temp.set((m01 * m22 * m30) - (m02 * m21 * m30) + (m02 * m20 * m31) - (m00 * m22 * m31) - (m01 * m20 * m32) + (m00 * m21 * m32), 3, 1);
        temp.set((m02 * m11 * m30) - (m01 * m12 * m30) - (m02 * m10 * m31) + (m00 * m12 * m31) + (m01 * m10 * m32) - (m00 * m11 * m32), 3, 2);
        temp.set((m01 * m12 * m20) - (m02 * m11 * m20) + (m02 * m10 * m21) - (m00 * m12 * m21) - (m01 * m10 * m22) + (m00 * m11 * m22), 3, 3);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                result.set(temp.get(i, j) / det, i, j);
            }
        }
    }
    model(result, translation, rotation, scale) {
        // TRANSLATION MATRIX	
        var translationMatrix = this.createMatrix(4, 4);
        this.identity(translationMatrix);
        this.translate(translationMatrix, translation);

        // ROTATION MATRIX
        var rotationMatrix = this.createMatrix(4, 4);
        this.identity(rotationMatrix);
        this.rotate(rotationMatrix, rotation);

        // SCALING MATRIX
        var scaleMatrix = this.createMatrix(4, 4);
        this.identity(scaleMatrix);
        this.scale(scaleMatrix, scale);

        // AND NOW MULTIPLY THEM TOGETHER IN THE CORRECT ORDER
        var tempMatrix = this.createMatrix(4, 4);
        this.multiply(tempMatrix, translationMatrix, rotationMatrix);
        this.multiply(result, tempMatrix, scaleMatrix);
    }
    multiply(result, mat0, mat1) {
        // result MIGHT BE mat0 OR mat1 SO IT'S BEST IF WE
        // CALCULATE TEMP VALUES FIRST BEFORE ASSIGNMENT
        var r00 = (mat0.get(0, 0) * mat1.get(0, 0))
            + (mat0.get(0, 1) * mat1.get(1, 0))
            + (mat0.get(0, 2) * mat1.get(2, 0))
            + (mat0.get(0, 3) * mat1.get(3, 0));
        var r10 = (mat0.get(1, 0) * mat1.get(0, 0))
            + (mat0.get(1, 1) * mat1.get(1, 0))
            + (mat0.get(1, 2) * mat1.get(2, 0))
            + (mat0.get(1, 3) * mat1.get(3, 0));
        var r20 = (mat0.get(2, 0) * mat1.get(0, 0))
            + (mat0.get(2, 1) * mat1.get(1, 0))
            + (mat0.get(2, 2) * mat1.get(2, 0))
            + (mat0.get(2, 3) * mat1.get(3, 0));
        var r30 = (mat0.get(3, 0) * mat1.get(0, 0))
            + (mat0.get(3, 1) * mat1.get(1, 0))
            + (mat0.get(3, 2) * mat1.get(2, 0))
            + (mat0.get(3, 3) * mat1.get(3, 0));
        var r01 = (mat0.get(0, 0) * mat1.get(0, 1))
            + (mat0.get(0, 1) * mat1.get(1, 1))
            + (mat0.get(0, 2) * mat1.get(2, 1))
            + (mat0.get(0, 3) * mat1.get(3, 1));
        var r11 = (mat0.get(1, 0) * mat1.get(0, 1))
            + (mat0.get(1, 1) * mat1.get(1, 1))
            + (mat0.get(1, 2) * mat1.get(2, 1))
            + (mat0.get(1, 3) * mat1.get(3, 1));
        var r21 = (mat0.get(2, 0) * mat1.get(0, 1))
            + (mat0.get(2, 1) * mat1.get(1, 1))
            + (mat0.get(2, 2) * mat1.get(2, 1))
            + (mat0.get(2, 3) * mat1.get(3, 1));
        var r31 = (mat0.get(3, 0) * mat1.get(0, 1))
            + (mat0.get(3, 1) * mat1.get(1, 1))
            + (mat0.get(3, 2) * mat1.get(2, 1))
            + (mat0.get(3, 3) * mat1.get(3, 1));
        var r02 = (mat0.get(0, 0) * mat1.get(0, 2))
            + (mat0.get(0, 1) * mat1.get(1, 2))
            + (mat0.get(0, 2) * mat1.get(2, 2))
            + (mat0.get(0, 3) * mat1.get(3, 2));
        var r12 = (mat0.get(1, 0) * mat1.get(0, 2))
            + (mat0.get(1, 1) * mat1.get(1, 2))
            + (mat0.get(1, 2) * mat1.get(2, 2))
            + (mat0.get(1, 3) * mat1.get(3, 2));
        var r22 = (mat0.get(2, 0) * mat1.get(0, 2))
            + (mat0.get(2, 1) * mat1.get(1, 2))
            + (mat0.get(2, 2) * mat1.get(2, 2))
            + (mat0.get(2, 3) * mat1.get(3, 2));
        var r32 = (mat0.get(3, 0) * mat1.get(0, 2))
            + (mat0.get(3, 1) * mat1.get(1, 2))
            + (mat0.get(3, 2) * mat1.get(2, 2))
            + (mat0.get(3, 3) * mat1.get(3, 2));
        var r03 = (mat0.get(0, 0) * mat1.get(0, 3))
            + (mat0.get(0, 1) * mat1.get(1, 3))
            + (mat0.get(0, 2) * mat1.get(2, 3))
            + (mat0.get(0, 3) * mat1.get(3, 3));
        var r13 = (mat0.get(1, 0) * mat1.get(0, 3))
            + (mat0.get(1, 1) * mat1.get(1, 3))
            + (mat0.get(1, 2) * mat1.get(2, 3))
            + (mat0.get(1, 3) * mat1.get(3, 3));
        var r23 = (mat0.get(2, 0) * mat1.get(0, 3))
            + (mat0.get(2, 1) * mat1.get(1, 3))
            + (mat0.get(2, 2) * mat1.get(2, 3))
            + (mat0.get(2, 3) * mat1.get(3, 3));
        var r33 = (mat0.get(3, 0) * mat1.get(0, 3))
            + (mat0.get(3, 1) * mat1.get(1, 3))
            + (mat0.get(3, 2) * mat1.get(2, 3))
            + (mat0.get(3, 3) * mat1.get(3, 3));

        // NOW PUT ALL THE CALCULATED VALUES IN THE result MATRIX
        result.set(r00, 0, 0);
        result.set(r10, 1, 0);
        result.set(r20, 2, 0);
        result.set(r30, 3, 0);
        result.set(r01, 0, 1);
        result.set(r11, 1, 1);
        result.set(r21, 2, 1);
        result.set(r31, 3, 1);
        result.set(r02, 0, 2);
        result.set(r12, 1, 2);
        result.set(r22, 2, 2);
        result.set(r32, 3, 2);
        result.set(r03, 0, 3);
        result.set(r13, 1, 3);
        result.set(r23, 2, 3);
        result.set(r33, 3, 3);
    }
    projection(result, nearZ, farZ, viewportWidth, viewportHeight, fovY) {
        var aspectRatio = viewportWidth / viewportHeight;
        var fieldOfViewY = this.math.degreesToRadians(fovY);
        var fieldOfViewX = 2 * Math.atan(Math.tan(fieldOfViewY / 2) * aspectRatio);

        // WE'LL USE THESE AS SHORTHAND FOR LOADING OUR MATRIX
        var n = nearZ;
        var f = farZ;
        var r = Math.tan(fieldOfViewX / 2) * n;
        var t = Math.tan(fieldOfViewY / 2) * n;

        // 0-3
        result.set(n / r, 0, 0);
        result.set(0.0, 0, 1);
        result.set(0.0, 0, 2);
        result.set(0.0, 0, 3);
        // 4-7
        result.set(0.0, 1, 0);
        result.set(n / t, 1, 1);
        result.set(0.0, 1, 2);
        result.set(0.0, 1, 3);
        // 8-11
        result.set(0.0, 2, 0);
        result.set(0.0, 2, 1);
        result.set((-(f + n)) / (f - n), 2, 2);
        result.set((-2 * f * n) / (f - n), 2, 3);
        // 12-15 
        result.set(0.0, 3, 0);
        result.set(0.0, 3, 1);
        result.set(-1.0, 3, 2);
        result.set(0.0, 3, 3);
    }
    rotate(result, rotationVector) {
        // START WITH THE X-AXIS ROTATION
        var xRotationMatrix = this.createMatrix(4, 4);
        this.identity(xRotationMatrix);
        var thetaX = rotationVector.getThetaX();
        xRotationMatrix.set(Math.cos(thetaX), 1, 1);
        xRotationMatrix.set(Math.sin(thetaX), 2, 1);
        xRotationMatrix.set(-1 * Math.sin(thetaX), 1, 2);
        xRotationMatrix.set(Math.cos(thetaX), 2, 2);

        // START WITH THE Y-AXIS ROTATION
        var yRotationMatrix = this.createMatrix(4, 4);
        this.identity(yRotationMatrix);
        var thetaY = rotationVector.getThetaY();
        yRotationMatrix.set(Math.cos(thetaY), 0, 0);
        yRotationMatrix.set(-1 * Math.sin(thetaY), 2, 0);
        yRotationMatrix.set(Math.sin(thetaY), 0, 2);
        yRotationMatrix.set(Math.cos(thetaY), 2, 2);

        // START WITH THE Z-AXIS ROTATION
        var zRotationMatrix = this.createMatrix(4, 4);
        this.identity(zRotationMatrix);
        var thetaZ = rotationVector.getThetaZ();
        zRotationMatrix.set(Math.cos(thetaZ), 0, 0);
        zRotationMatrix.set(Math.sin(thetaZ), 1, 0);
        zRotationMatrix.set(-1 * Math.sin(thetaZ), 0, 1);
        zRotationMatrix.set(Math.cos(thetaZ), 1, 1);

        // START WITH THE X-AXIS ROTATION
        var tempMatrix = this.createMatrix(4, 4);
        this.identity(tempMatrix);
        this.multiply(tempMatrix, xRotationMatrix, yRotationMatrix);
        this.multiply(result, tempMatrix, zRotationMatrix);
    }
    scale(result, scaleVector) {
        // START WITH THE IDENTITY MATRIX
        this.identity(result, scaleVector);

        // AND THEN LOAD IN THE TRANSLATION VALUES
        result.set(scaleVector.getX(), 0, 0);
        result.set(scaleVector.getY(), 1, 1);
        result.set(scaleVector.getZ(), 2, 2);
    }
    transform(result, mat, vec) {
        result.set((mat.get(0, 0) * vec.getX()) + (mat.get(0, 1) * vec.getY()) + (mat.get(0, 2) * vec.getZ()) + (mat.get(0, 3) * vec.getW()), 0);
        result.set((mat.get(1, 0) * vec.getX()) + (mat.get(1, 1) * vec.getY()) + (mat.get(1, 2) * vec.getZ()) + (mat.get(1, 3) * vec.getW()), 1);
        result.set((mat.get(2, 0) * vec.getX()) + (mat.get(2, 1) * vec.getY()) + (mat.get(2, 2) * vec.getZ()) + (mat.get(2, 3) * vec.getW()), 2);
        result.set((mat.get(3, 0) * vec.getX()) + (mat.get(3, 1) * vec.getY()) + (mat.get(3, 2) * vec.getZ()) + (mat.get(3, 3) * vec.getW()), 3);
    }
    translate(result, translationVector) {
        // START WITH THE IDENTITY MATRIX
        this.identity(result);

        // AND THEN LOAD IN THE TRANSLATION VALUES
        result.set(translationVector.getX(), 0, 3);
        result.set(translationVector.getY(), 1, 3);
        result.set(translationVector.getZ(), 2, 3);
    }
    transpose(result, mat) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var temp = mat.get(i, j);
                result.set(temp, j, i);
            }
        }
    }
    view(result, cameraPosition, cameraOrientation) {
        var pitch = this.math.degreesToRadians(cameraOrientation.getThetaX());
        var yaw = this.math.degreesToRadians(cameraOrientation.getThetaY());
        var roll = this.math.degreesToRadians(cameraOrientation.getThetaZ());

        // TO TRANSLATE
        var translateVector = this.math.vectorMath.createPositionVector();
        translateVector.set(-cameraPosition.getX(), -cameraPosition.getY(), -cameraPosition.getZ());
        var translateMatrix = this.createMatrix(4, 4);
        this.identity(translateMatrix);
        this.translate(translateMatrix, translateVector);

        // TO ROTATE
        var rotateVector = this.math.vectorMath.createRotationVector();
        rotateVector.set(-pitch, -yaw, -roll);
        var rotateMatrix = this.createMatrix(4, 4);
        this.rotate(rotateMatrix, rotateVector);

        // NOW COMBINE THE 2 MATRICES
        this.multiply(result, rotateMatrix, translateMatrix);
    }
    addVectors(result, vec0, vec1) {
        for (var i = 0; i < vec0.size; i++) {
            var total = vec0[i] + vec1[i];
            result[i] = total;
        }
    }
    createPositionVector() {
        var vector = new Float32Array(4);
        for (var i = 0; i < 4; i++)
            vector[i] = 0.0;
        vector.size = 4;
        vector.setX = function (x) { vector[0] = x; }
        vector.setY = function (y) { vector[1] = y; }
        vector.setZ = function (z) { vector[2] = z; }
        vector.setW = function (w) { vector[3] = w; }
        vector.set = function (x, y, z, w) {
            vector.setX(x);
            vector.setY(y);
            vector.setZ(z);
            vector.setW(w);
        }
        vector.getX = function () { return vector[0]; }
        vector.getY = function () { return vector[1]; }
        vector.getZ = function () { return vector[2]; }
        vector.getW = function () { return vector[3]; }
        vector.print = function () {
            var text = "[";
            for (var i = 0; i < vector.size; i++) {
                text += vector[i];
                if (i < (vector.size - 1)) {
                    text += ", ";
                }
            }
            text += "]";
            console.log(text);
        }
        return vector;
    }
    createRotationVector() {
        var vector = new Float32Array(4);
        for (var i = 0; i < 4; i++)
            vector[i] = 0.0;
        vector.size = 3;
        vector.setThetaX = function (thetaX) { vector[0] = thetaX; }
        vector.setThetaY = function (thetaY) { vector[1] = thetaY; }
        vector.setThetaZ = function (thetaZ) { vector[2] = thetaZ; }
        vector.set = function (thetaX, thetaY, thetaZ) {
            vector.setThetaX(thetaX);
            vector.setThetaY(thetaY);
            vector.setThetaZ(thetaZ);
        }
        vector.getThetaX = function () { return vector[0]; }
        vector.getThetaY = function () { return vector[1]; }
        vector.getThetaZ = function () { return vector[2]; }
        vector.print = function () {
            var text = "[";
            for (var i = 0; i < vector.size; i++) {
                text += vector[i];
                if (i < (vector.size - 1)) {
                    text += ", ";
                }
            }
            text += "]";
            console.log(text);
        }
        return vector;
    }
    crossProduct(result, vec0, vec1) {
        var result0 = (vec0[1] * vec1[2])
            - (vec1[1] * vec0[2]);
        var result1 = (vec0[2] * vec1[0])
            - (vec1[2] * vec0[0]);
        var result2 = (vec0[0] * vec1[1])
            - (vec1[0] * vec0[1]);
        result[0] = result0;
        result[1] = result1;
        result[2] = result2;
    }
    dotProduct(vec0, vec1) {
        var resultX = vec0.getX() * vec1.getX();
        var resultY = vec0.getY() * vec1.getY();
        var resultZ = vec0.getZ() * vec1.getZ();
        return resultX + resultY + resultZ;
    }
    multiplyVectors(result, vec, scalar) {
        var vec0 = vec[0] * scalar;
        var vec1 = vec[1] * scalar;
        var vec2 = vec[2] * scalar;
        result[0] = vec0;
        result[1] = vec1;
        result[2] = vec2;
    }
    normalize(result, vec) {
        var xSquared = vec.getX() * vec.getX();
        var ySquared = vec.getY() * vec.getY();
        var zSquared = vec.getZ() * vec.getZ();
        var distance = Math.sqrt(xSquared + ySquared + zSquared);
        result.setX(vec.getX() / distance);
        result.setY(vec.getY() / distance);
        result.setZ(vec.getZ() / distance);
    }
    subtractVectors(result, vec0, vec1) {
        var result0 = vec0[0] - vec1[0];
        var result1 = vec0[1] - vec1[1];
        var result2 = vec0[2] - vec1[2];
        result[0] = result0;
        result[1] = result1;
        result[2] = result2;
    }
}