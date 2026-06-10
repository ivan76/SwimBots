"use strict";

function Swimbot() {

	let flopperX = 0;
	let flopperY = 0;
	let flopperXV = 0;
	let flopperYV = 0;

	//  attraction 
	const TOO_UGLY_TO_CHOOSE = ZERO;

	// variables
	let _genotype = new Genotype();
	let _phenotype = new Phenotype();
	let _brain = new Brain();
	let _position = new Vector2D();
	let _velocity = new Vector2D();
	let _acceleration = new Vector2D();
	let _heading = new Vector2D();
	let _directionToGoal = new Vector2D();
	let _focusDirection = new Vector2D();
	let _centerOfMass = new Vector2D();
	let _vectorUtility = new Vector2D();
	let _chosenFoodBit = new FoodBit();
	let _swimbotRenderer = new SwimbotRenderer();
	let _chosenMate = null; // must start as null!
	let _age = 0;
	let _numOffspring = 0;
	let _numFoodBitsEaten = 0;
	//let _maximumLifeSpan    = 0;
	let _index = NULL_INDEX;
	let _chosenMateIndex = NULL_INDEX;
	let _chosenFoodBitIndex = NULL_INDEX;
	let _alive = false;
	let _tryingToMate = false;
	let _tryingToEat = false;
	let _growthScale = ZERO;
	let _torque = ZERO;
	let _angle = ZERO;
	let _spin = ZERO;
	let _energy = ZERO;
	let _timer = ZERO;
	let _timerDelta = ZERO;
	let _colorUtility = new Color();
	let _energyEfficiency = ZERO;
	let _selectRadius = ZERO;
	let _species = NULL_INDEX;

	let _lastPositionForEfficiencyMeasurement = new Vector2D();
	let _lastEnergyForEfficiencyMeasurement = ZERO;
	let _readyforSensoryInputToBrain = false;


	let _parent = null;

	this.setParent = function(parent) {
		_parent = parent;
	}

	this.computeMomentFactors = function() {
		this.determinePartDecendents();

		let oneOverMass = ONE / _phenotype.mass;

		for (let p = 2; p < _phenotype.numParts; p++) {
			let moment = _phenotype.parts[p].mass * oneOverMass;

			for (let d = 1; d <= _phenotype.parts[p].numDecendents; d++) {
				let decendent = _phenotype.parts[p].decendent[d];
				moment += _phenotype.parts[decendent].mass * oneOverMass;
			}

			_phenotype.parts[p].momentFactor = moment;
		}
	}

	// update body parts
	this.updateBodyParts = function() {
		let oldAgeThreshold = globalTweakers.maximumLifeSpan - OLD_AGE_DURATION;

		// swimmer is not old yet
		if (_age < oldAgeThreshold) {
			if (_age < YOUNG_AGE_DURATION) {
				// swimmer is still growing
				_growthScale = _age / YOUNG_AGE_DURATION;
			} else {
				_growthScale = ONE;
			}

			assert(_growthScale >= 0.0, "assert swimbot.js:updateBodyParts: _growthScale >= 0.0")
			assert(_growthScale <= 1.0, "assert swimbot.js:updateBodyParts: _growthScale <= 1.0")

			// slowing down because starving, 
			// but not slowing down to a full stop.
			if (_energy < STARVING) {
				_timerDelta = _energy / STARVING;

				if (_timerDelta < STARVING_TIMER_DELTA) {
					_timerDelta = STARVING_TIMER_DELTA;
				}
			} else {
				_timerDelta += TIMER_DELTA_INCREASE_RATE;

				if (_timerDelta > ONE) {
					_timerDelta = ONE;
				}
			}
		} else
		// swimmer is past old age threshold
		{
			// dying of old age
			if (_age > globalTweakers.maximumLifeSpan) {
				this.die();
			} else {
				// slowing down because dying
				_timerDelta = ONE - (_age - oldAgeThreshold) / OLD_AGE_DURATION;

				assert(_timerDelta >= 0.0, "assert swimbot.js:updateBodyParts: _timerDelta >= 0.0")
				assert(_timerDelta <= 1.0, "assert swimbot.js:updateBodyParts: _timerDelta <= 1.0")
			}
		}

		_timer += _timerDelta;

		// calculate the modulators as a function of the dot between the 
		// heading and the perpendicular of the direction to the goal
		let radian = _angle * PI_OVER_180;

		_heading.x = Math.sin(radian);
		_heading.y = Math.cos(radian);

		let perpX = _heading.y;
		let perpY = -_heading.x;

		let directionDot = _focusDirection.x * perpX + _focusDirection.y * perpY;

		// set root position and angle
		_phenotype.parts[ROOT_PART].position.set(_position);
		_phenotype.parts[ROOT_PART].currentAngle = _angle - this.getMomentAdjustment();

		// loop through parts to determine angle and position
		for (let p = 1; p < _phenotype.numParts; p++) {
			_phenotype.parts[p].position.set(this.getPartParentPosition(p));

			// determine current angle
			_phenotype.parts[p].currentAngle =
				_phenotype.parts[_phenotype.parts[p].parent].currentAngle +
				_phenotype.parts[p].angle;

			// add motion
			if (p > 1) // because part 1 has nothing to 'bend' off of 
			{
				let ampModulator = _phenotype.parts[p].turnAmp * directionDot;
				let phaseModulator = _phenotype.parts[p].turnPhase * directionDot;

				let radian = _timer * _phenotype.frequency + (_phenotype.parts[p].phase + phaseModulator);
				_phenotype.parts[p].bendingAngle = (_phenotype.parts[p].amp + ampModulator) * Math.sin(radian);
				_phenotype.parts[p].currentAngle += _phenotype.parts[p].bendingAngle;
			}

			// determine position
			let radian = _phenotype.parts[p].currentAngle * PI_OVER_180;
			let length = _phenotype.parts[p].length;

			if (_age < YOUNG_AGE_DURATION) {
				length *= _growthScale;
			}

			let x = length * Math.sin(radian);
			let y = length * Math.cos(radian);
			_phenotype.parts[p].previousMid.setXY(_phenotype.parts[p].midPosition.x, _phenotype.parts[p].midPosition.y);
			_phenotype.parts[p].midPosition.setXY(_phenotype.parts[p].position.x, _phenotype.parts[p].position.y);
			_phenotype.parts[p].position.addXY(x, y);
			_phenotype.parts[p].midPosition.addXY(x * ONE_HALF, y * ONE_HALF);

			// get part axis
			_phenotype.parts[p].axis.x = _phenotype.parts[p].position.x - _phenotype.parts[_phenotype.parts[p].parent].position.x;
			_phenotype.parts[p].axis.y = _phenotype.parts[p].position.y - _phenotype.parts[_phenotype.parts[p].parent].position.y;

			// get perpendicular of part axis
			_phenotype.parts[p].perpendicular.setXY(_phenotype.parts[p].axis.y / length, -_phenotype.parts[p].axis.x / length);

			// calculate part velocity now
			_phenotype.parts[p].velocity.setToDifference(_phenotype.parts[p].midPosition, _phenotype.parts[p].previousMid);
		}

		// calculate center of mass
		this.calculateCenterOfMass();

		// here is where I shift all my body nodes
		// to keep my center of mass in place...
		this.adjustToCenterOfMass();

		// I need to do this again because I 
		// just did an adjustToCenterOfMass
		this.calculateCenterOfMass();

		// calculate select radius
		// (this is a weird hacky solution)
		if (_age % 20 === 0) {
			for (let p = 1; p < _phenotype.numParts; p++) {
				for (let o = 1; o < _phenotype.numParts; o++) {
					if (o != p) {
						let distance = _phenotype.parts[p].position.getDistanceTo(_phenotype.parts[o].position);

						distance = SWIMBOT_SELECT_RADIUS_SCALAR * Math.sqrt(distance);

						if (distance > _selectRadius) {
							_selectRadius = distance;
						}
					}
				}
			}
		}
	}

	this.getMomentAdjustment = function() {
		let momentAdjustment = ZERO;

		// part 1 is not involved here.. 
		for (let p = 2; p < _phenotype.numParts; p++) {
			momentAdjustment += _phenotype.parts[p].bendingAngle * _phenotype.parts[p].momentFactor;
		}

		return momentAdjustment;
	}

	// calculate center of mass
	this.calculateCenterOfMass = function() {
		_centerOfMass.clear();

		for (let p = 1; p < _phenotype.numParts; p++) {
			_centerOfMass.addScaled(_phenotype.parts[p].midPosition, _phenotype.parts[p].mass);
		}

		_centerOfMass.scale(ONE / _phenotype.mass);
	}

	// adjust to center of mass
	this.adjustToCenterOfMass = function() {
		let offsetX = _position.x - _centerOfMass.x;
		let offsetY = _position.y - _centerOfMass.y;

		for (let p = 0; p < _phenotype.numParts; p++) {
			_phenotype.parts[p].position.addXY(offsetX, offsetY);
			_phenotype.parts[p].midPosition.addXY(offsetX, offsetY);
		}
	}

	// determine part decendents
	this.determinePartDecendents = function() {
		// The purpose of this function is to determine all 
		// the "child" parts that descend from each part....   
		for (let p = 1; p < _phenotype.numParts; p++) {
			_phenotype.parts[p].numDecendents = 0;

			// loop through all parts as potential decendents...
			for (let potentialDecendent = 1; potentialDecendent < _phenotype.numParts; potentialDecendent++) {
				let testing = true;
				let root = potentialDecendent;

				// for each potential_decendent, see if it traces back to the part in question 
				while (testing) {
					root = _phenotype.parts[root].parent; //trickle the root down the ancestral tree...

					// we have traced a decendent 
					if (root == p) {
						_phenotype.parts[p].numDecendents++;
						_phenotype.parts[p].decendent[_phenotype.parts[p].numDecendents] = potentialDecendent;
						testing = false;
					}

					// quit if you have if traced all the way back to ROOT_PART 
					if (root == ROOT_PART) {
						testing = false;
					}
				}
			}
		}
	}

	// create
	this.create = function(index, age, position, angle, energy, genotype, embryology) {
		// clear out everything for starters...
		this.clear();

		// set some basic properties
		_position.copyFrom(position);

		//_velocity.clear();
		_index = index;
		_angle = angle;
		_age = age;
		_energy = energy;
		_alive = true;
		_growthScale = ONE;

		// copy genotype values to this swimbot...
		_genotype.copyFromGenotype(genotype);
		assert(_genotype != null, "_genotype != null");

		// generate phenotype
		_phenotype = embryology.generatePhenotypeFromGenotype(_genotype);

		// important
		this.processPhenotype();

		// initialize energy efficiency-related stuff 
		_lastPositionForEfficiencyMeasurement.set(_position);
		_lastEnergyForEfficiencyMeasurement = _energy;

		// initialize brain
		_brain.initialize();
		_brain.setHungerThreshold(DEFAULT_SWIMBOT_HUNGER_THRESHOLD);
		_brain.setEnergyLevel(_energy);
		_brain.update();
	}

	this.setHungerThreshold = function(t) {
		_brain.setHungerThreshold(t);
	}

	// should be called after "generatePhenotypeFromGenotype"
	this.processPhenotype = function() {
		// calculate masses and total part length
		_phenotype.mass = ZERO;
		assert(_phenotype.numParts > 0, "_phenotype.numParts > 0");

		_phenotype.sumPartLengths = ZERO;

		for (let p = 1; p < _phenotype.numParts; p++) {
			_phenotype.sumPartLengths += _phenotype.parts[p].length;

			assert(_phenotype.parts[p].length > ZERO, "_phenotype.parts[p].length > ZERO");
			assert(_phenotype.parts[p].width > ZERO, "_phenotype.parts[p].width  > ZERO");

			_phenotype.parts[p].mass = _phenotype.parts[p].length * _phenotype.parts[p].width;

			assert(_phenotype.parts[p].mass > ZERO, "_phenotype.parts[p].mass > ZERO");

			_phenotype.mass += _phenotype.parts[p].mass;
		}

		assert(_phenotype.mass > ZERO, "_phenotype.mass > ZERO");

		// compute moment factors 
		this.computeMomentFactors();

		// create that body...now
		this.updateBodyParts();

		_timerDelta = ZERO;
	}

	this.zap = function(embryology, amount) {
		_genotype.zap(amount);
		assert(_genotype != null, "_genotype != null");

		// generate phenotype
		_phenotype = embryology.generatePhenotypeFromGenotype(_genotype);

		// important
		this.processPhenotype();
	}

	this.setGeneValue = function(geneIndex, geneValue, embryology) {
		// set gene value
		_genotype.setGeneValue(geneIndex, geneValue);

		// generate phenotype
		_phenotype = embryology.generatePhenotypeFromGenotype(_genotype);

		// important
		this.processPhenotype();
	}

	// update
	this.update = function() {
		// update age
		_age++;

		if (_age % BRAIN_SENSORY_UPDATE_PERIOD == 0) {
			_readyforSensoryInputToBrain = true;
		}

		// update brain
		_brain.setEnergyLevel(_energy);
		_brain.update();

		// I wanna eat my chosen food bit...
		if (_brain.getState() === BRAIN_STATE_PURSUING_FOOD) {
			if ((_chosenFoodBit != null) &&
				(_chosenFoodBit.getAlive())) {
				let xx = _chosenFoodBit.getPosition().x - this.getMouthPosition().x;
				let yy = _chosenFoodBit.getPosition().y - this.getMouthPosition().y;
				let distance = Math.sqrt(xx * xx + yy * yy);

				if (distance < SWIMBOT_MOUTH_LENGTH) {
					_tryingToEat = true;
				}
			}
		}

		// I wanna have sex with my chosen swimbot
		else if (_brain.getState() === BRAIN_STATE_PURSUING_MATE) {
			if ((_chosenMate != null) &&
				(_chosenMate.getAlive())) {
				let xx = _chosenMate.getGenitalPosition().x - this.getGenitalPosition().x;
				let yy = _chosenMate.getGenitalPosition().y - this.getGenitalPosition().y;
				let distance = Math.sqrt(xx * xx + yy * yy);

				if (distance < SWIMBOT_GENITAL_LENGTH)

				{
					_tryingToMate = true;
				}
			}
		}

		// determine the direction to the goal...
		if ((_brain.getState() === BRAIN_STATE_LOOKING_FOR_FOOD) ||
			(_brain.getState() === BRAIN_STATE_LOOKING_FOR_MATE)) {
			this.wanderFocus();
		} else if (_brain.getState() == BRAIN_STATE_PURSUING_MATE) {
			if (_chosenMate != null) {
				_directionToGoal.set(_chosenMate.getGenitalPosition());
				_directionToGoal.subtract(_phenotype.parts[GENITAL_INDEX].position);
				_directionToGoal.normalize();
			}
		} else if (_brain.getState() === BRAIN_STATE_PURSUING_FOOD) {
			if (_chosenFoodBit != null) {
				_directionToGoal.set(_chosenFoodBit.getPosition());
				_directionToGoal.subtract(_phenotype.parts[MOUTH_INDEX].position);
				_directionToGoal.normalize();
			}
		}

		// continually push the focus direction towards the goal
		let previousFocusDirection = new Vector2D();
		previousFocusDirection.set(_focusDirection);

		_focusDirection.addScaled(_directionToGoal, BRAIN_FOCUS_TARGET_SHIFT_STRENGTH);

		_vectorUtility.setToDifference(_focusDirection, previousFocusDirection);

		if (_vectorUtility.getMagnitudeSquared() > BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD * BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD) {
			_focusDirection.set(previousFocusDirection);
			_focusDirection.addScaled(_directionToGoal, BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD);
		}

		_focusDirection.normalize();

		// update body parts
		this.updateBodyParts();

		// update physics
		this.updatePhysics();
	}

	// wander focus
	this.wanderFocus = function() {
		let length = _directionToGoal.getMagnitude();

		if (length === ZERO) {
			_directionToGoal.x = -ONE_HALF + Math.random();
			_directionToGoal.y = -ONE_HALF + Math.random();
			length = _directionToGoal.getMagnitude();
		}

		_directionToGoal.x += (-BRAIN_WANDER_AMOUNT * ONE_HALF + Math.random() * BRAIN_WANDER_AMOUNT);
		_directionToGoal.y += (-BRAIN_WANDER_AMOUNT * ONE_HALF + Math.random() * BRAIN_WANDER_AMOUNT);

		_directionToGoal.x /= length;
		_directionToGoal.y /= length;
	}

	// update physics
	this.updatePhysics = function() {
		// a swimbot creates its own linear and angular forces via moving parts
		this.calculateFluidForces();

		if (_age % ENERGY_EFFICIENCY_MEASUREMENT_PERIOD === 0) {
			this.calculateEnergyEfficiency();
		}

		// energy is always slowly draining 
		_energy -= CONTINUAL_ENERGY_DRAIN;

		// when energy hits zero, that means death 
		if (_energy <= ZERO) {
			_energy = ZERO;
			this.die();
		}

		// wall collisions
		this.updateWallCollisions();
	}

	// swimbot creates its own linear and angular forces via moving parts
	this.calculateFluidForces = function() {
		// clear these out - they will be filled-in below...
		_acceleration.clear();
		_torque = ZERO;

		// loop through parts...
		assert(_phenotype.numParts > 0, "_phenotype.numParts > 0");

		for (let p = 1; p < _phenotype.numParts; p++) {
			// calculate this part's fraction of the total length
			let fractionOfWhole = _phenotype.parts[p].length / _phenotype.sumPartLengths;

			// calculate velocity
			_phenotype.parts[p].velocity.setToDifference(_phenotype.parts[p].midPosition, _phenotype.parts[p].previousMid);

			// get stroke amplitude 
			let strokeAmplitude = _phenotype.parts[p].velocity.dotWith(_phenotype.parts[p].perpendicular) * fractionOfWhole;

			let strokeForceX = _phenotype.parts[p].perpendicular.x * strokeAmplitude;
			let strokeForceY = _phenotype.parts[p].perpendicular.y * strokeAmplitude;

			// calculate energy lost from stroke
			// hey: this might be more accurate to nature if 
			// it were something like angle bend times mass.
			_energy -= Math.abs(strokeAmplitude) * ENERGY_USED_UP_SWIMMING;

			if (_energy < ZERO) {
				_energy = ZERO;
			}

			// calculate part vector from center
			let partVectorFromCenterX = _phenotype.parts[p].midPosition.x - _position.x;
			let partVectorFromCenterY = _phenotype.parts[p].midPosition.y - _position.y;

			// calculate part distance from center
			let xx = partVectorFromCenterX * partVectorFromCenterX;
			let yy = partVectorFromCenterY * partVectorFromCenterY;
			let distance = Math.sqrt(xx * xx + yy * yy);

			if (distance > ZERO) {
				// calculate part direction from center
				let partDirectionFromCenterX = partVectorFromCenterX / distance;
				let partDirectionFromCenterY = partVectorFromCenterY / distance;

				let partAccelerationX = -strokeForceX;
				let partAccelerationY = -strokeForceY;

				// accumulate acceleration 
				_acceleration.x += partAccelerationX;
				_acceleration.y += partAccelerationY;

				// calculate perpendicular 
				let partPerpendicularX = partVectorFromCenterY;
				let partPerpendicularY = -partVectorFromCenterX;

				// get dot of strokeForce with partPerpendicular
				let perpDot = (strokeForceX * partPerpendicularX + strokeForceY * partPerpendicularY) / _phenotype.sumPartLengths;

				// accumulate torque 
				let previousTorque = _torque;
				_torque -= perpDot;
			}
		}

		// apply linear and angular forces to velocity and spin
		_velocity.add(_acceleration);
		_spin += _torque; // * SPIN_SCALAR;

		// update position by velocity, and angle by spin
		_position.add(_velocity);
		_angle += _spin;
	}

	// calculate energy efficiency
	this.calculateEnergyEfficiency = function() {
		// measure distance traveled and energy lost       
		let distanceTraveled = _position.getDistanceTo(_lastPositionForEfficiencyMeasurement);

		let averageSpeed = distanceTraveled / ENERGY_EFFICIENCY_MEASUREMENT_PERIOD;
		let energyLost = _lastEnergyForEfficiencyMeasurement - _energy;

		//if swimbot ate food, energy went up, so cancel that....
		if (energyLost < ZERO) {
			energyLost = ZERO;
		}

		// calculate efficiency
		_energyEfficiency = averageSpeed / (ONE + energyLost);

		// reset these values for the next go-round...
		_lastPositionForEfficiencyMeasurement.set(_position);
		_lastEnergyForEfficiencyMeasurement = _energy;
	}

	// update wall collisions
	this.updateWallCollisions = function() {
		// left wall
		if (_position.x < POOL_LEFT + _phenotype.sumPartLengths * ONE_HALF) {
			for (let p = 1; p < _phenotype.numParts; p++) {
				let radius = _phenotype.parts[p].length + _phenotype.parts[p].width;
				let limit = POOL_LEFT + radius;

				if (_phenotype.parts[p].position.x < limit) {
					let penetration = limit - _phenotype.parts[p].position.x;

					_position.x += penetration * WALL_BOUNCE;
					_velocity.x += penetration * WALL_BOUNCE;
					_directionToGoal.x += penetration * WALL_BOUNCE;
					_directionToGoal.normalize();
				}
			}
		}
		// right wall
		else if (_position.x > POOL_RIGHT - _phenotype.sumPartLengths * ONE_HALF) {
			for (let p = 1; p < _phenotype.numParts; p++) {
				let radius = _phenotype.parts[p].length + _phenotype.parts[p].width;
				let limit = POOL_RIGHT - radius;

				if (_phenotype.parts[p].position.x > limit) {
					let penetration = limit - _phenotype.parts[p].position.x;

					_position.x += penetration * WALL_BOUNCE;
					_velocity.x += penetration * WALL_BOUNCE;
					_directionToGoal.x += penetration * WALL_BOUNCE;
					_directionToGoal.normalize();
				}
			}
		}

		// top wall
		if (_position.y < POOL_TOP + _phenotype.sumPartLengths * ONE_HALF) {
			for (let p = 1; p < _phenotype.numParts; p++) {
				let radius = _phenotype.parts[p].length + _phenotype.parts[p].width;
				let limit = POOL_TOP + radius;

				if (_phenotype.parts[p].position.y < limit) {
					let penetration = limit - _phenotype.parts[p].position.y;

					_position.y += penetration * WALL_BOUNCE;
					_velocity.y += penetration * WALL_BOUNCE;
					_directionToGoal.y += penetration * WALL_BOUNCE;
					_directionToGoal.normalize();
				}
			}
		}
		// bottom wall
		else if (_position.y > POOL_BOTTOM - _phenotype.sumPartLengths * ONE_HALF) {
			for (let p = 1; p < _phenotype.numParts; p++) {
				let radius = _phenotype.parts[p].length + _phenotype.parts[p].width;
				let limit = POOL_BOTTOM - radius;

				if (_phenotype.parts[p].position.y > limit) {
					let penetration = limit - _phenotype.parts[p].position.y;

					_position.y += penetration * WALL_BOUNCE;
					_velocity.y += penetration * WALL_BOUNCE;
					_directionToGoal.y += penetration * WALL_BOUNCE;
					_directionToGoal.normalize();
				}
			}
		}
	}

	// set position
	this.setPosition = function(p) {
		_position.set(p);

		// here is where I shift all my body nodes
		// to keep my center of mass in place...
		this.adjustToCenterOfMass();

		// I need to do this again because I 
		// just did an adjustToCenterOfMass
		this.calculateCenterOfMass();
	}

	// set velocity
	this.setVelocity = function(v) {
		_velocity.set(v);
	}

	// add to velocity 
	this.addForce = function(force) {
		_velocity.add(force);
	}

	// set energy
	this.setEnergy = function(e) {
		_energy = e;
	}

	// set angle
	this.setAngle = function(a) {
		_angle = a;
	}

	// get functions
	this.getIsTryingToEat = function() { return _tryingToEat; }
	this.getIsTryingToMate = function() { return _tryingToMate; }
	this.getIndex = function() { return _index; }
	this.getAge = function() { return _age; }
	this.getAlive = function() { return _alive; }
	this.getEnergy = function() { return _energy; }
	this.getAngle = function() { return _angle; }
	this.getEnergyEfficiency = function() { return _energyEfficiency; }
	this.getPosition = function() { return _position; }
	this.getBoundingRadius = function() { return _phenotype.sumPartLengths; }
	this.getNumParts = function() { return _phenotype.numParts; }
	this.getIsLookingForSensoryInput = function() { return _readyforSensoryInputToBrain; }
	this.getGenitalPosition = function() { return _phenotype.parts[GENITAL_INDEX].position; }
	this.getMouthPosition = function() { return _phenotype.parts[MOUTH_INDEX].position; }
	this.getChosenMateIndex = function() { return _chosenMateIndex; }
	this.getChosenFoodBitIndex = function() { return _chosenFoodBitIndex; }
	this.getNumOffspring = function() { return _numOffspring; }
	this.getNumFoodBitsEaten = function() { return _numFoodBitsEaten; }
	this.getBrainState = function() { return _brain.getState(); }
	this.getGenotype = function() { return _genotype; }
	this.getSelectRadius = function() { return _selectRadius; }
	this.getPreferredFoodType = function() { return _phenotype.preferredFoodType; }
	this.getDigestibleFoodType = function() { return _phenotype.digestibleFoodType; }

	this.getGoalDescription = function() {
		let brainState = _brain.getState();

		if (brainState === BRAIN_STATE_RESTING) { return "resting"; } else if (brainState === BRAIN_STATE_LOOKING_FOR_MATE) { return "looking for mate"; } else if (brainState === BRAIN_STATE_PURSUING_MATE) { return "pursuing mate"; } else if (brainState === BRAIN_STATE_LOOKING_FOR_FOOD) { return "looking for food bit"; } else if (brainState === BRAIN_STATE_PURSUING_FOOD) { return "pursuing food bit"; }

		return "(no goal identified)";
	}

	this.getAttractionDescription = function() {
		let a = _brain.getAttractionCriterion();

		if (a === ATTRACTION_COLORFUL) { return "colorful"; } else if (a === ATTRACTION_BIG) { return "big"; } else if (a === ATTRACTION_HYPER) { return "hyper"; } else if (a === ATTRACTION_LONG) { return "long"; } else if (a === ATTRACTION_STRAIGHT) { return "straight"; } else if (a === ATTRACTION_NO_COLOR) { return "no color"; } else if (a === ATTRACTION_SMALL) { return "small"; } else if (a === ATTRACTION_STILL) { return "still"; } else if (a === ATTRACTION_SHORT) { return "short"; } else if (a === ATTRACTION_CROOKED) { return "crooked"; } else if (a === ATTRACTION_SIMILAR_COLOR) { return "similar color"; } else if (a === ATTRACTION_SIMILAR_SIZE) { return "similar size"; } else if (a === ATTRACTION_SIMILAR_HYPER) { return "similar hyper"; } else if (a === ATTRACTION_SIMILAR_LENGTH) { return "similar length"; } else if (a === ATTRACTION_SIMILAR_STRAIGHT) { return "similar straight"; } else if (a === ATTRACTION_RANDOM) { return "random"; } else if (a === ATTRACTION_CLOSEST) { return "closest"; }

		return "(no attraction identified)";
	}

	// get part parent position
	this.getPartParentPosition = function(p) {
		if (_phenotype.parts[p].parent == NULL_PART) {
			return _position;
		}

		return _phenotype.parts[_phenotype.parts[p].parent].position;
	}

	// eatChosenFoodBit
	this.eatChosenFoodBit = function() {
		assert(_chosenFoodBit != null, "Swimbot:eatChosenFoodBit: _chosenFoodBit != null");
		assert(_chosenFoodBit.getAlive(), "Swimbot:eatChosenFoodBit: _chosenFoodBit.getAlive()");

		if ((_chosenFoodBit != null) &&
			(_chosenFoodBit.getAlive())) {
			let energyFromFoodBit = _chosenFoodBit.getEnergy();

			if (globalTweakers.numFoodTypes > 1) {
				// If the type of the chosen food bit is not compatible with the 
				// digestible type of the swimbot, then it gets less energy...
				if (_chosenFoodBit.getType() != _phenotype.digestibleFoodType) {
					energyFromFoodBit *= FOOD_TYPE_OFFSET;
				}
			}

			_energy += energyFromFoodBit;

			_numFoodBitsEaten++;

			assert(_chosenFoodBit.getEnergy() >= ZERO, "Swimbot:eatChosenFoodBit: _chosenFoodBit.getEnergy() >= ZERO");

			_tryingToEat = false;

			_timerDelta = ZERO;

			assert(_chosenFoodBitIndex != NULL_INDEX, "Swimbot:eatChosenFoodBit: _chosenFoodBitIndex != NULL_INDEX");

			_chosenFoodBit.kill();
		}

		return _chosenFoodBitIndex;
	}

	// setEnvironmentalStimuli
	this.setEnvironmentalStimuli = function(numNearbySwimbots, nearbySwimbotArray, foodBitWasFound, theFoodBit) {
		// if looking for a food bit, choose the one that was found
		_chosenFoodBit = null;
		_chosenFoodBitIndex = NULL_INDEX;

		if ((_brain.getState() == BRAIN_STATE_LOOKING_FOR_FOOD) ||
			(_brain.getState() == BRAIN_STATE_PURSUING_FOOD)) {
			_brain.setFoundFoodBit(foodBitWasFound);

			if (foodBitWasFound) {
				assert(theFoodBit != null, "swimbot.js: setEnvironmentalStimuli: theFoodBit != null");
				_chosenFoodBit = theFoodBit;
				_chosenFoodBitIndex = _chosenFoodBit.getIndex();
			}
		}

		// if looking for mate, scan the nearby swimbots and choose the most attractive...
		if (_brain.getState() === BRAIN_STATE_LOOKING_FOR_MATE) {
			let mostAttractiveFound = new Swimbot;
			let atLeastOneBabeIsVisible = false;
			let highestBabeFactor = -100.0;

			for (let o = 0; o < numNearbySwimbots; o++) {
				let babeFactor = nearbySwimbotArray[o].getAttractiveness(this);

				if ((babeFactor > highestBabeFactor) &&
					(babeFactor > TOO_UGLY_TO_CHOOSE) &&
					(nearbySwimbotArray[o].getAge() > YOUNG_AGE_DURATION) &&
					(nearbySwimbotArray[o].getEnergy() > STARVING)) {
					highestBabeFactor = babeFactor;
					mostAttractiveFound = nearbySwimbotArray[o];
					assert(mostAttractiveFound != null, "mostAttractiveFound != null");
					atLeastOneBabeIsVisible = true;
				}
			}

			if (atLeastOneBabeIsVisible) {
				_chosenMate = mostAttractiveFound;
				assert(_chosenMate != null, "_chosenMate != null");

				_chosenMateIndex = mostAttractiveFound.getIndex();
				assert(_chosenMateIndex != NULL_INDEX, "_chosenMateIndex != NULL_INDEX");

				_brain.setFoundSwimbot(true);
			} else {
				_brain.setFoundSwimbot(false);
			}
		} else if (_brain.getState() == BRAIN_STATE_PURSUING_MATE) {
			let ICanStillSeeYou = false;

			for (let o = 0; o < numNearbySwimbots; o++) {
				let index = nearbySwimbotArray[o].getIndex();
				if (index === _chosenMateIndex) {
					ICanStillSeeYou = true;
					_chosenMate = nearbySwimbotArray[o];
				}
			}

			if (ICanStillSeeYou) {

			} else {
				_brain.setFoundSwimbot(false);
				_chosenMate = null;
				_chosenMateIndex = NULL_INDEX;
			}
		}

		// reset this to false for next time around
		_readyforSensoryInputToBrain = false;

	}

	// set attraction
	this.setAttraction = function(attraction) {
		_brain.setAttraction(attraction);
	}

	// get attractiveness
	this.getAttractiveness = function(judge) {
		let attractiveness = Math.random();

		let attractionCriterion = _brain.getAttractionCriterion();

		if (attractionCriterion === ATTRACTION_COLORFUL) { attractiveness = this.getColorSaturation(); }
		if (attractionCriterion === ATTRACTION_BIG) { attractiveness = this.getCurrentBodyBigness(); }
		if (attractionCriterion === ATTRACTION_HYPER) { attractiveness = this.getCurrentBodyHyperness(); }
		if (attractionCriterion === ATTRACTION_LONG) { attractiveness = this.getCurrentBodyLongness(); }
		if (attractionCriterion === ATTRACTION_STRAIGHT) { attractiveness = this.getCurrentBodyStraightness(); }

		if (attractionCriterion === ATTRACTION_NO_COLOR) { attractiveness = ONE - this.getColorSaturation(); }
		if (attractionCriterion === ATTRACTION_SMALL) { attractiveness = ONE - this.getCurrentBodyBigness(); }
		if (attractionCriterion === ATTRACTION_STILL) { attractiveness = ONE - this.getCurrentBodyHyperness(); }
		if (attractionCriterion === ATTRACTION_SHORT) { attractiveness = ONE - this.getCurrentBodyLongness(); }
		if (attractionCriterion === ATTRACTION_CROOKED) { attractiveness = ONE - this.getCurrentBodyStraightness(); }

		if (attractionCriterion === ATTRACTION_SIMILAR_COLOR) { attractiveness = this.getColorSimilarity(judge); }
		if (attractionCriterion === ATTRACTION_SIMILAR_SIZE) { attractiveness = this.getBignessSimilarity(judge); }
		if (attractionCriterion === ATTRACTION_SIMILAR_HYPER) { attractiveness = this.getHypernessSimilarity(judge); }
		if (attractionCriterion === ATTRACTION_SIMILAR_LENGTH) { attractiveness = this.getLengthSimilarity(judge); }
		if (attractionCriterion === ATTRACTION_SIMILAR_STRAIGHT) { attractiveness = this.getStraightessSimilarity(judge); }

		if (attractionCriterion === ATTRACTION_CLOSEST) { attractiveness = this.getCloseness(judge); }
		if (attractionCriterion === ATTRACTION_RANDOM) { attractiveness = Math.random(); }

		return attractiveness;
	}

	// get color saturation
	this.getColorSaturation = function() {
		let saturation = ZERO;

		let accumulatedMass = ZERO;

		for (let p = 1; p < _phenotype.numParts; p++) {
			accumulatedMass += _phenotype.parts[p].mass;

			let rgDiff = Math.abs(_phenotype.parts[p].red - _phenotype.parts[p].green);
			let rbDiff = Math.abs(_phenotype.parts[p].red - _phenotype.parts[p].blue);
			let gbDiff = Math.abs(_phenotype.parts[p].green - _phenotype.parts[p].blue);

			let thisPartSaturation = (rgDiff + rbDiff + gbDiff) / 3;

			assert(thisPartSaturation <= ONE, "thisPartSaturation <= ONE");

			thisPartSaturation *= _phenotype.parts[p].mass

			saturation += thisPartSaturation;
		}

		assert(accumulatedMass > ZERO, "getColorSaturation: accumulatedMass > ZERO");

		saturation /= accumulatedMass;

		assert(saturation <= ONE, "getColorSaturation: saturation <= ONE");

		return saturation;
	}

	// get closeness
	this.getCloseness = function(judge) {
		let closest = SWIMBOT_VIEW_RADIUS; //maximum

		let distance = _position.getDistanceTo(judge.getPosition());

		if (distance < closest) {
			closest = distance;
		}

		return ONE - (closest / SWIMBOT_VIEW_RADIUS);
	}

	// get similarity
	this.getSimilarity = function(judge) {
		let amount = this.getColorSimilarity(judge) +
			this.getBignessSimilarity(judge) +
			this.getHypernessSimilarity(judge) +
			this.getLengthSimilarity(judge) +
			this.getStraightessSimilarity(judge);

		amount /= 5;

		return amount;
	}

	// get color similarity
	this.getColorSimilarity = function(judge) {
		let amount = ZERO;

		let c1 = judge.getAverageColor();
		let c2 = this.getAverageColor();

		let rDiff = Math.abs(c2.red - c1.red);
		let gDiff = Math.abs(c2.green - c1.green);
		let bDiff = Math.abs(c2.blue - c1.blue);

		amount = ONE - ((rDiff + gDiff + bDiff) * ONE_THIRD);

		return amount;
	}

	// get bigness similarity
	this.getBignessSimilarity = function(judge) {
		let amount = ZERO;

		let b1 = judge.getCurrentBodyBigness();
		let b2 = this.getCurrentBodyBigness();

		amount = ONE - Math.abs(b1 - b2);

		return amount;
	}

	// get hyperness similarity
	this.getHypernessSimilarity = function(judge) {
		let amount = ZERO;

		let b1 = judge.getCurrentBodyHyperness();
		let b2 = this.getCurrentBodyHyperness();

		amount = ONE - Math.abs(b1 - b2);

		return amount;
	}

	// get length similarity
	this.getLengthSimilarity = function(judge) {
		let amount = ZERO;

		let b1 = judge.getCurrentBodyLongness();
		let b2 = this.getCurrentBodyLongness();

		amount = ONE - Math.abs(b1 - b2);

		return amount;
	}

	// get straightness similarity
	this.getStraightessSimilarity = function(judge) {
		let amount = ZERO;

		let b1 = judge.getCurrentBodyStraightness();
		let b2 = this.getCurrentBodyStraightness();

		amount = ONE - Math.abs(b1 - b2);

		return amount;
	}

	this.getCurrentBodyBigness = function() {
		let amount = _phenotype.mass / GREATEST_POSSIBLE_SWIMBOT_MASS;

		return amount;
	}

	this.getCurrentBodyLongness = function() {
		let amount = ZERO;

		for (let p = 1; p < _phenotype.numParts; p++) {
			for (let pp = 1; pp < _phenotype.numParts; pp++) {
				if (pp != p) {
					let d = _phenotype.parts[p].midPosition.getDistanceTo(_phenotype.parts[pp].midPosition);

					if (d > amount) {
						amount = d;
					}
				}
			}
		}

		amount /= GREATEST_POSSIBLE_SWIMBOT_LENGTH;

		return amount;
	}

	this.getCurrentBodyStraightness = function() {
		let amount = ZERO;

		// normalized vectors for each part axis
		let v = new Array();
		for (let p = 1; p < _phenotype.numParts; p++) {
			v[p] = new Vector2D();
			v[p].setXY(_phenotype.parts[p].axis.x / _phenotype.parts[p].length, _phenotype.parts[p].axis.y / _phenotype.parts[p].length);
		}

		// finding the dot products between each pair of these vectors...
		if (_phenotype.numParts < 3) {
			amount = ONE;
		} else {
			let numTests = 0;
			for (let p = 1; p < _phenotype.numParts; p++) {
				for (let pp = p + 1; pp < _phenotype.numParts; pp++) {
					numTests++;
					assert(p != pp, "Swimbot:getCurrentBodyStraightness: p != pp");
					amount += Math.abs(v[p].dotWith(v[pp]));
				}
			}

			amount /= numTests;
		}

		// let's favor swimbots with more parts....
		amount *= 0.7;
		amount += (_phenotype.numParts / MAX_PARTS) * 0.3;

		if (amount > ONE) {
			amount = ONE;
		}

		return amount;
	}

	this.getCurrentBodyHyperness = function() {
		let amount = ZERO;

		for (let p = 1; p < _phenotype.numParts; p++) {
			amount += _phenotype.parts[p].velocity.getMagnitude();
		}

		let FugdeFactorToScaleHyperAttraction = 0.4;

		amount *= FugdeFactorToScaleHyperAttraction;

		if (amount > ONE) {
			amount = ONE;
		}

		return amount;
	}

	// get average color
	this.getAverageColor = function() {
		let r = ZERO;
		let g = ZERO;
		let b = ZERO;
		let accumulatedMass = ZERO;

		for (let p = 1; p < _phenotype.numParts; p++) {
			accumulatedMass += _phenotype.parts[p].mass;

			r += _phenotype.parts[p].red * _phenotype.parts[p].mass;
			g += _phenotype.parts[p].green * _phenotype.parts[p].mass;
			b += _phenotype.parts[p].blue * _phenotype.parts[p].mass;
		}

		assert(accumulatedMass > ZERO, "getAverageColor: accumulatedMass > ZERO");

		r /= accumulatedMass;
		g /= accumulatedMass;
		b /= accumulatedMass;

		assert(r <= ONE, "getAverageColor: r <= ONE");
		assert(g <= ONE, "getAverageColor: g <= ONE");
		assert(b <= ONE, "getAverageColor: b <= ONE");

		let c = new Color();
		c.red = r;
		c.green = g;
		c.blue = b;

		return c;
	}

	// die
	this.die = function() {
		_alive = false;

		if (_index != NULL_INDEX) {
			// this is used for updating the FamilyTree
			_parent.notifySwimbotDeathTime(_index);
		}
	}

	// clear all data
	this.clear = function() {
		_lastPositionForEfficiencyMeasurement.clear();
		_genotype.clear();
		_position.clear();
		_velocity.clear();
		_acceleration.clear();
		_heading.clear();
		_directionToGoal.clear();
		_focusDirection.clear();
		_centerOfMass.clear();
		_vectorUtility.clear();

		_chosenFoodBit = null;
		_chosenMate = null;
		_age = 0;
		_numOffspring = 0;
		_numFoodBitsEaten = 0;
		_index = NULL_INDEX;
		_chosenMateIndex = NULL_INDEX;
		_chosenFoodBitIndex = NULL_INDEX;
		_alive = false;
		_tryingToMate = false;
		_tryingToEat = false;
		_growthScale = ZERO;
		_torque = ZERO;
		_angle = ZERO;
		_spin = ZERO;
		_energy = ZERO;
		_timer = ZERO;
		_timerDelta = ZERO;
		_energyEfficiency = ZERO;
		_selectRadius = ZERO;
		_lastEnergyForEfficiencyMeasurement = ZERO;
		_readyforSensoryInputToBrain = false;
	}

	// contribute to offspring
	this.contributeToOffspring = function() {

		let energyToContribute = _energy * globalTweakers.childEnergyRatio;

		_energy -= energyToContribute;

		assert(_energy >= ZERO, "Swimbot: contributeToOffspring: _energy >= ZERO");

		_numOffspring++;

		_timerDelta = ZERO;
		_tryingToMate = false;
		_chosenMate = null;
		_chosenMateIndex = NULL_INDEX
		_brain.setFoundSwimbot(false);

		return energyToContribute;
	}

	// set rendering goals
	this.setRenderingGoals = function(r) {
		_swimbotRenderer.setRenderingGoals(r);
	}

	// render
	this.render = function(levelOfDetail) {
		_swimbotRenderer.render(
			_phenotype,
			_brain,
			_age,
			_energy,
			_growthScale,
			_focusDirection,
			levelOfDetail
		);
	}
}