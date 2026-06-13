"use strict";

const ViewTrackingMode = {
	NULL: -1,
	WHOLE_POOL: 0,
	AUTOTRACK: 1,
	SELECTED: 2,
	MUTUAL: 3,
	PROLIFIC: 4,
	EFFICIENT: 5,
	VIRGIN: 6,
	HUNGRY: 7
};

class ViewTracking {
	static LOVER_TRACKING_SCALE_BASE = 0; //200
	static LOVER_TRACKING_SCALE_INC = 2.0;
	static DEFAULT_INERTIA = 0.4;
	static EASE_IN_FRACTION = 15.0;
	static INNER_WINDOW_RATIO = 0.1;

	constructor() {
		this._vectorUtility = new Vector2D();
		this._centroidUtility = new Vector2D();
		this._isTracking = false;
		this._trackingEaseIn = ZERO;
		this._trackingPosition = new Vector2D();
		this._trackingScale = POOL_WIDTH;
		this._inertia = ViewTracking.DEFAULT_INERTIA;
		this._cameraForce = new Vector2D();
		this._cameraScaleForce = ZERO;
		this._swimbots = [];
		this._mode = ViewTrackingMode.AUTOTRACK;
		this._lover1Index = NULL_INDEX;
		this._lover2Index = NULL_INDEX;

		// set this to the default
		this._vectorUtility.x = POOL_X_CENTER;
		this._vectorUtility.y = POOL_Y_CENTER;
		this._trackingPosition.copyFrom(this._vectorUtility);

		// Incremental centroid cache
		this._cachedCentroid = new Vector2D();
		this._cachedCentroidValid = false;
		this._cachedTrackingX = 0;
		this._cachedTrackingY = 0;
		this._cachedScale = 0;
		this._centroidInvalidateDist = 10; // recompute if trackingPosition moved more than this
	}

	setSwimbots(swimbots) {
		this._swimbots = swimbots;
	}

	setMode(mode, currentCameraPosition, currentCameraScale, selectedSwimbot) {
		this._mode = mode;

		this._isTracking = false;
		this._trackingPosition.copyFrom(currentCameraPosition);
		this._trackingEaseIn = ZERO;
		this._inertia = ViewTracking.DEFAULT_INERTIA;
		this._cachedCentroidValid = false; // invalidate centroid cache on mode change

		// whole pool
		if (this._mode === ViewTrackingMode.WHOLE_POOL) {
			this._isTracking = true;
			this._trackingScale = POOL_WIDTH;
			this._inertia = 0.1;
		}
		// autotrack
		else if (this._mode === ViewTrackingMode.AUTOTRACK) {
			this._isTracking = true;
			this._trackingScale = 600;
			this._inertia = 0.1;
		}
		// selected swimbot
		else if (this._mode === ViewTrackingMode.SELECTED) {
			if (selectedSwimbot != NULL_INDEX) {
				this._isTracking = true;
				this._trackingScale = 400;
				document.getElementById('swimbotDataPanel').innerHTML = "";
			}
		}
		// mutual love
		else if (this._mode === ViewTrackingMode.MUTUAL) {
			this._trackingPosition.copyFrom(this._getCentroidOfLovers());

			if ((this._lover1Index != NULL_INDEX) &&
				(this._lover2Index != NULL_INDEX)) {
				this._isTracking = true;
			}
		}
		// prolific
		else if (this._mode === ViewTrackingMode.PROLIFIC) {
			let mostProlific = this._getMostProlificSwimbot();

			if (mostProlific != NULL_INDEX) {
				selectedSwimbot = mostProlific;

				this._isTracking = true;
				this._trackingScale = 500;
				document.getElementById('swimbotDataPanel').innerHTML = "";
			}
		}
		// most efficient
		else if (this._mode === ViewTrackingMode.EFFICIENT) {
			let mostEfficient = this._getMostEfficientSwimbot();

			if (mostEfficient != NULL_INDEX) {
				selectedSwimbot = mostEfficient;

				this._isTracking = true;
				this._trackingScale = 500;
				document.getElementById('swimbotDataPanel').innerHTML = "";
			}
		}
		// oldest virgin
		else if (this._mode === ViewTrackingMode.VIRGIN) {
			let oldestVirgin = this._getOldestVirgin();

			if (oldestVirgin != NULL_INDEX) {
				selectedSwimbot = oldestVirgin;

				this._isTracking = true;
				this._trackingScale = 500;
				document.getElementById('swimbotDataPanel').innerHTML = "";
			}
		}
		// hungriest
		else if (this._mode === ViewTrackingMode.HUNGRY) {
			let biggestEater = this._getBiggestEater();

			if (biggestEater != NULL_INDEX) {
				selectedSwimbot = biggestEater;

				this._isTracking = true;
				this._trackingScale = 500;
				document.getElementById('swimbotDataPanel').innerHTML = "";
			}
		}

		return selectedSwimbot;
	}

