"use strict";

const SimulationStartMode = {
	RANDOM: 0,
	FROGGIES: 1,
	TANGO: 2,
	RACE: 3,
	NEIGHBORHOOD: 4,
	BIG_BANG: 5,
	BAD_PARENTS: 6,
	BARRIER: 7,
	EMPTY: 8,
	FILE: 9,
	SPECIES: 10
};

const CameraNavigationAction = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
	IN: 4,
	OUT: 5
}

// this needs to be the same as the corresponding value in Embryology.js !!!!
const NUM_GENES_USED = 112;

// The global tweakers are all adjustable through the UI.
SwimbotsApp.globalTweakers = new GlobalTweakers();
var globalTweakers = SwimbotsApp.globalTweakers; // alias for legacy compatibility

class GenePool {
	constructor() {
		// count-related constants
		const TRAIL_LENGTH = 100;

		const NUM_NEIGHBORHOOD_SWIMBOTS = 14 * 14;
		const NUM_NEIGHBORHOOD_FOODBITS = 28 * 28;

		// rendering-related constants
		const DEFAULT_MILLISECONDS_PER_UPDATE = 20;

		const LEVEL_OF_DETAIL_THRESHOLD = 1200.0;

		const INITIAL_VIEW_SCALE = POOL_WIDTH * 0.1;
		const RACE_VIEW_SCALE = POOL_WIDTH * 0.3;
		const BANG_VIEW_SCALE = POOL_WIDTH * 0.2;
		const PARENT_VIEW_SCALE = POOL_WIDTH * 0.05;
		const NEIGHBORHOOD_VIEW_SCALE = POOL_WIDTH * 0.4;
		const NEIGHBORHOOD_FREQ = 5.0;
		const DEBUG_SHOW_SWIMBOT_TRAIL = false;
		const CAMERA_TRACKING_UPDATE_PERIOD = 10;
		const CLONE_SEPARATION = 10.0;
		const FOOD_RACE_SIZE = 1000;
		const FOOD_BANG_SIZE = 1700;

		// instance fields (previously let-local variables)
		this._millisecondsPerUpdate = 0;
		this._touch = new Touch();
		this._swimbots = [];
		this._foodBits = Array(MAX_FOODBITS);
		this._nearbySwimbotsArray = Array(BRAIN_MAX_PERCEIVED_NEARBY_SWIMBOTS);
		this._viewTracking = new ViewTracking();
		this._potentialMate = new Swimbot();
		this._chosenFoodBit = new FoodBit();
		this._camera = new Camera();
		this._obstacle = new Obstacle();
		this._pool = new Pool();
		this._embryology = new Embryology();
		this._vectorUtility = new Vector2D();
		this._myGenotype = new Genotype();
		this._mateGenotype = new Genotype();
		this._childGenotype = new Genotype();
		this._neighborhoodX = [];
		this._neighborhoodY = [];
		this._neighborhoodAxis = [];
		this._simulationRunning = false;
		this._rendering = false;
		this._swimbotBeingDragged = false;
		this._foodBitBeingDragged = false;
		this._poolCenter = new Vector2D();
		this._canvas = null;
		this._clock = 0;
		this._numSwimbots = 0;
		this._numNearbySwimbots = 0;
		this._numFoodBits = 0;
		this._canvasWidth = 0;
		this._canvasHeight = 0;
		this._mousedOverSwimbot = NULL_INDEX;
		this._mousedOverFoodBit = NULL_INDEX;
		this._selectedSwimbot = NULL_INDEX;
		this._selectedFoodBit = NULL_INDEX;
		this._startTime = ZERO;
		this._seconds = ZERO;
		this._gardenOfEdenRadius = ZERO;
		this._levelOfDetail = SWIMBOT_LEVEL_OF_DETAIL_LOW;
		this._previousTime = ZERO;
		this._frameRate = ZERO;
		this._debugTrail = Array(TRAIL_LENGTH);
		this._familyTree = new FamilyTree();
		this._phyloTree = new PhyloTree();
		this._spatialGrid = new SpatialHashGrid(200); // cell size of 200 pixels
		this._panningLeft = false;
		this._panningRight = false;
		this._panningUp = false;
		this._panningDown = false;
		this._zoomingIn = false;
		this._zoomingOut = false;
		this._renderingGoals = false;
		this._windowWidth = 0;
		this._windowHeight = 0;
		this._lastFrameTime = 0;
		this._lastSimTime = 0;
		this._frameAccumulator = 0;
		this._animationFrameId = null;

		// food speciation toggle — when true, all presets spawn 50/50 food + swimbot preferences
		this._foodSpeciationEnabled = false;

		// create fixed-sized swimbot array
		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			this._swimbots[s] = new Swimbot();
			this._swimbots[s].setParent(this);
		}

		// create fixed-sized perceived nearby swimbot array
		for (let s = 0; s < BRAIN_MAX_PERCEIVED_NEARBY_SWIMBOTS; s++) {
			this._nearbySwimbotsArray[s] = new Swimbot();
		}

		// create fixed-sized foodbit array
		for (let f = 0; f < MAX_FOODBITS; f++) {
			this._foodBits[f] = new FoodBit();
		}

		// create trail array
		for (let t = 0; t < TRAIL_LENGTH; t++) {
			this._debugTrail[t] = new Vector2D();
		}

