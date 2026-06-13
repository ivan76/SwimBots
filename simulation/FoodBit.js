"use strict";

const FOOD_BIT_SIZE = 1.5; //default size
const MIN_FOOD_BIT_MAX_SPAWN_RADIUS = 10;
const MAX_FOOD_BIT_MAX_SPAWN_RADIUS = 4000.0;
const DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS = 4000.0; //max distance for spawned child
const MIN_FOOD_BIT_ENERGY = 0.0;
const MAX_FOOD_BIT_ENERGY = 100.0;
const DEFAULT_FOOD_BIT_ENERGY = 50.0; //when eaten, swimbot gets this much energy
const FOOD_BIT_SIZE_VIEW_SCALE = 0.03; //increase with view scale (a kind of LOD)
const FOOD_BIT_GRAB_RADIUS = 20.0; // radius for grabbing food bit
const FOOD_BIT_BOUNDARY_MARGIN = POOL_WIDTH * 0.01; // important value - creates empty space from wall
const FOOD_BIT_COLOR_COMPONENTS = "100, 200, 100";
const FOOD_BIT_ROLLOVER_COLOR = "rgba( 100, 200, 100, 0.5 )";
const FOOD_BIT_SELECT_COLOR = "rgba( 200, 200, 200, 1.0 )";
const FOOD_OPACITY_INCREMENT = 0.01;

//const FOOD_TYPE_NULL   = -1;
//const FOOD_TYPE_GREEN  =  0;
//const FOOD_TYPE_BLUE   =  1;

// Food bit
class FoodBit {
	constructor() {
		this._position = new Vector2D();
		this._energy = ZERO;
		this._type = 0;
		this._red = ZERO;
		this._green = ZERO;
		this._blue = ZERO;
		this._opacity = ZERO;
		this._index = NULL_INDEX;
		this._maxSpawnRadius = DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS;
	}

	// initialize
	initialize(f) {
		this._index = f;
		this._energy = DEFAULT_FOOD_BIT_ENERGY;
		this._opacity = ZERO;
		this._position.x = POOL_LEFT + Math.random() * POOL_WIDTH;
		this._position.y = POOL_TOP + Math.random() * POOL_HEIGHT;
		this._type = 0;
	}

	setType(n) {
		this._type = n;
		this.setColorAccordingToType();
	}

	setColorAccordingToType() {
		if (this._type === 0) { this._red = 0.3;
			this._green = 0.8;
			this._blue = 0.2; }
		if (this._type === 1) { this._red = 0.3;
			this._green = 0.5;
			this._blue = 0.9; }
	}

	spawnFromParent(parentFoodBit, childIndex, childType) {
		assert(parentFoodBit.getIndex() != NULL_INDEX, "foodbit.js: spawnNearParent: parentFoodBit.index != NULL_INDEX");
		assert(parentFoodBit.getAlive(), "foodbit.js: spawnNearParent: parentFoodBit.getAlive()");
		assert(childIndex != NULL_INDEX, "foodbit.js: spawnNearParent: childIndex != NULL_INDEX");

		if (childIndex === parentFoodBit.getIndex()) {
			// warning: childIndex same as parentFoodBit index
		}

		//assert( childIndex != parentFoodBit.getIndex(), "foodbit.js: spawnNearParent: childIndex != parentFoodBit.index" );

		this._index = childIndex;
		this._opacity = ZERO;
		this._energy = parentFoodBit.getEnergy();
		this._type = childType;

		this.setColorAccordingToType();

		// set the position
		this._position.set(parentFoodBit.getPosition());

		// randomize position
		this.randomizeSpawnPosition(parentFoodBit);
	}

	randomizeSpawnPosition(parentFoodBit) {
		this._position.set(parentFoodBit.getPosition());

		let xx = Math.random() * Math.random();
		let yy = Math.random() * Math.random();

		if (Math.random() < ONE_HALF) { xx *= -ONE; }
		if (Math.random() < ONE_HALF) { yy *= -ONE; }

		this._position.x += xx * this._maxSpawnRadius;
		this._position.y += yy * this._maxSpawnRadius;

		// pool boundary collisions
		let pb = POOL_TOP + FOOD_BIT_BOUNDARY_MARGIN;
		let pt = POOL_BOTTOM - FOOD_BIT_BOUNDARY_MARGIN;
		let pl = POOL_LEFT + FOOD_BIT_BOUNDARY_MARGIN;
		let pr = POOL_RIGHT - FOOD_BIT_BOUNDARY_MARGIN;

		if (this._position.y < pb) { this._position.y += ((pb - this._position.y) * 2); } else if (this._position.y > pt) { this._position.y += ((pt - this._position.y) * 2); }

		if (this._position.x > pr) { this._position.x += ((pr - this._position.x) * 2); } else if (this._position.x < pl) { this._position.x += ((pl - this._position.x) * 2); }

		if (SPAWN_FOOD_RANDOMLY_IN_POOL) {
			this._position.x = POOL_LEFT + Math.random() * POOL_WIDTH;
			this._position.y = POOL_TOP + Math.random() * POOL_HEIGHT;
		}

		assert(this._position.x < POOL_RIGHT, "foodbit.js: spawnNearParent: _position.x < POOL_RIGHT");
		assert(this._position.x > POOL_LEFT, "foodbit.js: spawnNearParent: _position.x > POOL_LEFT");
		assert(this._position.y > POOL_TOP, "foodbit.js: spawnNearParent: _position.y < POOL_TOP");
		assert(this._position.y < POOL_BOTTOM, "foodbit.js: spawnNearParent: _position.y > POOL_BOTTOM");
	}

