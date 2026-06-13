"use strict";

/*
 * Tests for simulation entities: Brain, FoodBit, Touch, Swimbot.
 *
 * Load order in test harness:
 *   MathConstants.js -> Vector2D.js -> Utility.js -> Color.js -> SwimbotTypes.js
 *   -> Parameters.js -> Brain.js -> FoodBit.js -> Touch.js -> Genotype.js
 *   -> Embryology.js -> SwimbotRenderer.js -> Swimbot.js -> test-runner.js -> this file
 *
 * Call runTests() from the test harness page to execute.
 */

// ============================================================
// Brain class
// ============================================================

describe("Brain", function () {

    it("new Brain() creates with default state BRAIN_STATE_NULL", function () {
        var brain = new Brain();
        assertEquals(BRAIN_STATE_NULL, brain.getState());
    });

    it("new Brain() creates with default energy ZERO", function () {
        var brain = new Brain();
        assertEquals(ZERO, brain._energy);
    });

    it("new Brain() creates with default attraction ATTRACTION_SIMILAR_COLOR", function () {
        var brain = new Brain();
        assertEquals(ATTRACTION_SIMILAR_COLOR, brain.getAttractionCriterion());
    });

    it("new Brain() creates with foundFoodBit false", function () {
        var brain = new Brain();
        assertFalse(brain._foundFoodBit);
    });

    it("new Brain() creates with foundSwimbot false", function () {
        var brain = new Brain();
        assertFalse(brain._foundSwimbot);
    });

    it("initialize() resets brain state to BRAIN_STATE_NULL", function () {
        var brain = new Brain();
        brain._state = BRAIN_STATE_LOOKING_FOR_FOOD;
        brain.initialize();
        assertEquals(BRAIN_STATE_NULL, brain.getState());
    });

    it("setEnergyLevel(e) sets the energy", function () {
        var brain = new Brain();
        brain.setEnergyLevel(75.0);
        assertEquals(75.0, brain._energy);
    });

    it("setHungerThreshold(h) then getHungerThreshold() returns same value", function () {
        var brain = new Brain();
        brain.setHungerThreshold(42.0);
        assertEquals(42.0, brain.getHungerThreshold());
    });

    it("setAttraction(a) then getAttractionCriterion() returns same value", function () {
        var brain = new Brain();
        brain.setAttraction(ATTRACTION_BIG);
        assertEquals(ATTRACTION_BIG, brain.getAttractionCriterion());
    });

    it("setAttraction(a) resets foundSwimbot to false", function () {
        var brain = new Brain();
        brain._foundSwimbot = true;
        brain.setAttraction(ATTRACTION_SMALL);
        assertFalse(brain._foundSwimbot);
    });

    it("getState() returns valid brain state constant (>= NULL, < NUM)", function () {
        var brain = new Brain();
        var state = brain.getState();
        assertTrue(state >= BRAIN_STATE_NULL, "state >= BRAIN_STATE_NULL");
        assertTrue(state < NUM_BRAIN_STATES, "state < NUM_BRAIN_STATES");
    });

    it("update() with low energy transitions to LOOKING_FOR_FOOD", function () {
        var brain = new Brain();
        brain.setEnergyLevel(10.0);
        brain.setHungerThreshold(50.0);
        brain.update();
        assertEquals(BRAIN_STATE_LOOKING_FOR_FOOD, brain.getState());
    });

    it("update() with high energy transitions to LOOKING_FOR_MATE", function () {
        var brain = new Brain();
        brain.setEnergyLevel(90.0);
        brain.setHungerThreshold(50.0);
        brain.update();
        assertEquals(BRAIN_STATE_LOOKING_FOR_MATE, brain.getState());
    });

    it("update() from LOOKING_FOR_FOOD to PURSUING_FOOD when food found", function () {
        var brain = new Brain();
        brain.setEnergyLevel(10.0);
        brain.setHungerThreshold(50.0);
        brain.update(); // transitions to LOOKING_FOR_FOOD
        assertEquals(BRAIN_STATE_LOOKING_FOR_FOOD, brain.getState());

        brain.setFoundFoodBit(true);
        brain.update();
        assertEquals(BRAIN_STATE_PURSUING_FOOD, brain.getState());
    });

    it("update() from PURSUING_FOOD back to LOOKING_FOR_FOOD when food lost", function () {
        var brain = new Brain();
        brain.setEnergyLevel(10.0);
        brain.setHungerThreshold(50.0);
        brain.update(); // LOOKING_FOR_FOOD
        brain.setFoundFoodBit(true);
        brain.update(); // PURSUING_FOOD
        assertEquals(BRAIN_STATE_PURSUING_FOOD, brain.getState());

        brain.setFoundFoodBit(false);
        brain.update();
        assertEquals(BRAIN_STATE_LOOKING_FOR_FOOD, brain.getState());
    });

    it("update() from LOOKING_FOR_MATE to PURSUING_MATE when mate found", function () {
        var brain = new Brain();
        brain.setEnergyLevel(90.0);
        brain.setHungerThreshold(50.0);
        brain.update(); // transitions to LOOKING_FOR_MATE
        assertEquals(BRAIN_STATE_LOOKING_FOR_MATE, brain.getState());

        brain.setFoundSwimbot(true);
        brain.update();
        assertEquals(BRAIN_STATE_PURSUING_MATE, brain.getState());
    });

    it("update() from PURSUING_MATE back to LOOKING_FOR_MATE when mate lost", function () {
        var brain = new Brain();
        brain.setEnergyLevel(90.0);
        brain.setHungerThreshold(50.0);
        brain.update(); // LOOKING_FOR_MATE
        brain.setFoundSwimbot(true);
        brain.update(); // PURSUING_MATE
        assertEquals(BRAIN_STATE_PURSUING_MATE, brain.getState());

        brain.setFoundSwimbot(false);
        brain.update();
        assertEquals(BRAIN_STATE_LOOKING_FOR_MATE, brain.getState());
    });

    it("update() switches from mate pursuit to food when energy drops", function () {
        var brain = new Brain();
        brain.setEnergyLevel(90.0);
        brain.setHungerThreshold(50.0);
        brain.update(); // LOOKING_FOR_MATE
        assertEquals(BRAIN_STATE_LOOKING_FOR_MATE, brain.getState());

        brain.setEnergyLevel(10.0);
        brain.update();
        assertEquals(BRAIN_STATE_LOOKING_FOR_FOOD, brain.getState());
    });

    it("update() does not throw with valid state transitions", function () {
        var brain = new Brain();
        brain.setEnergyLevel(50.0);
        brain.setHungerThreshold(50.0);
        // energy >= threshold so it should go to LOOKING_FOR_MATE
        (function () {
            brain.update();
        })();
    });

    it("setFoundFoodBit(true) sets the flag", function () {
        var brain = new Brain();
        brain.setFoundFoodBit(true);
        assertTrue(brain._foundFoodBit);
    });

    it("setFoundFoodBit(false) clears the flag", function () {
        var brain = new Brain();
        brain._foundFoodBit = true;
        brain.setFoundFoodBit(false);
        assertFalse(brain._foundFoodBit);
    });

    it("setFoundSwimbot(true) sets the flag", function () {
        var brain = new Brain();
        brain.setFoundSwimbot(true);
        assertTrue(brain._foundSwimbot);
    });

    it("setFoundSwimbot(false) clears the flag", function () {
        var brain = new Brain();
        brain._foundSwimbot = true;
        brain.setFoundSwimbot(false);
        assertFalse(brain._foundSwimbot);
    });
});

