"use strict";

// ============================================================
// Core Math / Utility / Camera Tests
// ============================================================
// Load order in test-runner.html:
//   MathConstants.js -> Vector2D.js -> Utility.js -> Camera.js -> test-runner.js -> this file
// ============================================================

// --------------- Vector2D ---------------

describe("Vector2D", function () {

    it("new Vector2D() creates with x=0, y=0", function () {
        var v = new Vector2D();
        assertEquals(0.0, v.x);
        assertEquals(0.0, v.y);
    });

    it("setXY(x, y) sets both coordinates", function () {
        var v = new Vector2D();
        v.setXY(3.5, -2.1);
        assertEquals(3.5, v.x);
        assertEquals(-2.1, v.y);
    });

    it("copyFrom(v) copies coordinates", function () {
        var src = new Vector2D();
        src.setXY(10, 20);
        var dst = new Vector2D();
        dst.copyFrom(src);
        assertEquals(10, dst.x);
        assertEquals(20, dst.y);
    });

    it("add(v) adds vector components", function () {
        var v = new Vector2D();
        v.setXY(1, 2);
        var other = new Vector2D();
        other.setXY(3, 4);
        v.add(other);
        assertEquals(4, v.x);
        assertEquals(6, v.y);
    });

    it("subtract(v) subtracts vector components", function () {
        var v = new Vector2D();
        v.setXY(10, 20);
        var other = new Vector2D();
        other.setXY(3, 4);
        v.subtract(other);
        assertEquals(7, v.x);
        assertEquals(16, v.y);
    });

    it("scale(s) scales vector components", function () {
        var v = new Vector2D();
        v.setXY(2, 3);
        v.scale(5);
        assertEquals(10, v.x);
        assertEquals(15, v.y);
    });

    it("getMagnitude() returns correct magnitude (3-4-5 triangle)", function () {
        var v = new Vector2D();
        v.setXY(3, 4);
        assertEquals(5, v.getMagnitude());
    });

    it("getMagnitude() returns 0 for zero vector", function () {
        var v = new Vector2D();
        assertEquals(0, v.getMagnitude());
    });

    it("getMagnitudeSquared() returns squared magnitude", function () {
        var v = new Vector2D();
        v.setXY(3, 4);
        assertEquals(25, v.getMagnitudeSquared());
    });

    it("normalize() normalizes to unit length", function () {
        var v = new Vector2D();
        v.setXY(3, 4);
        v.normalize();
        assertClose(1.0, v.getMagnitude(), 1e-10);
    });

    it("normalize() on zero vector returns (1, 0)", function () {
        var v = new Vector2D();
        v.normalize();
        assertEquals(1.0, v.x);
        assertEquals(0.0, v.y);
    });

    it("dotWith(v) returns dot product", function () {
        var a = new Vector2D();
        a.setXY(1, 2);
        var b = new Vector2D();
        b.setXY(3, 4);
        assertEquals(11, a.dotWith(b));
    });

    it("dotWith(v) returns 0 for orthogonal vectors", function () {
        var a = new Vector2D();
        a.setXY(1, 0);
        var b = new Vector2D();
        b.setXY(0, 1);
        assertEquals(0, a.dotWith(b));
    });

    it("clear() resets to 0,0", function () {
        var v = new Vector2D();
        v.setXY(99, -42);
        v.clear();
        assertEquals(0.0, v.x);
        assertEquals(0.0, v.y);
    });

    it("getDistanceTo(v) returns correct distance", function () {
        var a = new Vector2D();
        a.setXY(0, 0);
        var b = new Vector2D();
        b.setXY(3, 4);
        assertEquals(5, a.getDistanceTo(b));
    });

    it("getDistanceTo(v) returns 0 for same position", function () {
        var a = new Vector2D();
        a.setXY(5, 5);
        var b = new Vector2D();
        b.setXY(5, 5);
        assertEquals(0, a.getDistanceTo(b));
    });

    it("getDistanceSquaredTo(v) returns squared distance", function () {
        var a = new Vector2D();
        a.setXY(0, 0);
        var b = new Vector2D();
        b.setXY(3, 4);
        assertEquals(25, a.getDistanceSquaredTo(b));
    });

    it("setToPerpendicular() rotates 90 degrees", function () {
        var v = new Vector2D();
        v.setXY(1, 0);
        v.setToPerpendicular();
        assertEquals(0, v.x);
        assertEquals(-1, v.y);
    });

    it("setToPerpendicular() on (0, 1) yields (1, 0)", function () {
        var v = new Vector2D();
        v.setXY(0, 1);
        v.setToPerpendicular();
        assertEquals(1, v.x);
        assertEquals(0, v.y);
    });

    it("setToPerpendicular() produces orthogonal vector (dot = 0)", function () {
        var original = new Vector2D();
        original.setXY(3, 7);
        var v = new Vector2D();
        v.copyFrom(original);
        v.setToPerpendicular();
        assertEquals(0, original.dotWith(v));
    });

    it("addScaled(v, s) adds scaled vector", function () {
        var v = new Vector2D();
        v.setXY(1, 2);
        var other = new Vector2D();
        other.setXY(3, 4);
        v.addScaled(other, 2);
        assertEquals(7, v.x);  // 1 + 3*2
        assertEquals(10, v.y); // 2 + 4*2
    });

    it("subtractScaled(v, s) subtracts scaled vector", function () {
        var v = new Vector2D();
        v.setXY(10, 20);
        var other = new Vector2D();
        other.setXY(1, 2);
        v.subtractScaled(other, 3);
        assertEquals(7, v.x);  // 10 - 1*3
        assertEquals(14, v.y); // 20 - 2*3
    });
});

// --------------- MathConstants ---------------

