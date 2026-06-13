"use strict";

/*
 * Tests for utility classes: VectorPool, ColorCache, SpatialHashGrid, EventBus.
 * Load test-runner.js first, then the classes under test, then this file.
 * Call runTests() from the test harness page to execute.
 */

// ---------- VectorPool ----------

describe("VectorPool", function () {

    it("new VectorPool(10) creates pool with 10 pre-allocated vectors", function () {
        var pool = new VectorPool(10);
        assertNotNull(pool);
        assertNotNull(pool._pool);
        assertEquals(10, pool._pool.length);
        assertEquals(0, pool._index);
    });

    it("acquire() returns a Vector2D with x=0, y=0 (cleared)", function () {
        var pool = new VectorPool(5);
        var v = pool.acquire();
        assertNotNull(v);
        assertClose(0, v.x, 1e-9);
        assertClose(0, v.y, 1e-9);
    });

    it("multiple acquire() calls return different objects", function () {
        var pool = new VectorPool(5);
        var v1 = pool.acquire();
        var v2 = pool.acquire();
        var v3 = pool.acquire();
        assertTrue(v1 !== v2, "v1 and v2 should be different objects");
        assertTrue(v2 !== v3, "v2 and v3 should be different objects");
        assertTrue(v1 !== v3, "v1 and v3 should be different objects");
    });

    it("release(v) returns vector to pool (decrements index)", function () {
        var pool = new VectorPool(5);
        var v1 = pool.acquire();
        assertEquals(1, pool._index);
        pool.release(v1);
        assertEquals(0, pool._index);
    });

    it("create(x, y) returns vector with correct coordinates", function () {
        var pool = new VectorPool(5);
        var v = pool.create(3.5, -2.1);
        assertClose(3.5, v.x, 1e-9);
        assertClose(-2.1, v.y, 1e-9);
    });

    it("reset() resets the pool index to 0", function () {
        var pool = new VectorPool(5);
        pool.acquire();
        pool.acquire();
        assertEquals(2, pool._index);
        pool.reset();
        assertEquals(0, pool._index);
    });

    it("acquiring more than pool size still works (creates new Vector2D)", function () {
        var pool = new VectorPool(2);
        var v1 = pool.acquire();
        var v2 = pool.acquire();
        assertEquals(2, pool._index);
        var v3 = pool.acquire();
        assertNotNull(v3);
        assertTrue(v3 !== v1);
        assertTrue(v3 !== v2);
    });

    it("acquired vectors can be reused after reset", function () {
        var pool = new VectorPool(3);
        var v1 = pool.acquire();
        v1.setXY(10, 20);
        pool.reset();
        var v2 = pool.acquire();
        assertEquals(v1, v2, "should return the same pooled vector after reset");
        assertClose(0, v2.x, 1e-9, "re-acquired vector should be cleared");
        assertClose(0, v2.y, 1e-9, "re-acquired vector should be cleared");
    });
});

// ---------- ColorCache ----------