// ============================================================
// FoodBit class
// ============================================================

describe("FoodBit", function () {

    it("new FoodBit() creates instance", function () {
        var fb = new FoodBit();
        assertNotNull(fb);
    });

    it("new FoodBit() creates with dead state (index === NULL_INDEX)", function () {
        var fb = new FoodBit();
        assertFalse(fb.getAlive());
        assertEquals(NULL_INDEX, fb.getIndex());
    });

    it("initialize(index) sets up food bit with given index", function () {
        var fb = new FoodBit();
        fb.initialize(42);
        assertEquals(42, fb.getIndex());
        assertTrue(fb.getAlive());
    });

    it("initialize() sets energy to DEFAULT_FOOD_BIT_ENERGY", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        assertEquals(DEFAULT_FOOD_BIT_ENERGY, fb.getEnergy());
    });

    it("initialize() sets type to 0", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        assertEquals(0, fb.getType());
    });

    it("initialize() sets position within pool bounds", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        var pos = fb.getPosition();
        assertTrue(pos.x >= POOL_LEFT, "x >= POOL_LEFT");
        assertTrue(pos.x <= POOL_RIGHT, "x <= POOL_RIGHT");
        assertTrue(pos.y >= POOL_TOP, "y >= POOL_TOP");
        assertTrue(pos.y <= POOL_HEIGHT + POOL_TOP, "y <= POOL_BOTTOM");
    });

    it("setPosition(v) then getPosition() returns same coordinates", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);
        fb.setPosition(pos);
        var result = fb.getPosition();
        assertEquals(POOL_LEFT + 100, result.x);
        assertEquals(POOL_TOP + 100, result.y);
    });

    it("setPosition(v) clamps out-of-bounds coordinates to pool", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT - 100, POOL_TOP - 100);
        fb.setPosition(pos);
        var result = fb.getPosition();
        assertTrue(result.x >= POOL_LEFT, "clamped x >= POOL_LEFT");
        assertTrue(result.y >= POOL_TOP, "clamped y >= POOL_TOP");
    });

    it("setEnergy(e) then getEnergy() returns same value", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        fb.setEnergy(37.5);
        assertEquals(37.5, fb.getEnergy());
    });

    it("setEnergy(e) accepts MIN_FOOD_BIT_ENERGY", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        fb.setEnergy(MIN_FOOD_BIT_ENERGY);
        assertEquals(MIN_FOOD_BIT_ENERGY, fb.getEnergy());
    });

    it("setEnergy(e) accepts MAX_FOOD_BIT_ENERGY", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        fb.setEnergy(MAX_FOOD_BIT_ENERGY);
        assertEquals(MAX_FOOD_BIT_ENERGY, fb.getEnergy());
    });

    it("setType(t) then getType() returns same type", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        fb.setType(1);
        assertEquals(1, fb.getType());
    });

    it("getType() returns 0 after initialize", function () {
        var fb = new FoodBit();
        fb.initialize(5);
        assertEquals(0, fb.getType());
    });

    it("getIndex() returns the initialization index", function () {
        var fb = new FoodBit();
        fb.initialize(99);
        assertEquals(99, fb.getIndex());
    });

    it("getAlive() returns true after initialize", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        assertTrue(fb.getAlive());
    });

    it("kill() marks as dead", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        assertTrue(fb.getAlive());
        fb.kill();
        assertFalse(fb.getAlive());
    });

    it("kill() sets index to NULL_INDEX", function () {
        var fb = new FoodBit();
        fb.initialize(77);
        fb.kill();
        assertEquals(NULL_INDEX, fb.getIndex());
    });

    it("setMaxSpawnRadius(r) then getMaxSpawnRadius() returns same value", function () {
        var fb = new FoodBit();
        fb.setMaxSpawnRadius(500.0);
        assertEquals(500.0, fb.getMaxSpawnRadius());
    });

    it("new FoodBit() has default max spawn radius", function () {
        var fb = new FoodBit();
        assertEquals(DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS, fb.getMaxSpawnRadius());
    });

    it("update() increases opacity from zero toward ONE", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        assertEquals(ZERO, fb._opacity);
        fb.update();
        assertTrue(fb._opacity > ZERO, "opacity should increase after update");
    });

    it("update() caps opacity at ONE", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        fb._opacity = ONE;
        fb.update();
        assertEquals(ONE, fb._opacity);
    });

    it("shiftPosition(s) adds offset to position", function () {
        var fb = new FoodBit();
        fb.initialize(0);
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);
        fb.setPosition(pos);
        var shift = new Vector2D();
        shift.setXY(10, -5);
        fb.shiftPosition(shift);
        var result = fb.getPosition();
        assertEquals(POOL_LEFT + 110, result.x);
        assertEquals(POOL_TOP + 95, result.y);
    });
});

