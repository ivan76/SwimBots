"use strict";

//  constants
const NUM_CATEGORIES = 4;

//  gene limits
const MIN_LENGTH = 3.0;
const MAX_LENGTH = 27.0;
const MIN_WIDTH = 0.5;
const MIN_SPLINED = 0;
const MAX_SPLINED = 1;
const MIN_END_CAP_SPLINE = 0.5;
const MAX_END_CAP_SPLINE = 4.0;

const MAX_WIDTH = 7.0;

const MIN_FREQUENCY = 0.02;
const MAX_FREQUENCY = 0.2;
const MIN_AMP = -60.0;
const MAX_AMP = 60.0;
const MIN_PHASE = -1.0;
const MAX_PHASE = 1.0;
const MIN_COLOR = ZERO;
const MAX_COLOR = ONE;
const MIN_BRANCH_PERIOD = 1;
const MAX_BRANCH_PERIOD = 4;
const MIN_BRANCH_ANGLE = -90.0;
const MAX_BRANCH_ANGLE = 90.0;
const MIN_BRANCH_NUMBER = 0;
const MAX_BRANCH_NUMBER = 3;
const MIN_BRANCH_SHIFT = 0;
const MAX_BRANCH_SHIFT = 6;
const MIN_BRANCH_REFLECT = 0;
const MAX_BRANCH_REFLECT = 3;
const MIN_BRANCH_CATEGORY = 0;
const MAX_BRANCH_CATEGORY = NUM_CATEGORIES - 1;
const MIN_CUT_OFF = MIN_PARTS;
const MAX_CUT_OFF = MAX_PARTS - 1;
const MIN_SEQUENCE_COUNT = MIN_PARTS;
const MAX_SEQUENCE_COUNT = 5;

const GREATEST_POSSIBLE_SWIMBOT_MASS = MAX_PARTS * MAX_LENGTH * MAX_WIDTH
const GREATEST_POSSIBLE_SWIMBOT_LENGTH = MAX_PARTS * MAX_LENGTH;

// Helper class for category values (previously inner function)
class CategoryValues {
    constructor() {
        this.sequenceCount = ZERO;

        //geometry and color
        this.startWidth = ZERO;
        this.endWidth = ZERO;
        this.startLength = ZERO;
        this.endLength = ZERO;
        this.startRed = ZERO;
        this.startGreen = ZERO;
        this.startBlue = ZERO;
        this.endRed = ZERO;
        this.endGreen = ZERO;
        this.endBlue = ZERO;
        this.splined = ZERO;
        this.endCapSpline = ZERO;

        // motion
        this.amp = ZERO;
        this.phase = ZERO;
        this.turnAmp = ZERO;
        this.turnPhase = ZERO;
        this.branchAmp = ZERO;
        this.branchPhase = ZERO;
        this.branchTurnAmp = ZERO;
        this.branchTurnPhase = ZERO;

        //branching
        this.branchPeriod = ZERO;
        this.branchAngle = ZERO;
        this.branchNumber = ZERO;
        this.branchShift = ZERO;
        this.branchCategory = ZERO;
        this.branchReflect = ZERO;
    }
}

// Helper function for copying parts (previously inner function)
function copyPart(from, to) {
    to.category = from.category;
    to.position = from.position;
    to.velocity = from.velocity;
    to.previousMid = from.previousMid;
    to.midPosition = from.midPosition;
    to.perpendicular = from.perpendicular;
    to.bendingAngle = from.bendingAngle;
    to.currentAngle = from.currentAngle;

    to.mass = from.mass;
    to.length = from.length;
    to.width = from.width;
    to.angle = from.angle;
    //to.branchAngle		= from.branchAngle;
    to.frequency = from.frequency;
    to.amp = from.amp;
    to.phase = from.phase;
    to.turnAmp = from.turnAmp;
    to.turnPhase = from.turnPhase;
    to.momentFactor = from.momentFactor;
    to.red = from.red;
    to.green = from.green;
    to.blue = from.blue;
    to.splined = from.splined;
    to.endCapSpline = from.endCapSpline;
    to.numDecendents = from.numDecendents;

    for (let d = 0; d < MAX_PARTS; d++) {
        to.decendent[d] = from.decendent[d];
    }
}