	reset() {
		this._lover1Index = NULL_INDEX;
		this._lover2Index = NULL_INDEX;
	}

	startTracking() {
		this._isTracking = true;
	}

	stopTracking() {
		this._isTracking = false;
		this._mode = ViewTrackingMode.NULL;
	}

	updateTracking(currentCameraPosition, currentCameraScale, selectedSwimbot) {
		if (this._mode === ViewTrackingMode.AUTOTRACK) {
			this._trackingPosition.copyFrom(this._getCentroidOfVisibleSwimbots());
		} else if (this._mode === ViewTrackingMode.MUTUAL) {
			if ((this._lover1Index != NULL_INDEX) &&
				(this._lover2Index != NULL_INDEX)) {
				let loverDistance = this._swimbots[this._lover1Index].getPosition().getDistanceTo(this._swimbots[this._lover2Index].getPosition());

				this._trackingScale += ((loverDistance * 2) - this._trackingScale) * 0.1;
			}

			this._trackingPosition.copyFrom(this._getCentroidOfLovers());
		} else {
			if (selectedSwimbot != NULL_INDEX) {
				this._trackingPosition.copyFrom(this._swimbots[selectedSwimbot].getPosition());
			}
		}

		// This is where the tracking forces are created......
		let xx = this._trackingPosition.x - currentCameraPosition.x;
		let yy = this._trackingPosition.y - currentCameraPosition.y;

		// this is where we handle the inner-window having no tracking force...
		let min = currentCameraScale * ViewTracking.INNER_WINDOW_RATIO;

		let d = Math.sqrt(xx * xx + yy * yy);

		if (d < min) {
			this._cameraForce.x = ZERO;
			this._cameraForce.y = ZERO;
		} else {
			let ramp = (d - min) / currentCameraScale;

			if (ramp > ONE) {
				ramp = ONE;
			}

			this._cameraForce.x = xx * this._inertia * ramp;
			this._cameraForce.y = yy * this._inertia * ramp;
		}

		// set scale force
		this._cameraScaleForce = (this._trackingScale - currentCameraScale) * this._inertia;

		// handle ease-in effect
		this._trackingEaseIn += ViewTracking.EASE_IN_FRACTION;

		let distance = this._cameraForce.getMagnitude();

		if (distance > this._trackingEaseIn) {
			if (distance > ZERO) {
				this._cameraForce.x = (this._cameraForce.x / distance) * this._trackingEaseIn;
				this._cameraForce.y = (this._cameraForce.y / distance) * this._trackingEaseIn;
			}
		}

		if (this._cameraScaleForce < -this._trackingEaseIn) { this._cameraScaleForce = -this._trackingEaseIn; }
		if (this._cameraScaleForce > this._trackingEaseIn) { this._cameraScaleForce = this._trackingEaseIn; }
	}

	// some quickie get functions....
	getIsTracking() { return this._isTracking; }
	getMode() { return this._mode; }
	getLover1Index() { return this._lover1Index; }
	getLover2Index() { return this._lover2Index; }
	getCameraForce() { return this._cameraForce; }
	getCameraScaleForce() { return this._cameraScaleForce; }

	_getCentroidOfVisibleSwimbots() {
		// Check if cached centroid is still valid (tracking position hasn't moved much)
		let dx = this._trackingPosition.x - this._cachedTrackingX;
		let dy = this._trackingPosition.y - this._cachedTrackingY;
		if (this._cachedCentroidValid &&
			Math.abs(dx) < this._centroidInvalidateDist &&
			Math.abs(dy) < this._centroidInvalidateDist &&
			Math.abs(this._trackingScale - this._cachedScale) < 5) {
			return this._cachedCentroid;
		}

		// Recompute centroid
		let totalWeight = ZERO;
		this._centroidUtility.clear();

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			let xx = this._swimbots[s].getPosition().x - this._trackingPosition.x;
			let yy = this._swimbots[s].getPosition().y - this._trackingPosition.y;

			let distance = Math.sqrt(xx * xx + yy * yy);

			if (distance < this._trackingScale) {
				if (this._swimbots[s].getAlive()) {
					let weight = ONE - (distance / this._trackingScale);

					this._centroidUtility.addScaled(this._swimbots[s].getPosition(), weight);
					totalWeight += weight;
				}
			}
		}

		if (totalWeight > ZERO) {
			this._centroidUtility.scale(ONE / totalWeight);
		} else {
			let closestSwimbot = this._getClosestSwimbotToTrackingPosition();

			if (closestSwimbot != NULL_INDEX) {
				this._centroidUtility.copyFrom(this._swimbots[closestSwimbot].getPosition());
			} else {
				this._centroidUtility.copyFrom(this._trackingPosition);
			}
		}

		// Cache the result
		this._cachedCentroid.copyFrom(this._centroidUtility);
		this._cachedTrackingX = this._trackingPosition.x;
		this._cachedTrackingY = this._trackingPosition.y;
		this._cachedScale = this._trackingScale;
		this._cachedCentroidValid = true;