// ============================================================
// Touch class
// ============================================================

describe("Touch", function () {

    it("new Touch() creates with BEEN_UP state", function () {
        var touch = new Touch();
        assertEquals(TouchState.BEEN_UP, touch.getState());
    });

    it("new Touch() creates with position (0, 0)", function () {
        var touch = new Touch();
        assertEquals(ZERO, touch._x);
        assertEquals(ZERO, touch._y);
    });

    it("setToDown(x, y) sets BEEN_DOWN state after update", function () {
        var touch = new Touch();
        touch.setToDown(100, 200);
        assertEquals(TouchState.JUST_DOWN, touch.getState());
        touch.update();
        assertEquals(TouchState.BEEN_DOWN, touch.getState());
    });

    it("setToDown(x, y) sets position", function () {
        var touch = new Touch();
        touch.setToDown(100, 200);
        assertEquals(100, touch._x);
        assertEquals(200, touch._y);
    });

    it("setToUp(x, y) sets BEEN_UP state after update", function () {
        var touch = new Touch();
        touch.setToUp(50, 60);
        assertEquals(TouchState.JUST_UP, touch.getState());
        touch.update();
        assertEquals(TouchState.BEEN_UP, touch.getState());
    });

    it("setToUp(x, y) sets position", function () {
        var touch = new Touch();
        touch.setToUp(50, 60);
        assertEquals(50, touch._x);
        assertEquals(60, touch._y);
    });

    it("setToMove(x, y) updates position without changing state", function () {
        var touch = new Touch();
        touch.setToDown(10, 10); // JUST_DOWN
        touch.setToMove(30, 40);
        assertEquals(TouchState.JUST_DOWN, touch.getState());
        assertEquals(30, touch._x);
        assertEquals(40, touch._y);
    });

    it("getVelocityX() returns difference after moves", function () {
        var touch = new Touch();
        touch.setToMove(100, 0);
        touch.update(); // previousX becomes 100
        touch.setToMove(120, 0);
        touch.update(); // previousX becomes 120
        touch.setToMove(150, 0);
        assertEquals(30, touch.getVelocityX());
    });

    it("getVelocityY() returns difference after moves", function () {
        var touch = new Touch();
        touch.setToMove(0, 100);
        touch.update();
        touch.setToMove(0, 120);
        touch.update();
        touch.setToMove(0, 170);
        assertEquals(50, touch.getVelocityY());
    });

    it("getVelocityX() returns 0 when no movement", function () {
        var touch = new Touch();
        touch.setToMove(50, 50);
        touch.update();
        touch.setToMove(50, 50);
        assertEquals(0, touch.getVelocityX());
    });

    it("getVelocityY() returns 0 when no movement", function () {
        var touch = new Touch();
        touch.setToMove(50, 50);
        touch.update();
        touch.setToMove(50, 50);
        assertEquals(0, touch.getVelocityY());
    });

    it("getState() returns current state constant", function () {
        var touch = new Touch();
        assertEquals(TouchState.BEEN_UP, touch.getState());
        touch.setToDown(0, 0);
        assertEquals(TouchState.JUST_DOWN, touch.getState());
    });

    it("update() transitions JUST_DOWN to BEEN_DOWN", function () {
        var touch = new Touch();
        touch.setToDown(0, 0);
        touch.update();
        assertEquals(TouchState.BEEN_DOWN, touch.getState());
    });

    it("update() transitions JUST_UP to BEEN_UP", function () {
        var touch = new Touch();
        touch.setToUp(0, 0);
        touch.update();
        assertEquals(TouchState.BEEN_UP, touch.getState());
    });

    it("update() leaves BEEN_DOWN unchanged", function () {
        var touch = new Touch();
        touch.setToDown(0, 0);
        touch.update(); // -> BEEN_DOWN
        touch.update(); // stays BEEN_DOWN
        assertEquals(TouchState.BEEN_DOWN, touch.getState());
    });

    it("update() leaves BEEN_UP unchanged", function () {
        var touch = new Touch();
        assertEquals(TouchState.BEEN_UP, touch.getState());
        touch.update();
        assertEquals(TouchState.BEEN_UP, touch.getState());
    });
});

