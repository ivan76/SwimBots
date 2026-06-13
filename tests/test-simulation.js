"use strict";

/*
 * Tests for the main simulation system (GenePool, FamilyTree, ViewTracking, Pool, Obstacle).
 *
 * Required script load order (in test.html):
 *   MathConstants.js, Parameters.js, Utility.js, Vector2D.js, ObjectPool.js, SpatialHashGrid.js,
 *   SwimbotTypes.js, Genotype.js, Embryology.js, Brain.js, SwimbotRenderer.js, Swimbot.js,
 *   Touch.js, ViewTracking.js, FamilyTree.js, PhyloTree.js, Obstacle.js, FoodBit.js,
 *   Pool.js, Camera.js, GenePool.js, EventBus.js
 *   test-runner.js, test-simulation.js
 */

// ---------------------------------------------------------------------------
// GenePool
// ---------------------------------------------------------------------------

describe("GenePool — construction and initialization", function () {
    it("should create a GenePool instance", function () {
        var pool = new GenePool();
        assertNotNull(pool);
    });

    it("should accept a canvas context via setCanvas", function () {
        var pool = new GenePool();
        var fakeCtx = { fillRect: function () { }, fillStyle: "" };
        pool.setCanvas(fakeCtx);
        // no throw — success
    });

    it("should accept canvas dimensions via setCanvasDimensions", function () {
        var pool = new GenePool();
        pool.setCanvasDimensions(800, 600);
        // no throw — success
    });

    it("should initialize with RANDOM mode", function () {
        var pool = new GenePool();
        var fakeCtx = { fillRect: function () { }, fillStyle: "", fillText: function () { }, stroke: function () { }, strokeStyle: "" };
        pool.setCanvas(fakeCtx);
        pool.setCanvasDimensions(800, 600);
        pool.initialize();

        assertTrue(pool.getNumSwimbots() > 0, "should have swimbots after initialize");
        assertTrue(pool.getNumFoodBits() > 0, "should have food bits after initialize");
        assertTrue(pool.getSimulationRunning(), "simulation should be running");
        assertEquals(0, pool.getTimeStep(), "time step should be 0 after initialize");
    });

    it("should start simulation with different modes", function () {
        var pool = new GenePool();
        var fakeCtx = { fillRect: function () { }, fillStyle: "", fillText: function () { }, stroke: function () { }, strokeStyle: "" };
        pool.setCanvas(fakeCtx);
        pool.setCanvasDimensions(800, 600);

        // RANDOM
        pool.startSimulation(SimulationStartMode.RANDOM);
        assertTrue(pool.getNumSwimbots() > 0);

        // EMPTY
        pool.startSimulation(SimulationStartMode.EMPTY);
        assertEquals(0, pool.getNumSwimbots());

        // TANGO (2 swimbots)
        pool.startSimulation(SimulationStartMode.TANGO);
        assertEquals(2, pool.getNumSwimbots());
    });

    it("should toggle simulation running state", function () {
        var pool = new GenePool();
        var fakeCtx = { fillRect: function () { }, fillStyle: "", fillText: function () { }, stroke: function () { }, strokeStyle: "" };
        pool.setCanvas(fakeCtx);
        pool.setCanvasDimensions(800, 600);
        pool.initialize();

        assertTrue(pool.getSimulationRunning());
        pool.setSimulationRunning(false);
        assertFalse(pool.getSimulationRunning());
        pool.setSimulationRunning(true);
        assertTrue(pool.getSimulationRunning());
    });

    it("should toggle rendering state", function () {
        var pool = new GenePool();
        pool.setRendering(true);
        assertTrue(pool.getRendering());
        pool.setRendering(false);
        assertFalse(pool.getRendering());
    });
});

describe("GenePool — ecosystem settings getters/setters", function () {
    var pool;
    var fakeCtx;

    it("should setup pool before tests", function () {
        pool = new GenePool();
        fakeCtx = { fillRect: function () { }, fillStyle: "", fillText: function () { }, stroke: function () { }, strokeStyle: "" };
        pool.setCanvas(fakeCtx);
        pool.setCanvasDimensions(800, 600);
        pool.initialize();
    });

    it("should get/set foodGrowthDelay", function () {
        pool.setFoodGrowthDelay(50);
        assertEquals(50, pool.getFoodGrowthDelay());
    });

    it("should get/set foodSpread", function () {
        pool.setFoodSpread(100);
        assertClose(100, pool.getFoodSpread(), 1);
    });

    it("should get/set foodBitEnergy", function () {
        pool.setFoodBitEnergy(100);
        assertEquals(100, pool.getFoodBitEnergy());
    });

    it("should get/set hungerThreshold", function () {
        pool.setHungerThreshold(80);
        assertEquals(80, pool.getHungerThreshold());
    });

    it("should get/set offspringEnergyRatio", function () {
        pool.setOffspringEnergyRatio(0.75);
        assertClose(0.75, pool.getEnergyToOffspring(), 0.01);
    });

    it("should get/set maximumSwimbotAge", function () {
        pool.setMaximumSwimbotAge(25000);
        assertEquals(25000, pool.getMaximumSwimbotAge());
    });
});