		// Subscribe to UI commands via EventBus (Phase 1 decoupling)
		this._setupUICommandHandlers();
	}

	/**
	 * Register all EventBus listeners for UI_CMD_* events.
	 * This replaces direct calls from ui.js to GenePool setter/action methods.
	 */
	_setupUICommandHandlers() {
		const self = this;

		// Ecosystem setters
		eventBus.on(UI_CMD_SET_FOOD_DELAY,        (d) => self.setFoodGrowthDelay(d));
		eventBus.on(UI_CMD_SET_FOOD_SPREAD,       (s) => self.setFoodSpread(s));
		eventBus.on(UI_CMD_SET_FOOD_ENERGY,       (e) => self.setFoodBitEnergy(e));
		eventBus.on(UI_CMD_SET_HUNGER_THRESHOLD,  (h) => self.setHungerThreshold(h));
		eventBus.on(UI_CMD_SET_OFFSPRING_RATIO,   (e) => self.setOffspringEnergyRatio(e));
		eventBus.on(UI_CMD_SET_MAX_AGE,           (m) => self.setMaximumSwimbotAge(m));
		eventBus.on(UI_CMD_SET_ATTRACTION,        (a) => self.setAttraction(a));
		eventBus.on(UI_CMD_SET_ECOSYSTEM_DEFAULTS, () => {
			self.setFoodGrowthDelay(DEFAULT_FOOD_REGENERATION_PERIOD);
			self.setFoodSpread(DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS);
			self.setFoodBitEnergy(DEFAULT_FOOD_BIT_ENERGY);
			self.setHungerThreshold(DEFAULT_SWIMBOT_HUNGER_THRESHOLD);
			self.setOffspringEnergyRatio(DEFAULT_CHILD_ENERGY_RATIO);
			self.setMaximumSwimbotAge(DEFAULT_MAXIMUM_AGE);
		});

		// Simulation control
		eventBus.on(UI_CMD_TOGGLE_SIMULATION, () => {
			if (self._simulationRunning) {
				self._simulationRunning = false;
			} else {
				self._simulationRunning = true;
			}
		});
		eventBus.on(UI_CMD_SET_FAST_RENDERING, (fast) => {
			self._millisecondsPerUpdate = fast ? 0 : 20;
		});
		eventBus.on(UI_CMD_SET_RENDERING, (r) => self.setRendering(r));
		eventBus.on(UI_CMD_TOGGLE_GOAL_OVERLAY, () => self.toggleGoalOverlay());

		// View / camera
		eventBus.on(UI_CMD_SET_VIEW_MODE,       (m) => self.setViewMode(m));
		eventBus.on(UI_CMD_CLEAR_VIEW_MODE,     () => self.clearViewMode());
		eventBus.on(UI_CMD_START_CAMERA_NAV,    (a) => self.startCameraNavigation(a));
		eventBus.on(UI_CMD_STOP_CAMERA_NAV,     (a) => self.stopCameraNavigation(a));

		// Food speciation
		eventBus.on(UI_CMD_SET_FOOD_SPECIATION, (enabled) => self.setFoodSpeciationEnabled(enabled));

		// Swimbot actions
		eventBus.on(UI_CMD_MAKE_RANDOM_SWIMBOT, () => self.makeNewRandomSwimbot());
		eventBus.on(UI_CMD_ZAP_SWIMBOT,         (data) => self.zapSwimbot(data.id, data.amount));
		eventBus.on(UI_CMD_RANDOMIZE_SWIMBOT,   (id) => self.randomizeSwimbot(id));
		eventBus.on(UI_CMD_CLONE_SWIMBOT,       (id) => self.cloneSwimbot(id));
		eventBus.on(UI_CMD_KILL_SWIMBOT,        (id) => self.killSwimbot(id));
		eventBus.on(UI_CMD_CREATE_WITH_GENES,   (genes) => self.createNewSwimbotWithGenes(genes));
		eventBus.on(UI_CMD_TWEAK_GENE,          (data) => self.tweakGene(data.swimbotIndex, data.geneIndex, data.geneValue));
		eventBus.on(UI_CMD_START_SIMULATION,    (mode) => self.startSimulation(mode));

		// Touch input
		eventBus.on(UI_CMD_TOUCH_DOWN, (data) => self.touchDown(data.x, data.y));
		eventBus.on(UI_CMD_TOUCH_MOVE, (data) => self.touchMove(data.x, data.y));
		eventBus.on(UI_CMD_TOUCH_UP,   (data) => self.touchUp(data.x, data.y));
		eventBus.on(UI_CMD_TOUCH_OUT,  (data) => self.touchOut(data.x, data.y));

		// Canvas dimensions
		eventBus.on(UI_CMD_SET_CANVAS_DIMENSIONS, (data) => self.setCanvasDimensions(data.width, data.height));
	}

	setCanvas(c) {
		this._canvas = c;
	}

	setCanvasDimensions(w, h) {
		this._canvasWidth = w;
		this._canvasHeight = h;
		this._camera.setAspectRatio(this._canvasWidth / this._canvasHeight);
	}

	initialize() {
		// get pool center
		this._poolCenter.copyFrom(this._pool.getCenter());

		// start with a random simulation
		this.startSimulation(SimulationStartMode.RANDOM);

		this._millisecondsPerUpdate = 20; // DEFAULT_MILLISECONDS_PER_UPDATE

		// configure view tracking
		//_viewTracking.setPoolCenter(_poolCenter);
		this._viewTracking.setSwimbots(this._swimbots);
		this._viewTracking.setMode(ViewTrackingMode.AUTOTRACK, this._camera.getPosition(), this._camera.getScale(), 0);

		// start up the rAF game loop
		this._lastFrameTime = 0;
		this._lastSimTime = 0;
		this._frameAccumulator = 0;
		this.timer = requestAnimationFrame((timestamp) => this.update(timestamp));
	}

	startSimulation(mode) {
		//looks like numOffspring didn't get reset. fix this! (and any other related side effects

		// start time
		this._startTime = (new Date).getTime();

		// initialize pool
		this._seconds = ((new Date).getTime() - this._startTime) / MILLISECONDS_PER_SECOND;
		this._pool.initialize(this._seconds);

		// initialize camera
		this._camera.setScale(POOL_WIDTH * 0.1); // INITIAL_VIEW_SCALE
		this._camera.setPosition(this._poolCenter);

		// reset view control
		this._viewTracking.reset();

		// reset family tree
		this._familyTree.reset();

		// clear out all swimbots and food bits
		this._numSwimbots = 0;
		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			this._swimbots[s].clear();
		}

		this._numFoodBits = 0
		for (let f = 0; f < MAX_FOODBITS; f++) {
			this._foodBits[f].kill();
		}

		// Here I set ecosystem tweak values to their defaults. Some of
		// them may be changed afterwards depending on the simulation mode.
		this.setFoodGrowthDelay(DEFAULT_FOOD_REGENERATION_PERIOD);
		this.setFoodSpread(DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS);
		this.setFoodBitEnergy(DEFAULT_FOOD_BIT_ENERGY);
		this.setHungerThreshold(DEFAULT_SWIMBOT_HUNGER_THRESHOLD);
		this.setAttraction(ATTRACTION_SIMILAR_COLOR);
		this.setGardenOfEdenRadius(DEFAULT_GARDEN_OF_EDEN_RADIUS);
		this.setOffspringEnergyRatio(DEFAULT_CHILD_ENERGY_RATIO);
		this.setMaximumSwimbotAge(DEFAULT_MAXIMUM_AGE);

		// do this stuff after doing the stuff above:
		this._numSwimbots = INITIAL_NUM_SWIMBOTS;
		this._numFoodBits = INITIAL_NUM_FOODBITS;

		// default
		if (this._foodSpeciationEnabled || mode === SimulationStartMode.SPECIES) {
			globalTweakers.numFoodTypes = 2;
		} else {
			globalTweakers.numFoodTypes = 1;
		}
		this.randomizeFood();

		// initialize various parameters according to simulation start mode
		if (mode === SimulationStartMode.RANDOM) {
			//this uses all default values
		} else if (mode === SimulationStartMode.SPECIES) {
			globalTweakers.numFoodTypes = 2;
			this.randomizeFood(); // Important: do this after setting numFoodTypes!

			//this.setGardenOfEdenRadius(1500); /* again... */ this.randomizeFood();
			this.setFoodGrowthDelay(15);
			this.setMaximumSwimbotAge(20000);
			this._numSwimbots = 1000;
			this._numFoodBits = 2000;
			this.setFoodToSpeciesConfiguration();
			this._camera.setScale(POOL_WIDTH);
		} else if (mode === SimulationStartMode.FROGGIES) {
			//this.randomizeFood();
		} else if (mode === SimulationStartMode.TANGO) {
			this._numSwimbots = 2;
			//this.randomizeFood();
		} else if (mode === SimulationStartMode.RACE) {
			this._numSwimbots = 4;
			this.setFoodToRaceConfiguration();
			this._camera.setScale(POOL_WIDTH * 0.3); // RACE_VIEW_SCALE
		} else if (mode === SimulationStartMode.BIG_BANG) {
			this._numSwimbots = 100;
			this.setFoodToBangConfiguration();
			this._camera.setScale(POOL_WIDTH * 0.2); // BANG_VIEW_SCALE
		} else if (mode === SimulationStartMode.BAD_PARENTS) {
			this._numSwimbots = 2;
			this.setFoodToBadParentsConfiguration();

			this.setFoodGrowthDelay(200);
			this.setFoodSpread(20);
			this.setHungerThreshold(150);
			this.setFoodBitEnergy(6);
			this.setOffspringEnergyRatio(0.0001);

			this._camera.setScale(POOL_WIDTH * 0.05); // PARENT_VIEW_SCALE
		} else if (mode === SimulationStartMode.BARRIER) {
			// the obstacle is initialized below to be in the middle of the pool!

			//this.setFoodToBarrierConfiguration();
			//this.randomizeFood();
			//_camera.setScale(PARENT_VIEW_SCALE);
		} else if (mode === SimulationStartMode.NEIGHBORHOOD) {
			this._camera.setScale(POOL_WIDTH * 0.4); // NEIGHBORHOOD_VIEW_SCALE
			this._numSwimbots = 14 * 14; // NUM_NEIGHBORHOOD_SWIMBOTS
			this.randomizeNeighborhood();
			this.setFoodToNeighborhood(this._poolCenter, this._gardenOfEdenRadius);
		} else if (mode === SimulationStartMode.EMPTY) {
			this._numSwimbots = 0;
			//this.randomizeFood();
		}

		// initialize swimbots
		for (let i = 0; i < this._numSwimbots; i++) {
			let initialPosition = new Vector2D();

			initialPosition.setToRandomLocationInDisk(this._poolCenter, this._gardenOfEdenRadius);

			if (mode === SimulationStartMode.SPECIES) {
				let s = POOL_WIDTH * 0.4;

				let x = Math.random() * s;
				let y = POOL_HEIGHT * ONE_HALF - s * ONE_HALF + +Math.random() * s;

				if (Math.random() < ONE_HALF) {
					x = POOL_WIDTH - x;
				}

				initialPosition.setXY(x, y)
			}

			// yo, initial age is distributed
			let weightedRandomNormal = Math.random();

			let initialAge = YOUNG_AGE_DURATION + Math.floor((globalTweakers.maximumLifeSpan - YOUNG_AGE_DURATION) * weightedRandomNormal);

			assert((initialAge >= YOUNG_AGE_DURATION), "Genepool.js: startSimulation: (initialAge >= YOUNG_AGE_DURATION)");
			assert((initialAge <= globalTweakers.maximumLifeSpan), "Genepool.js: startSimulation: (initialAge <= globalTweakers.maximumLifeSpan)");

			let initialAngle = getRandomAngleInDegrees(); //-180.0 + Math.random() * 360.0;
			let initialEnergy = DEFAULT_SWIMBOT_HUNGER_THRESHOLD;

			// set values according to sim type

			// neighborhood
			if (mode === SimulationStartMode.NEIGHBORHOOD) {
				let sqrt = Math.floor(Math.sqrt(this._numSwimbots));
				let xMod = i % sqrt;
				let yMod = Math.floor((i / this._numSwimbots) * sqrt);

				let xFraction = xMod / sqrt;
				let yFraction = yMod / sqrt;

				let x = this._poolCenter.x - this._gardenOfEdenRadius + xFraction * this._gardenOfEdenRadius * 2;
				let y = this._poolCenter.y - this._gardenOfEdenRadius + yFraction * this._gardenOfEdenRadius * 2;

				initialPosition.setXY(x, y);

				for (let g = 0; g < NUM_GENES; g++) {
					let value = ZERO;

					if (this._neighborhoodAxis[g]) {
						value = ONE_HALF + ONE_HALF * Math.sin((this._neighborhoodX[g] + (-ONE_HALF + xFraction)) * 5.0); // NEIGHBORHOOD_FREQ
					} else {
						value = ONE_HALF + ONE_HALF * Math.sin((this._neighborhoodY[g] + (-ONE_HALF + yFraction)) * 5.0); // NEIGHBORHOOD_FREQ
					}

					if (value < ZERO) { value = ZERO; }
					if (value > ONE) { value = ONE; }

					let geneValue = Math.floor((BYTE_SIZE - 1) * value);

					this._myGenotype.setGeneValue(g, geneValue);
				}
			}
			// froggies
			else if (mode === SimulationStartMode.FROGGIES) {
				this._myGenotype.setToFroggy();
			}
			// tango
			else if (mode === SimulationStartMode.TANGO) {
				if (i === 0) { this._myGenotype.setToPreset(PRESET_GENOTYPE_DARWIN); }
				if (i === 1) { this._myGenotype.setToPreset(PRESET_GENOTYPE_MENDEL); }

				if (i === 0) { initialPosition.setXY(this._poolCenter.x - 100 * ONE_HALF, this._poolCenter.y); }
				if (i === 1) { initialPosition.setXY(this._poolCenter.x + 100 * ONE_HALF, this._poolCenter.y); }
			}
			// race
			else if (mode === SimulationStartMode.RACE) {
				/*
				if (i === 0) { _myGenotype.setToPreset(PRESET_GENOTYPE_MARGULIS  ); }
				if (i === 1) { _myGenotype.setToPreset(PRESET_GENOTYPE_MARGULIS  ); }
				if (i === 2) { _myGenotype.setToPreset(PRESET_GENOTYPE_DAWKINS ); }
				if (i === 3) { _myGenotype.setToPreset(PRESET_GENOTYPE_DAWKINS ); }
				*/

				if (i === 0) { this._myGenotype.setToPreset(PRESET_GENOTYPE_WILSON); }
				if (i === 1) { this._myGenotype.setToPreset(PRESET_GENOTYPE_WILSON); }
				if (i === 2) { this._myGenotype.setToPreset(PRESET_GENOTYPE_DENNETT); }
				if (i === 3) { this._myGenotype.setToPreset(PRESET_GENOTYPE_DENNETT); }

				if (i === 0) { initialPosition.setXY(this._poolCenter.x - 1000, this._poolCenter.y + 1000); } // FOOD_RACE_SIZE
				if (i === 1) { initialPosition.setXY(this._poolCenter.x - 1000, this._poolCenter.y + 1000 - 60); }
				if (i === 2) { initialPosition.setXY(this._poolCenter.x + 1000, this._poolCenter.y + 1000); }
				if (i === 3) { initialPosition.setXY(this._poolCenter.x + 1000, this._poolCenter.y + 1000 - 60); }
			}
			// big bang
			else if (mode === SimulationStartMode.BIG_BANG) {
				initialPosition.setXY(this._poolCenter.x, this._poolCenter.y);
				this._myGenotype.randomize();
			}
			// bad parents
			else if (mode === SimulationStartMode.BAD_PARENTS) {
				if (i === 0) { this._myGenotype.setToPreset(PRESET_GENOTYPE_TURING); }
				if (i === 1) { this._myGenotype.setToPreset(PRESET_GENOTYPE_TURING); }

				if (i === 0) { initialPosition.setXY(this._poolCenter.x - 200 * ONE_HALF, this._poolCenter.y); }
				if (i === 1) { initialPosition.setXY(this._poolCenter.x + 200 * ONE_HALF, this._poolCenter.y); }
			}
			/*
			// barrier
			else if (mode === SimulationStartMode.BARRIER)
			{
			    if (i === 0) { _myGenotype.setToPreset(PRESET_GENOTYPE_DAWKINS  ); }
			    if (i === 1) { _myGenotype.setToPreset(PRESET_GENOTYPE_WALLACE  ); }
			    if (i === 2) { _myGenotype.setToPreset(PRESET_GENOTYPE_MENDEL   ); }
			    if (i === 3) { _myGenotype.setToPreset(PRESET_GENOTYPE_WILSON   ); }
			    if (i === 4) { _myGenotype.setToPreset(PRESET_GENOTYPE_TURING   ); }
			    if (i === 5) { _myGenotype.setToPreset(PRESET_GENOTYPE_MARGULIS ); }

			    let s = 150;

			    if (i === 0) { initialPosition.setXY(_poolCenter.x + s * -1,  _poolCenter.y + s * -1); }
			    if (i === 1) { initialPosition.setXY(_poolCenter.x + s *  0,  _poolCenter.y + s * -1); }
			    if (i === 2) { initialPosition.setXY(_poolCenter.x + s *  1,  _poolCenter.y + s * -1); }
			    if (i === 3) { initialPosition.setXY(_poolCenter.x + s * -1,  _poolCenter.y + s *  1); }
			    if (i === 4) { initialPosition.setXY(_poolCenter.x + s *  0,  _poolCenter.y + s *  1); }
			    if (i === 5) { initialPosition.setXY(_poolCenter.x + s *  1,  _poolCenter.y + s *  1); }
			}
			*/
			// normal random
			else {
				this._myGenotype.randomize();
			}

			// food speciation toggle — applies to all presets when enabled
			if (this._foodSpeciationEnabled) {
				let foodType = (i < this._numSwimbots / 2) ? 0 : 1;
				let prefGene = this._embryology.getPreferredFoodTypeGene();
				let digGene = this._embryology.getDigestibleFoodTypeGene();
				this._myGenotype.setGeneValue(prefGene, foodType === 0 ? 0 : 200);
				this._myGenotype.setGeneValue(digGene, foodType === 0 ? 0 : 200);
			}

			// This sets all junk DNA to a value of 0!!!
			for (let g = NUM_GENES_USED; g < NUM_GENES; g++) {
				this._myGenotype.setGeneValue(g, 0);
			}

			// This is not the most elegant way to do this, but just to get it working.....
			// For any simulation mode (pool preset) other than Species, the swimbot genes
			// for food type preferrence and food type digestion are set to 0 (green).
			if (mode != SimulationStartMode.SPECIES) {
				// This sets the food type gene to be the same as the preferredFoodColor gene
				//let foodColorGene = _embryology.getFoodColorGene();
				//let foodTypeGene  = _embryology.getFoodNutritionGene();
				//let geneValue = _myGenotype.getGeneValue(foodColorGene);
				//_myGenotype.setGeneValue(foodNutritionGene, 0);
				//_myGenotype.setGeneValue(foodNutritionGene, 0);
			}

			// create the swimbot
			this._swimbots[i].create(i, initialAge, initialPosition, initialAngle, initialEnergy, this._myGenotype, this._embryology);

			// add the new swimbot to the family tree
			this._familyTree.addNode(i, NULL_INDEX, NULL_INDEX, this._clock, this.getSwimbotGenes(i));
		}

		// initialize obstacle
		let end1 = new Vector2D();
		let end2 = new Vector2D();

		end1.setXY(POOL_LEFT + POOL_WIDTH * 0.005, POOL_TOP + POOL_HEIGHT * 0.005);
		end2.setXY(POOL_LEFT + POOL_WIDTH * 0.01, POOL_TOP + POOL_HEIGHT * 0.005);

		if (mode === SimulationStartMode.BARRIER) {
			end1.setXY(POOL_LEFT + POOL_WIDTH * 0.2, POOL_TOP + POOL_HEIGHT * ONE_HALF);
			end2.setXY(POOL_LEFT + POOL_WIDTH * 0.8, POOL_TOP + POOL_HEIGHT * ONE_HALF);
		}

		this._obstacle.setEndpointPositions(end1, end2);

		for (let m = 0; m < 10; m++) {
			this._moveFoodBitsFromObstacle();
		}

		// clear this!
		this._setSelectedSwimbot(NULL_INDEX);

		// set _simulationRunning to true
		this._simulationRunning = true;

		// set rendering to true
		this._rendering = true;

		// reset clock to 0
		this._clock = 0;
	}

	setGardenOfEdenRadius(r) {
		this._gardenOfEdenRadius = r;
	}

	randomizeNeighborhood() {
		for (let g = 0; g < NUM_GENES; g++) {
			this._neighborhoodX[g] = -ONE + Math.random() * 2.0;
			this._neighborhoodY[g] = -ONE + Math.random() * 2.0;

			if (Math.random() < ONE_HALF) {
				this._neighborhoodAxis[g] = false;
			} else {
				this._neighborhoodAxis[g] = true;
			}
		}
	}

	randomizeFood() {
		for (let f = 0; f < this._numFoodBits; f++) {
			this._foodBits[f].initialize(f);

			// set food type...
			let n = 0;

			if (globalTweakers.numFoodTypes === 2) {
				if (this._foodSpeciationEnabled) {
					// first half green, second half blue
					n = f < this._numFoodBits * ONE_HALF ? 0 : 1;
				} else {
					n = Math.floor(Math.random() * 2);
				}
			}

			this._foodBits[f].setType(n);

			// place food bit randomly in a disk in the middle of the pool
			let poolCenter = new Vector2D();
			poolCenter.x = POOL_LEFT + POOL_WIDTH * ONE_HALF;
			poolCenter.y = POOL_TOP + POOL_HEIGHT * ONE_HALF;

			let foodBitPosition = new Vector2D();
			foodBitPosition.setToRandomLocationInDisk(poolCenter, this._gardenOfEdenRadius);

			/*
			if (mode === SimulationStartMode.SPECIES)
			{
			    lfoodBitPosition.x = Math.random() * POOL_WIDTH * 0.24;
			    foodBitPosition.y = Math.random() * POOL_HEIGHT;

			    if (Math.random() < ONE_HALF)
			    {
			        foodBitPosition.x = POOL_WIDTH - foodBitPosition.x;
			    }
			}
			*/

			this._foodBits[f].setPosition(foodBitPosition);
		}
	}

	setFoodToNeighborhood(position, size) {
		this._numFoodBits = 28 * 28; // NUM_NEIGHBORHOOD_FOODBITS

		for (let f = 0; f < this._numFoodBits; f++) {
			let sqrt = Math.floor(Math.sqrt(this._numFoodBits));
			let xMod = f % sqrt;
			let yMod = Math.floor((f / this._numFoodBits) * sqrt);

			let xFraction = xMod / sqrt;
			let yFraction = yMod / sqrt;

			let foodBitPosition = new Vector2D();

			foodBitPosition.setXY(
				position.x - size + xFraction * size * 2,
				position.y - size + yFraction * size * 2
			);

			this._foodBits[f].initialize(f);
			this._foodBits[f].setPosition(foodBitPosition);
		}
	}

	setFoodToBarrierConfiguration() {
		this._numFoodBits = 40;
		let spread = 500;
		let p = new Vector2D();

		for (let f = 0; f < this._numFoodBits; f++) {
			this._foodBits[f].initialize(f);
			p.setXY(
				this._poolCenter.x + (-spread * ONE_HALF + Math.random() * spread),
				this._poolCenter.y + (-spread * ONE_HALF + Math.random() * spread)
			);

			this._foodBits[f].setPosition(p);
		}

		this.setFoodSpread(MIN_FOOD_BIT_MAX_SPAWN_RADIUS + (MAX_FOOD_BIT_MAX_SPAWN_RADIUS - MIN_FOOD_BIT_MAX_SPAWN_RADIUS) * 0.2);
	}

	setFoodToBadParentsConfiguration() {
		this._numFoodBits = 5;

		let spread = 100;
		let p = new Vector2D();
		let f = -1;

		f++;
		this._foodBits[f].initialize(f);
		p.setXY(this._poolCenter.x, this._poolCenter.y + spread * -1.0);
		this._foodBits[f].setPosition(p);
		f++;
		this._foodBits[f].initialize(f);
		p.setXY(this._poolCenter.x, this._poolCenter.y + spread * -0.5);
		this._foodBits[f].setPosition(p);
		f++;
		this._foodBits[f].initialize(f);
		p.setXY(this._poolCenter.x, this._poolCenter.y + spread * 0.0);
		this._foodBits[f].setPosition(p);
		f++;
		this._foodBits[f].initialize(f);
		p.setXY(this._poolCenter.x, this._poolCenter.y + spread * 0.5);
		this._foodBits[f].setPosition(p);
		f++;
		this._foodBits[f].initialize(f);
		p.setXY(this._poolCenter.x, this._poolCenter.y + spread * 1.0);
		this._foodBits[f].setPosition(p);

		this.setFoodSpread(MIN_FOOD_BIT_MAX_SPAWN_RADIUS);
	}

	setFoodToBangConfiguration() {
		this._numFoodBits = 500;
		let radius = ONE;
		let fraction = ZERO;
		let thirdNum = this._numFoodBits / 3.0;

		let foodBitPosition = new Vector2D();

		for (let f = 0; f < this._numFoodBits; f++) {
			if (f > this._numFoodBits * 0.66666) {
				fraction = (f - (this._numFoodBits * 0.66666)) / thirdNum;
				radius = 600;
			} else if (f > this._numFoodBits * 0.333333) {
				fraction = (f - (this._numFoodBits * 0.333333)) / thirdNum;
				radius = 900;
			} else {
				fraction = f / thirdNum;
				radius = 300;
			}

			let radian = fraction * Math.PI * 2.0;

			// spiral
			/*
			radius *= 1.016;
			let radian = f * 0.2;
			*/

			let x = this._poolCenter.x + radius * Math.sin(radian);
			let y = this._poolCenter.y + radius * Math.cos(radian);

			foodBitPosition.setXY(x, y);

			this._foodBits[f].initialize(f);
			this._foodBits[f].setPosition(foodBitPosition);
		}

		this.setFoodGrowthDelay(DEFAULT_FOOD_REGENERATION_PERIOD);
		this.setFoodSpread(20);
	}

	setFoodToSpeciesConfiguration() {
		let p = new Vector2D();

		for (let f = 0; f < this._numFoodBits; f++) {
			let s = POOL_WIDTH * 0.4;
			p.x = Math.random() * s;
			p.y = POOL_HEIGHT * ONE_HALF - s * ONE_HALF + +Math.random() * s;

			this._foodBits[f].setType(Math.floor(Math.random() * 2));

			if (Math.random() < ONE_HALF) {
				p.x = POOL_WIDTH - p.x;
			}

			this._foodBits[f].setPosition(p);
		}
	}

	setFoodToRaceConfiguration() {
		this._numFoodBits = 0;

		let p = new Vector2D();
		let num = 200;
		let xx = this._poolCenter.x;
		let yy = this._poolCenter.y + 1000 * 0.9; // FOOD_RACE_SIZE

		for (let f = 0; f < num; f++) {
			let fraction = f / num;

			p.x = xx + 1000 * Math.cos(fraction * Math.PI); // FOOD_RACE_SIZE
			p.y = yy - 1000 * Math.sin(fraction * Math.PI); // FOOD_RACE_SIZE

			this._foodBits[this._numFoodBits].initialize(f);
			this._foodBits[this._numFoodBits].setPosition(p);
			this._numFoodBits++;
		}

		num = 140;
		let r = 0;
		xx = this._poolCenter.x;
		yy = this._poolCenter.y - 1000 * 0.4; // FOOD_RACE_SIZE

		for (let f = 0; f < num; f++) {
			let ff = f * 0.1;

			r += 2;

			p.x = xx + r * Math.cos(ff);
			p.y = yy + r * Math.sin(ff);

			this._foodBits[this._numFoodBits].initialize(f);
			this._foodBits[this._numFoodBits].setPosition(p);
			this._numFoodBits++;
		}

		//set the delay of food growth
		this.setFoodGrowthDelay(MAX_FOOD_REGENERATION_PERIOD);
		this.setFoodSpread(MIN_FOOD_BIT_MAX_SPAWN_RADIUS);
	}

	setAttraction(a) {
		globalTweakers.attractionCriterion = a;

		assert(globalTweakers.attractionCriterion >= 0, "genepool: setAttraction: globalTweakers.attractionCriterion >= 0")
		assert(globalTweakers.attractionCriterion < NUM_ATTRACTIONS, "genepool: setAttraction: globalTweakers.attractionCriterion < NUM_ATTRACTIONS")

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			this._swimbots[s].setAttraction(globalTweakers.attractionCriterion);
		}
	}

	notifySwimbotDeathTime(deceasedSwimbotIndex) {
		assert(deceasedSwimbotIndex != NULL_INDEX, "GenePool.js: this.notifySwimbotDeathTime: deceasedSwimbotIndex != NULL_INDEX")
		this._familyTree.setDeathTime(deceasedSwimbotIndex, this._clock);
		eventBus.emit('SWIMBOT_DIED', { index: deceasedSwimbotIndex, clock: this._clock });
	}

	update(timestamp) {
		// get seconds since started...
		this._seconds = ((new Date).getTime() - this._startTime) / MILLISECONDS_PER_SECOND;

		if (this._simulationRunning) {
			if (this._millisecondsPerUpdate <= 0) {
				// "fastest" mode: run as many simulation steps as possible per frame
				let steps = 0;
				let maxSteps = 50;
				let deadline = timestamp + this._millisecondsPerUpdate;
				while (steps < maxSteps) {
					this._clock++;
					this.updateSwimbots();
					this.updateFood();
					steps++;
				}
			} else {
				// Normal mode: throttle by _millisecondsPerUpdate
				let elapsed = timestamp - this._lastSimTime;
				if (elapsed >= this._millisecondsPerUpdate) {
					this._clock++;
					this.updateSwimbots();
					this.updateFood();
					this._lastSimTime = timestamp;
				}
			}
		}

		if (this._rendering) {
			// update camera...
			this._camera.update(this._seconds);

			if (RENDER_SWIMBOT_AS_DOT) {
				this._levelOfDetail = SWIMBOT_LEVEL_OF_DETAIL_DOT;
			} else {
				if (this._camera.getScale() > 1200.0) { // LEVEL_OF_DETAIL_THRESHOLD
					this._levelOfDetail = SWIMBOT_LEVEL_OF_DETAIL_LOW;
				} else {
					this._levelOfDetail = SWIMBOT_LEVEL_OF_DETAIL_HIGH;
				}
			}

			// update camera tracking...
			if (this._viewTracking.getIsTracking()) {

				this._viewTracking.updateTracking(this._camera.getPosition(), this._camera.getScale(), this._selectedSwimbot);

				this._camera.addForce(this._viewTracking.getCameraForce(), this._viewTracking.getCameraScaleForce());

			}

			// update camera navigation
			this.updateCameraNavigation();

			// render everything...
			this.render();
		}

		// update touch state
		// (important for generating state for touch velocity, etc.)
		// also, important to call this after updateCameraNavigation
		this._touch.update();

		// Emit simulation state for UI consumers (Phase 1 decoupling)
		this._emitSimState();

		// trigger next frame via rAF
		this._lastFrameTime = timestamp;
		this.timer = requestAnimationFrame((ts) => this.update(ts));
	}

	/**
	 * Emit a snapshot of the simulation state via EventBus.
	 * The UI subscribes to this event instead of calling getters on genePool.
	 */
	_emitSimState() {
		eventBus.emit(SIM_STATE_UPDATED, {
			// Ecosystem parameters
			foodGrowthDelay: globalTweakers.foodRegenerationPeriod,
			foodSpread: globalTweakers.foodSpread,
			foodBitEnergy: globalTweakers.foodBitEnergy,
			hungerThreshold: globalTweakers.hungerThreshold,
			energyToOffspring: globalTweakers.childEnergyRatio,
			maximumSwimbotAge: globalTweakers.maximumLifeSpan,
			attraction: globalTweakers.attractionCriterion,

			// Simulation flags
			simulationRunning: this._simulationRunning,
			rendering: this._rendering,
			renderingGoals: this._renderingGoals,
			clock: this._clock,

			// Counts
			numSwimbots: this.getNumSwimbots(),
			numSwimbotsPreferringType0: this.getNumSwimbotsPreferringType(0),
			numSwimbotsPreferringType1: this.getNumSwimbotsPreferringType(1),
			numFoodBits: this.getNumFoodBits(),
			numFoodBits1: this.getNumFoodBits1(),

			// Selection
			selectedSwimbotID: this._selectedSwimbot,
			aSwimbotIsSelected: this._selectedSwimbot != NULL_INDEX,

			// View
			viewMode: this._viewTracking.getMode(),

			// Gene metadata
			numGeneCategories: this._embryology.getNumGeneCategories(),
			numGenesPerCategory: this._embryology.getNumGenesPerCategory(),

			// Selected swimbot details (if any)
			selectedSwimbot: this._buildSelectedSwimbotData()
		});
	}

	_buildSelectedSwimbotData() {
		if (this._selectedSwimbot === NULL_INDEX) return null;
		const sb = this._swimbots[this._selectedSwimbot];
		if (!sb.getAlive()) return null;
		return {
			index: sb.getIndex(),
			brainState: sb.getBrainState(),
			chosenMateIndex: sb.getChosenMateIndex(),
			age: sb.getAge(),
			energy: sb.getEnergy(),
			numFoodBitsEaten: sb.getNumFoodBitsEaten(),
			numOffspring: sb.getNumOffspring(),
			attractionDescription: sb.getAttractionDescription(),
			preferredFoodType: sb.getPreferredFoodType(),
			digestibleFoodType: sb.getDigestibleFoodType()
		};
	}

	_rebuildSpatialGrid() {
		this._spatialGrid.clear();
		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				this._spatialGrid.add(this._swimbots[s]);
			}
		}
	}

	updateSwimbots() {
		this._rebuildSpatialGrid();

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {

				this._swimbots[s].update();

				// provide aspects of the environment for the swimbot to perceive
				if (this._swimbots[s].getIsLookingForSensoryInput()) {
					this.giveSwimbotNearbyEnvironmentalStimuli(s);
				}

				// check for obstacle collision....
				if (this._obstacle.getCollision(this._swimbots[s].getPosition(), this._swimbots[s].getBoundingRadius() * ONE_HALF)) {
					// only call this IMMEDIATELY after calling "_obstacle.getCollision"...
					this._vectorUtility = this._obstacle.getCurrentCollisionForce();
					this._vectorUtility.scale(1.2);
					this._swimbots[s].addForce(this._vectorUtility);
				}

				// eating
				if (this._swimbots[s].getIsTryingToEat()) {
					let eatenFoodBit = this._swimbots[s].eatChosenFoodBit();
				}

				// giving birth to a new swimbot
				if (this._swimbots[s].getIsTryingToMate()) {
					let newBornSwimbotIndex = this.findLowestDeadSwimbotInArray();

					// a few quick reality checks here...
					if ((newBornSwimbotIndex != NULL_INDEX) &&
						(this._swimbots[s].getChosenMateIndex() != NULL_INDEX)) {
						let chosenMateIndex = this._swimbots[s].getChosenMateIndex();

						this._potentialMate = this._swimbots[chosenMateIndex];

						assert(this._potentialMate != null, "genepool: updateSwimbots: _potentialMate != null");

						if (this._potentialMate.getAlive()) {
							assert(this._myGenotype != null, "genepool: updateSwimbots: _myGenotype    != null");
							assert(this._mateGenotype != null, "genepool: updateSwimbots: _mateGenotype  != null");

							// collect genes from me and my chosen mate and recombine them for the child
							this._myGenotype = this._swimbots[s].getGenotype();
							this._mateGenotype = this._potentialMate.getGenotype();

							// if the junk dna of each swimbot are similar enough...
							if (!this.getJunkDnaSimilarity(this._myGenotype, this._mateGenotype) > NON_REPRODUCING_JUNK_DNA_LIMIT) {}

							if (this.getJunkDnaSimilarity(this._myGenotype, this._mateGenotype) > NON_REPRODUCING_JUNK_DNA_LIMIT) {
								// recombine genes for the child
								assert(this._childGenotype != null, "_childGenotype != null");

								this._childGenotype.setAsOffspring(this._myGenotype, this._mateGenotype);

								// collect energy from parents for child energy
								let myEnergyContribution = this._swimbots[s].contributeToOffspring();
								let mateEnergyContribution = this._potentialMate.contributeToOffspring();
								let energyToOffspring = myEnergyContribution + mateEnergyContribution;

								// set birth position
								let diffX = this._potentialMate.getGenitalPosition().x - this._swimbots[s].getGenitalPosition().x;
								let diffY = this._potentialMate.getGenitalPosition().y - this._swimbots[s].getGenitalPosition().y;

								this._vectorUtility.x = this._swimbots[s].getGenitalPosition().x + diffX * ONE_HALF;
								this._vectorUtility.y = this._swimbots[s].getGenitalPosition().y + diffY * ONE_HALF;

								// pool effect
								this._pool.endTouch(this._vectorUtility, this._seconds);

								// create the child swimbot
								let initialAngle = getRandomAngleInDegrees();
								this._swimbots[newBornSwimbotIndex].create(newBornSwimbotIndex, 0, this._vectorUtility, initialAngle, energyToOffspring, this._childGenotype, this._embryology)

								// add the new swimbot to the family tree
								this._familyTree.addNode(newBornSwimbotIndex, s, chosenMateIndex, this._clock, this.getSwimbotGenes(newBornSwimbotIndex));

								eventBus.emit('SWIMBOT_BORN', { index: newBornSwimbotIndex, clock: this._clock });
							} // if (getJunkDnaDistance(_myGenotype, _mateGenotype) > NON_REPRODUCING_JUNK_DNA_LIMIT)
							else {
								//console.log("reproduction not possible because junk dna is too dissimilar!");
							}
						}
					}
				}
			} else {
				// In case the selected swimbot has just died, de-select it!
				if (this._selectedSwimbot === s) {
					this._setSelectedSwimbot(NULL_INDEX);
				}
			}
		}

		// if showing mutual love....
		if (this._viewTracking.getMode() === ViewTrackingMode.MUTUAL) {
			let lover1 = this._viewTracking.getLover1Index();
			let lover2 = this._viewTracking.getLover2Index();

			if ((lover1 != NULL_INDEX) &&
				(lover2 != NULL_INDEX)) {
				// show the mouths and genitals
				this._swimbots[lover1].setRenderingGoals(true);
				this._swimbots[lover2].setRenderingGoals(true);

				// if either of the lovers stop pursuing the other then cancel mutual view mode
				if ((this._swimbots[lover1].getChosenMateIndex() != lover2) || (this._swimbots[lover2].getChosenMateIndex() != lover1)) {
					//_viewTracking.setMode(ViewTrackingMode.NULL, 0);
					//this.clearViewMode();
					this._viewTracking.stopTracking();
				}
			} else {
				this._viewTracking.stopTracking();
			}
		}

		eventBus.emit('SWIMBOTS_UPDATED', {
			numSwimbots: this._numSwimbots,
			numFoodBits: this._numFoodBits,
			clock: this._clock
		});
	}

	getJunkDnaSimilarity(genotype1, genotype2) {
		let diff = ZERO;
		let num = 0;
		for (let g = NUM_GENES_USED; g < NUM_GENES; g++) {
			diff += Math.abs(genotype1.getGeneValue(g) - genotype2.getGeneValue(g)) / BYTE_SIZE;
			num++;
		}

		let similarity = ONE - (diff / num);

		return similarity;
	}

	generatePhyloTree() {
		let numJunkGenes = NUM_GENES - NUM_GENES_USED;
		this._phyloTree.initialize(numJunkGenes);

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				this._phyloTree.addJunkDNA(this._swimbots[s].getGenotype());
			}
		}
	}

	findLowestDeadSwimbotInArray() {
		let s = NULL_INDEX;
		let t = NULL_INDEX;

		let looking = true;
		while (looking) {
			t++;

			if (!this._swimbots[t].getAlive()) {
				s = t;
				assert(s < MAX_SWIMBOTS, "s < MAX_SWIMBOTS");
				looking = false;
			}

			if (t >= MAX_SWIMBOTS - 1) {
				looking = false;
			}
		}

		return s;
	}

	giveSwimbotNearbyEnvironmentalStimuli(s) {
		// collect the array of nearby visible swimbots...
		this._numNearbySwimbots = 0;
		let pos = this._swimbots[s].getGenitalPosition();
		let nearby = this._spatialGrid.query(pos.x, pos.y, SWIMBOT_VIEW_RADIUS);
		for (let i = 0; i < nearby.length && this._numNearbySwimbots < BRAIN_MAX_PERCEIVED_NEARBY_SWIMBOTS; i++) {
			let o = nearby[i];
			if (o !== this._swimbots[s]) {
				let distanceSquared = pos.getDistanceSquaredTo(o.getGenitalPosition());
				if (distanceSquared < SWIMBOT_VIEW_RADIUS * SWIMBOT_VIEW_RADIUS) {
					if (!this._obstacle.getObstruction(pos, o.getGenitalPosition())) {
						this._nearbySwimbotsArray[this._numNearbySwimbots] = o;
						this._numNearbySwimbots++;
					}
				}
			}
		}

		// find the closest food bit
		let foundFoodBit = false;
		let smallestDistance = Number.MAX_SAFE_INTEGER;
		for (let f = 0; f < MAX_FOODBITS; f++) {
			let okay = true;

			// In the current implementation, if the number of food types is 2,
			// then the swimbot only "sees" a foodbit of its preferred type.
			if (globalTweakers.numFoodTypes === 2) {
				if (this._foodBits[f].getType() != this._swimbots[s].getPreferredFoodType()) {
					okay = false;
				}
			}

			if (okay) {
				if (this._foodBits[f].getAlive()) {
					let viewDistance = this._swimbots[s].getMouthPosition().getDistanceTo(this._foodBits[f].getPosition());

					if (viewDistance < SWIMBOT_VIEW_RADIUS) {
						let distance = viewDistance / SWIMBOT_VIEW_RADIUS;

						if (distance < smallestDistance) {
							if (!this._obstacle.getObstruction(this._swimbots[s].getMouthPosition(), this._foodBits[f].getPosition())) {
								smallestDistance = distance;
								this._chosenFoodBit = this._foodBits[f];
								foundFoodBit = true;
							}
						}
					}
				}
			}
		}

		// pass these environmental stimuli along to the swimbot...
		this._swimbots[s].setEnvironmentalStimuli(this._numNearbySwimbots, this._nearbySwimbotsArray, foundFoodBit, this._chosenFoodBit);
	}

	updateFood() {
		let numType0FoodBits = 0;
		let numType1FoodBits = 0;

		// general update for all food bits
		for (let f = 0; f < MAX_FOODBITS; f++) {
			if (this._foodBits[f].getAlive()) {
				this._foodBits[f].update();

				if (globalTweakers.numFoodTypes === 2) {
					// calculate num foodbits of both types...
					if (this._foodBits[f].getType() === 0) { numType0FoodBits++; } else if (this._foodBits[f].getType() === 1) { numType1FoodBits++; }

					assert(((this._foodBits[f].getType() === 0) || (this._foodBits[f].getType() === 1)), "genepool.updateFood: _foodBits[f].getType() invalid!");

					assert(numType0FoodBits <= MAX_FOODBITS_PER_TYPE, "this.updateFood: numType0FoodBits > MAX_FOODBITS_PER_TYPE");
					assert(numType1FoodBits <= MAX_FOODBITS_PER_TYPE, "this.updateFood: numType1FoodBits > MAX_FOODBITS_PER_TYPE");
				}
			}
		}

		// periodically regenerate food
		assert(globalTweakers.foodRegenerationPeriod > 0, "GenePool:updateFood:globalTweakers.foodRegenerationPeriod > 0");

		if (this._clock % globalTweakers.foodRegenerationPeriod == 0) {
			let childFoodBitIndex = this.findLowestDeadFoodBitInArray();

			if (childFoodBitIndex != NULL_INDEX) {
				assert(!this._foodBits[childFoodBitIndex].getAlive(), "GenePool:updateFood: ! _foodBits[ childFoodBit ].getAlive");

				let newFoodType = 0;
				let parentFoodBitIndex = this.findRandomLivingFoodBit(newFoodType);

				// If we are using two types of food bits, then we need to do some housekeeping to make sure that
				// neither type exceeds max population and also that there is always at least one bit of each type
				if (globalTweakers.numFoodTypes === 2) {
					// randomize the new food bit type, so that both
					// food types have a chance to grow at the same rate.
					newFoodType = Math.floor(Math.random() * 2);

					if (numType0FoodBits === MAX_FOODBITS_PER_TYPE) {
						newFoodType = 1;
					} else if (numType1FoodBits === MAX_FOODBITS_PER_TYPE) {
						newFoodType = 0;
					}

					parentFoodBitIndex = this.findRandomLivingFoodBit(newFoodType);

					// If there are no more food bits left of a particular type, then
					// I will force the child to have that type, and I will choose
					// one of the existing food bits of the other type as its parent.
					if (numType0FoodBits === 0) {
						newFoodType = 0;
						parentFoodBitIndex = this.findRandomLivingFoodBit(1);
					}

					if (numType1FoodBits === 0) {
						newFoodType = 1;
						parentFoodBitIndex = this.findRandomLivingFoodBit(0);
					}
				} else {
					assert(numType1FoodBits === 0, "genepool.js:updateFood: numType1FoodBits === 0");
				}

				if (parentFoodBitIndex != NULL_INDEX) {
					assert(!this._foodBits[childFoodBitIndex].getAlive(), "GenePool:updateFood: ! _foodBits[ childFoodBit ].getAlive");
					assert(childFoodBitIndex != this._foodBits[parentFoodBitIndex].getIndex(), "genepool.js: updateFood: childFoodBitIndex != _foodBits[ parentFoodBitIndex ].getIndex()");

					// spawn the child in a position relative to parent...
					this._foodBits[childFoodBitIndex].spawnFromParent(this._foodBits[parentFoodBitIndex], childFoodBitIndex, newFoodType);

					// make sure the new food bit position is not obscured by
					// the obstacle. If it is, keep trying new spawn positions...
					let looking = true;
					let num = 0;
					while (looking) {
						// spawn the child to new position relative to parent...
						this._foodBits[childFoodBitIndex].randomizeSpawnPosition(this._foodBits[parentFoodBitIndex]);

						if (!this._obstacle.getObstruction(this._foodBits[parentFoodBitIndex].getPosition(), this._foodBits[childFoodBitIndex].getPosition())) {
							looking = false;
						}

						num++;
						if (num > 10) {
							looking = false;
						}
					}
				}
			}
		}
	}

	setFoodSpread(s) {
		assert(s >= MIN_FOOD_BIT_MAX_SPAWN_RADIUS, "GenePool: setFoodSpread: s >= MIN_FOOD_BIT_MAX_SPAWN_RADIUS")
		assert(s <= MAX_FOOD_BIT_MAX_SPAWN_RADIUS, "GenePool: setFoodSpread: s <= MAX_FOOD_BIT_MAX_SPAWN_RADIUS")

		globalTweakers.foodSpread = s;

		for (let f = 0; f < MAX_FOODBITS; f++) {
			this._foodBits[f].setMaxSpawnRadius(globalTweakers.foodSpread);
		}
	}

	setFoodBitEnergy(e) {
		assert(e >= MIN_FOOD_BIT_ENERGY, "GenePool: setFoodBitEnergy: e >= MIN_FOOD_BIT_ENERGY");
		assert(e <= MAX_FOOD_BIT_ENERGY, "GenePool: setFoodBitEnergy: e <= MAX_FOOD_BIT_ENERGY");

		globalTweakers.foodBitEnergy = e;

		for (let f = 0; f < MAX_FOODBITS; f++) {
			this._foodBits[f].setEnergy(globalTweakers.foodBitEnergy);
		}
	}

	setHungerThreshold(h) {
		assert(h >= MIN_SWIMBOT_HUNGER_THRESHOLD, "GenePool: setHungerThreshold: h >= MIN_SWIMBOT_HUNGER_THRESHOLD");
		assert(h <= MAX_SWIMBOT_HUNGER_THRESHOLD, "GenePool: setHungerThreshold: h <= MAX_SWIMBOT_HUNGER_THRESHOLD");

		globalTweakers.hungerThreshold = h;

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			this._swimbots[s].setHungerThreshold(globalTweakers.hungerThreshold);
		}
	}

	setOffspringEnergyRatio(e) {
		assert(e >= MIN_CHILD_ENERGY_RATIO, "GenePool: setOffspringEnergyRatio: e >= MIN_CHILD_ENERGY_RATIO");
		assert(e <= MAX_CHILD_ENERGY_RATIO, "GenePool: setOffspringEnergyRatio: e <= MAX_CHILD_ENERGY_RATIO");

		globalTweakers.childEnergyRatio = e;
	}

	setFoodGrowthDelay(d) {
		assert(d >= MIN_FOOD_REGENERATION_PERIOD, "setFoodGrowthDelay: d >= MIN_FOOD_REGENERATION_PERIOD")
		assert(d <= MAX_FOOD_REGENERATION_PERIOD, "setFoodGrowthDelay: d <= MAX_FOOD_REGENERATION_PERIOD")

		globalTweakers.foodRegenerationPeriod = d;
	}

	setMaximumSwimbotAge(m) {
		assert(m >= MIN_MAXIMUM_AGE, "GenePool: setMaximumSwimbotAge: m >= MIN_MAXIMUM_AGE");
		assert(m <= MAX_MAXIMUM_AGE, "GenePool: setMaximumSwimbotAge: m <= MAX_MAXIMUM_AGE");

		globalTweakers.maximumLifeSpan = m;
	}

	findRandomLivingFoodBit(foodType) {
		let f = NULL_INDEX;
		let numTimesLooking = 200;
		let i = 0;
		let looking = true;

		while (looking) {
			let testIndex = Math.floor(Math.random() * (MAX_FOODBITS - 1));

			if (this._foodBits[testIndex].getAlive()) {
				if (this._foodBits[testIndex].getType() === foodType) {
					f = testIndex;
					looking = false;
				}
			}

			i++;
			if (i > numTimesLooking) {
				looking = false;
			}
		}

		assert(f < MAX_FOODBITS, "Genepool.js: f < MAX_FOODBITS");

		return f;
	}

	findLowestDeadFoodBitInArray() {
		let f = NULL_INDEX;
		let t = NULL_INDEX;

		let looking = true;

		while (looking) {
			t++;

			if (t < MAX_FOODBITS) {
				if (!this._foodBits[t].getAlive()) {
					f = t;
					assert(f < MAX_FOODBITS, "Genepool.js: findLowestDeadFoodBitInArray: f < MAX_FOODBITS");
					looking = false;
				}
			} else {
				looking = false;
			}
		}

		return f;
	}

	createNewSwimbotWithGenes(genes) {
		let index = this.findLowestDeadSwimbotInArray();

		assert(index != NULL_INDEX, "GenePool.createNewSwimbotWithGenes: index != NULL_INDEX");

		this._myGenotype.setGenes(genes);

		let initialAge = YOUNG_AGE_DURATION;
		let initialAngle = ZERO;
		let initialEnergy = DEFAULT_SWIMBOT_HUNGER_THRESHOLD;

		this._swimbots[index].create(index, initialAge, this._camera.getPosition(), initialAngle, initialEnergy, this._myGenotype, this._embryology);

		// add the new swimbot to the family tree
		this._familyTree.addNode(index, NULL_INDEX, NULL_INDEX, this._clock, this.getSwimbotGenes(index));

		this._setSelectedSwimbot(index);
	}

	setPoolData(data) {
		// frozen or running?
		this._simulationRunning = data.simulationRunning;

		// load food
		this._numFoodBits = data.numFoodBits;

		for (let f = 0; f < MAX_FOODBITS; f++) {
			this._foodBits[f].kill();
		}

		for (let f = 0; f < data.numFoodBits; f++) {
			let id = data.foodBitArray[f].id;

			this._foodBits[id].initialize();

			let foodBitPosition = new Vector2D();
			foodBitPosition.setXY(data.foodBitArray[f].x, data.foodBitArray[f].y);
			this._foodBits[id].setPosition(foodBitPosition);
		}

		// load swimbots
		this._numSwimbots = data.numSwimbots;

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			this._swimbots[s].die();
		}

		// reset family tree array
		this._familyTree.reset();

		// create the swimbots
		for (let s = 0; s < data.numSwimbots; s++) {
			let id = data.swimbotArray[s].id;

			let swimbotPosition = new Vector2D();
			swimbotPosition.setXY(data.swimbotArray[s].x, data.swimbotArray[s].y);

			let loadedGenotype = new Genotype();
			loadedGenotype.setGenes(data.swimbotArray[s].genes);

			this._swimbots[id].create(
				s,
				data.swimbotArray[s].age,
				swimbotPosition,
				data.swimbotArray[s].angle,
				data.swimbotArray[s].energy,
				loadedGenotype,
				this._embryology
			);

			// add the new swimbot to the family tree
			this._familyTree.addNode(id, NULL_INDEX, NULL_INDEX, this._clock, this.getSwimbotGenes(id));
		}

		// camera
		let cameraPosition = new Vector2D();
		cameraPosition.setXY(data.cameraX, data.cameraY);
		this._camera.setPosition(cameraPosition);
		this._camera.setScale(data.cameraScale);

		// set view control--
		this._viewTracking.reset();

		// set tweakers
		this.setFoodGrowthDelay(data.foodRegenerationPeriod);
		this.setFoodSpread(data.foodSpread);
		this.setFoodBitEnergy(data.foodBitEnergy);
		this.setHungerThreshold(data.hungerThreshold);
		this.setAttraction(data.attractionCriterion);
		this.setOffspringEnergyRatio(data.childEnergyRatio);

		this._renderingGoals = data.renderingGoals;

		// set obstacle
		// todo
		let end1 = new Vector2D();
		let end2 = new Vector2D();

		if ((data.obstacleEnd1X != undefined) &&
			(data.obstacleEnd1Y != undefined) &&
			(data.obstacleEnd2X != undefined) &&
			(data.obstacleEnd2Y != undefined)) {
			end1.setXY(data.obstacleEnd1X, data.obstacleEnd1Y);
			end2.setXY(data.obstacleEnd2X, data.obstacleEnd2Y);
		} else {
			end1.setXY(100, 100);
			end2.setXY(200, 100);
		}

		this._obstacle.setEndpointPositions(end1, end2);

		// start time
		this._startTime = (new Date).getTime();

		// get seconds
		this._seconds = ((new Date).getTime() - this._startTime) / MILLISECONDS_PER_SECOND;

		// initialize pool
		this._pool.initialize(this._seconds);

		// clear this!
		this._setSelectedSwimbot(NULL_INDEX);

		// set clock to 0
		this._clock = 0;
	}

	// set selected swimbot (previously inner function)
	_setSelectedSwimbot(index) {
		this._selectedSwimbot = index;
	}

	makeNewRandomSwimbot() {
		let index = this.findLowestDeadSwimbotInArray();

		if (index != NULL_INDEX) {
			let initialAge = YOUNG_AGE_DURATION;
			let initialAngle = getRandomAngleInDegrees(); //-180.0 + Math.random() * 360.0;
			let initialEnergy = DEFAULT_SWIMBOT_HUNGER_THRESHOLD;

			this._myGenotype.randomize();

			this._swimbots[index].create(index, initialAge, this._camera.getPosition(), initialAngle, initialEnergy, this._myGenotype, this._embryology);

			// add the new swimbot to the family tree
			this._familyTree.addNode(index, NULL_INDEX, NULL_INDEX, this._clock, this.getSwimbotGenes(index));

			this._setSelectedSwimbot(index)
		} else {
			// cannot make random swimbot
		}
	}

	zapSwimbot(ID, amount) {
		assert(ID != NULL_INDEX, "genepool: zapSwimbot: ID != NULL_INDEX");
		this._swimbots[ID].zap(this._embryology, amount);
		this._pool.endTouch(this._swimbots[ID].getPosition(), this._seconds);
	}

	randomizeSwimbot(ID) {
		assert(ID != NULL_INDEX, "genepool: randomizeSwimbot: ID != NULL_INDEX");
		this.zapSwimbot(ID, ONE);
		this._pool.endTouch(this._swimbots[ID].getPosition(), this._seconds);
	}

	cloneSwimbot(ID) {
		assert(ID != NULL_INDEX, "genepool: cloneSwimbot: ID != NULL_INDEX");

		let index = this.findLowestDeadSwimbotInArray();

		if (index != NULL_INDEX) {
			//let initialAge      = YOUNG_AGE_DURATION;
			let initialAge = this._swimbots[ID].getAge();
			let initialAngle = this._swimbots[ID].getAngle();
			let initialEnergy = this._swimbots[ID].getEnergy() * ONE_HALF;
			let genotype = this._swimbots[ID].getGenotype();

			let initialPosition = new Vector2D();
			let p = new Vector2D();
			initialPosition.copyFrom(this._swimbots[ID].getPosition());
			p.copyFrom(initialPosition);

			initialPosition.x += 10.0; // CLONE_SEPARATION
			p.x -= 10.0; // CLONE_SEPARATION

			this._swimbots[ID].setPosition(p);
			this._swimbots[ID].setEnergy(initialEnergy); // the clonee gets its energy halved as well as the cloned
			this._swimbots[index].create(index, initialAge, initialPosition, initialAngle, initialEnergy, genotype, this._embryology);

			// add the new swimbot to the family tree
			this._familyTree.addNode(index, NULL_INDEX, NULL_INDEX, this._clock, this.getSwimbotGenes(index));

			this._setSelectedSwimbot(index)
		}
	}

	killSwimbot(ID) {
		assert(ID != NULL_INDEX, "genepool: killSwimbot: ID != NULL_INDEX");

		// if this swimbot is one of the mutal lovers, then turn off mutal mode....
		if (this._viewTracking.getMode() === ViewTrackingMode.MUTUAL) {
			if ((this._viewTracking.getLover1Index() === ID) ||
				(this._viewTracking.getLover2Index() === ID)) {
				this.clearViewMode();
			}
		}

		// deselect, if selected....
		if (this._selectedSwimbot === ID) {
			this._setSelectedSwimbot(NULL_INDEX);
		}

		// kill that mofo....
		this._swimbots[ID].die();

		// add a pool effect....
		this._pool.endTouch(this._swimbots[ID].getPosition(), this._seconds);
	}

	updateCameraNavigation() {
		if (this._panningLeft) { this._camera.panLeft(); }
		if (this._panningRight) { this._camera.panRight(); }
		if (this._panningUp) { this._camera.panUp(); }
		if (this._panningDown) { this._camera.panDown(); }
		if (this._zoomingIn) { this._camera.zoomIn(); }
		if (this._zoomingOut) { this._camera.zoomOut(); }
	}

	setSimulationRunning(s) {
		this._simulationRunning = s;
	}

	setRendering(r) {
		this._rendering = r;
	}

	setMillisecondsPerUpdate(m) {
		this._millisecondsPerUpdate = m;
	}

	setFoodSpeciationEnabled(enabled) {
		this._foodSpeciationEnabled = enabled;
	}

	getFoodSpeciationEnabled() {
		return this._foodSpeciationEnabled;
	}

	toggleGoalOverlay() {
		if (this._renderingGoals) {
			this._renderingGoals = false;
		} else {
			this._renderingGoals = true;
		}

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			this._swimbots[s].setRenderingGoals(this._renderingGoals);
		}
	}

	// shift any food bit that maye be overlapping with the obstacle... (previously inner function)
	_moveFoodBitsFromObstacle() {
		for (let f = 0; f < MAX_FOODBITS; f++) {
			if (this._foodBits[f].getAlive()) {
				if (this._obstacle.getCollision(this._foodBits[f].getPosition(), 30)) {
					this._vectorUtility = this._obstacle.getCurrentCollisionForce();
					this._vectorUtility.scale(5);
					this._foodBits[f].shiftPosition(this._vectorUtility);

				}
			}
		}
	}

	//-------------------------
	render() {
		// set transform according to camera
		let nx = this._camera.getPosition().x / this._camera.getXDimension();
		let ny = this._camera.getPosition().y / this._camera.getYDimension();

		let xTranslation = (ONE_HALF - nx) * this._canvasWidth;
		let yTranslation = (ONE_HALF - ny) * this._canvasHeight;

		let xScale = this._canvasWidth / this._camera.getXDimension();
		let yScale = this._canvasHeight / this._camera.getYDimension();

		this._canvas.translate(xTranslation, yTranslation);
		this._canvas.scale(xScale, yScale);

		// render the pool
		this._pool.render(this._seconds, this._camera);

		// render obstacle
		this._obstacle.render(this._camera);

		// render food
		this.renderFoodBits();

		// render swimbots
		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				if (this._camera.getWithinView(this._swimbots[s].getPosition(), this._swimbots[s].getBoundingRadius())) {
					this._swimbots[s].render(this._levelOfDetail);

					if ((s === this._mousedOverSwimbot) ||
						(s === this._selectedSwimbot)) {
						if (s === this._selectedSwimbot) {
							this._renderSelectCircle(this._swimbots[s].getPosition().x, this._swimbots[s].getPosition().y, this._swimbots[s].getSelectRadius(), false);
						} else {
							this._renderSelectCircle(this._swimbots[s].getPosition().x, this._swimbots[s].getPosition().y, this._swimbots[s].getSelectRadius(), true);
						}

						this._swimbots[s].setRenderingGoals(true);

						if (false) { // DEBUG_SHOW_SWIMBOT_TRAIL
							this.showSwimbotTrail(s);
						}
					} else {
						if (!this._renderingGoals) {
							this._swimbots[s].setRenderingGoals(false);
						}
					}
				}
			}
		}

		// when view is in mutual love mode, show a line between the lovers...
		if (this._viewTracking.getMode() === ViewTrackingMode.MUTUAL) {
			if ((this._viewTracking.getLover1Index() != NULL_INDEX) &&
				(this._viewTracking.getLover2Index() != NULL_INDEX)) {
				this._canvas.lineCap = "round";
				this._canvas.lineWidth = 5;
				this._canvas.strokeStyle = "rgba(200, 200, 200, 0.06)";
				this._canvas.moveTo(this._swimbots[this._viewTracking.getLover1Index()].getGenitalPosition().x, this._swimbots[this._viewTracking.getLover1Index()].getGenitalPosition().y);
				this._canvas.lineTo(this._swimbots[this._viewTracking.getLover2Index()].getGenitalPosition().x, this._swimbots[this._viewTracking.getLover2Index()].getGenitalPosition().y);
				this._canvas.stroke();

				this._canvas.lineWidth = 2;
				this._canvas.strokeStyle = "rgba(255, 255, 200, 0.06)";
				this._canvas.moveTo(this._swimbots[this._viewTracking.getLover1Index()].getGenitalPosition().x, this._swimbots[this._viewTracking.getLover1Index()].getGenitalPosition().y);
				this._canvas.lineTo(this._swimbots[this._viewTracking.getLover2Index()].getGenitalPosition().x, this._swimbots[this._viewTracking.getLover2Index()].getGenitalPosition().y);
				this._canvas.stroke();
			}
		}

		// reset transform
		this._canvas.resetTransform();

		// render view tracking info
		let viewTrackingMode = this._viewTracking.getMode();

		if (viewTrackingMode != NULL_INDEX) {
			let modeString = "(error)";

			if (viewTrackingMode === ViewTrackingMode.WHOLE_POOL) { modeString = "viewing whole pool" } else if (viewTrackingMode === ViewTrackingMode.AUTOTRACK) { modeString = "autotracking group" } else if (viewTrackingMode === ViewTrackingMode.SELECTED) { modeString = "viewing selected swimbot" } else if (viewTrackingMode === ViewTrackingMode.MUTUAL) { modeString = "viewing mutual love" } else if (viewTrackingMode === ViewTrackingMode.PROLIFIC) { modeString = "viewing most prolific" } else if (viewTrackingMode === ViewTrackingMode.EFFICIENT) { modeString = "viewing most efficient" } else if (viewTrackingMode === ViewTrackingMode.VIRGIN) { modeString = "viewing oldest virgin" } else if (viewTrackingMode === ViewTrackingMode.HUNGRY) { modeString = "viewing glutton" }

			this._canvas.font = "14px Arial";
			this._canvas.fillStyle = "rgba(255, 255, 255, 0.5)";
			this._canvas.fillText(modeString, this._canvasWidth - 170, this._canvasHeight - 30);
		}

		// render border
		this._canvas.lineWidth = 1;
		this._canvas.strokeStyle = "rgb(0, 0, 0)";
		this._canvas.strokeRect(0, 0, this._canvasWidth, this._canvasHeight);
	}

	// previously inner function
	_renderSelectCircle(x, y, r, m) {
		let lineWidth = 1.6 + 0.005 * this._camera.getScale();
		let alpha = 0.07;

		if (m) {
			alpha = 0.03;
		}

		canvas.lineWidth = lineWidth;
		canvas.strokeStyle = "rgba(255, 255, 255, " + alpha + ")";
		canvas.beginPath();
		canvas.arc(x, y, r, 0, PI2, false);
		canvas.stroke();
		canvas.closePath();

		canvas.lineWidth = lineWidth * 0.4;
		canvas.strokeStyle = "rgba(255, 255, 255, " + alpha + ")";
		canvas.beginPath();
		canvas.arc(x, y, r, 0, PI2, false);
		canvas.stroke();
		canvas.closePath();
	}

	// previously inner function (unused by current code, kept for completeness)
	_renderCamera() {
		this._canvas.strokeStyle = "rgb(255, 255, 255)";
		this._canvas.lineWidth = this._camera.getScale() * 0.007;

		let spacing = 15;

		let x = this._camera.getPosition().x - this._camera.getXDimension() * ONE_HALF;
		let y = this._camera.getPosition().y - this._camera.getYDimension() * ONE_HALF;
		let w = this._camera.getXDimension();
		let h = this._camera.getYDimension();

		this._canvas.strokeRect(x + spacing * ONE_HALF, y + spacing * ONE_HALF, w - spacing, h - spacing);

		this._canvas.fillStyle = "rgb(255, 255, 255)";
		this._canvas.strokeRect(
			this._camera.getPosition().x - this._camera.getXDimension() * 0.01,
			this._camera.getPosition().y - this._camera.getYDimension() * 0.01, 0.01, 0.01
		);
	}

	renderFoodBits() {
		for (let f = 0; f < MAX_FOODBITS; f++) {
			if (this._foodBits[f].getAlive()) {
				if (this._camera.getWithinView(this._foodBits[f].getPosition(), FOOD_BIT_GRAB_RADIUS)) {
					this._foodBits[f].render(this._camera.getScale());

					if (f === this._selectedFoodBit) {
						this._foodBits[f].renderSelectOutline(this._camera.getScale());
					}

					if (f === this._mousedOverFoodBit) {
						this._foodBits[f].renderMousedOverOutline(this._camera.getScale());
					}
				}
			}
		}
	}

	initializeDebugTrail(s) {
		for (let t = 0; t < 100; t++) { // TRAIL_LENGTH
			this._debugTrail[t].set(this._swimbots[s].getPosition());
		}
	}

	showSwimbotTrail(s) {
		// update trail
		if (this._clock % 20 == 0) {
			for (let t = 100 - 1; t > 0; t--) { // TRAIL_LENGTH
				this._debugTrail[t].set(this._debugTrail[t - 1]);
			}

			this._debugTrail[0].set(this._swimbots[s].getPosition());
		}

		// render trail
		this._canvas.lineWidth = 2;
		this._canvas.strokeStyle = "rgb(255, 255, 255)";

		for (let t = 1; t < 100; t++) { // TRAIL_LENGTH
			this._canvas.beginPath();
			this._canvas.moveTo(this._debugTrail[t - 1].x, this._debugTrail[t - 1].y);
			this._canvas.lineTo(this._debugTrail[t].x, this._debugTrail[t].y);
			this._canvas.closePath();
			this._canvas.stroke();
		}
	}

	setGeneTweakCategory(swimbotIndex) {
		//console.log("setGeneTweakCategory: swimbotIndex = " + swimbotIndex);
	}

	tweakGene(swimbotIndex, geneIndex, geneValue) {
		assert(swimbotIndex != NULL_INDEX, "genepool.js: tweakGene: swimbotIndex != NULL_INDEX");
		assert(geneIndex >= 0, "genepool.js: tweakGene: geneIndex >= 0");
		assert(geneIndex < NUM_GENES, "genepool.js: tweakGene: geneIndex    < NUM_GENES");
		assert(geneValue >= 0, "genepool.js: tweakGene: geneValue    >= 0");
		assert(geneValue < BYTE_SIZE, "genepool.js: tweakGene: geneValue    < BYTE_SIZE");

		this._swimbots[swimbotIndex].setGeneValue(geneIndex, geneValue, this._embryology);

		this._vectorUtility.x = ZERO;
		this._vectorUtility.y = ZERO;
		this._swimbots[swimbotIndex].setVelocity(this._vectorUtility);
	}

	touchDown(x, y) {
		this._touch.setToDown(x, y);
		this.handleNonUITouchDownActions(x, y);
	}

	convertScreenCoordinatesToPoolPosition(x, y) {
		this._vectorUtility.x = this._camera.getPosition().x - this._camera.getXDimension() * ONE_HALF + (x / this._canvasWidth) * this._camera.getXDimension();
		this._vectorUtility.y = this._camera.getPosition().y - this._camera.getYDimension() * ONE_HALF + (y / this._canvasHeight) * this._camera.getYDimension();
		return this._vectorUtility;
	}

	touchMove(x, y) {
		if ((x < this._canvasWidth) &&
			(y < this._canvasHeight)) {
			this._touch.setToMove(x, y);

			this._vectorUtility = this.convertScreenCoordinatesToPoolPosition(x, y);
			this._pool.moveTouch(this._vectorUtility, this._seconds);

			if ((this._touch.getState() === TouchState.JUST_DOWN) ||
				(this._touch.getState() === TouchState.BEEN_DOWN)) {
				// dragging a swimbot around
				if ((this._swimbotBeingDragged) &&
					(this._selectedSwimbot != NULL_INDEX)) {
					this._vectorUtility = this.convertScreenCoordinatesToPoolPosition(x, y);
					this._swimbots[this._selectedSwimbot].setPosition(this._vectorUtility);

					this._vectorUtility.setXY(ZERO, ZERO);
					this._swimbots[this._selectedSwimbot].setVelocity(this._vectorUtility);
				} else if ((this._foodBitBeingDragged) &&
					(this._selectedFoodBit != NULL_INDEX)) {
					// dragging a fodbit around
					this._vectorUtility = this.convertScreenCoordinatesToPoolPosition(x, y);
					this._foodBits[this._selectedFoodBit].setPosition(this._vectorUtility);
				} else {
					if (this._obstacle.getBeingMoved()) {
						// set the new moved position
						this._vectorUtility = this.convertScreenCoordinatesToPoolPosition(x, y);
						this._obstacle.setMovePosition(this._vectorUtility);

						// keep food away from obstacle
						this._moveFoodBitsFromObstacle();
					} else {
						let x = this._touch.getVelocityX();
						let y = this._touch.getVelocityY();
						this._camera.drag(x, y);
					}
				}
			} else {
				this._vectorUtility = this.convertScreenCoordinatesToPoolPosition(x, y);

				// check to see if the mouse if hovering over a swimbot or food bit
				this._mousedOverSwimbot = this.indexOfClosestSwimbotToScreenPosition(x, y);
				this._mousedOverFoodBit = this.indexOfClosestFoodBitToScreenPosition(x, y);

				// check to see if the mouse if hovering over the obstacle
				this._obstacle.detectHover(this._vectorUtility)
			}
		}
	}

	touchUp(x, y) {
		this._touch.setToUp(x, y);

		this._swimbotBeingDragged = false;
		this._foodBitBeingDragged = false;

		// if no button or swimbot or food bit was un-clicked
		if ((this._selectedSwimbot === NULL_INDEX) &&
			(this._selectedFoodBit === NULL_INDEX)) {
			if (this._obstacle.getBeingMoved()) {
				this._obstacle.stopMoving();
			}

			this._vectorUtility = this.convertScreenCoordinatesToPoolPosition(x, y);
			this._pool.endTouch(this._vectorUtility, this._seconds);
		}
	}

	touchOut(x, y) {
		this.touchUp(x, y);
	}

	touchTwoFingerMove(e) {
		if ((e.x < this._canvasWidth) &&
			(e.y < this._canvasHeight)) {
			this._camera.drag(-e.deltaX, -e.deltaY);
			this.clearViewMode();
		}
	}

	// start camera Navigation
	startCameraNavigation(action) {
		this._viewTracking.stopTracking();

		if (action === CameraNavigationAction.LEFT) { this._panningLeft = true; } else if (action === CameraNavigationAction.RIGHT) { this._panningRight = true; } else if (action === CameraNavigationAction.DOWN) { this._panningDown = true; } else if (action === CameraNavigationAction.UP) { this._panningUp = true; } else if (action === CameraNavigationAction.IN) { this._zoomingIn = true; } else if (action === CameraNavigationAction.OUT) { this._zoomingOut = true; }
	}

	// stop camera Navigation
	stopCameraNavigation(action) {
		this._panningLeft = false;
		this._panningRight = false;
		this._panningUp = false;
		this._panningDown = false;
		this._zoomingIn = false;
		this._zoomingOut = false;
	}

	clearViewMode() {
		this.setViewMode(ViewTrackingMode.NULL);
	}

	setViewMode(viewMode) {
		// if the new mode is "selected" but there is no swimbot selected, then bail out...
		if ((viewMode === ViewTrackingMode.SELECTED) &&
			(this._selectedSwimbot === NULL_INDEX)) {
			return;
		}

		let selectedSwimbot = this._viewTracking.setMode(viewMode, this._camera.getPosition(), this._camera.getScale(), this._selectedSwimbot);
		this._setSelectedSwimbot(selectedSwimbot);
	}

	handleNonUITouchDownActions(x, y) {
		if ((x < this._canvasWidth) && (y < this._canvasHeight)) {
			// in case view control is tracking, stop it...
			this._viewTracking.stopTracking();

			// has a swimmer been clicked?
			this._setSelectedSwimbot(this.indexOfClosestSwimbotToScreenPosition(x, y));

			// a swimmer is clicked
			if (this._selectedSwimbot != NULL_INDEX) {
				this._swimbotBeingDragged = true;
				this.initializeDebugTrail(this._selectedSwimbot);
			}

			// find out if a foodbit was clicked
			if (this._selectedSwimbot === NULL_INDEX) {
				this._selectedFoodBit = this.indexOfClosestFoodBitToScreenPosition(x, y);

				if (this._selectedFoodBit != NULL_INDEX) {
					this._foodBitBeingDragged = true;
				}
			} else {
				this._mousedOverFoodBit = NULL_INDEX;
			}

			// if no swimbot or food bit was clicked
			if ((this._selectedSwimbot == NULL_INDEX) &&
				(this._selectedFoodBit == NULL_INDEX)) {
				this._vectorUtility = this.convertScreenCoordinatesToPoolPosition(x, y);

				// did the obstacle get touched?
				if (this._obstacle.detectHover(this._vectorUtility)) {
					this._obstacle.startMoving(this._vectorUtility);
				} else {
					// touch the pool!
					this._pool.startTouch(this._vectorUtility, this._seconds);
				}
			}
		}
	}

	indexOfClosestSwimbotToScreenPosition(x, y) {
		let indexOfClosest = NULL_INDEX;
		let closestDistance = 1000.0;

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				this._vectorUtility = this.convertScreenCoordinatesToPoolPosition(x, y);

				let distanceSquared = this._swimbots[s].getPosition().getDistanceSquaredTo(this._vectorUtility);
				if (distanceSquared < this._swimbots[s].getSelectRadius() * this._swimbots[s].getSelectRadius()) {
					if (distanceSquared < closestDistance) {
						indexOfClosest = s;
						closestDistance = distanceSquared;
					}
				}
			}
		}

		return indexOfClosest;
	}

	indexOfClosestFoodBitToScreenPosition(x, y) {
		let indexOfClosest = NULL_INDEX;
		let closestDistance = 1000.0;

		for (let f = 0; f < MAX_FOODBITS; f++) {
			if (this._foodBits[f].getAlive()) {
				this._vectorUtility = this.convertScreenCoordinatesToPoolPosition(x, y);

				let distanceSquared = this._foodBits[f].getPosition().getDistanceSquaredTo(this._vectorUtility);
				if (distanceSquared < FOOD_BIT_GRAB_RADIUS * FOOD_BIT_GRAB_RADIUS) {
					if (distanceSquared < closestDistance) {
						indexOfClosest = f;
						closestDistance = distanceSquared;
					}
				}
			}
		}

		return indexOfClosest;
	}


	// various quickie getters...
	getFoodGrowthDelay() { return globalTweakers.foodRegenerationPeriod; }
	getFoodSpread() { return globalTweakers.foodSpread; }
	getFoodBitEnergy() { return globalTweakers.foodBitEnergy; }
	getHungerThreshold() { return globalTweakers.hungerThreshold; }
	getEnergyToOffspring() { return globalTweakers.childEnergyRatio; }
	getMaximumSwimbotAge() { return globalTweakers.maximumLifeSpan; }
	getTimeStep() { return this._clock; }
	getRenderingGoals() { return this._renderingGoals; }
	getSimulationRunning() { return this._simulationRunning; }
	getRendering() { return this._rendering; }
	getSelectedSwimbotID() { return this._selectedSwimbot; }
	getViewMode() { return this._viewTracking.getMode(); }

	// check to see if the camera navigation is active
	getCameraNavigationActive(action) {
		let result = false;

		if ((action === CameraNavigationAction.LEFT) && (this._panningLeft)) { result = true; }
		if ((action === CameraNavigationAction.RIGHT) && (this._panningRight)) { result = true; }
		if ((action === CameraNavigationAction.DOWN) && (this._panningDown)) { result = true; }
		if ((action === CameraNavigationAction.UP) && (this._panningUp)) { result = true; }
		if ((action === CameraNavigationAction.IN) && (this._zoomingIn)) { result = true; }
		if ((action === CameraNavigationAction.OUT) && (this._zoomingOut)) { result = true; }

		return result;
	}

	getASwimbotIsSelected() {
		if (this._selectedSwimbot != NULL_INDEX) {
			return true;
		}

		return false;
	}

	getPresetGenotype(p) {
		this._myGenotype.setToPreset(p);

		return this._myGenotype.getGenes();
	}

	getNumFoodBits() {
		let num = 0;

		for (let f = 0; f < MAX_FOODBITS; f++) {
			if (this._foodBits[f].getAlive()) {
				if (globalTweakers.numFoodTypes === 2) {
					if (this._foodBits[f].getType() === 0) {
						num++;
					}
				} else {
					num++;
				}
			}
		}

		return num;
	}

	getNumFoodBits1() {
		let num = 0;

		for (let f = 0; f < MAX_FOODBITS; f++) {
			if (this._foodBits[f].getAlive()) {
				if (this._foodBits[f].getType() === 1) {
					num++;
				}
			}
		}

		return num;
	}

	getNumSwimbots() {
		let num = 0;

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				num++;
			}
		}

		return num;
	}

	/**
	 * Count alive swimbots whose preferred food type matches the given type (0 or 1).
	 * Only meaningful when globalTweakers.numFoodTypes === 2.
	 */
	getNumSwimbotsPreferringType(type) {
		let num = 0;
		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				if (this._swimbots[s].getPreferredFoodType() === type) {
					num++;
				}
			}
		}
		return num;
	}

	getPoolData() {
		// create foodbit array
		function FoodBitData() {
			this.id = NULL_INDEX;
			this.x = ZERO;
			this.y = ZERO;
		}

		let foodBitDataArray = [];

		let numFoodbits = 0;
		for (let f = 0; f < MAX_FOODBITS; f++) {
			if (this._foodBits[f].getAlive()) {
				foodBitDataArray[numFoodbits] = new FoodBitData();
				foodBitDataArray[numFoodbits].id = f;
				foodBitDataArray[numFoodbits].x = this._foodBits[f].getPosition().x;
				foodBitDataArray[numFoodbits].y = this._foodBits[f].getPosition().y;

				numFoodbits++;
			}
		}

		// create swimbot array
		function SwimbotData() {
			this.x = ZERO;
			this.y = ZERO;
			this.angle = ZERO;
			this.energy = ZERO;
			this.age = 0;
			this.id = 0;
			this.genes = [];
		}

		let swimbotDataArray = [];

		let numSwimbots = 0;
		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				swimbotDataArray[numSwimbots] = new SwimbotData();
				swimbotDataArray[numSwimbots].id = s;
				swimbotDataArray[numSwimbots].x = this._swimbots[s].getPosition().x;
				swimbotDataArray[numSwimbots].y = this._swimbots[s].getPosition().y;
				swimbotDataArray[numSwimbots].angle = this._swimbots[s].getAngle();
				swimbotDataArray[numSwimbots].age = this._swimbots[s].getAge();
				swimbotDataArray[numSwimbots].energy = this._swimbots[s].getEnergy();
				swimbotDataArray[numSwimbots].genes = this.getSwimbotGenes(s);

				numSwimbots++;
			}
		}

		let poolData = {
			"simulationRunning": this._simulationRunning,
			"numFoodBits": numFoodbits,
			"numSwimbots": numSwimbots,
			"foodBitArray": foodBitDataArray,
			"swimbotArray": swimbotDataArray,
			"cameraX": this._camera.getPosition().x,
			"cameraY": this._camera.getPosition().y,
			"cameraScale": this._camera.getScale(),
			"foodRegenerationPeriod": globalTweakers.foodRegenerationPeriod,
			"foodSpread": globalTweakers.foodSpread,
			"foodBitEnergy": globalTweakers.foodBitEnergy,
			"hungerThreshold": globalTweakers.hungerThreshold,
			"attractionCriterion": globalTweakers.attractionCriterion,
			"childEnergyRatio": globalTweakers.childEnergyRatio,
			"renderingGoals": this._renderingGoals,
			"obstacleEnd1X": this._obstacle.getEnd1Position().x,
			"obstacleEnd1Y": this._obstacle.getEnd1Position().y,
			"obstacleEnd2X": this._obstacle.getEnd2Position().x,
			"obstacleEnd2Y": this._obstacle.getEnd2Position().y
		}

		return poolData;
	}

	getSwimbotGenes(ID) {
		let genotype = this._swimbots[ID].getGenotype();
		return genotype.getGenes();
	}

	getFamilyTree() {
		return this._familyTree;
	}

	getAttraction() {
		return globalTweakers.attractionCriterion;
	}

	getGeneName(g) {
		return this._embryology.getGeneName(g);
	}

	getGeneValue(swimbotID, geneIndex) {
		let genotype = this._swimbots[swimbotID].getGenotype();

		return genotype.getGeneValue(geneIndex);
	}

	getNumGenesPerCategory() {
		return this._embryology.getNumGenesPerCategory();
	}

	getNumGeneCategories() {
		return this._embryology.getNumGeneCategories();
	}

	// swimbot getters...
	getSwimbotIndex(ID) { return this._swimbots[ID].getIndex(); }
	getSwimbotBrainState(ID) { return this._swimbots[ID].getBrainState(); }
	getSwimbotChosenMate(ID) { return this._swimbots[ID].getChosenMateIndex(); }
	getSwimbotAge(ID) { return this._swimbots[ID].getAge(); }
	getSwimbotEnergy(ID) { return this._swimbots[ID].getEnergy(); }
	getSwimbotNumFoodBitsEaten(ID) { return this._swimbots[ID].getNumFoodBitsEaten(); }
	getSwimbotNumOffspring(ID) { return this._swimbots[ID].getNumOffspring(); }
	getSwimbotAttractionDescription(ID) { return this._swimbots[ID].getAttractionDescription(); }
	getSwimbotPreferredFoodType(ID) { return this._swimbots[ID].getPreferredFoodType(); }
	getSwimbotDigestibleFoodType(ID) { return this._swimbots[ID].getDigestibleFoodType(); }
}
