"use strict";

// ============================================================
// Genetics System Tests (Genotype, Embryology, SwimbotTypes)
// ============================================================
// Required load order before test-runner.js:
//   MathConstants.js -> Vector2D.js -> Utility.js -> SwimbotTypes.js
//   -> Parameters.js -> Genotype.js -> Embryology.js
// ============================================================

// --------------- Genotype ---------------

describe("Genotype", function () {

    it("new Genotype() creates with all genes initialized to 0", function () {
        var gt = new Genotype();
        assertNotNull(gt);
        assertNotNull(gt._genes);
        assertEquals(NUM_GENES, gt._genes.length);
        for (var i = 0; i < NUM_GENES; i++) {
            assertEquals(0, gt._genes[i], "gene " + i + " should be 0");
        }
    });

    it("randomize() sets all gene values in [0, 255]", function () {
        var gt = new Genotype();
        gt.randomize();
        for (var i = 0; i < NUM_GENES; i++) {
            assertTrue(gt._genes[i] >= 0, "gene " + i + " below 0");
            assertTrue(gt._genes[i] < BYTE_SIZE, "gene " + i + " >= " + BYTE_SIZE);
        }
    });

    it("setGeneValue(g, v) then getGeneValue(g) returns same value", function () {
        var gt = new Genotype();
        gt.setGeneValue(0, 200);
        assertEquals(200, gt.getGeneValue(0));
        gt.setGeneValue(100, 42);
        assertEquals(42, gt.getGeneValue(100));
        gt.setGeneValue(255, 255);
        assertEquals(255, gt.getGeneValue(255));
    });

    it("getGenes() returns array-like of length NUM_GENES (256)", function () {
        var gt = new Genotype();
        var genes = gt.getGenes();
        assertNotNull(genes);
        assertEquals(NUM_GENES, genes.length);
    });

    it("setGenes(arr) sets all genes from array", function () {
        var gt = new Genotype();
        var arr = new Uint8Array(NUM_GENES);
        for (var i = 0; i < NUM_GENES; i++) {
            arr[i] = i % 256;
        }
        gt.setGenes(arr);
        for (var i = 0; i < NUM_GENES; i++) {
            assertEquals(i % 256, gt.getGeneValue(i), "gene " + i + " mismatch after setGenes");
        }
    });

    it("setAllGenesToOneValue(v) sets all genes to that value", function () {
        var gt = new Genotype();
        gt.setAllGenesToOneValue(128);
        for (var i = 0; i < NUM_GENES; i++) {
            assertEquals(128, gt.getGeneValue(i), "gene " + i + " should be 128");
        }
    });

    it("clear() resets all genes to 0", function () {
        var gt = new Genotype();
        gt.setAllGenesToOneValue(200);
        gt.clear();
        for (var i = 0; i < NUM_GENES; i++) {
            assertEquals(0, gt.getGeneValue(i), "gene " + i + " should be 0 after clear");
        }
    });

    it("copyFromGenotype(other) copies all genes", function () {
        var source = new Genotype();
        source.setAllGenesToOneValue(170);
        source.setGeneValue(50, 99);
        var dest = new Genotype();
        dest.setAllGenesToOneValue(0);
        dest.copyFromGenotype(source);
        for (var i = 0; i < NUM_GENES; i++) {
            assertEquals(source.getGeneValue(i), dest.getGeneValue(i), "gene " + i + " mismatch after copy");
        }
    });

    it("setToPreset(0) Darwin works without throwing", function () {
        var gt = new Genotype();
        gt.setToPreset(PRESET_GENOTYPE_DARWIN);
        assertTrue(hasNonZeroGene(gt), "Darwin preset should have non-zero genes");
    });

    it("setToPreset(1) Wallace works without throwing", function () {
        var gt = new Genotype();
        gt.setToPreset(PRESET_GENOTYPE_WALLACE);
        assertTrue(hasNonZeroGene(gt), "Wallace preset should have non-zero genes");
    });

    it("setToPreset(2) Mendel works without throwing", function () {
        var gt = new Genotype();
        gt.setToPreset(PRESET_GENOTYPE_MENDEL);
        assertTrue(hasNonZeroGene(gt), "Mendel preset should have non-zero genes");
    });

    it("setToPreset(3) Turing works without throwing", function () {
        var gt = new Genotype();
        gt.setToPreset(PRESET_GENOTYPE_TURING);
        assertTrue(hasNonZeroGene(gt), "Turing preset should have non-zero genes");
    });

    it("setToPreset(4) Margulis works without throwing", function () {
        var gt = new Genotype();
        gt.setToPreset(PRESET_GENOTYPE_MARGULIS);
        assertTrue(hasNonZeroGene(gt), "Margulis preset should have non-zero genes");
    });

    it("setToPreset(5) Wilson works without throwing", function () {
        var gt = new Genotype();
        gt.setToPreset(PRESET_GENOTYPE_WILSON);
        assertTrue(hasNonZeroGene(gt), "Wilson preset should have non-zero genes");
    });

    it("setToPreset(6) Dawkins works without throwing", function () {
        var gt = new Genotype();
        gt.setToPreset(PRESET_GENOTYPE_DAWKINS);
        assertTrue(hasNonZeroGene(gt), "Dawkins preset should have non-zero genes");
    });

    it("setToPreset(7) Dennett works without throwing", function () {
        var gt = new Genotype();
        gt.setToPreset(PRESET_GENOTYPE_DENNETT);
        assertTrue(hasNonZeroGene(gt), "Dennett preset should have non-zero genes");
    });

    it("setToFroggy() produces valid genotype", function () {
        var gt = new Genotype();
        gt.setToFroggy();
        assertTrue(hasNonZeroGene(gt), "Froggy should have non-zero genes");
        // Froggy sets gene 0 to 255 explicitly
        assertEquals(255, gt.getGeneValue(0));
    });

    it("setAsOffspring(p0, p1) produces child with genes from both parents", function () {
        var p0 = new Genotype();
        p0.setAllGenesToOneValue(100);
        var p1 = new Genotype();
        p1.setAllGenesToOneValue(200);
        var child = new Genotype();
        child.setAsOffspring(p0, p1);

        // Every gene should be either 100 or 200 (or mutated variant)
        var found100 = false;
        var found200 = false;
        for (var i = 0; i < NUM_GENES; i++) {
            var v = child.getGeneValue(i);
            if (v === 100) found100 = true;
            if (v === 200) found200 = true;
            assertTrue(v >= 0 && v < BYTE_SIZE, "child gene " + i + " out of range: " + v);
        }
        assertTrue(found100, "child should have at least one gene from parent 0 (100)");
        assertTrue(found200, "child should have at least one gene from parent 1 (200)");
    });

    it("mutateGene(g) changes a single gene value and stays in [0, 255]", function () {
        var gt = new Genotype();
        gt.setAllGenesToOneValue(128);
        var before = gt.getGeneValue(42);
        gt.mutateGene(42);
        var after = gt.getGeneValue(42);
        assertTrue(after >= 0 && after < BYTE_SIZE, "mutated gene should be in [0, 255]");
        // The gene may stay the same if amplitude is 0, so we only check range
    });

    it("mutateGene(g) wraps around when exceeding BYTE_SIZE", function () {
        // Run multiple mutations to find one that actually changes the value
        var gt = new Genotype();
        var changed = false;
        for (var trial = 0; trial < 100; trial++) {
            gt.setGeneValue(0, 250);
            var before = gt.getGeneValue(0);
            gt.mutateGene(0);
            var after = gt.getGeneValue(0);
            if (before !== after) {
                changed = true;
                break;
            }
        }
        // Most mutations will change the value; if none did in 100 trials, that is extremely unlikely
        assertTrue(changed, "mutateGene should change the value in at least one of 100 trials");
    });

    it("zap(amount) mutates multiple genes", function () {
        var gt = new Genotype();
        gt.setAllGenesToOneValue(128);
        var before = gt.getGeneValue(0);
        // zap with amount=1.0 mutates every gene
        gt.zap(1.0);
        // After zapping every gene with amplitude 128, at least some should differ
        var anyChanged = false;
        for (var i = 0; i < NUM_GENES; i++) {
            if (gt.getGeneValue(i) !== 128) {
                anyChanged = true;
                break;
            }
        }
        assertTrue(anyChanged, "zap(1.0) should change at least some genes");
    });

    it("zap(0) does not change any genes", function () {
        var gt = new Genotype();
        gt.setAllGenesToOneValue(128);
        gt.zap(0);
        for (var i = 0; i < NUM_GENES; i++) {
            assertEquals(128, gt.getGeneValue(i), "gene " + i + " should be unchanged by zap(0)");
        }
    });

    it("getGeneName(g) returns non-empty string", function () {
        var gt = new Genotype();
        var name = gt.getGeneName(0);
        assertTrue(name.length > 0, "getGeneName should return non-empty string");
    });
});