		return this._cachedCentroid;
	}

	_getClosestSwimbotToTrackingPosition() {
		let closest = NULL_INDEX;
		let smallestDistance = POOL_WIDTH;

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				let distance = this._swimbots[s].getPosition().getDistanceTo(this._trackingPosition);

				if (distance < smallestDistance) {
					smallestDistance = distance;
					closest = s;
				}
			}
		}

		return closest;
	}

	_getMostProlificSwimbot() {
		let mostNumOffspring = 0;
		let mostProlific = 0;

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				let numOffspring = this._swimbots[s].getNumOffspring();

				if (numOffspring > mostNumOffspring) {
					mostNumOffspring = numOffspring;
					mostProlific = s;
				}
			}
		}

		return mostProlific;
	}

	_getMostEfficientSwimbot() {
		let highestEfficiency = 0;
		let mostEfficient = NULL_INDEX;

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				if (this._swimbots[s].getNumOffspring() === 0) {
					let efficiency = this._swimbots[s].getEnergyEfficiency();

					if (efficiency > highestEfficiency) {
						highestEfficiency = efficiency;
						mostEfficient = s;
					}
				}
			}
		}

		return mostEfficient;
	}

	_getOldestVirgin() {
		let highestAge = 0;
		let oldestVirgin = NULL_INDEX;

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				if (this._swimbots[s].getNumOffspring() === 0) {
					let age = this._swimbots[s].getAge();

					if (age > highestAge) {
						highestAge = age;
						oldestVirgin = s;
					}
				}
			}
		}

		return oldestVirgin;
	}

	_getBiggestEater() {
		let mostEaten = 0;
		let biggestEater = NULL_INDEX;

		for (let s = 0; s < MAX_SWIMBOTS; s++) {
			if (this._swimbots[s].getAlive()) {
				let numEaten = this._swimbots[s].getNumFoodBitsEaten();

				if (numEaten > mostEaten) {
					mostEaten = numEaten;
					biggestEater = s;
				}
			}
		}

		return biggestEater;
	}

	_getCentroidOfLovers() {
		let centroid = new Vector2D();

		// set the centroid to the tracking position as the default
		centroid.copyFrom(this._trackingPosition);

		// start by assuming they are still in love
		let stillInLove = true;

		// check if either of the lovers has NULL_INDEX
		if ((this._lover1Index === NULL_INDEX) ||
			(this._lover2Index === NULL_INDEX)) {
			stillInLove = false;
		}

		// okay - if their indices are legit
		if (stillInLove) {
			// Check to see if the lovers have broken up
			for (let s = 0; s < MAX_SWIMBOTS; s++) {
				// is lover 1 still in love with lover 2?
				if (s === this._lover1Index) {
					if (this._swimbots[s].getAlive()) {
						if ((this._swimbots[s].getBrainState() != BRAIN_STATE_PURSUING_MATE) ||
							(this._swimbots[s].getChosenMateIndex() != this._lover2Index)) {
							stillInLove = false;
						}
					} else {
						stillInLove = false;
					}
				}

				// if yes, then...is lover 2 still in love with lover 1?
				if (stillInLove) {
					if (s === this._lover2Index) {
						if (this._swimbots[s].getAlive()) {
							if ((this._swimbots[s].getBrainState() != BRAIN_STATE_PURSUING_MATE) ||
								(this._swimbots[s].getChosenMateIndex() != this._lover1Index)) {
								stillInLove = false;
							}
						} else {
							stillInLove = false;
						}
					}
				}
			}
		}

		// okay, they parted ways - find two new lovers!
		if (!stillInLove) {
			for (let s = 0; s < MAX_SWIMBOTS; s++) {
				if (this._swimbots[s].getAlive()) {
					if (this._swimbots[s].getBrainState() === BRAIN_STATE_PURSUING_MATE) {
						let chosenMate = this._swimbots[s].getChosenMateIndex();

						for (let o = 0; o < MAX_SWIMBOTS; o++) {
							if (o === chosenMate) {
								if (this._swimbots[o].getAlive()) {
									if (this._swimbots[o].getBrainState() === BRAIN_STATE_PURSUING_MATE) {
										if (this._swimbots[o].getChosenMateIndex() === s) {
											this._lover1Index = s;
											this._lover2Index = o;

											assert(this._lover1Index != this._lover2Index, "getCentroidOfLovers: _lover1Index != _lover2Index");
										}
									}
								}
							}
						}
					}
				}
			}
		}

		// get the centroid of the two lovers and send it off
		if ((this._lover1Index != NULL_INDEX) &&
			(this._lover2Index != NULL_INDEX)) {
			centroid.x = (this._swimbots[this._lover1Index].getPosition().x + this._swimbots[this._lover2Index].getPosition().x) * ONE_HALF;
			centroid.y = (this._swimbots[this._lover1Index].getPosition().y + this._swimbots[this._lover2Index].getPosition().y) * ONE_HALF;
		}

		return centroid;
	}
}