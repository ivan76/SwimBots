"use strict";

// states
const BRAIN_STATE_NULL = -1;
const BRAIN_STATE_RESTING = 0;
const BRAIN_STATE_LOOKING_FOR_MATE = 1;
const BRAIN_STATE_PURSUING_MATE = 2;
const BRAIN_STATE_LOOKING_FOR_FOOD = 3;
const BRAIN_STATE_PURSUING_FOOD = 4;
const BRAIN_STATE_LOOKING_FOR_PREY = 5;
const BRAIN_STATE_PURSUING_PREY = 6;
const BRAIN_STATE_FLEEING_PREDATOR = 7;
const NUM_BRAIN_STATES = 8;

// perceiving
const BRAIN_SENSORY_UPDATE_PERIOD = 50;
const BRAIN_MAX_PERCEIVED_NEARBY_SWIMBOTS = 20;

const BRAIN_FOCUS_TARGET_SHIFT_STRENGTH = 0.1;
const BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD = 0.07;
const BRAIN_WANDER_AMOUNT = 0.2;


// Brain!
class Brain {
	constructor() {
		this._state = BRAIN_STATE_NULL;
		this._energy = ZERO;
		this._foundFoodBit = false;
		this._foundSwimbot = false;
		this._hungerThreshold = ZERO;
		this._attractionCriterion = ATTRACTION_SIMILAR_COLOR;
	}

	initialize() {
		this._state = BRAIN_STATE_NULL;
	}

	update() {
		// if low energy, look for food, otherwise, look for sex
		if (this._energy < this._hungerThreshold) {
			if ((this._state != BRAIN_STATE_PURSUING_FOOD) && (this._state != BRAIN_STATE_LOOKING_FOR_FOOD)) {
				this._state = BRAIN_STATE_LOOKING_FOR_FOOD;
			}
		} else {
			if ((this._state != BRAIN_STATE_PURSUING_MATE) && (this._state != BRAIN_STATE_LOOKING_FOR_MATE)) {
				this._state = BRAIN_STATE_LOOKING_FOR_MATE;
			}
		}

		//  looking for food
		if (this._state == BRAIN_STATE_LOOKING_FOR_FOOD) {
			if (this._foundFoodBit) {
				this._state = BRAIN_STATE_PURSUING_FOOD;
			}
		}
		//  pursuing food
		else if (this._state == BRAIN_STATE_PURSUING_FOOD) {
			if (!this._foundFoodBit) {
				this._state = BRAIN_STATE_LOOKING_FOR_FOOD;
			}
		}
		//  Looking for mate
		else if (this._state == BRAIN_STATE_LOOKING_FOR_MATE) {
			if (this._foundSwimbot) {
				this._state = BRAIN_STATE_PURSUING_MATE;
			}
		}
		//  pursuing mate
		else if (this._state == BRAIN_STATE_PURSUING_MATE) {
			if (!this._foundSwimbot) {
				this._state = BRAIN_STATE_LOOKING_FOR_MATE;
			}
		}

		//  check for bogus brain state
		assert(this._state < NUM_BRAIN_STATES, "_state < NUM_BRAIN_STATES");
		assert(this._state > BRAIN_STATE_NULL, "_state > BRAIN_STATE_NULL");
	}

	// setters
	setEnergyLevel(e) { this._energy = e; }
	setHungerThreshold(h) { this._hungerThreshold = h; }
	setFoundFoodBit(f) { this._foundFoodBit = f; }
	setFoundSwimbot(f) { this._foundSwimbot = f; }

	setAttraction(a) {
		this._attractionCriterion = a;

		// setting _foundSwimbot to false, causes the swimbot to search for a new potential mate
		this._foundSwimbot = false;
	}

	// getters
	getHungerThreshold() { return this._hungerThreshold; }
	getAttractionCriterion() { return this._attractionCriterion; }
	getState() { return this._state; }
}