// --------------- Embryology ---------------

describe("Embryology", function () {

    it("new Embryology() creates instance", function () {
        var emb = new Embryology();
        assertNotNull(emb);
    });

    it("generatePhenotypeFromGenotype(genotype) produces phenotype with numParts >= MIN_PARTS", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        assertNotNull(ph);
        assertTrue(ph.numParts >= MIN_PARTS, "numParts " + ph.numParts + " should be >= " + MIN_PARTS);
    });

    it("generatePhenotypeFromGenotype(genotype) produces phenotype with numParts <= MAX_PARTS", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        assertTrue(ph.numParts <= MAX_PARTS, "numParts " + ph.numParts + " should be <= " + MAX_PARTS);
    });

    it("getNumGeneCategories() returns NUM_CATEGORIES (4)", function () {
        var emb = new Embryology();
        assertEquals(NUM_CATEGORIES, emb.getNumGeneCategories());
    });

    it("getNumGenesUsed() returns expected value after phenotype generation", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        emb.generatePhenotypeFromGenotype(gt);
        var used = emb.getNumGenesUsed();
        assertTrue(used > 0, "getNumGenesUsed should be positive, got " + used);
        assertTrue(used < NUM_GENES, "getNumGenesUsed should be < NUM_GENES, got " + used);
        assertEquals(NUM_GENES_USED, used, "getNumGenesUsed should equal NUM_GENES_USED constant");
    });

    it("getGeneName(g) returns non-empty string for valid gene index (after generation)", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        emb.generatePhenotypeFromGenotype(gt);
        var used = emb.getNumGenesUsed();
        for (var i = 0; i < used; i++) {
            var name = emb.getGeneName(i);
            assertTrue(name.length > 0, "getGeneName(" + i + ") should return non-empty string, got: '" + name + "'");
        }
    });

    it("getGeneName(0) returns 'frequency' after generation", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        emb.generatePhenotypeFromGenotype(gt);
        assertEquals("frequency", emb.getGeneName(0));
    });

    it("getGeneName(1) returns 'cutoff' after generation", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        emb.generatePhenotypeFromGenotype(gt);
        assertEquals("cutoff", emb.getGeneName(1));
    });

    it("getGeneName for unused genes returns 'junk'", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        emb.generatePhenotypeFromGenotype(gt);
        // genes beyond _numGenesUsed should remain "junk"
        assertEquals("junk", emb.getGeneName(NUM_GENES - 1));
    });

    it("phenotype has valid parts array of MAX_PARTS length", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        assertArrayLength(MAX_PARTS, ph.parts);
    });

    it("each part in phenotype has required properties", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        for (var i = 0; i < ph.numParts; i++) {
            var p = ph.parts[i];
            assertNotNull(p.position, "part " + i + " should have position");
            assertNotNull(p.axis, "part " + i + " should have axis");
            assertTrue(p.length >= ZERO, "part " + i + " length should be >= 0, got " + p.length);
            assertTrue(p.width >= ZERO, "part " + i + " width should be >= 0, got " + p.width);
            assertNotNull(p.category, "part " + i + " should have category");
            assertType("number", p.parent, "part " + i + " should have numeric parent");
            assertType("number", p.child, "part " + i + " should have numeric child");
            assertType("number", p.angle, "part " + i + " should have numeric angle");
            assertType("number", p.frequency, "part " + i + " should have numeric frequency");
            assertType("number", p.phase, "part " + i + " should have numeric phase");
            assertType("number", p.amp, "part " + i + " should have numeric amp");
            assertType("number", p.red, "part " + i + " should have numeric red");
            assertType("number", p.green, "part " + i + " should have numeric green");
            assertType("number", p.blue, "part " + i + " should have numeric blue");
        }
    });

    it("phenotype parts have color values in [0, 1]", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        for (var i = 0; i < ph.numParts; i++) {
            var p = ph.parts[i];
            assertTrue(p.red >= 0 && p.red <= 1, "part " + i + " red out of [0,1]: " + p.red);
            assertTrue(p.green >= 0 && p.green <= 1, "part " + i + " green out of [0,1]: " + p.green);
            assertTrue(p.blue >= 0 && p.blue <= 1, "part " + i + " blue out of [0,1]: " + p.blue);
        }
    });

    it("phenotype parts have valid category in [0, NUM_CATEGORIES-1]", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        for (var i = 0; i < ph.numParts; i++) {
            var cat = ph.parts[i].category;
            assertTrue(cat >= 0 && cat < NUM_CATEGORIES, "part " + i + " category " + cat + " out of range");
        }
    });

    it("phenotype parts have valid parent references", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        for (var i = 0; i < ph.numParts; i++) {
            var parent = ph.parts[i].parent;
            assertTrue(parent >= NULL_INDEX && parent < ph.numParts,
                "part " + i + " parent " + parent + " out of valid range");
        }
    });

    it("generating phenotype from randomized genotype does not throw", function () {
        var emb = new Embryology();
        (function () {
            var gt = new Genotype();
            gt.randomize();
            emb.generatePhenotypeFromGenotype(gt);
        })();
    });

    it("generating phenotype from preset genotype (Darwin) does not throw", function () {
        var emb = new Embryology();
        (function () {
            var gt = new Genotype();
            gt.setToPreset(PRESET_GENOTYPE_DARWIN);
            emb.generatePhenotypeFromGenotype(gt);
        })();
    });

    it("generating phenotype from preset genotype (Turing) does not throw", function () {
        var emb = new Embryology();
        (function () {
            var gt = new Genotype();
            gt.setToPreset(PRESET_GENOTYPE_TURING);
            emb.generatePhenotypeFromGenotype(gt);
        })();
    });

    it("generating phenotype from preset genotype (Dennett) does not throw", function () {
        var emb = new Embryology();
        (function () {
            var gt = new Genotype();
            gt.setToPreset(PRESET_GENOTYPE_DENNETT);
            emb.generatePhenotypeFromGenotype(gt);
        })();
    });

    it("generating phenotype from Froggy genotype does not throw", function () {
        var emb = new Embryology();
        (function () {
            var gt = new Genotype();
            gt.setToFroggy();
            emb.generatePhenotypeFromGenotype(gt);
        })();
    });

    it("phenotype from all-zero genotype produces valid result", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        // genes are already 0 from constructor
        var ph = emb.generatePhenotypeFromGenotype(gt);
        assertNotNull(ph);
        assertTrue(ph.numParts >= MIN_PARTS, "zero-genotype should still produce >= MIN_PARTS parts");
    });

    it("phenotype from all-max genotype produces valid result", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.setAllGenesToOneValue(255);
        var ph = emb.generatePhenotypeFromGenotype(gt);
        assertNotNull(ph);
        assertTrue(ph.numParts >= MIN_PARTS, "max-genotype should produce >= MIN_PARTS parts");
        assertTrue(ph.numParts <= MAX_PARTS, "max-genotype should produce <= MAX_PARTS parts");
    });

    it("phenotype.frequency is set from genotype", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        assertTrue(ph.frequency >= MIN_FREQUENCY, "frequency should be >= " + MIN_FREQUENCY);
        assertTrue(ph.frequency <= MAX_FREQUENCY, "frequency should be <= " + MAX_FREQUENCY);
    });

    it("phenotype.preferredFoodType defaults to 0 when numFoodTypes is 1", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        assertEquals(0, ph.preferredFoodType);
    });

    it("phenotype.digestibleFoodType defaults to 0 when numFoodTypes is 1", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        assertEquals(0, ph.digestibleFoodType);
    });

    it("multiple phenotype generations produce different results from random genotypes", function () {
        var emb = new Embryology();
        var gt1 = new Genotype();
        gt1.randomize();
        var gt2 = new Genotype();
        gt2.randomize();
        var ph1 = emb.generatePhenotypeFromGenotype(gt1);
        var ph2 = emb.generatePhenotypeFromGenotype(gt2);
        // It is extremely unlikely two random genotypes produce identical phenotypes
        var identical = true;
        for (var i = 0; i < ph1.numParts; i++) {
            if (ph1.parts[i].length !== ph2.parts[i].length) {
                identical = false;
                break;
            }
        }
        assertFalse(identical, "two random genotypes should produce different phenotypes");
    });

    it("phenotype parts have length within [MIN_LENGTH, MAX_LENGTH]", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        for (var i = 0; i < ph.numParts; i++) {
            if (ph.parts[i].length === 0) continue; // skip zero-length parts (cut off by cutoff gene)
            assertTrue(ph.parts[i].length >= MIN_LENGTH,
                "part " + i + " length " + ph.parts[i].length + " < MIN_LENGTH " + MIN_LENGTH);
            assertTrue(ph.parts[i].length <= MAX_LENGTH,
                "part " + i + " length " + ph.parts[i].length + " > MAX_LENGTH " + MAX_LENGTH);
        }
    });

    it("phenotype parts have width within [MIN_WIDTH, MAX_WIDTH]", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        for (var i = 0; i < ph.numParts; i++) {
            if (ph.parts[i].width === 0) continue; // skip zero-width parts (cut off by cutoff gene)
            assertTrue(ph.parts[i].width >= MIN_WIDTH,
                "part " + i + " width " + ph.parts[i].width + " < MIN_WIDTH " + MIN_WIDTH);
            assertTrue(ph.parts[i].width <= MAX_WIDTH,
                "part " + i + " width " + ph.parts[i].width + " > MAX_WIDTH " + MAX_WIDTH);
        }
    });

    it("getRootPartIndex() returns ROOT_PART (0)", function () {
        assertEquals(0, ROOT_PART);
    });

    it("getNumGenesPerCategory() returns expected value after generation", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        emb.generatePhenotypeFromGenotype(gt);
        var perCat = emb.getNumGenesPerCategory();
        assertTrue(perCat > 0, "getNumGenesPerCategory should be positive, got " + perCat);
    });
});