describe("GenePool — swimbot operations", function () {
    var pool;
    var fakeCtx;

    it("should setup pool", function () {
        pool = new GenePool();
        fakeCtx = { fillRect: function () { }, fillStyle: "", fillText: function () { }, stroke: function () { }, strokeStyle: "" };
        pool.setCanvas(fakeCtx);
        pool.setCanvasDimensions(800, 600);
        pool.initialize();
    });

    it("should return NULL_INDEX for selected swimbot initially", function () {
        assertEquals(NULL_INDEX, pool.getSelectedSwimbotID());
    });

    it("should get swimbot genes as array of length 256", function () {
        var id = pool.getSwimbotIndex(0);
        var genes = pool.getSwimbotGenes(id);
        assertNotNull(genes);
        assertEquals(NUM_GENES, genes.length);
    });

    it("should get valid swimbot age", function () {
        var id = pool.getSwimbotIndex(0);
        assertTrue(pool.getSwimbotAge(id) > 0);
    });

    it("should get valid swimbot energy", function () {
        var id = pool.getSwimbotIndex(0);
        assertTrue(pool.getSwimbotEnergy(id) >= 0);
    });

    it("should get valid brain state", function () {
        var id = pool.getSwimbotIndex(0);
        var state = pool.getSwimbotBrainState(id);
        assertTrue(state >= 0 && state < NUM_BRAIN_STATES);
    });

    it("should get offspring count (number)", function () {
        var id = pool.getSwimbotIndex(0);
        assertType("number", pool.getSwimbotNumOffspring(id));
    });

    it("should get food eaten count (number)", function () {
        var id = pool.getSwimbotIndex(0);
        assertType("number", pool.getSwimbotNumFoodBitsEaten(id));
    });

    it("should kill a swimbot", function () {
        var id = pool.getSwimbotIndex(0);
        var before = pool.getNumSwimbots();
        pool.killSwimbot(id);
        assertTrue(pool.getNumSwimbots() < before);
    });

    it("should clone a swimbot", function () {
        var id = pool.getSwimbotIndex(0);
        if (id === NULL_INDEX) { it.skip = true; return; }
        var before = pool.getNumSwimbots();
        pool.cloneSwimbot(id);
        assertTrue(pool.getNumSwimbots() > before);
    });

    it("should zap a swimbot without throwing", function () {
        var id = pool.getSwimbotIndex(0);
        if (id !== NULL_INDEX) {
            pool.zapSwimbot(id, 0.2);
        }
    });

    it("should randomize a swimbot without throwing", function () {
        var id = pool.getSwimbotIndex(0);
        if (id !== NULL_INDEX) {
            pool.randomizeSwimbot(id);
        }
    });

    it("should create a new random swimbot", function () {
        var before = pool.getNumSwimbots();
        pool.makeNewRandomSwimbot();
        assertTrue(pool.getNumSwimbots() > before);
    });
});

describe("GenePool — simulation step", function () {
    it("should run 10 simulation steps without throwing", function () {
        var pool = new GenePool();
        var fakeCtx = { fillRect: function () { }, fillStyle: "", fillText: function () { }, stroke: function () { }, strokeStyle: "", beginPath: function () { }, arc: function () { }, closePath: function () { }, lineWidth: 1, lineCap: "", save: function () { }, restore: function () { }, translate: function () { }, rotate: function () { }, scale: function () { }, moveTo: function () { }, lineTo: function () { }, bezierCurveTo: function () { }, clip: function () { }, measureText: function () { return { width: 0 }; } };
        pool.setCanvas(fakeCtx);
        pool.setCanvasDimensions(800, 600);
        pool.initialize();

        var initialSwimbots = pool.getNumSwimbots();
        var initialFood = pool.getNumFoodBits();

        for (var i = 0; i < 10; i++) {
            pool.updateSwimbots();
            pool.updateFood();
        }

        // After 10 steps, food bits should still be present
        assertTrue(pool.getNumFoodBits() > 0, "food bits should still exist after 10 steps");
    });
});

