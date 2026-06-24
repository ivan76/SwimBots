"use strict";

class Swimbot {
    constructor() {
        // variables
        this._genotype = new Genotype();
        this._phenotype = new Phenotype();
        this._brain = new Brain();
        this._position = new Vector2D();
        this._velocity = new Vector2D();
        this._acceleration = new Vector2D();
        this._heading = new Vector2D();
        this._directionToGoal = new Vector2D();
        this._focusDirection = new Vector2D();
        this._centerOfMass = new Vector2D();
        this._vectorUtility = new Vector2D();
        this._chosenFoodBit = new FoodBit();
        this._swimbotRenderer = new SwimbotRenderer();
        this._chosenMate = null; // must start as null!
        this._age = 0;
        this._numOffspring = 0;
        this._numFoodBitsEaten = 0;
        this._index = NULL_INDEX;
        this._chosenMateIndex = NULL_INDEX;
        this._chosenFoodBitIndex = NULL_INDEX;
        this._alive = false;
        this._tryingToMate = false;
        this._tryingToEat = false;
        this._growthScale = ZERO;
        this._torque = ZERO;
        this._angle = ZERO;
        this._spin = ZERO;
        this._energy = ZERO;
        this._timer = ZERO;
        this._timerDelta = ZERO;
        this._colorUtility = new Color();
        this._energyEfficiency = ZERO;
        this._selectRadius = ZERO;

        this._lastPositionForEfficiencyMeasurement = new Vector2D();
        this._lastEnergyForEfficiencyMeasurement = ZERO;
        this._readyforSensoryInputToBrain = false;

        this._parent = null;

        // Sub-components (lazy init to avoid circular dependency)
        this._physics = null;
        this._ai = null;
        this._social = null;
    }

    /**
     * Get the physics sub-component (lazy init).
     */
    _getPhysics() {
        if (!this._physics) this._physics = new SwimbotPhysics(this);
        return this._physics;
    }

    /**
     * Get the AI sub-component (lazy init).
     */
    _getAI() {
        if (!this._ai) this._ai = new SwimbotAI(this);
        return this._ai;
    }

    /**
     * Get the social sub-component (lazy init).
     */
    _getSocial() {
        if (!this._social) this._social = new SwimbotSocial(this);
        return this._social;
    }

    // ------------------------------------------------------------------
    // Lifecycle
    // ------------------------------------------------------------------

    setParent(parent) {
        this._parent = parent;
    }

    // create
    create(index, age, position, angle, energy, genotype, embryology) {
        // clear out everything for starters...
        this.clear();

        // set some basic properties
        this._position.copyFrom(position);

        //_velocity.clear();
        this._index = index;
        this._angle = angle;
        this._age = age;
        this._energy = energy;
        this._alive = true;
        this._growthScale = ONE;

        // copy genotype values to this swimbot...
        this._genotype.copyFromGenotype(genotype);
        assert(this._genotype != null, "_genotype != null");

        // generate phenotype
        this._phenotype = embryology.generatePhenotypeFromGenotype(this._genotype);

        // important
        this.processPhenotype();

        // initialize energy efficiency-related stuff
        this._lastPositionForEfficiencyMeasurement.set(this._position);
        this._lastEnergyForEfficiencyMeasurement = this._energy;

        // initialize brain
        this._brain.initialize();
        this._brain.setHungerThreshold(DEFAULT_SWIMBOT_HUNGER_THRESHOLD);
        this._brain.setEnergyLevel(this._energy);
        this._brain.update();
    }

    setHungerThreshold(t) {
        this._getAI().setHungerThreshold(t);
    }

    // should be called after "generatePhenotypeFromGenotype"
    processPhenotype() {
        // calculate masses and total part length
        this._phenotype.mass = ZERO;
        assert(this._phenotype.numParts > 0, "_phenotype.numParts > 0");

        this._phenotype.sumPartLengths = ZERO;

        for (let p = 1; p < this._phenotype.numParts; p++) {
            this._phenotype.sumPartLengths += this._phenotype.parts[p].length;

            assert(this._phenotype.parts[p].length > ZERO, "_phenotype.parts[p].length > ZERO");
            assert(this._phenotype.parts[p].width > ZERO, "_phenotype.parts[p].width  > ZERO");

            this._phenotype.parts[p].mass = this._phenotype.parts[p].length * this._phenotype.parts[p].width;

            assert(this._phenotype.parts[p].mass > ZERO, "_phenotype.parts[p].mass > ZERO");

            this._phenotype.mass += this._phenotype.parts[p].mass;
        }

        assert(this._phenotype.mass > ZERO, "_phenotype.mass > ZERO");

        // compute moment factors
        this._getPhysics().computeMomentFactors();

        // create that body...now
        this._getPhysics().updateBodyParts();

        this._timerDelta = ZERO;
    }

    // ------------------------------------------------------------------
    // Genetics
    // ------------------------------------------------------------------