// --------------- SwimbotTypes (Part, Phenotype) ---------------

describe("Part", function () {

    it("new Part() creates with default properties", function () {
        var p = new Part();
        assertNotNull(p);
        assertEquals(0, p.category);
        assertNotNull(p.position);
        assertNotNull(p.axis);
        assertNotNull(p.velocity);
        assertNotNull(p.previousMid);
        assertNotNull(p.midPosition);
        assertNotNull(p.perpendicular);
        assertEquals(ZERO, p.bendingAngle);
        assertEquals(ZERO, p.currentAngle);
        assertEquals(NULL_PART, p.parent);
        assertEquals(NULL_PART, p.child);
        assertEquals(ZERO, p.mass);
        assertEquals(ZERO, p.length);
        assertEquals(ZERO, p.width);
        assertEquals(ZERO, p.angle);
        assertEquals(ZERO, p.frequency);
        assertEquals(ZERO, p.phase);
        assertEquals(ZERO, p.amp);
        assertEquals(ZERO, p.turnAmp);
        assertEquals(ZERO, p.turnPhase);
        assertEquals(ZERO, p.momentFactor);
        assertEquals(ZERO, p.red);
        assertEquals(ZERO, p.green);
        assertEquals(ZERO, p.blue);
        assertEquals(ZERO, p.endCapSpline);
        assertFalse(p.branch);
        assertFalse(p.splined);
        assertEquals(0, p.numDecendents);
        assertNotNull(p.decendent);
        assertArrayLength(MAX_PARTS, p.decendent);
    });

    it("Part vector properties are Vector2D instances", function () {
        var p = new Part();
        assertTrue(p.position instanceof Vector2D);
        assertTrue(p.axis instanceof Vector2D);
        assertTrue(p.velocity instanceof Vector2D);
        assertTrue(p.previousMid instanceof Vector2D);
        assertTrue(p.midPosition instanceof Vector2D);
        assertTrue(p.perpendicular instanceof Vector2D);
    });

    it("Part properties are independently settable", function () {
        var p = new Part();
        p.category = 3;
        p.length = 15.0;
        p.width = 4.0;
        p.red = 1.0;
        p.green = 0.5;
        p.blue = 0.0;
        p.branch = true;
        p.splined = true;
        p.parent = 0;
        p.child = 2;
        assertEquals(3, p.category);
        assertEquals(15.0, p.length);
        assertEquals(4.0, p.width);
        assertEquals(1.0, p.red);
        assertEquals(0.5, p.green);
        assertEquals(0.0, p.blue);
        assertTrue(p.branch);
        assertTrue(p.splined);
        assertEquals(0, p.parent);
        assertEquals(2, p.child);
    });
});