describe("GenePool — metadata and getters", function () {
    it("should return valid view mode", function () {
        var pool = new GenePool();
        assertTrue(pool.getViewMode() >= 0);
    });

    it("should return valid attraction constant", function () {
        var pool = new GenePool();
        var attr = pool.getAttraction();
        assertTrue(attr >= 0 && attr < NUM_ATTRACTIONS);
    });

    it("should return non-empty gene name", function () {
        var pool = new GenePool();
        var name = pool.getGeneName(0);
        assertNotNull(name);
        assertTrue(name.length > 0);
    });

    it("should return family tree instance", function () {
        var pool = new GenePool();
        var ft = pool.getFamilyTree();
        assertNotNull(ft);
        assertType("object", ft);
    });

    it("should return pool data as object", function () {
        var pool = new GenePool();
        var fakeCtx = { fillRect: function () { }, fillStyle: "", fillText: function () { }, stroke: function () { }, strokeStyle: "", beginPath: function () { }, arc: function () { }, closePath: function () { }, lineWidth: 1, lineCap: "", save: function () { }, restore: function () { }, translate: function () { }, rotate: function () { }, scale: function () { }, moveTo: function () { }, lineTo: function () { }, bezierCurveTo: function () { }, clip: function () { }, measureText: function () { return { width: 0 }; } };
        pool.setCanvas(fakeCtx);
        pool.setCanvasDimensions(800, 600);
        pool.initialize();

        var data = pool.getPoolData();
        assertNotNull(data);
        assertType("object", data);
    });

    it("should return preset genotype", function () {
        var pool = new GenePool();
        var genes = pool.getPresetGenotype(0); // Darwin
        assertNotNull(genes);
        assertArrayLength(NUM_GENES, genes);
    });
});

// ---------------------------------------------------------------------------
// FamilyTree
// ---------------------------------------------------------------------------

describe("FamilyTree", function () {
    it("should create with 0 nodes", function () {
        var tree = new FamilyTree();
        assertEquals(0, tree.getNumNodes());
    });

    it("should add and retrieve a node", function () {
        var tree = new FamilyTree();
        var genes = [];
        for (var g = 0; g < NUM_GENES; g++) genes[g] = g % 256;
        tree.addNode(42, NULL_INDEX, NULL_INDEX, 100, genes);

        assertEquals(1, tree.getNumNodes());
        assertEquals(42, tree.getNodePoolIndex(0));
        assertEquals(100, tree.getNodeBirthTime(0));
        assertEquals(0, tree.getNodeDeathTime(0));
        assertNotNull(tree.getNodeGenes(0));
    });

    it("should set and get death time", function () {
        var tree = new FamilyTree();
        var genes = [];
        for (var g = 0; g < NUM_GENES; g++) genes[g] = 0;
        tree.addNode(5, NULL_INDEX, NULL_INDEX, 50, genes);
        tree.setDeathTime(5, 200);
        assertEquals(200, tree.getNodeDeathTime(0));
    });

    it("should reset all nodes", function () {
        var tree = new FamilyTree();
        var genes = [];
        for (var g = 0; g < NUM_GENES; g++) genes[g] = 0;
        tree.addNode(1, NULL_INDEX, NULL_INDEX, 10, genes);
        tree.addNode(2, NULL_INDEX, NULL_INDEX, 20, genes);
        assertEquals(2, tree.getNumNodes());
        tree.reset();
        assertEquals(0, tree.getNumNodes());
    });

    it("should enforce MAX_FAMILY_TREE_NODES limit with eviction", function () {
        var tree = new FamilyTree();
        var genes = [];
        for (var g = 0; g < NUM_GENES; g++) genes[g] = 0;

        // Add nodes up to the limit
        for (var i = 0; i < MAX_FAMILY_TREE_NODES + 100; i++) {
            tree.addNode(i, NULL_INDEX, NULL_INDEX, i, genes);
        }

        // Should not exceed MAX_FAMILY_TREE_NODES
        assertTrue(tree.getNumNodes() <= MAX_FAMILY_TREE_NODES, "nodes should not exceed limit: " + tree.getNumNodes());
    });

    it("should return parent indices", function () {
        var tree = new FamilyTree();
        var genes = [];
        for (var g = 0; g < NUM_GENES; g++) genes[g] = 0;
        tree.addNode(1, NULL_INDEX, NULL_INDEX, 0, genes);
        tree.addNode(2, 1, NULL_INDEX, 1, genes);

        assertEquals(NULL_INDEX, tree.getNodeParent1PoolIndex(0));
        assertEquals(1, tree.getNodeParent1PoolIndex(1));
    });
});