class Embryology {
    constructor() {
        this._testNoEel = true;

        // variables
        this._normalizedGenes = new Float32Array(NUM_GENES);
        this._geneNames = Array(NUM_GENES);
        this._branchStatus = Array(MAX_PARTS);
        this._categoryValues = Array(NUM_CATEGORIES);
        this._partIndex = ZERO;
        this._generating = false;
        this._frequency = ZERO;
        this._numGenesUsed = 0;
        this._numGenesPerCategory = 0;
        this._cutOff = 0;
        this._preferredFoodTypeGene = 0;
        this._digestibleFoodTypeGene = 0;

        for (let g = 0; g < NUM_GENES; g++) {
            this._geneNames[g] = "junk";
        }
    }

    getPreferredFoodTypeGene() { return this._preferredFoodTypeGene; }

    getDigestibleFoodTypeGene() { return this._digestibleFoodTypeGene; }

    // generate phenotype from genotype
    generatePhenotypeFromGenotype(genotype) {
        // create new phenotype...
        let phenotype = new Phenotype();

        // create categories array
        for (let c = 0; c < NUM_CATEGORIES; c++) {
            this._categoryValues[c] = new CategoryValues();
        }

        // initialize branch status
        for (let p = 0; p < MAX_PARTS; p++) {
            this._branchStatus[p] = false;
        }

        // convert the gene values from byte to normalized
        for (let g = 0; g < NUM_GENES; g++) {
            this._normalizedGenes[g] = genotype.getGeneValue(g) / BYTE_SIZE;
            assert(this._normalizedGenes[g] >= ZERO, "normalizedGenes[g] >= ZERO");
            assert(this._normalizedGenes[g] <= ONE, "normalizedGenes[g] <= ONE");
        }

        // get the ranges...
        let sequenceCountRange = MAX_SEQUENCE_COUNT - MIN_SEQUENCE_COUNT;
        let widthRange = MAX_WIDTH - MIN_WIDTH;
        let lengthRange = MAX_LENGTH - MIN_LENGTH;
        let ampRange = MAX_AMP - MIN_AMP;
        let frequencyRange = MAX_FREQUENCY - MIN_FREQUENCY;
        let phaseRange = MAX_PHASE - MIN_PHASE;
        let colorRange = MAX_COLOR - MIN_COLOR;
        let periodRange = MAX_BRANCH_PERIOD - MIN_BRANCH_PERIOD;
        let branchAngleRange = MAX_BRANCH_ANGLE - MIN_BRANCH_ANGLE;
        let branchNumberRange = MAX_BRANCH_NUMBER - MIN_BRANCH_NUMBER;
        let branchShiftRange = MAX_BRANCH_SHIFT - MIN_BRANCH_SHIFT;
        let branchCategoryRange = MAX_BRANCH_CATEGORY - MIN_BRANCH_CATEGORY;
        let branchReflectRange = MAX_BRANCH_REFLECT - MIN_BRANCH_REFLECT;
        let cutOffRange = MAX_CUT_OFF - MIN_CUT_OFF;
        let splinedRange = MAX_SPLINED - MIN_SPLINED;
        let endCapSplineRange = MAX_END_CAP_SPLINE - MIN_END_CAP_SPLINE;

        // apply genes
        let g = -1;

        g++;
        this._frequency = MIN_FREQUENCY + frequencyRange * this._normalizedGenes[g];
        this._geneNames[g] = "frequency";
        g++;
        this._cutOff = MIN_CUT_OFF + cutOffRange * this._normalizedGenes[g];
        this._geneNames[g] = "cutoff";

        for (let c = 0; c < NUM_CATEGORIES; c++) {
            this._numGenesPerCategory = 0;
            g++;
            this._categoryValues[c].startRed = MIN_COLOR + colorRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "start red";
            g++;
            this._categoryValues[c].startGreen = MIN_COLOR + colorRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "start green";
            g++;
            this._categoryValues[c].startBlue = MIN_COLOR + colorRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "start blue";
            g++;
            this._categoryValues[c].endRed = MIN_COLOR + colorRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "end red";
            g++;
            this._categoryValues[c].endGreen = MIN_COLOR + colorRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "end green";
            g++;
            this._categoryValues[c].endBlue = MIN_COLOR + colorRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "end blue";
            g++;
            this._categoryValues[c].startWidth = MIN_WIDTH + widthRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "start width";
            g++;
            this._categoryValues[c].endWidth = MIN_WIDTH + widthRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "end width";
            g++;
            this._categoryValues[c].startLength = MIN_LENGTH + lengthRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "start length";
            g++;
            this._categoryValues[c].endLength = MIN_LENGTH + lengthRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "end length";

            g++;
            this._categoryValues[c].amp = MIN_AMP + ampRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "amplitude";
            g++;
            this._categoryValues[c].phase = MIN_PHASE + phaseRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "phase";
            g++;
            this._categoryValues[c].turnAmp = MIN_AMP + ampRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "turn amplitude";
            g++;
            this._categoryValues[c].turnPhase = MIN_PHASE + phaseRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "turn phase";
            g++;
            this._categoryValues[c].branchAmp = MIN_AMP + ampRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "branch amplitude";
            g++;
            this._categoryValues[c].branchPhase = MIN_PHASE + phaseRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "branch phase";
            g++;
            this._categoryValues[c].branchTurnAmp = MIN_AMP + ampRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "branch turn amplitude";
            g++;
            this._categoryValues[c].branchTurnPhase = MIN_PHASE + phaseRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "branch turn phase";

            g++;
            this._categoryValues[c].sequenceCount = MIN_SEQUENCE_COUNT + sequenceCountRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "sequence count";
            g++;
            this._categoryValues[c].branchPeriod = MIN_BRANCH_PERIOD + periodRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "branch period";
            g++;
            this._categoryValues[c].branchAngle = MIN_BRANCH_ANGLE + branchAngleRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "branch angle";
            g++;
            this._categoryValues[c].branchNumber = MIN_BRANCH_NUMBER + branchNumberRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "branch number";
            g++;
            this._categoryValues[c].branchShift = MIN_BRANCH_SHIFT + branchShiftRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "branch shift";
            g++;
            this._categoryValues[c].branchCategory = MIN_BRANCH_CATEGORY + branchCategoryRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "branch category";
            g++;
            this._categoryValues[c].branchReflect = MIN_BRANCH_REFLECT + branchReflectRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "branch reflect";

            g++;
            this._categoryValues[c].splined = MIN_SPLINED + splinedRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "splined";
            g++;
            this._categoryValues[c].endCapSpline = MIN_END_CAP_SPLINE + endCapSplineRange * this._normalizedGenes[g];
            this._numGenesPerCategory++;
            this._geneNames[g] = "end cap spline";

            // make these integers
            this._categoryValues[c].sequenceCount = Math.floor(ZERO + this._categoryValues[c].sequenceCount);
            this._categoryValues[c].branchPeriod = Math.floor(ZERO + this._categoryValues[c].branchPeriod);
            this._categoryValues[c].branchNumber = Math.floor(ONE + this._categoryValues[c].branchNumber);
            this._categoryValues[c].branchShift = Math.floor(ZERO + this._categoryValues[c].branchShift);
            this._categoryValues[c].branchCategory = Math.floor(ZERO + this._categoryValues[c].branchCategory);
            this._categoryValues[c].branchReflect = Math.floor(ONE + this._categoryValues[c].branchReflect);
            this._categoryValues[c].splined = Math.round(ZERO + this._categoryValues[c].splined);
        }

        // add genes for food type preference and digestibility:
        // by default, swimbots are all born with a preferrence for 0 (green), but if numFoodTypes
        // is set to 2, then they are born with a genetically-determined preferrence.
        phenotype.preferredFoodType = 0;
        phenotype.digestibleFoodType = 0;

        g++;
        this._preferredFoodTypeGene = g;
        this._geneNames[g] = "preferred food type";
        if (globalTweakers.numFoodTypes === 2) {
            phenotype.preferredFoodType = Math.floor(this._normalizedGenes[g] * 2);
        }

        g++;
        this._digestibleFoodTypeGene = g;
        this._geneNames[g] = "digestible food type";
        if (globalTweakers.numFoodTypes === 2) {
            phenotype.digestibleFoodType = Math.floor(this._normalizedGenes[g] * 2);
        }

        // important: set _numGenesUsed
        this._numGenesUsed = g + 1;

        // make sure this is kosher
        assert(this._numGenesUsed < NUM_GENES, "embryology: _numGenesUsed < NUM_GENES");

        // set the frequency...
        phenotype.frequency = this._frequency;

        // generate the first sequence...
        this._partIndex = ROOT_PART;
        let startCategory = 0;

        this._testNoEel = true;
        this.generateBodySequence(phenotype, this._partIndex, ZERO, startCategory, ONE);
        this._testNoEel = false;

        // generate the rest of the body...
        this._generating = true;
        while (this._generating) {
            for (let p = 0; p < MAX_PARTS; p++) {
                this._generating = false; // this might get set back to true in generateBodySequence

                // branching...
                if (this._branchStatus[p]) {
                    this._branchStatus[p] = false; // this might get set back to true in generateBodySequence

                    let partCategory = phenotype.parts[p].category;

                    let c = this._categoryValues[partCategory].branchCategory;
                    let reflect = ONE;

                    // grow branch
                    if (this._categoryValues[c].branchNumber === 1) {
                        reflect = ONE;
                        this.generateBodySequence(phenotype, p, this._categoryValues[c].branchAngle, c, reflect);
                    } else {
                        // fan out branch angle across the range of branches....
                        for (let b = 0; b < this._categoryValues[c].branchNumber; b++) {
                            reflect = ONE;
                            if (b % this._categoryValues[c].branchReflect === 0) {
                                reflect = -ONE;
                            }

                            let f = -ONE + (b / (this._categoryValues[c].branchNumber - 1)) * 2;

                            this.generateBodySequence(phenotype, p, this._categoryValues[c].branchAngle * f, c, reflect);
                        }
                    }
                }
            }
        }

        // set num parts (it will have accumulated from generating part sequences)
        phenotype.numParts = this._partIndex + 1;

        assert(phenotype.numParts > 1, "phenotype.numParts > 1");

        // re-order the parts for more sensible rendering
        //this.fixPartOrdering(phenotype);

        return phenotype;
    }