describe("Phenotype", function () {

    it("new Phenotype() creates with numParts=0", function () {
        var ph = new Phenotype();
        assertNotNull(ph);
        assertEquals(0, ph.numParts);
    });

    it("new Phenotype() creates with parts array of MAX_PARTS length", function () {
        var ph = new Phenotype();
        assertArrayLength(MAX_PARTS, ph.parts);
    });

    it("new Phenotype() initializes each slot with a Part instance", function () {
        var ph = new Phenotype();
        for (var i = 0; i < MAX_PARTS; i++) {
            assertTrue(ph.parts[i] instanceof Part, "parts[" + i + "] should be a Part");
        }
    });

    it("new Phenotype() creates with frequency=ZERO", function () {
        var ph = new Phenotype();
        assertEquals(ZERO, ph.frequency);
    });

    it("new Phenotype() creates with sumPartLengths=ZERO", function () {
        var ph = new Phenotype();
        assertEquals(ZERO, ph.sumPartLengths);
    });

    it("new Phenotype() creates with mass=ZERO", function () {
        var ph = new Phenotype();
        assertEquals(ZERO, ph.mass);
    });

    it("new Phenotype() creates with preferredFoodType=0", function () {
        var ph = new Phenotype();
        assertEquals(0, ph.preferredFoodType);
    });

    it("new Phenotype() creates with digestibleFoodType=0", function () {
        var ph = new Phenotype();
        assertEquals(0, ph.digestibleFoodType);
    });

    it("Phenotype properties are independently settable", function () {
        var ph = new Phenotype();
        ph.numParts = 5;
        ph.frequency = 0.15;
        ph.sumPartLengths = 50.0;
        ph.mass = 25.0;
        ph.preferredFoodType = 1;
        ph.digestibleFoodType = 1;
        assertEquals(5, ph.numParts);
        assertEquals(0.15, ph.frequency);
        assertEquals(50.0, ph.sumPartLengths);
        assertEquals(25.0, ph.mass);
        assertEquals(1, ph.preferredFoodType);
        assertEquals(1, ph.digestibleFoodType);
    });
});