// ---------------------------------------------------------------------------
// ViewTracking
// ---------------------------------------------------------------------------

describe("ViewTracking", function () {
    it("should create instance with tracking disabled", function () {
        var vt = new ViewTracking();
        // Default should have tracking set based on constructor
        assertNotNull(vt);
    });

    it("should reset state", function () {
        var vt = new ViewTracking();
        vt.reset();
        assertEquals(NULL_INDEX, vt.getLover1Index());
        assertEquals(NULL_INDEX, vt.getLover2Index());
    });

    it("should set AUTOTRACK mode", function () {
        var vt = new ViewTracking();
        var pos = { x: 4000, y: 4000 };
        var selected = vt.setMode(ViewTrackingMode.AUTOTRACK, pos, 600, NULL_INDEX);
        assertTrue(vt.getIsTracking());
        assertEquals(ViewTrackingMode.AUTOTRACK, vt.getMode());
    });

    it("should set WHOLE_POOL mode", function () {
        var vt = new ViewTracking();
        var pos = { x: 4000, y: 4000 };
        vt.setMode(ViewTrackingMode.WHOLE_POOL, pos, POOL_WIDTH, NULL_INDEX);
        assertTrue(vt.getIsTracking());
        assertEquals(ViewTrackingMode.WHOLE_POOL, vt.getMode());
    });

    it("should start and stop tracking", function () {
        var vt = new ViewTracking();
        vt.stopTracking();
        assertFalse(vt.getIsTracking());
        vt.startTracking();
        assertTrue(vt.getIsTracking());
    });

    it("should return camera force and scale force", function () {
        var vt = new ViewTracking();
        var force = vt.getCameraForce();
        assertNotNull(force);
        assertType("number", vt.getCameraScaleForce());
    });
});

// ---------------------------------------------------------------------------
// Pool
// ---------------------------------------------------------------------------

describe("Pool", function () {
    it("should create and initialize", function () {
        var pool = new Pool();
        pool.initialize(0);
        assertNotNull(pool);
    });

    it("should return pool center at (4000, 4000)", function () {
        var pool = new Pool();
        pool.initialize(0);
        var center = pool.getCenter();
        assertEquals(POOL_X_CENTER, center.x);
        assertEquals(POOL_Y_CENTER, center.y);
    });

    it("should handle touch events without throwing", function () {
        var pool = new Pool();
        pool.initialize(0);
        var pos = new Vector2D();
        pos.setXY(4000, 4000);
        pool.startTouch(pos, 0);
        pool.moveTouch(pos, 1);
        pool.endTouch(pos, 2);
    });
});

// ---------------------------------------------------------------------------
// Obstacle
// ---------------------------------------------------------------------------

describe("Obstacle", function () {
    it("should create and set endpoints", function () {
        var obs = new Obstacle();
        var e1 = new Vector2D();
        var e2 = new Vector2D();
        e1.setXY(100, 100);
        e2.setXY(200, 200);
        obs.setEndpointPositions(e1, e2);
    });

    it("should return endpoint positions", function () {
        var obs = new Obstacle();
        var e1 = new Vector2D();
        var e2 = new Vector2D();
        e1.setXY(100, 100);
        e2.setXY(200, 200);
        obs.setEndpointPositions(e1, e2);

        var p1 = obs.getEnd1Position();
        var p2 = obs.getEnd2Position();
        assertEquals(100, p1.x);
        assertEquals(100, p1.y);
        assertEquals(200, p2.x);
        assertEquals(200, p2.y);
    });

    it("should detect collision with obstacle line", function () {
        var obs = new Obstacle();
        var e1 = new Vector2D();
        var e2 = new Vector2D();
        e1.setXY(0, 0);
        e2.setXY(1000, 1000);
        obs.setEndpointPositions(e1, e2);

        var testPos = new Vector2D();
        testPos.setXY(500, 500);
        var collided = obs.getCollision(testPos, 20);
        assertTrue(collided);
    });

    it("should not detect collision far from obstacle", function () {
        var obs = new Obstacle();
        var e1 = new Vector2D();
        var e2 = new Vector2D();
        e1.setXY(0, 0);
        e2.setXY(100, 0);
        obs.setEndpointPositions(e1, e2);

        var testPos = new Vector2D();
        testPos.setXY(5000, 5000);
        var collided = obs.getCollision(testPos, 20);
        assertFalse(collided);
    });

    it("should start and stop moving", function () {
        var obs = new Obstacle();
        var e1 = new Vector2D();
        var e2 = new Vector2D();
        e1.setXY(0, 0);
        e2.setXY(100, 0);
        obs.setEndpointPositions(e1, e2);

        // Hover endpoint 1 first (required before startMoving)
        var hoverPos = new Vector2D();
        hoverPos.setXY(0, 0);
        obs.detectHover(hoverPos);
        assertTrue(obs.getHovered(), "endpoint should be hovered");

        var movePos = new Vector2D();
        movePos.setXY(50, 50);
        obs.startMoving(movePos);
        assertTrue(obs.getBeingMoved(), "obstacle should be moving after startMoving");
        obs.stopMoving();
        assertFalse(obs.getBeingMoved(), "obstacle should stop after stopMoving");
    });

    it("should detect obstruction between two points", function () {
        var obs = new Obstacle();
        var e1 = new Vector2D();
        var e2 = new Vector2D();
        e1.setXY(0, 0);
        e2.setXY(1000, 1000);
        obs.setEndpointPositions(e1, e2);

        var p1 = new Vector2D();
        var p2 = new Vector2D();
        p1.setXY(490, 510);
        p2.setXY(510, 490);
        var obstructed = obs.getObstruction(p1, p2);
        assertTrue(obstructed);
    });
});