describe("MathConstants", function () {

    it("NULL_INDEX === -1", function () {
        assertEquals(-1, NULL_INDEX);
    });

    it("BYTE_SIZE === 256", function () {
        assertEquals(256, BYTE_SIZE);
    });

    it("ZERO === 0.0", function () {
        assertEquals(0.0, ZERO);
    });

    it("ONE === 1.0", function () {
        assertEquals(1.0, ONE);
    });

    it("ONE_HALF === 0.5", function () {
        assertEquals(0.5, ONE_HALF);
    });

    it("PI2 is approximately 2 * Math.PI", function () {
        assertClose(Math.PI * 2.0, PI2, 1e-10);
    });

    it("MILLISECONDS_PER_SECOND === 1000", function () {
        assertEquals(1000, MILLISECONDS_PER_SECOND);
    });
});

// --------------- Utility functions ---------------

describe("Utility functions", function () {

    it("assert(true, 'msg') does not throw", function () {
        // Should complete without throwing
        assert(true, "this should pass");
    });

    it("assert(false, 'msg') does not throw (logs to console.error)", function () {
        // The current implementation uses console.error, not throw
        assert(false, "this should not throw");
    });

    it("getRandomAngleInDegrees() returns value in [-180, 180)", function () {
        for (var i = 0; i < 100; i++) {
            var angle = getRandomAngleInDegrees();
            assertTrue(angle >= -180.0, "angle " + angle + " < -180");
            assertTrue(angle < 180.0, "angle " + angle + " >= 180");
        }
    });

    it("Color() creates with red=0, green=0, blue=0", function () {
        var c = new Color();
        assertEquals(0, c.red);
        assertEquals(0, c.green);
        assertEquals(0, c.blue);
    });

    it("Color properties are settable", function () {
        var c = new Color();
        c.red = 255;
        c.green = 128;
        c.blue = 64;
        assertEquals(255, c.red);
        assertEquals(128, c.green);
        assertEquals(64, c.blue);
    });
});

// --------------- Camera class ---------------

describe("Camera", function () {

    it("new Camera() creates with default position (0,0)", function () {
        var cam = new Camera();
        var pos = cam.getPosition();
        assertEquals(0, pos.x);
        assertEquals(0, pos.y);
    });

    it("new Camera() creates with default scale 1", function () {
        var cam = new Camera();
        assertEquals(1, cam.getScale());
    });

    it("setPosition(v) then getPosition() returns same coordinates", function () {
        var cam = new Camera();
        var pos = new Vector2D();
        pos.setXY(42, -17);
        cam.setPosition(pos);
        var result = cam.getPosition();
        assertEquals(42, result.x);
        assertEquals(-17, result.y);
    });

    it("setScale(s) then getScale() returns same scale", function () {
        var cam = new Camera();
        cam.setScale(2.5);
        assertEquals(2.5, cam.getScale());
    });

    it("setAspectRatio(a) sets the aspect ratio", function () {
        var cam = new Camera();
        cam.setAspectRatio(16 / 9);
        assertClose(16 / 9, cam._aspectRatio, 1e-10);
    });

    it("panLeft() modifies velocity.x negatively", function () {
        var cam = new Camera();
        cam._secondsDelta = 0.016; // ~60 fps
        var before = cam._velocity.x;
        cam.panLeft();
        assertTrue(cam._velocity.x < before);
    });

    it("panRight() modifies velocity.x positively", function () {
        var cam = new Camera();
        cam._secondsDelta = 0.016;
        var before = cam._velocity.x;
        cam.panRight();
        assertTrue(cam._velocity.x > before);
    });

    it("panUp() modifies velocity.y negatively", function () {
        var cam = new Camera();
        cam._secondsDelta = 0.016;
        var before = cam._velocity.y;
        cam.panUp();
        assertTrue(cam._velocity.y < before);
    });

    it("panDown() modifies velocity.y positively", function () {
        var cam = new Camera();
        cam._secondsDelta = 0.016;
        var before = cam._velocity.y;
        cam.panDown();
        assertTrue(cam._velocity.y > before);
    });

    it("zoomIn() modifies scaleDelta negatively", function () {
        var cam = new Camera();
        cam._secondsDelta = 0.016;
        cam.zoomIn();
        assertTrue(cam._scaleDelta < 0);
    });

    it("zoomOut() modifies scaleDelta positively", function () {
        var cam = new Camera();
        cam._secondsDelta = 0.016;
        cam.zoomOut();
        assertTrue(cam._scaleDelta > 0);
    });

    it("getPosition() returns a new object each call (not shared reference)", function () {
        var cam = new Camera();
        var pos1 = cam.getPosition();
        var pos2 = cam.getPosition();
        assertTrue(pos1 !== pos2, "getPosition should return a new object each time");
    });

    it("getPosition() mutation does not affect internal position", function () {
        var cam = new Camera();
        var pos = new Vector2D();
        pos.setXY(100, 200);
        cam.setPosition(pos);

        var result = cam.getPosition();
        result.x = 9999;
        result.y = 9999;

        var after = cam.getPosition();
        assertEquals(100, after.x);
        assertEquals(200, after.y);
    });

    it("setScale resets scaleDelta to zero", function () {
        var cam = new Camera();
        cam._scaleDelta = 5.0;
        cam.setScale(1.5);
        assertEquals(0, cam._scaleDelta);
    });

    it("setPosition resets velocity to zero", function () {
        var cam = new Camera();
        cam._velocity.setXY(10, 20);
        var pos = new Vector2D();
        pos.setXY(0, 0);
        cam.setPosition(pos);
        assertEquals(0, cam._velocity.x);
        assertEquals(0, cam._velocity.y);
    });
});