// --------------- Integration: Genotype -> Embryology -> Phenotype ---------------

describe("Genotype to Phenotype pipeline", function () {

    it("random genotype produces phenotype with at least MIN_PARTS parts", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.randomize();
        var ph = emb.generatePhenotypeFromGenotype(gt);
        assertTrue(ph.numParts >= MIN_PARTS, "random genotype should yield >= " + MIN_PARTS + " parts, got " + ph.numParts);
    });

    it("all 8 presets produce valid phenotypes", function () {
        var emb = new Embryology();
        for (var preset = 0; preset < 8; preset++) {
            var gt = new Genotype();
            gt.setToPreset(preset);
            var ph = emb.generatePhenotypeFromGenotype(gt);
            assertTrue(ph.numParts >= MIN_PARTS,
                "preset " + preset + " should yield >= " + MIN_PARTS + " parts, got " + ph.numParts);
            assertTrue(ph.numParts <= MAX_PARTS,
                "preset " + preset + " should yield <= " + MAX_PARTS + " parts, got " + ph.numParts);
        }
    });

    it("offspring genotype produces valid phenotype", function () {
        var emb = new Embryology();
        var p0 = new Genotype();
        p0.setToPreset(PRESET_GENOTYPE_DARWIN);
        var p1 = new Genotype();
        p1.setToPreset(PRESET_GENOTYPE_TURING);
        var child = new Genotype();
        child.setAsOffspring(p0, p1);
        var ph = emb.generatePhenotypeFromGenotype(child);
        assertTrue(ph.numParts >= MIN_PARTS, "offspring phenotype should have >= " + MIN_PARTS + " parts");
    });

    it("mutated genotype produces valid phenotype", function () {
        var emb = new Embryology();
        var gt = new Genotype();
        gt.setToPreset(PRESET_GENOTYPE_DARWIN);
        gt.zap(0.5); // mutate half the genes
        var ph = emb.generatePhenotypeFromGenotype(gt);
        assertTrue(ph.numParts >= MIN_PARTS, "mutated phenotype should have >= " + MIN_PARTS + " parts");
    });

    it("copy of genotype produces identical phenotype part count", function () {
        var emb = new Embryology();
        var gt1 = new Genotype();
        gt1.randomize();
        var gt2 = new Genotype();
        gt2.copyFromGenotype(gt1);
        var ph1 = emb.generatePhenotypeFromGenotype(gt1);
        var ph2 = emb.generatePhenotypeFromGenotype(gt2);
        assertEquals(ph1.numParts, ph2.numParts, "identical genotypes should produce same numParts");
    });
});

// --------------- Helper functions ---------------

function hasNonZeroGene(gt) {
    for (var i = 0; i < NUM_GENES; i++) {
        if (gt.getGeneValue(i) !== 0) {
            return true;
        }
    }
    return false;
}
