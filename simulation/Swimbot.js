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
		this._species = NULL_INDEX;

		this._lastPositionForEfficiencyMeasurement = new Vector2D();
		this._lastEnergyForEfficiencyMeasurement = ZERO;
		this._readyforSensoryInputToBrain = false;


		this._parent = null;
	}

	setParent(parent) {
		this._parent = parent;
	}

	computeMomentFactors() {
		this.determinePartDecendents();

		let oneOverMass = ONE / this._phenotype.mass;

		for (let p = 2; p < this._phenotype.numParts; p++) {
			let moment = this._phenotype.parts[p].mass * oneOverMass;

			for (let d = 1; d <= this._phenotype.parts[p].numDecendents; d++) {
				let decendent = this._phenotype.parts[p].decendent[d];
				moment += this._phenotype.parts[decendent].mass * oneOverMass;
			}

			this._phenotype.parts[p].momentFactor = moment;
		}
	}

	// update body parts
	updateBodyParts() {
		let oldAgeThreshold = globalTweakers.maximumLifeSpan - OLD_AGE_DURATION;

		// swimmer is not old yet
		if (this._age < oldAgeThreshold) {
			if (this._age < YOUNG_AGE_DURATION) {
				// swimmer is still growing
				this._growthScale = this._age / YOUNG_AGE_DURATION;
			} else {
				this._growthScale = ONE;
			}

			assert(this._growthScale >= 0.0, "assert swimbot.js:updateBodyParts: _growthScale >= 0.0")
			assert(this._growthScale <= 1.0, "assert swimbot.js:updateBodyParts: _growthScale <= 1.0")

			// slowing down because starving,
			// but not slowing down to a full stop.
			if (this._energy < STARVING) {
				this._timerDelta = this._energy / STARVING;

				if (this._timerDelta < STARVING_TIMER_DELTA) {
					this._timerDelta = STARVING_TIMER_DELTA;
				}
			} else {
				this._timerDelta += TIMER_DELTA_INCREASE_RATE;

				if (this._timerDelta > ONE) {
					this._timerDelta = ONE;
				}
			}
		} else
		// swimmer is past old age threshold
		{
			// dying of old age
			if (this._age > globalTweakers.maximumLifeSpan) {
				this.die();
			} else {
				// slowing down because dying
				this._timerDelta = ONE - (this._age - oldAgeThreshold) / OLD_AGE_DURATION;

				assert(this._timerDelta >= 0.0, "assert swimbot.js:updateBodyParts: _timerDelta >= 0.0")
				assert(this._timerDelta <= 1.0, "assert swimbot.js:updateBodyParts: _timerDelta <= 1.0")
			}
		}

		this._timer += this._timerDelta;

		// calculate the modulators as a function of the dot between the
		// heading and the perpendicular of the direction to the goal
		let radian = this._angle * PI_OVER_180;

		this._heading.x = Math.sin(radian);
		this._heading.y = Math.cos(radian);

		let perpX = this._heading.y;
		let perpY = -this._heading.x;

		let directionDot = this._focusDirection.x * perpX + this._focusDirection.y * perpY;

		// set root position and angle
		this._phenotype.parts[ROOT_PART].position.set(this._position);
		this._phenotype.parts[ROOT_PART].currentAngle = this._angle - this.getMomentAdjustment();

		// loop through parts to determine angle and position
		for (let p = 1; p < this._phenotype.numParts; p++) {
			this._phenotype.parts[p].position.set(this.getPartParentPosition(p));

			// determine current angle
			this._phenotype.parts[p].currentAngle =
				this._phenotype.parts[this._phenotype.parts[p].parent].currentAngle +
				this._phenotype.parts[p].angle;

			// add motion
			if (p > 1) // because part 1 has nothing to 'bend' off of
			{
				let ampModulator = this._phenotype.parts[p].turnAmp * directionDot;
				let phaseModulator = this._phenotype.parts[p].turnPhase * directionDot;

				let radian = this._timer * this._phenotype.frequency + (this._phenotype.parts[p].phase + phaseModulator);
				this._phenotype.parts[p].bendingAngle = (this._phenotype.parts[p].amp + ampModulator) * Math.sin(radian);
				this._phenotype.parts[p].currentAngle += this._phenotype.parts[p].bendingAngle;
			}

			// determine position
			let radian = this._phenotype.parts[p].currentAngle * PI_OVER_180;
			let length = this._phenotype.parts[p].length;

			if (this._age < YOUNG_AGE_DURATION) {
				length *= this._growthScale;
			}

			let x = length * Math.sin(radian);
			let y = length * Math.cos(radian);
			this._phenotype.parts[p].previousMid.setXY(this._phenotype.parts[p].midPosition.x, this._phenotype.parts[p].midPosition.y);
			this._phenotype.parts[p].midPosition.setXY(this._phenotype.parts[p].position.x, this._phenotype.parts[p].position.y);
			this._phenotype.parts[p].position.addXY(x, y);
			this._phenotype.parts[p].midPosition.addXY(x * ONE_HALF, y * ONE_HALF);

			// get part axis
			this._phenotype.parts[p].axis.x = this._phenotype.parts[p].position.x - this._phenotype.parts[this._phenotype.parts[p].parent].position.x;
			this._phenotype.parts[p].axis.y = this._phenotype.parts[p].position.y - this._phenotype.parts[this._phenotype.parts[p].parent].position.y;

			// get perpendicular of part axis
			this._phenotype.parts[p].perpendicular.setXY(this._phenotype.parts[p].axis.y / length, -this._phenotype.parts[p].axis.x / length);

			// calculate part velocity now
			this._phenotype.parts[p].velocity.setToDifference(this._phenotype.parts[p].midPosition, this._phenotype.parts[p].previousMid);
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
		if (this._age % 20 === 0) {
			for (let p = 1; p < this._phenotype.numParts; p++) {
				for (let o = 1; o < this._phenotype.numParts; o++) {
					if (o != p) {
						let distance = this._phenotype.parts[p].position.getDistanceTo(this._phenotype.parts[o].position);

						distance = SWIMBOT_SELECT_RADIUS_SCALAR * Math.sqrt(distance);

						if (distance > this._selectRadius) {
							this._selectRadius = distance;
						}
					}
				}
			}
		}
	}

	getMomentAdjustment() {
		let momentAdjustment = ZERO;

		// part 1 is not involved here..
		for (let p = 2; p < this._phenotype.numParts; p++) {
			momentAdjustment += this._phenotype.parts[p].bendingAngle * this._phenotype.parts[p].momentFactor;
		}

		return momentAdjustment;
	}

	// calculate center of mass
	calculateCenterOfMass() {
		this._centerOfMass.clear();

		for (let p = 1; p < this._phenotype.numParts; p++) {
			this._centerOfMass.addScaled(this._phenotype.parts[p].midPosition, this._phenotype.parts[p].mass);
		}

		this._centerOfMass.scale(ONE / this._phenotype.mass);
	}

	// adjust to center of mass
	adjustToCenterOfMass() {
		let offsetX = this._position.x - this._centerOfMass.x;
		let offsetY = this._position.y - this._centerOfMass.y;

		for (let p = 0; p < this._phenotype.numParts; p++) {
			this._phenotype.parts[p].position.addXY(offsetX, offsetY);
			this._phenotype.parts[p].midPosition.addXY(offsetX, offsetY);
		}
	}

	// determine part decendents
	determinePartDecendents() {
		// The purpose of this function is to determine all
		// the "child" parts that descend from each part....
		for (let p = 1; p < this._phenotype.numParts; p++) {
			this._phenotype.parts[p].numDecendents = 0;

			// loop through all parts as potential decendents...
			for (let potentialDecendent = 1; potentialDecendent < this._phenotype.numParts; potentialDecendent++) {
				let testing = true;
				let root = potentialDecendent;

				// for each potential_decendent, see if it traces back to the part in question
				while (testing) {
					root = this._phenotype.parts[root].parent; //trickle the root down the ancestral tree...

					// we have traced a decendent
					if (root == p) {
						this._phenotype.parts[p].numDecendents++;
						this._phenotype.parts[p].decendent[this._phenotype.parts[p].numDecendents] = potentialDecendent;
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
		this._brain.setHungerThreshold(t);
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
		this.computeMomentFactors();

		// create that body...now
		this.updateBodyParts();

		this._timerDelta = ZERO;
	}

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

	// update
	update() {
		// update age
		this._age++;

		if (this._age % BRAIN_SENSORY_UPDATE_PERIOD == 0) {
			this._readyforSensoryInputToBrain = true;
		}

		// update brain
		this._brain.setEnergyLevel(this._energy);
		this._brain.update();

		// I wanna eat my chosen food bit...
		if (this._brain.getState() === BRAIN_STATE_PURSUING_FOOD) {
			if ((this._chosenFoodBit != null) &&
				(this._chosenFoodBit.getAlive())) {
				let xx = this._chosenFoodBit.getPosition().x - this.getMouthPosition().x;
				let yy = this._chosenFoodBit.getPosition().y - this.getMouthPosition().y;
				let distance = Math.sqrt(xx * xx + yy * yy);

				if (distance < SWIMBOT_MOUTH_LENGTH) {
					this._tryingToEat = true;
				}
			}
		}

		// I wanna have sex with my chosen swimbot
		else if (this._brain.getState() === BRAIN_STATE_PURSUING_MATE) {
			if ((this._chosenMate != null) &&
				(this._chosenMate.getAlive())) {
				let xx = this._chosenMate.getGenitalPosition().x - this.getGenitalPosition().x;
				let yy = this._chosenMate.getGenitalPosition().y - this.getGenitalPosition().y;
				let distance = Math.sqrt(xx * xx + yy * yy);

				if (distance < SWIMBOT_GENITAL_LENGTH)

				{
					this._tryingToMate = true;
				}
			}
		}

		// determine the direction to the goal...
		if ((this._brain.getState() === BRAIN_STATE_LOOKING_FOR_FOOD) ||
			(this._brain.getState() === BRAIN_STATE_LOOKING_FOR_MATE)) {
			this.wanderFocus();
		} else if (this._brain.getState() == BRAIN_STATE_PURSUING_MATE) {
			if (this._chosenMate != null) {
				this._directionToGoal.set(this._chosenMate.getGenitalPosition());
				this._directionToGoal.subtract(this._phenotype.parts[GENITAL_INDEX].position);
				this._directionToGoal.normalize();
			}
		} else if (this._brain.getState() === BRAIN_STATE_PURSUING_FOOD) {
			if (this._chosenFoodBit != null) {
				this._directionToGoal.set(this._chosenFoodBit.getPosition());
				this._directionToGoal.subtract(this._phenotype.parts[MOUTH_INDEX].position);
				this._directionToGoal.normalize();
			}
		}

		// continually push the focus direction towards the goal
		let previousFocusDirection = new Vector2D();
		previousFocusDirection.set(this._focusDirection);

		this._focusDirection.addScaled(this._directionToGoal, BRAIN_FOCUS_TARGET_SHIFT_STRENGTH);

		this._vectorUtility.setToDifference(this._focusDirection, previousFocusDirection);

		if (this._vectorUtility.getMagnitudeSquared() > BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD * BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD) {
			this._focusDirection.set(previousFocusDirection);
			this._focusDirection.addScaled(this._directionToGoal, BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD);
		}

		this._focusDirection.normalize();

		// update body parts
		this.updateBodyParts();

		// update physics
		this.updatePhysics();
	}

	// wander focus
	wanderFocus() {
		let length = this._directionToGoal.getMagnitude();

		if (length === ZERO) {
			this._directionToGoal.x = -ONE_HALF + Math.random();
			this._directionToGoal.y = -ONE_HALF + Math.random();
			length = this._directionToGoal.getMagnitude();
		}

		this._directionToGoal.x += (-BRAIN_WANDER_AMOUNT * ONE_HALF + Math.random() * BRAIN_WANDER_AMOUNT);
		this._directionToGoal.y += (-BRAIN_WANDER_AMOUNT * ONE_HALF + Math.random() * BRAIN_WANDER_AMOUNT);

		this._directionToGoal.x /= length;
		this._directionToGoal.y /= length;
	}

	// update physics
	updatePhysics() {
		// a swimbot creates its own linear and angular forces via moving parts
		this.calculateFluidForces();

		if (this._age % ENERGY_EFFICIENCY_MEASUREMENT_PERIOD === 0) {
			this.calculateEnergyEfficiency();
		}

		// energy is always slowly draining
		this._energy -= CONTINUAL_ENERGY_DRAIN;

		// when energy hits zero, that means death
		if (this._energy <= ZERO) {
			this._energy = ZERO;
			this.die();
		}

		// wall collisions
		this.updateWallCollisions();
	}

	// swimbot creates its own linear and angular forces via moving parts
	calculateFluidForces() {
		// clear these out - they will be filled-in below...
		this._acceleration.clear();
		this._torque = ZERO;

		// loop through parts...
		assert(this._phenotype.numParts > 0, "_phenotype.numParts > 0");

		for (let p = 1; p < this._phenotype.numParts; p++) {
			// calculate this part's fraction of the total length
			let fractionOfWhole = this._phenotype.parts[p].length / this._phenotype.sumPartLengths;

			// calculate velocity
			this._phenotype.parts[p].velocity.setToDifference(this._phenotype.parts[p].midPosition, this._phenotype.parts[p].previousMid);

			// get stroke amplitude
			let strokeAmplitude = this._phenotype.parts[p].velocity.dotWith(this._phenotype.parts[p].perpendicular) * fractionOfWhole;

			let strokeForceX = this._phenotype.parts[p].perpendicular.x * strokeAmplitude;
			let strokeForceY = this._phenotype.parts[p].perpendicular.y * strokeAmplitude;

			// calculate energy lost from stroke
			// hey: this might be more accurate to nature if
			// it were something like angle bend times mass.
			this._energy -= Math.abs(strokeAmplitude) * ENERGY_USED_UP_SWIMMING;

			if (this._energy < ZERO) {
				this._energy = ZERO;
			}

			// calculate part vector from center
			let partVectorFromCenterX = this._phenotype.parts[p].midPosition.x - this._position.x;
			let partVectorFromCenterY = this._phenotype.parts[p].midPosition.y - this._position.y;

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
				this._acceleration.x += partAccelerationX;
				this._acceleration.y += partAccelerationY;

				// calculate perpendicular
				let partPerpendicularX = partVectorFromCenterY;
				let partPerpendicularY = -partVectorFromCenterX;

				// get dot of strokeForce with partPerpendicular
				let perpDot = (strokeForceX * partPerpendicularX + strokeForceY * partPerpendicularY) / this._phenotype.sumPartLengths;

				// accumulate torque
				let previousTorque = this._torque;
				this._torque -= perpDot;
			}
		}

		// apply linear and angular forces to velocity and spin
		this._velocity.add(this._acceleration);
		this._spin += this._torque; // * SPIN_SCALAR;

		// update position by velocity, and angle by spin
		this._position.add(this._velocity);
		this._angle += this._spin;
	}

	// calculate energy efficiency
	calculateEnergyEfficiency() {
		// measure distance traveled and energy lost
		let distanceTraveled = this._position.getDistanceTo(this._lastPositionForEfficiencyMeasurement);

		let averageSpeed = distanceTraveled / ENERGY_EFFICIENCY_MEASUREMENT_PERIOD;
		let energyLost = this._lastEnergyForEfficiencyMeasurement - this._energy;

		//if swimbot ate food, energy went up, so cancel that....
		if (energyLost < ZERO) {
			energyLost = ZERO;
		}

		// calculate efficiency
		this._energyEfficiency = averageSpeed / (ONE + energyLost);

		// reset these values for the next go-round...
		this._lastPositionForEfficiencyMeasurement.set(this._position);
		this._lastEnergyForEfficiencyMeasurement = this._energy;
	}

	// update wall collisions
	updateWallCollisions() {
		// left wall
		if (this._position.x < POOL_LEFT + this._phenotype.sumPartLengths * ONE_HALF) {
			for (let p = 1; p < this._phenotype.numParts; p++) {
				let radius = this._phenotype.parts[p].length + this._phenotype.parts[p].width;
				let limit = POOL_LEFT + radius;

				if (this._phenotype.parts[p].position.x < limit) {
					let penetration = limit - this._phenotype.parts[p].position.x;

					this._position.x += penetration * WALL_BOUNCE;
					this._velocity.x += penetration * WALL_BOUNCE;
					this._directionToGoal.x += penetration * WALL_BOUNCE;
					this._directionToGoal.normalize();
				}
			}
		}
		// right wall
		else if (this._position.x > POOL_RIGHT - this._phenotype.sumPartLengths * ONE_HALF) {
			for (let p = 1; p < this._phenotype.numParts; p++) {
				let radius = this._phenotype.parts[p].length + this._phenotype.parts[p].width;
				let limit = POOL_RIGHT - radius;

				if (this._phenotype.parts[p].position.x > limit) {
					let penetration = limit - this._phenotype.parts[p].position.x;

					this._position.x += penetration * WALL_BOUNCE;
					this._velocity.x += penetration * WALL_BOUNCE;
					this._directionToGoal.x += penetration * WALL_BOUNCE;
					this._directionToGoal.normalize();
				}
			}
		}

		// top wall
		if (this._position.y < POOL_TOP + this._phenotype.sumPartLengths * ONE_HALF) {
			for (let p = 1; p < this._phenotype.numParts; p++) {
				let radius = this._phenotype.parts[p].length + this._phenotype.parts[p].width;
				let limit = POOL_TOP + radius;

				if (this._phenotype.parts[p].position.y < limit) {
					let penetration = limit - this._phenotype.parts[p].position.y;

					this._position.y += penetration * WALL_BOUNCE;
					this._velocity.y += penetration * WALL_BOUNCE;
					this._directionToGoal.y += penetration * WALL_BOUNCE;
					this._directionToGoal.normalize();
				}
			}
		}
		// bottom wall
		else if (this._position.y > POOL_BOTTOM - this._phenotype.sumPartLengths * ONE_HALF) {
			for (let p = 1; p < this._phenotype.numParts; p++) {
				let radius = this._phenotype.parts[p].length + this._phenotype.parts[p].width;
				let limit = POOL_BOTTOM - radius;

				if (this._phenotype.parts[p].position.y > limit) {
					let penetration = limit - this._phenotype.parts[p].position.y;

					this._position.y += penetration * WALL_BOUNCE;
					this._velocity.y += penetration * WALL_BOUNCE;
					this._directionToGoal.y += penetration * WALL_BOUNCE;
					this._directionToGoal.normalize();
				}
			}
		}
	}

	// set position
	setPosition(p) {
		this._position.set(p);

		// here is where I shift all my body nodes
		// to keep my center of mass in place...
		this.adjustToCenterOfMass();

		// I need to do this again because I
		// just did an adjustToCenterOfMass
		this.calculateCenterOfMass();
	}

	// set velocity
	setVelocity(v) {
		this._velocity.set(v);
	}

	// add to velocity
	addForce(force) {
		this._velocity.add(force);
	}

	// set energy
	setEnergy(e) {
		this._energy = e;
	}

	// set angle
	setAngle(a) {
		this._angle = a;
	}

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

	// eatChosenFoodBit
	eatChosenFoodBit() {
		assert(this._chosenFoodBit != null, "Swimbot:eatChosenFoodBit: _chosenFoodBit != null");
		assert(this._chosenFoodBit.getAlive(), "Swimbot:eatChosenFoodBit: _chosenFoodBit.getAlive()");

		if ((this._chosenFoodBit != null) &&
			(this._chosenFoodBit.getAlive())) {
			let energyFromFoodBit = this._chosenFoodBit.getEnergy();

			if (globalTweakers.numFoodTypes > 1) {
				// If the type of the chosen food bit is not compatible with the
				// digestible type of the swimbot, then it gets less energy...
				if (this._chosenFoodBit.getType() != this._phenotype.digestibleFoodType) {
					energyFromFoodBit *= FOOD_TYPE_OFFSET;
				}
			}

			this._energy += energyFromFoodBit;

			this._numFoodBitsEaten++;

			assert(this._chosenFoodBit.getEnergy() >= ZERO, "Swimbot:eatChosenFoodBit: _chosenFoodBit.getEnergy() >= ZERO");

			this._tryingToEat = false;

			this._timerDelta = ZERO;

			assert(this._chosenFoodBitIndex != NULL_INDEX, "Swimbot:eatChosenFoodBit: _chosenFoodBitIndex != NULL_INDEX");

			this._chosenFoodBit.kill();
		}

		return this._chosenFoodBitIndex;
	}

	// setEnvironmentalStimuli
	setEnvironmentalStimuli(numNearbySwimbots, nearbySwimbotArray, foodBitWasFound, theFoodBit) {
		const TOO_UGLY_TO_CHOOSE = ZERO;

		// if looking for a food bit, choose the one that was found
		this._chosenFoodBit = null;
		this._chosenFoodBitIndex = NULL_INDEX;

		if ((this._brain.getState() == BRAIN_STATE_LOOKING_FOR_FOOD) ||
			(this._brain.getState() == BRAIN_STATE_PURSUING_FOOD)) {
			this._brain.setFoundFoodBit(foodBitWasFound);

			if (foodBitWasFound) {
				assert(theFoodBit != null, "swimbot.js: setEnvironmentalStimuli: theFoodBit != null");
				this._chosenFoodBit = theFoodBit;
				this._chosenFoodBitIndex = this._chosenFoodBit.getIndex();
			}
		}

		// if looking for mate, scan the nearby swimbots and choose the most attractive...
		if (this._brain.getState() === BRAIN_STATE_LOOKING_FOR_MATE) {
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
				this._chosenMate = mostAttractiveFound;
				assert(this._chosenMate != null, "_chosenMate != null");

				this._chosenMateIndex = mostAttractiveFound.getIndex();
				assert(this._chosenMateIndex != NULL_INDEX, "_chosenMateIndex != NULL_INDEX");

				this._brain.setFoundSwimbot(true);
			} else {
				this._brain.setFoundSwimbot(false);
			}
		} else if (this._brain.getState() == BRAIN_STATE_PURSUING_MATE) {
			let ICanStillSeeYou = false;

			for (let o = 0; o < numNearbySwimbots; o++) {
				let index = nearbySwimbotArray[o].getIndex();
				if (index === this._chosenMateIndex) {
					ICanStillSeeYou = true;
					this._chosenMate = nearbySwimbotArray[o];
				}
			}

			if (ICanStillSeeYou) {

			} else {
				this._brain.setFoundSwimbot(false);
				this._chosenMate = null;
				this._chosenMateIndex = NULL_INDEX;
			}
		}

		// reset this to false for next time around
		this._readyforSensoryInputToBrain = false;

	}

	// set attraction
	setAttraction(attraction) {
		this._brain.setAttraction(attraction);
	}

	// get attractiveness
	getAttractiveness(judge) {
		let attractiveness = Math.random();

		let attractionCriterion = this._brain.getAttractionCriterion();

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
	getColorSaturation() {
		let saturation = ZERO;

		let accumulatedMass = ZERO;

		for (let p = 1; p < this._phenotype.numParts; p++) {
			accumulatedMass += this._phenotype.parts[p].mass;

			let rgDiff = Math.abs(this._phenotype.parts[p].red - this._phenotype.parts[p].green);
			let rbDiff = Math.abs(this._phenotype.parts[p].red - this._phenotype.parts[p].blue);
			let gbDiff = Math.abs(this._phenotype.parts[p].green - this._phenotype.parts[p].blue);

			let thisPartSaturation = (rgDiff + rbDiff + gbDiff) / 3;

			assert(thisPartSaturation <= ONE, "thisPartSaturation <= ONE");

			thisPartSaturation *= this._phenotype.parts[p].mass

			saturation += thisPartSaturation;
		}

		assert(accumulatedMass > ZERO, "getColorSaturation: accumulatedMass > ZERO");

		saturation /= accumulatedMass;

		assert(saturation <= ONE, "getColorSaturation: saturation <= ONE");

		return saturation;
	}

	// get closeness
	getCloseness(judge) {
		let closest = SWIMBOT_VIEW_RADIUS; //maximum

		let distance = this._position.getDistanceTo(judge.getPosition());

		if (distance < closest) {
			closest = distance;
		}

		return ONE - (closest / SWIMBOT_VIEW_RADIUS);
	}

	// get similarity
	getSimilarity(judge) {
		let amount = this.getColorSimilarity(judge) +
			this.getBignessSimilarity(judge) +
			this.getHypernessSimilarity(judge) +
			this.getLengthSimilarity(judge) +
			this.getStraightessSimilarity(judge);

		amount /= 5;

		return amount;
	}

	// get color similarity
	getColorSimilarity(judge) {
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
	getBignessSimilarity(judge) {
		let amount = ZERO;

		let b1 = judge.getCurrentBodyBigness();
		let b2 = this.getCurrentBodyBigness();

		amount = ONE - Math.abs(b1 - b2);

		return amount;
	}

	// get hyperness similarity
	getHypernessSimilarity(judge) {
		let amount = ZERO;

		let b1 = judge.getCurrentBodyHyperness();
		let b2 = this.getCurrentBodyHyperness();

		amount = ONE - Math.abs(b1 - b2);

		return amount;
	}

	// get length similarity
	getLengthSimilarity(judge) {
		let amount = ZERO;

		let b1 = judge.getCurrentBodyLongness();
		let b2 = this.getCurrentBodyLongness();

		amount = ONE - Math.abs(b1 - b2);

		return amount;
	}

	// get straightness similarity
	getStraightessSimilarity(judge) {
		let amount = ZERO;

		let b1 = judge.getCurrentBodyStraightness();
		let b2 = this.getCurrentBodyStraightness();

		amount = ONE - Math.abs(b1 - b2);

		return amount;
	}

	getCurrentBodyBigness() {
		let amount = this._phenotype.mass / GREATEST_POSSIBLE_SWIMBOT_MASS;

		return amount;
	}

	getCurrentBodyLongness() {
		let amount = ZERO;

		for (let p = 1; p < this._phenotype.numParts; p++) {
			for (let pp = 1; pp < this._phenotype.numParts; pp++) {
				if (pp != p) {
					let d = this._phenotype.parts[p].midPosition.getDistanceTo(this._phenotype.parts[pp].midPosition);

					if (d > amount) {
						amount = d;
					}
				}
			}
		}

		amount /= GREATEST_POSSIBLE_SWIMBOT_LENGTH;

		return amount;
	}

	getCurrentBodyStraightness() {
		let amount = ZERO;

		// normalized vectors for each part axis
		let v = [];
		for (let p = 1; p < this._phenotype.numParts; p++) {
			v[p] = new Vector2D();
			v[p].setXY(this._phenotype.parts[p].axis.x / this._phenotype.parts[p].length, this._phenotype.parts[p].axis.y / this._phenotype.parts[p].length);
		}

		// finding the dot products between each pair of these vectors...
		if (this._phenotype.numParts < 3) {
			amount = ONE;
		} else {
			let numTests = 0;
			for (let p = 1; p < this._phenotype.numParts; p++) {
				for (let pp = p + 1; pp < this._phenotype.numParts; pp++) {
					numTests++;
					assert(p != pp, "Swimbot:getCurrentBodyStraightness: p != pp");
					amount += Math.abs(v[p].dotWith(v[pp]));
				}
			}

			amount /= numTests;
		}

		// let's favor swimbots with more parts....
		amount *= 0.7;
		amount += (this._phenotype.numParts / MAX_PARTS) * 0.3;

		if (amount > ONE) {
			amount = ONE;
		}

		return amount;
	}

	getCurrentBodyHyperness() {
		let amount = ZERO;

		for (let p = 1; p < this._phenotype.numParts; p++) {
			amount += this._phenotype.parts[p].velocity.getMagnitude();
		}

		let FugdeFactorToScaleHyperAttraction = 0.4;

		amount *= FugdeFactorToScaleHyperAttraction;

		if (amount > ONE) {
			amount = ONE;
		}

		return amount;
	}

	// get average color
	getAverageColor() {
		let r = ZERO;
		let g = ZERO;
		let b = ZERO;
		let accumulatedMass = ZERO;

		for (let p = 1; p < this._phenotype.numParts; p++) {
			accumulatedMass += this._phenotype.parts[p].mass;

			r += this._phenotype.parts[p].red * this._phenotype.parts[p].mass;
			g += this._phenotype.parts[p].green * this._phenotype.parts[p].mass;
			b += this._phenotype.parts[p].blue * this._phenotype.parts[p].mass;
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
}