// ============================================================
// Swimbot class
// ============================================================

describe("Swimbot", function () {

    it("new Swimbot() creates instance", function () {
        var sb = new Swimbot();
        assertNotNull(sb);
    });

    it("getAlive() returns false initially", function () {
        var sb = new Swimbot();
        assertFalse(sb.getAlive());
    });

    it("getIndex() returns NULL_INDEX initially", function () {
        var sb = new Swimbot();
        assertEquals(NULL_INDEX, sb.getIndex());
    });

    it("getAge() returns 0 initially", function () {
        var sb = new Swimbot();
        assertEquals(0, sb.getAge());
    });

    it("getEnergy() returns ZERO initially", function () {
        var sb = new Swimbot();
        assertEquals(ZERO, sb.getEnergy());
    });

    it("create() creates a live swimbot", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(1, 0, pos, 0.0, 100.0, genotype, embryology);
        assertTrue(sb.getAlive());
    });

    it("getIndex() returns the creation index after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(42, 0, pos, 0.0, 100.0, genotype, embryology);
        assertEquals(42, sb.getIndex());
    });

    it("getAge() returns the creation age after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 500, pos, 0.0, 100.0, genotype, embryology);
        assertEquals(500, sb.getAge());
    });

    it("getPosition() returns the creation position after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 200, POOL_TOP + 300);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var result = sb.getPosition();
        assertEquals(POOL_LEFT + 200, result.x);
        assertEquals(POOL_TOP + 300, result.y);
    });

    it("getEnergy() returns the creation energy after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 75.0, genotype, embryology);
        assertEquals(75.0, sb.getEnergy());
    });

    it("getNumParts() returns valid part count (>= MIN_PARTS)", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertTrue(sb.getNumParts() >= MIN_PARTS, "numParts >= MIN_PARTS");
    });

    it("getNumParts() returns value <= MAX_PARTS", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertTrue(sb.getNumParts() <= MAX_PARTS, "numParts <= MAX_PARTS");
    });

    it("getGenotype() returns the genotype after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(200);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var resultGenotype = sb.getGenotype();
        assertNotNull(resultGenotype);
        assertEquals(200, resultGenotype.getGeneValue(0));
    });

    it("die() marks as dead, getAlive() returns false", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertTrue(sb.getAlive());

        // mock _parent to avoid null reference when die() notifies death time
        sb._parent = { notifySwimbotDeathTime: function () { } };
        sb.die();
        assertFalse(sb.getAlive());
    });

    it("die() with NULL_INDEX does not require _parent", function () {
        var sb = new Swimbot();
        sb._index = NULL_INDEX;
        sb._alive = true;
        sb.die();
        assertFalse(sb.getAlive());
    });

    it("clear() resets the swimbot to dead state", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertTrue(sb.getAlive());
        sb.clear();
        assertFalse(sb.getAlive());
    });

    it("clear() resets index to NULL_INDEX", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(77, 0, pos, 0.0, 100.0, genotype, embryology);
        sb.clear();
        assertEquals(NULL_INDEX, sb.getIndex());
    });

    it("clear() resets energy to ZERO", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        sb.clear();
        assertEquals(ZERO, sb.getEnergy());
    });

    it("clear() resets age to 0", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 500, pos, 0.0, 100.0, genotype, embryology);
        sb.clear();
        assertEquals(0, sb.getAge());
    });

    it("setEnergy(e) then getEnergy() returns same value", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        sb.setEnergy(60.0);
        assertEquals(60.0, sb.getEnergy());
    });

    it("setVelocity(v) updates velocity", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var vel = new Vector2D();
        vel.setXY(5.0, -3.0);
        sb.setVelocity(vel);
        assertEquals(5.0, sb._velocity.x);
        assertEquals(-3.0, sb._velocity.y);
    });

    it("addForce(f) adds to velocity", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var force = new Vector2D();
        force.setXY(2.0, 3.0);
        sb.addForce(force);
        assertEquals(2.0, sb._velocity.x);
        assertEquals(3.0, sb._velocity.y);
    });

    it("getBoundingRadius() returns positive number after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertTrue(sb.getBoundingRadius() > 0, "boundingRadius > 0");
    });

    it("getGenitalPosition() returns Vector2D after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var genitalPos = sb.getGenitalPosition();
        assertNotNull(genitalPos);
        assertTrue(genitalPos instanceof Vector2D, "should be Vector2D");
    });

    it("getMouthPosition() returns Vector2D after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var mouthPos = sb.getMouthPosition();
        assertNotNull(mouthPos);
        assertTrue(mouthPos instanceof Vector2D, "should be Vector2D");
    });

    it("getNumOffspring() returns 0 initially", function () {
        var sb = new Swimbot();
        assertEquals(0, sb.getNumOffspring());
    });

    it("getNumFoodBitsEaten() returns 0 initially", function () {
        var sb = new Swimbot();
        assertEquals(0, sb.getNumFoodBitsEaten());
    });

    it("getBrainState() returns valid state after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var state = sb.getBrainState();
        assertTrue(state >= BRAIN_STATE_RESTING, "state >= BRAIN_STATE_RESTING");
        assertTrue(state < NUM_BRAIN_STATES, "state < NUM_BRAIN_STATES");
    });

    it("getColorSaturation() returns number in [0, 1]", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var sat = sb.getColorSaturation();
        assertType("number", sat);
        assertTrue(sat >= 0, "saturation >= 0");
        assertTrue(sat <= 1, "saturation <= 1");
    });

    it("getCurrentBodyBigness() returns number", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var bigness = sb.getCurrentBodyBigness();
        assertType("number", bigness);
    });

    it("getCurrentBodyLongness() returns number", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var longness = sb.getCurrentBodyLongness();
        assertType("number", longness);
    });

    it("getCurrentBodyStraightness() returns number", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var straightness = sb.getCurrentBodyStraightness();
        assertType("number", straightness);
    });

    it("getCurrentBodyHyperness() returns number", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var hyperness = sb.getCurrentBodyHyperness();
        assertType("number", hyperness);
    });

    it("getAngle() returns the creation angle after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 45.0, 100.0, genotype, embryology);
        assertEquals(45.0, sb.getAngle());
    });

    it("setAngle(a) sets the angle", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        sb.setAngle(90.0);
        assertEquals(90.0, sb.getAngle());
    });

    it("setPosition(p) sets the swimbot position", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var newPos = new Vector2D();
        newPos.setXY(POOL_LEFT + 500, POOL_TOP + 600);
        sb.setPosition(newPos);
        var result = sb.getPosition();
        assertEquals(POOL_LEFT + 500, result.x);
        assertEquals(POOL_TOP + 600, result.y);
    });

    it("getSelectRadius() returns non-negative number after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertTrue(sb.getSelectRadius() >= 0, "selectRadius >= 0");
    });

    it("getEnergyEfficiency() returns number after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertType("number", sb.getEnergyEfficiency());
    });

    it("getGoalDescription() returns string after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertType("string", sb.getGoalDescription());
    });

    it("getAttractionDescription() returns string after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertType("string", sb.getAttractionDescription());
    });

    it("getChosenMateIndex() returns NULL_INDEX initially", function () {
        var sb = new Swimbot();
        assertEquals(NULL_INDEX, sb.getChosenMateIndex());
    });

    it("getChosenFoodBitIndex() returns NULL_INDEX initially", function () {
        var sb = new Swimbot();
        assertEquals(NULL_INDEX, sb.getChosenFoodBitIndex());
    });

    it("getIsTryingToEat() returns false initially", function () {
        var sb = new Swimbot();
        assertFalse(sb.getIsTryingToEat());
    });

    it("getIsTryingToMate() returns false initially", function () {
        var sb = new Swimbot();
        assertFalse(sb.getIsTryingToMate());
    });

    it("getIsLookingForSensoryInput() returns false initially", function () {
        var sb = new Swimbot();
        assertFalse(sb.getIsLookingForSensoryInput());
    });

    it("setHungerThreshold(t) sets brain hunger threshold", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        sb.setHungerThreshold(60.0);
        assertEquals(60.0, sb._brain.getHungerThreshold());
    });

    it("setAttraction(a) sets brain attraction criterion", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        sb.setAttraction(ATTRACTION_LONG);
        assertEquals(ATTRACTION_LONG, sb._brain.getAttractionCriterion());
    });

    it("getAverageColor() returns Color object with valid RGB", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        var color = sb.getAverageColor();
        assertNotNull(color);
        assertTrue(color.red >= ZERO, "red >= 0");
        assertTrue(color.red <= ONE, "red <= 1");
        assertTrue(color.green >= ZERO, "green >= 0");
        assertTrue(color.green <= ONE, "green <= 1");
        assertTrue(color.blue >= ZERO, "blue >= 0");
        assertTrue(color.blue <= ONE, "blue <= 1");
    });

    it("getPreferredFoodType() returns number after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertType("number", sb.getPreferredFoodType());
    });

    it("getDigestibleFoodType() returns number after create()", function () {
        var sb = new Swimbot();
        var genotype = new Genotype();
        genotype.setAllGenesToOneValue(128);
        var embryology = new Embryology();
        var pos = new Vector2D();
        pos.setXY(POOL_LEFT + 100, POOL_TOP + 100);

        sb.create(0, 0, pos, 0.0, 100.0, genotype, embryology);
        assertType("number", sb.getDigestibleFoodType());
    });
});
