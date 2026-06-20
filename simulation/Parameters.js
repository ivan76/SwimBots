const FOOD_TYPE_OFFSET = 0.2;

const DEFAULT_NUM_FOOD_TYPES = 1;

const SWIMBOT_LEVEL_OF_DETAIL_DOT = 0;
const SWIMBOT_LEVEL_OF_DETAIL_LOW = 1;
const SWIMBOT_LEVEL_OF_DETAIL_HIGH = 2;

const DEFAULT_GARDEN_OF_EDEN_RADIUS = 2000;
const GARDEN_OF_EDEN_RADIUS = DEFAULT_GARDEN_OF_EDEN_RADIUS;

const MIN_FOOD_REGENERATION_PERIOD = 1;
const DEFAULT_FOOD_REGENERATION_PERIOD = 20;
const MAX_FOOD_REGENERATION_PERIOD = 200;

const DEFAULT_CHILD_ENERGY_RATIO = ONE_HALF;

const MIN_CHILD_ENERGY_RATIO = ZERO;
const MAX_CHILD_ENERGY_RATIO = ONE;
const MIN_SWIMBOT_HUNGER_THRESHOLD = ZERO;

const MAX_SWIMBOTS = 2000;

const INITIAL_NUM_SWIMBOTS = 500;

const MAX_FOODBITS = 2000;
const MAX_FOODBITS_PER_TYPE = 1000; // make this one-half of MAX_FOODBITS (because there are two types)
const INITIAL_NUM_FOODBITS = 1000;

const NON_REPRODUCING_JUNK_DNA_LIMIT = 0.9;
//0.9 appears to be a good threshold for species differences. Any less and it takes way too long
// for species to separate out and any more and the species appear the same to the user.

const SPAWN_FOOD_RANDOMLY_IN_POOL = false;

const MUTATION_RATE = 0.01;

const CROSSOVER_RATE = 0.2;

const MAX_SWIMBOT_HUNGER_THRESHOLD = 200;
const DEFAULT_SWIMBOT_HUNGER_THRESHOLD = 50;

const YOUNG_AGE_DURATION = 1000;
const OLD_AGE_DURATION = 1000;
const MIN_MAXIMUM_AGE = YOUNG_AGE_DURATION + OLD_AGE_DURATION;
const MAX_MAXIMUM_AGE = 40000;

const DEFAULT_MAXIMUM_AGE = MAX_MAXIMUM_AGE;

const SWIMBOT_SELECT_RADIUS_SCALAR = 7.0;

const RENDER_SWIMBOT_AS_DOT = false;
const SWIMBOT_DOT_RENDER_RADIUS = 20;

//these are global variables that are meant to be adjustible via the ui (and maybe via other components).
class GlobalTweakers {
	constructor() {
		this.childEnergyRatio = DEFAULT_CHILD_ENERGY_RATIO;
		this.maximumLifeSpan = DEFAULT_MAXIMUM_AGE;
		this.foodSpread = DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS;
		this.foodBitEnergy = DEFAULT_FOOD_BIT_ENERGY;
		this.foodRegenerationPeriod = DEFAULT_FOOD_REGENERATION_PERIOD;
		this.hungerThreshold = DEFAULT_SWIMBOT_HUNGER_THRESHOLD;
		this.numFoodTypes = DEFAULT_NUM_FOOD_TYPES;
		this.attractionCriterion = ATTRACTION_SIMILAR_COLOR;
	}
}