describe("ColorCache", function () {

    it("new ColorCache(100) creates cache", function () {
        var cache = new ColorCache(100);
        assertNotNull(cache);
        assertEquals(0, cache._size);
    });

    it("getRGBA(r, g, b, a) returns valid rgba string", function () {
        var cache = new ColorCache(100);
        var str = cache.getRGBA(255, 128, 0, 1.0);
        assertEquals("rgba(255,128,0,1)", str);
    });

    it("getRGBA(r, g, b, a) returns cached string on second call", function () {
        var cache = new ColorCache(100);
        var str1 = cache.getRGBA(100, 200, 50, 0.5);
        var str2 = cache.getRGBA(100, 200, 50, 0.5);
        assertEquals(str1, str2, "cached calls should return the same string");
        assertEquals(1, cache._size, "cache size should be 1 after duplicate call");
    });

    it("getRGBA quantizes float RGB values", function () {
        var cache = new ColorCache(100);
        var str1 = cache.getRGBA(100.1, 200.1, 50.1, 0.5);
        var str2 = cache.getRGBA(100.4, 200.4, 50.4, 0.5);
        assertEquals(str1, str2, "quantized values should hit the same cache key");
    });

    it("getRGBFromHSL(h, s, l) returns valid rgb string", function () {
        var cache = new ColorCache(100);
        var str = cache.getRGBFromHSL(0, 1, 0.5);
        assertTrue(str.indexOf("rgb(") === 0, "should start with rgb(");
        assertTrue(str.indexOf(")") === str.length - 1, "should end with )");
    });

    it("getRGBFromHSL(0, 1, 0.5) returns pure red", function () {
        var cache = new ColorCache(100);
        var str = cache.getRGBFromHSL(0, 1, 0.5);
        assertEquals("rgb(255,0,0)", str);
    });

    it("getRGBFromHSL(120, 1, 0.5) returns pure green", function () {
        var cache = new ColorCache(100);
        var str = cache.getRGBFromHSL(120, 1, 0.5);
        assertEquals("rgb(0,255,0)", str);
    });

    it("getRGBFromHSL(240, 1, 0.5) returns pure blue", function () {
        var cache = new ColorCache(100);
        var str = cache.getRGBFromHSL(240, 1, 0.5);
        assertEquals("rgb(0,0,255)", str);
    });

    it("getRGBFromHSL(0, 0, 1) returns white", function () {
        var cache = new ColorCache(100);
        var str = cache.getRGBFromHSL(0, 0, 1);
        assertEquals("rgb(255,255,255)", str);
    });

    it("getRGBFromHSL(0, 0, 0) returns black", function () {
        var cache = new ColorCache(100);
        var str = cache.getRGBFromHSL(0, 0, 0);
        assertEquals("rgb(0,0,0)", str);
    });

    it("clear() empties the cache", function () {
        var cache = new ColorCache(100);
        cache.getRGBA(255, 0, 0, 1);
        cache.getRGBA(0, 255, 0, 1);
        assertEquals(2, cache._size);
        cache.clear();
        assertEquals(0, cache._size);
    });

    it("eviction occurs when cache exceeds maxSize", function () {
        var cache = new ColorCache(5);
        for (var i = 0; i < 10; i++) {
            cache.getRGBA(i, i, i, 1);
        }
        assertTrue(cache._size <= 5, "cache size should not exceed maxSize after eviction");
    });
});

// ---------- Singleton instances ----------

describe("Singleton instances", function () {

    it("vectorPool is a VectorPool instance", function () {
        assertNotNull(vectorPool);
        assertTrue(vectorPool instanceof VectorPool);
    });

    it("colorCache is a ColorCache instance", function () {
        assertNotNull(colorCache);
        assertTrue(colorCache instanceof ColorCache);
    });
});

// ---------- SpatialHashGrid ----------

describe("SpatialHashGrid", function () {

    it("new SpatialHashGrid(200) creates grid", function () {
        var grid = new SpatialHashGrid(200);
        assertNotNull(grid);
        assertEquals(200, grid._cellSize);
    });

    it("clear() empties grid", function () {
        var grid = new SpatialHashGrid(100);
        var entity = { getPosition: function () { return { x: 50, y: 50 }; } };
        grid.add(entity);
        assertTrue(grid._map.size > 0, "map should have entries after add");
        grid.clear();
        assertEquals(0, grid._map.size, "map should be empty after clear");
    });

    it("add(entity) adds entity to correct cell", function () {
        var grid = new SpatialHashGrid(100);
        var entity = { getPosition: function () { return { x: 150, y: 250 }; } };
        grid.add(entity);
        var key = "1,2"; // floor(150/100)=1, floor(250/100)=2
        assertTrue(grid._map.has(key), "entity should be in cell 1,2");
        assertEquals(1, grid._map.get(key).length);
    });

    it("query(x, y, radius) returns entities within radius", function () {
        var grid = new SpatialHashGrid(100);
        var e1 = { getPosition: function () { return { x: 10, y: 10 }; } };
        var e2 = { getPosition: function () { return { x: 300, y: 300 }; } };
        grid.add(e1);
        grid.add(e2);

        var results = grid.query(0, 0, 50);
        assertArrayLength(1, results);
        assertEquals(e1, results[0]);
    });

    it("query(x, y, radius) excludes entities outside radius", function () {
        var grid = new SpatialHashGrid(100);
        var far = { getPosition: function () { return { x: 500, y: 500 }; } };
        grid.add(far);
        var results = grid.query(0, 0, 100);
        // query returns all entities in the cells that overlap the radius
        // cell radius = ceil(100/100) = 1, so cells (0,0) (-1,0) (0,-1) (-1,-1) (1,0) (0,1) (1,1) (-1,1) (1,-1)
        // entity at (500,500) is in cell (5,5) which is outside this range
        assertArrayLength(0, results);
    });

    it("empty query returns empty array", function () {
        var grid = new SpatialHashGrid(100);
        var results = grid.query(0, 0, 50);
        assertArrayLength(0, results);
    });

    it("add 10 entities at known positions, query returns correct subset", function () {
        var grid = new SpatialHashGrid(100);
        for (var i = 0; i < 10; i++) {
            // place 10 entities in a tight cluster at (10,10)
            grid.add({ getPosition: function () { return { x: 10, y: 10 }; } });
        }
        // add 1 entity far away
        grid.add({ getPosition: function () { return { x: 1000, y: 1000 }; } });

        var results = grid.query(0, 0, 50);
        assertArrayLength(10, results);
    });

    it("entities in adjacent cells are found", function () {
        var grid = new SpatialHashGrid(100);
        // entity at (99, 99) -> cell (0, 0)
        var e1 = { getPosition: function () { return { x: 99, y: 99 }; } };
        // entity at (101, 101) -> cell (1, 1)
        var e2 = { getPosition: function () { return { x: 101, y: 101 }; } };
        grid.add(e1);
        grid.add(e2);

        // query from (100, 100) with radius 10
        // cell radius = ceil(10/100) = 1, so we search cells (-1,-1) to (2,2)
        var results = grid.query(100, 100, 10);
        assertArrayLength(2, results);
    });

    it("queryFiltered returns only entities matching filter", function () {
        var grid = new SpatialHashGrid(100);
        var e1 = { type: "food", getPosition: function () { return { x: 10, y: 10 }; } };
        var e2 = { type: "swimbot", getPosition: function () { return { x: 20, y: 20 }; } };
        grid.add(e1);
        grid.add(e2);

        var results = grid.queryFiltered(0, 0, 10000, function (e) { return e.type === "food"; });
        assertArrayLength(1, results);
        assertEquals(e1, results[0]);
    });

    it("queryFiltered with no matching entities returns empty array", function () {
        var grid = new SpatialHashGrid(100);
        var e = { type: "food", getPosition: function () { return { x: 10, y: 10 }; } };
        grid.add(e);
        var results = grid.queryFiltered(0, 0, 10000, function (e) { return e.type === "swimbot"; });
        assertArrayLength(0, results);
    });

    it("multiple entities in same cell are all returned by query", function () {
        var grid = new SpatialHashGrid(100);
        var entities = [];
        for (var i = 0; i < 5; i++) {
            entities.push({ getPosition: function () { return { x: 50, y: 50 }; } });
        }
        for (var j = 0; j < entities.length; j++) {
            grid.add(entities[j]);
        }
        var results = grid.query(50, 50, 100);
        assertArrayLength(5, results);
    });
});