    // re-order the body parts for proper rendering
    fixPartOrdering(phenotype) {
        //  copy the parts array into a backup array and call it "testParts"
        let fixed = [];
        let testParts = [];

        phenotype.parts[2].red = 1.0;
        phenotype.parts[2].green = 1.0;
        phenotype.parts[2].blue = 0.5;

        for (let p = 1; p < phenotype.numParts; p++) {
            fixed[p] = false;
            testParts[p] = new Part();
            copyPart(phenotype.parts[p], testParts[p]);
        }

        // start with part 1
        let currentParentIndex = 1;
        fixed[currentParentIndex] = true;

        // loop through the rest of the parts to replace them
        // with the copy...possibly in a different order)
        for (let p = 1; p < phenotype.numParts; p++) {
            copyPart(testParts[p], phenotype.parts[p]);
        }
    }

    // generate body sequence
    generateBodySequence(phenotype, parent, branchAngle, c, reflect) {
        for (let i = 0; i < this._categoryValues[c].sequenceCount; i++) {
            if (this._partIndex < this._cutOff) {
                // increment _partIndex
                this._partIndex++;
                assert(this._partIndex < MAX_PARTS, "_partIndex < MAX_PARTS");

                phenotype.parts[this._partIndex].child = NULL_INDEX; //default

                // the first part is a branchpoint from the parent
                if (i === 0) {
                    phenotype.parts[this._partIndex].branch = true;
                    phenotype.parts[this._partIndex].parent = parent;
                    phenotype.parts[this._partIndex].angle = branchAngle;
                    phenotype.parts[this._partIndex].amp = this._categoryValues[c].branchAmp;
                    phenotype.parts[this._partIndex].phase = this._categoryValues[c].branchPhase * this._partIndex;
                    phenotype.parts[this._partIndex].turnAmp = this._categoryValues[c].branchTurnAmp;
                    phenotype.parts[this._partIndex].turnPhase = this._categoryValues[c].branchTurnPhase * this._partIndex;
                } else {
                    let parent = this._partIndex - 1;
                    phenotype.parts[parent].child = this._partIndex;

                    phenotype.parts[this._partIndex].branch = false;
                    phenotype.parts[this._partIndex].parent = parent;
                    phenotype.parts[this._partIndex].angle = ZERO;
                    phenotype.parts[this._partIndex].amp = this._categoryValues[c].amp;
                    phenotype.parts[this._partIndex].phase = this._categoryValues[c].phase * this._partIndex;
                    phenotype.parts[this._partIndex].turnAmp = this._categoryValues[c].turnAmp;
                    phenotype.parts[this._partIndex].turnPhase = this._categoryValues[c].turnPhase;
                }

                if (this._testNoEel) {
                    phenotype.parts[this._partIndex].turnAmp = ZERO;
                    phenotype.parts[this._partIndex].turnPhase = ZERO;
                }

                // apply reflection on amp
                phenotype.parts[this._partIndex].amp *= reflect;

                // set some other attributes
                phenotype.parts[this._partIndex].category = c;
                phenotype.parts[this._partIndex].frequency = phenotype.frequency;
                phenotype.parts[this._partIndex].splined = this._categoryValues[c].splined;
                phenotype.parts[this._partIndex].endCapSpline = this._categoryValues[c].endCapSpline;

                // set attributes that interpolate over the sequence
                let fraction = ZERO;

                if (this._categoryValues[c].sequenceCount > 1) {
                    fraction = i / (this._categoryValues[c].sequenceCount - 1);
                }

                phenotype.parts[this._partIndex].width = this._categoryValues[c].startWidth + fraction * (this._categoryValues[c].endWidth - this._categoryValues[c].startWidth);
                phenotype.parts[this._partIndex].length = this._categoryValues[c].startLength + fraction * (this._categoryValues[c].endLength - this._categoryValues[c].startLength);
                phenotype.parts[this._partIndex].red = this._categoryValues[c].startRed + fraction * (this._categoryValues[c].endRed - this._categoryValues[c].startRed);
                phenotype.parts[this._partIndex].green = this._categoryValues[c].startGreen + fraction * (this._categoryValues[c].endGreen - this._categoryValues[c].startGreen);
                phenotype.parts[this._partIndex].blue = this._categoryValues[c].startBlue + fraction * (this._categoryValues[c].endBlue - this._categoryValues[c].startBlue);

                assert(phenotype.parts[this._partIndex].length > ZERO, "In Embryology: phenotype.parts[ _partIndex ].length > ZERO");
                assert(phenotype.parts[this._partIndex].width > ZERO, "In Embryology: phenotype.parts[ _partIndex ].width  > ZERO");

                // determine if there is a branching
                let mod = (i + this._categoryValues[c].branchShift) % this._categoryValues[c].branchPeriod;

                if (mod === 0) {
                    this._generating = true;
                    this._branchStatus[this._partIndex] = true;
                }
            }
        }
    }

    // get num categories
    getNumGeneCategories() {
        return NUM_CATEGORIES;
    }

    // get num genes used
    getNumGenesUsed() {
        return this._numGenesUsed;
    }

    // get num genes per category
    getNumGenesPerCategory() {
        return this._numGenesPerCategory;
    }

    // get gene name
    getGeneName(g) {
        return this._geneNames[g];
    }
}