    zap(embryology, amount) {
        this._genotype.zap(amount);
        assert(this._genotype != null, "_genotype != null");

        // generate phenotype
        this._phenotype = embryology.generatePhenotypeFromGenotype(this._genotype);

        // important
        this.processPhenotype();
    }

    setGeneValue(geneIndex, geneValue, embryology) {
        // set gene value
        this._genotype.setGeneValue(geneIndex, geneValue);

        // generate phenotype
        this._phenotype = embryology.generatePhenotypeFromGenotype(this._genotype);

        // important
        this.processPhenotype();
    }

    // ------------------------------------------------------------------
    // Main tick
    // ------------------------------------------------------------------

    // update
    update() {
        // Delegate AI tick (includes age increment, brain update, goal pursuit, focus direction)
        this._getAI().tick();

        // update body parts
        this._getPhysics().updateBodyParts();

        // update physics
        this._getPhysics().updatePhysics();
    }

    // ------------------------------------------------------------------
    // Physics delegation
    // ------------------------------------------------------------------

    // set position
    setPosition(p) {
        this._getPhysics().setPosition(p);
    }

    // set velocity
    setVelocity(v) {
        this._getPhysics().setVelocity(v);
    }

    // add to velocity
    addForce(force) {
        this._getPhysics().addForce(force);
    }

    // set energy
    setEnergy(e) {
        this._energy = e;
    }

    // set angle
    setAngle(a) {
        this._angle = a;
    }

    // ------------------------------------------------------------------
    // AI delegation
    // ------------------------------------------------------------------

    // eatChosenFoodBit
    eatChosenFoodBit() {
        return this._getAI().eatChosenFoodBit();
    }

    // setEnvironmentalStimuli
    setEnvironmentalStimuli(numNearbySwimbots, nearbySwimbotArray, foodBitWasFound, theFoodBit) {
        this._getAI().setEnvironmentalStimuli(numNearbySwimbots, nearbySwimbotArray, foodBitWasFound, theFoodBit);
    }

    // set attraction
    setAttraction(attraction) {
        this._getAI().setAttraction(attraction);
    }

    // ------------------------------------------------------------------
    // Social delegation
    // ------------------------------------------------------------------

    // get attractiveness
    getAttractiveness(judge) {
        return this._getSocial().getAttractiveness(judge);
    }

    // get color saturation
    getColorSaturation() {
        return this._getSocial().getColorSaturation();
    }

    // get closeness
    getCloseness(judge) {
        return this._getSocial().getCloseness(judge);
    }

    // get similarity
    getSimilarity(judge) {
        return this._getSocial().getSimilarity(judge);
    }

    // get color similarity
    getColorSimilarity(judge) {
        return this._getSocial().getColorSimilarity(judge);
    }

    // get bigness similarity
    getBignessSimilarity(judge) {
        return this._getSocial().getBignessSimilarity(judge);
    }

    // get hyperness similarity
    getHypernessSimilarity(judge) {
        return this._getSocial().getHypernessSimilarity(judge);
    }

    // get length similarity
    getLengthSimilarity(judge) {
        return this._getSocial().getLengthSimilarity(judge);
    }

    // get straightness similarity
    getStraightessSimilarity(judge) {
        return this._getSocial().getStraightessSimilarity(judge);
    }

    getCurrentBodyBigness() {
        return this._getSocial().getCurrentBodyBigness();
    }

    getCurrentBodyLongness() {
        return this._getSocial().getCurrentBodyLongness();
    }

    getCurrentBodyStraightness() {
        return this._getSocial().getCurrentBodyStraightness();
    }

    getCurrentBodyHyperness() {
        return this._getSocial().getCurrentBodyHyperness();
    }

    // get average color
    getAverageColor() {
        return this._getSocial().getAverageColor();
    }

    // ------------------------------------------------------------------
    // Lifecycle helpers
    // ------------------------------------------------------------------

    // die
    die() {
        this._alive = false;

        if (this._index != NULL_INDEX) {
            // this is used for updating the FamilyTree
            this._parent.notifySwimbotDeathTime(this._index);
        }
    }

    // clear all data
    clear() {
        this._lastPositionForEfficiencyMeasurement.clear();
        this._genotype.clear();
        this._position.clear();
        this._velocity.clear();
        this._acceleration.clear();
        this._heading.clear();
        this._directionToGoal.clear();
        this._focusDirection.clear();
        this._centerOfMass.clear();
        this._vectorUtility.clear();

        this._chosenFoodBit = null;
        this._chosenMate = null;
        this._age = 0;
        this._numOffspring = 0;
        this._numFoodBitsEaten = 0;
        this._index = NULL_INDEX;
        this._chosenMateIndex = NULL_INDEX;
        this._chosenFoodBitIndex = NULL_INDEX;
        this._alive = false;
        this._tryingToMate = false;
        this._tryingToEat = false;
        this._growthScale = ZERO;
        this._torque = ZERO;
        this._angle = ZERO;
        this._spin = ZERO;
        this._energy = ZERO;
        this._timer = ZERO;
        this._timerDelta = ZERO;
        this._energyEfficiency = ZERO;
        this._selectRadius = ZERO;
        this._lastEnergyForEfficiencyMeasurement = ZERO;
        this._readyforSensoryInputToBrain = false;

        // Reset sub-components on clear so they re-initialize lazily
        this._physics = null;
        this._ai = null;
        this._social = null;
    }