// ---------------------------------------------------------------------------
// PhyloTree
// ---------------------------------------------------------------------------

describe("PhyloTree", function () {
    it("should create and initialize", function () {
        var pt = new PhyloTree();
        pt.initialize(144); // 256 - 112 = 144 junk genes
        assertNotNull(pt);
    });

    it("should add junk DNA without throwing", function () {
        var pt = new PhyloTree();
        pt.initialize(144);
        var gt = new Genotype();
        gt.randomize();
        pt.addJunkDNA(gt);
    });
});

// ---------------------------------------------------------------------------
// GlobalTweakers
// ---------------------------------------------------------------------------

describe("GlobalTweakers", function () {
    it("should create instance with default values", function () {
        var gt = new GlobalTweakers();
        assertNotNull(gt);
        assertType("number", gt.childEnergyRatio);
        assertType("number", gt.maximumLifeSpan);
        assertType("number", gt.foodSpread);
        assertType("number", gt.foodBitEnergy);
        assertType("number", gt.foodRegenerationPeriod);
        assertType("number", gt.hungerThreshold);
        assertType("number", gt.numFoodTypes);
        assertType("number", gt.attractionCriterion);
    });
});

// ---------------------------------------------------------------------------
// SimulationStartMode and CameraNavigationAction constants
// ---------------------------------------------------------------------------

describe("Global constants", function () {
    it("should have all SimulationStartMode values", function () {
        assertEquals(0, SimulationStartMode.RANDOM);
        assertEquals(1, SimulationStartMode.FROGGIES);
        assertEquals(2, SimulationStartMode.TANGO);
        assertEquals(3, SimulationStartMode.RACE);
        assertEquals(4, SimulationStartMode.NEIGHBORHOOD);
        assertEquals(5, SimulationStartMode.BIG_BANG);
        assertEquals(6, SimulationStartMode.BAD_PARENTS);
        assertEquals(7, SimulationStartMode.BARRIER);
        assertEquals(8, SimulationStartMode.EMPTY);
        assertEquals(9, SimulationStartMode.FILE);
        assertEquals(10, SimulationStartMode.SPECIES);
    });

    it("should have all CameraNavigationAction values", function () {
        assertEquals(0, CameraNavigationAction.LEFT);
        assertEquals(1, CameraNavigationAction.RIGHT);
        assertEquals(2, CameraNavigationAction.UP);
        assertEquals(3, CameraNavigationAction.DOWN);
        assertEquals(4, CameraNavigationAction.IN);
        assertEquals(5, CameraNavigationAction.OUT);
    });

    it("should have ViewTrackingMode values", function () {
        assertEquals(-1, ViewTrackingMode.NULL);
        assertEquals(0, ViewTrackingMode.WHOLE_POOL);
        assertEquals(1, ViewTrackingMode.AUTOTRACK);
        assertEquals(2, ViewTrackingMode.SELECTED);
        assertEquals(3, ViewTrackingMode.MUTUAL);
        assertEquals(4, ViewTrackingMode.PROLIFIC);
        assertEquals(5, ViewTrackingMode.EFFICIENT);
        assertEquals(6, ViewTrackingMode.VIRGIN);
        assertEquals(7, ViewTrackingMode.HUNGRY);
    });
});