// ---------- EventBus ----------

describe("EventBus", function () {

    it("eventBus is defined globally", function () {
        assertNotNull(eventBus);
    });

    it("on(event, callback) registers listener", function () {
        var called = false;
        eventBus.on("_test_on_event", function () { called = true; });
        eventBus.emit("_test_on_event");
        assertTrue(called);
        eventBus.off("_test_on_event");
    });

    it("emit(event, data) triggers listener with data", function () {
        var receivedData = null;
        eventBus.on("_test_emit_data", function (data) { receivedData = data; });
        eventBus.emit("_test_emit_data", { value: 42 });
        assertNotNull(receivedData);
        assertEquals(42, receivedData.value);
        eventBus.off("_test_emit_data");
    });

    it("off(event, callback) removes specific listener", function () {
        var count = 0;
        var cb = function () { count++; };
        eventBus.on("_test_off", cb);
        eventBus.emit("_test_off");
        assertEquals(1, count);
        eventBus.off("_test_off", cb);
        eventBus.emit("_test_off");
        assertEquals(1, count, "callback should not fire after off");
    });

    it("off(event) with no callback removes all listeners", function () {
        var count = 0;
        eventBus.on("_test_off_all", function () { count++; });
        eventBus.on("_test_off_all", function () { count++; });
        eventBus.emit("_test_off_all");
        assertEquals(2, count);
        eventBus.off("_test_off_all");
        eventBus.emit("_test_off_all");
        assertEquals(2, count, "no callbacks should fire after off with no callback");
    });

    it("once(event, callback) triggers once then unregisters", function () {
        var count = 0;
        eventBus.once("_test_once", function () { count++; });
        eventBus.emit("_test_once");
        assertEquals(1, count);
        eventBus.emit("_test_once");
        assertEquals(1, count, "once callback should not fire a second time");
    });

    it("multiple listeners on same event all fire", function () {
        var results = [];
        eventBus.on("_test_multi", function () { results.push("a"); });
        eventBus.on("_test_multi", function () { results.push("b"); });
        eventBus.on("_test_multi", function () { results.push("c"); });
        eventBus.emit("_test_multi");
        assertArrayLength(3, results);
        assertEquals("a", results[0]);
        assertEquals("b", results[1]);
        assertEquals("c", results[2]);
        eventBus.off("_test_multi");
    });

    it("emitting unknown event does not throw", function () {
        assertType("undefined", undefined); // no-op to satisfy assertThrows pattern
        (function () {
            eventBus.emit("_nonexistent_event_xyz");
        })();
    });

    it("emit returns this for chaining", function () {
        var result = eventBus.emit("_test_chain");
        assertEquals(eventBus, result);
    });

    it("on returns this for chaining", function () {
        var result = eventBus.on("_test_on_chain", function () {});
        assertEquals(eventBus, result);
        eventBus.off("_test_on_chain");
    });

    it("off returns this for chaining", function () {
        var result = eventBus.off("_test_off_chain");
        assertEquals(eventBus, result);
    });
});