    // contribute to offspring
    contributeToOffspring() {

        let energyToContribute = this._energy * globalTweakers.childEnergyRatio;

        this._energy -= energyToContribute;

        assert(this._energy >= ZERO, "Swimbot: contributeToOffspring: _energy >= ZERO");

        this._numOffspring++;

        this._timerDelta = ZERO;
        this._tryingToMate = false;
        this._chosenMate = null;
        this._chosenMateIndex = NULL_INDEX
        this._brain.setFoundSwimbot(false);

        return energyToContribute;
    }

    // ------------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------------

    // set rendering goals
    setRenderingGoals(r) {
        this._swimbotRenderer.setRenderingGoals(r);
    }

    // render
    render(levelOfDetail) {
        this._swimbotRenderer.render(
            this._phenotype,
            this._brain,
            this._age,
            this._energy,
            this._growthScale,
            this._focusDirection,
            levelOfDetail
        );
    }

    // ------------------------------------------------------------------
    // Getters (preserved for external callers)
    // ------------------------------------------------------------------

    // get functions
    getIsTryingToEat() { return this._tryingToEat; }
    getIsTryingToMate() { return this._tryingToMate; }
    getIndex() { return this._index; }
    getAge() { return this._age; }
    getAlive() { return this._alive; }
    getEnergy() { return this._energy; }
    getAngle() { return this._angle; }
    getEnergyEfficiency() { return this._energyEfficiency; }
    getPosition() { return this._position; }
    getBoundingRadius() { return this._phenotype.sumPartLengths; }
    getNumParts() { return this._phenotype.numParts; }
    getIsLookingForSensoryInput() { return this._readyforSensoryInputToBrain; }
    getGenitalPosition() { return this._phenotype.parts[GENITAL_INDEX].position; }
    getMouthPosition() { return this._phenotype.parts[MOUTH_INDEX].position; }
    getChosenMateIndex() { return this._chosenMateIndex; }
    getChosenFoodBitIndex() { return this._chosenFoodBitIndex; }
    getNumOffspring() { return this._numOffspring; }
    getNumFoodBitsEaten() { return this._numFoodBitsEaten; }
    getBrainState() { return this._brain.getState(); }
    getGenotype() { return this._genotype; }
    getSelectRadius() { return this._selectRadius; }
    getPreferredFoodType() { return this._phenotype.preferredFoodType; }
    getDigestibleFoodType() { return this._phenotype.digestibleFoodType; }

    getGoalDescription() {
        let brainState = this._brain.getState();

        if (brainState === BRAIN_STATE_RESTING) { return "resting"; } else if (brainState === BRAIN_STATE_LOOKING_FOR_MATE) { return "looking for mate"; } else if (brainState === BRAIN_STATE_PURSUING_MATE) { return "pursuing mate"; } else if (brainState === BRAIN_STATE_LOOKING_FOR_FOOD) { return "looking for food bit"; } else if (brainState === BRAIN_STATE_PURSUING_FOOD) { return "pursuing food bit"; }

        return "(no goal identified)";
    }

    getAttractionDescription() {
        let a = this._brain.getAttractionCriterion();

        if (a === ATTRACTION_COLORFUL) { return "colorful"; } else if (a === ATTRACTION_BIG) { return "big"; } else if (a === ATTRACTION_HYPER) { return "hyper"; } else if (a === ATTRACTION_LONG) { return "long"; } else if (a === ATTRACTION_STRAIGHT) { return "straight"; } else if (a === ATTRACTION_NO_COLOR) { return "no color"; } else if (a === ATTRACTION_SMALL) { return "small"; } else if (a === ATTRACTION_STILL) { return "still"; } else if (a === ATTRACTION_SHORT) { return "short"; } else if (a === ATTRACTION_CROOKED) { return "crooked"; } else if (a === ATTRACTION_SIMILAR_COLOR) { return "similar color"; } else if (a === ATTRACTION_SIMILAR_SIZE) { return "similar size"; } else if (a === ATTRACTION_SIMILAR_HYPER) { return "similar hyper"; } else if (a === ATTRACTION_SIMILAR_LENGTH) { return "similar length"; } else if (a === ATTRACTION_SIMILAR_STRAIGHT) { return "similar straight"; } else if (a === ATTRACTION_RANDOM) { return "random"; } else if (a === ATTRACTION_CLOSEST) { return "closest"; }

        return "(no attraction identified)";
    }

    // get part parent position
    getPartParentPosition(p) {
        if (this._phenotype.parts[p].parent == NULL_PART) {
            return this._position;
        }

        return this._phenotype.parts[this._phenotype.parts[p].parent].position;
    }
}