	setPosition(p) {
		this._position.set(p);

		if (this._position.y < POOL_TOP) { this._position.y = POOL_TOP + FOOD_BIT_SIZE; } else if (this._position.y > POOL_BOTTOM) { this._position.y = POOL_BOTTOM - FOOD_BIT_SIZE; }
		if (this._position.x > POOL_RIGHT) { this._position.x = POOL_RIGHT - FOOD_BIT_SIZE; } else if (this._position.x < POOL_LEFT) { this._position.x = POOL_LEFT + FOOD_BIT_SIZE; }

		assert(this._position.x < POOL_RIGHT, "foodbit.js: setPosition: _position.x < POOL_RIGHT");
		assert(this._position.x > POOL_LEFT, "foodbit.js: setPosition: _position.x > POOL_LEFT");
		assert(this._position.y > POOL_TOP, "foodbit.js: setPosition: _position.y < POOL_TOP");
		assert(this._position.y < POOL_BOTTOM, "foodbit.js: setPosition: _position.y > POOL_BOTTOM");
	}

	shiftPosition(s) {
		this._position.x += s.x;
		this._position.y += s.y;
	}

	setMaxSpawnRadius(r) {
		this._maxSpawnRadius = r;
		assert(this._maxSpawnRadius <= MAX_FOOD_BIT_MAX_SPAWN_RADIUS, "FoodBit: setMaxSpawnRadius: _maxSpawnRadius <= MAX_FOOD_BIT_MAX_SPAWN_RADIUS");
		assert(this._maxSpawnRadius >= MIN_FOOD_BIT_MAX_SPAWN_RADIUS, "FoodBit: setMaxSpawnRadius: _maxSpawnRadius >= MIN_FOOD_BIT_MAX_SPAWN_RADIUS");
	}

	getMaxSpawnRadius() {
		return this._maxSpawnRadius;
	}

	setEnergy(e) {
		this._energy = e;

		assert(this._energy <= MAX_FOOD_BIT_ENERGY, "FoodBit:getMaxSpawnRadius setEnergy: _energy <= MAX_FOOD_BIT_ENERGY");
		assert(this._energy >= MIN_FOOD_BIT_ENERGY, "FoodBit:getMaxSpawnRadius setEnergy: _energy >= MIN_FOOD_BIT_ENERGY");
	}

	kill() {
		this._index = NULL_INDEX;
	}

	// getters
	getPosition() { return this._position; }
	getEnergy() { return this._energy; }
	getType() { return this._type; }
	getIndex() { return this._index; }
	getAlive() { return (this._index != NULL_INDEX); }

	// update
	update() {
		// foodbits are born transparent...they become more opaque
		// and then reach max visability within a few seconds
		if (this._opacity < ONE) {
			this._opacity += FOOD_OPACITY_INCREMENT;
			if (this._opacity > ONE) {
				this._opacity = ONE;
			}
		}
	}

	// render
	render(vewScale) {
		canvas.fillStyle = "rgba( " +
			Math.floor(this._red * 255) + ", " +
			Math.floor(this._green * 255) + ", " +
			Math.floor(this._blue * 255) + ", " +
			this._opacity + ")";

		let radius = FOOD_BIT_SIZE + vewScale * FOOD_BIT_SIZE_VIEW_SCALE * FOOD_BIT_SIZE_VIEW_SCALE;

		canvas.beginPath();
		canvas.arc(this._position.x, this._position.y, radius, 0, PI2, false);
		canvas.fill();
		canvas.closePath();
	}

	// render moused-over outline
	renderMousedOverOutline(viewScale) {
		this.showSelectCircle(viewScale, FOOD_BIT_ROLLOVER_COLOR);
	}

	// render select outline
	renderSelectOutline(viewScale) {
		this.showSelectCircle(viewScale, FOOD_BIT_SELECT_COLOR);
	}

	showSelectCircle(viewScale, color) {
		let lineWidth = 1.0 + 0.005 * viewScale;

		canvas.lineWidth = lineWidth;
		canvas.strokeStyle = "rgba( 100, 200, 100, 0.05 )";
		canvas.beginPath();
		canvas.arc(this._position.x, this._position.y, FOOD_BIT_GRAB_RADIUS, 0, PI2, false);
		canvas.stroke();
		canvas.closePath();

		canvas.lineWidth = lineWidth * 0.3;
		canvas.strokeStyle = "rgba( 100, 200, 100, 0.1 )";
		canvas.beginPath();
		canvas.arc(this._position.x, this._position.y, FOOD_BIT_GRAB_RADIUS, 0, PI2, false);
		canvas.stroke();
		canvas.closePath();
	}
}