// ---------- SpriteCache ----------

describe("SpriteCache", function () {

    it("spriteCache is defined globally", function () {
        assertNotNull(spriteCache);
    });

    it("new SpriteCache(100) creates empty cache", function () {
        var cache = new SpriteCache(100);
        assertNotNull(cache);
        assertEquals(0, cache.getSize());
    });

    it("get() returns a sprite with canvas, w, h for valid geometry", function () {
        var cache = new SpriteCache(50);
        var sprite = cache.get(20, 5, 5, false, 255, 128, 0);
        assertNotNull(sprite);
        assertNotNull(sprite.canvas);
        assertTrue(sprite.w > 0, "width should be positive");
        assertTrue(sprite.h > 0, "height should be positive");
    });

    it("get() returns null for zero-length part", function () {
        var cache = new SpriteCache(50);
        var sprite = cache.get(0, 5, 5, false, 255, 128, 0);
        assertNull(sprite);
    });

    it("duplicate get() returns cached sprite (same reference)", function () {
        var cache = new SpriteCache(50);
        var s1 = cache.get(20, 5, 5, false, 255, 128, 0);
        var s2 = cache.get(20, 5, 5, false, 255, 128, 0);
        assertEquals(s1, s2, "cached calls should return the same sprite object");
        assertEquals(1, cache.getSize(), "cache size should be 1 after duplicate call");
    });

    it("different geometry produces different cache entries", function () {
        var cache = new SpriteCache(100);
        var s1 = cache.get(20, 5, 5, false, 255, 0, 0);
        var s2 = cache.get(20, 5, 5, false, 0, 255, 0);
        assertTrue(s1 !== s2, "different colors should produce different sprites");
        assertEquals(2, cache.getSize());
    });

    it("splined vs non-splined produces different entries", function () {
        var cache = new SpriteCache(100);
        var s1 = cache.get(20, 5, 5, false, 255, 128, 0);
        var s2 = cache.get(20, 5, 5, true, 255, 128, 0);
        assertTrue(s1 !== s2, "splined and non-splined should differ");
        assertEquals(2, cache.getSize());
    });

    it("eviction occurs when cache exceeds maxSize", function () {
        var cache = new SpriteCache(5);
        for (var i = 0; i < 10; i++) {
            cache.get(20, 5, 5, false, i, i, i);
        }
        assertTrue(cache.getSize() <= 5, "cache size should not exceed maxSize after eviction");
    });

    it("clear() empties the cache", function () {
        var cache = new SpriteCache(100);
        cache.get(20, 5, 5, false, 255, 0, 0);
        cache.get(20, 5, 5, false, 0, 255, 0);
        assertEquals(2, cache.getSize());
        cache.clear();
        assertEquals(0, cache.getSize());
    });

    it("quantization: similar widths hit same cache key (length not quantized)", function () {
        var cache = new SpriteCache(100);
        // widths 5.1 and 5.2 both quantize to 5.0 (quant=0.5)
        var s1 = cache.get(20, 5.1, 5, false, 255, 128, 0);
        var s2 = cache.get(20, 5.2, 5, false, 255, 128, 0);
        assertEquals(s1, s2, "quantized widths should hit same cache key");
        assertEquals(1, cache.getSize());
    });

    it("different lengths produce different cache entries (no length quantization)", function () {
        var cache = new SpriteCache(100);
        var s1 = cache.get(20.1, 5, 5, false, 255, 128, 0);
        var s2 = cache.get(20.8, 5, 5, false, 255, 128, 0);
        assertTrue(s1 !== s2, "different lengths should produce different sprites (no length quantization)");
        assertEquals(2, cache.getSize());
    });

    it("sprite canvas has valid OffscreenCanvas or HTMLCanvasElement", function () {
        var cache = new SpriteCache(50);
        var sprite = cache.get(30, 8, 8, true, 100, 200, 50);
        assertNotNull(sprite.canvas);
        // canvas should have getContext
        var ctx = sprite.canvas.getContext("2d");
        assertNotNull(ctx);
    });
});
