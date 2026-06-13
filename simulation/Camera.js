"use strict";

const FRICTION = 8.0;
const BUTTON_FORCE = 0.3;
const DRAG_FORCE = 0.03;
const PAN_OVERSHOOT_PUSH = 0.7;
const SCALE_OVERSHOOT_PUSH = 0.7;
const MINIMUM_SCALE = 500.0;

class Camera {
	constructor() {
		this._position = new Vector2D();
		this._velocity = new Vector2D();
		this._vectorUtility = new Vector2D();
		this._scaleDelta = ZERO;
		this._scale = ONE;
		this._aspectRatio = ONE;
		this._left = ZERO;
		this._right = ZERO;
		this._top = ZERO;
		this._bottom = ZERO;
		this._seconds = ZERO;
		this._secondsDelta = ZERO;
	}

	update(seconds) {
		// friction
		let f = ONE - FRICTION * this._secondsDelta;

		if (f < ZERO) {
			this._velocity.clear();
			this._scaleDelta = ZERO;
		} else if (f < ONE) {
			this._velocity.scale(f);
			this._scaleDelta *= (f);
		}

		// update position and scale
		this._position.add(this._velocity);
		this._scale += this._scaleDelta;

		// calculate frame
		this._calculateFrame();

		// apply constraints
		this._applyConstraints();

		// update seconds
		this._secondsDelta = seconds - this._seconds;
		this._seconds = seconds;
	}

	addForce(force, scaleForce) {
		this._velocity.x = force.x;
		this._velocity.y = force.y;
		this._scaleDelta = scaleForce;
	}

	setAspectRatio(a) {
		this._aspectRatio = a;

		// important
		this._calculateFrame();

		// apply constraints
		this._applyConstraints();
	}

	_calculateFrame() {
		this._right = this._position.x + this._scale * ONE_HALF * this._aspectRatio;
		this._left = this._position.x - this._scale * ONE_HALF * this._aspectRatio;

		this._top = this._position.y + this._scale * ONE_HALF;
		this._bottom = this._position.y - this._scale * ONE_HALF;
	}

	_applyConstraints() {
		let scaleOvershoot = this._scale - (POOL_RIGHT - POOL_LEFT);
		if (scaleOvershoot > ZERO) {
			this._scale -= scaleOvershoot * SCALE_OVERSHOOT_PUSH;
		}

		let scaleUndershoot = this._scale - MINIMUM_SCALE;
		if (scaleUndershoot < ZERO) {
			this._scale -= scaleUndershoot * SCALE_OVERSHOOT_PUSH;
		}

		let rightOverShoot = this._right - POOL_RIGHT;
		let leftOverShoot = this._left + POOL_LEFT;
		let topOverShoot = this._top - POOL_BOTTOM;
		let bottomOverShoot = this._bottom + POOL_TOP;

		if (rightOverShoot > ZERO) {
			this._position.x -= rightOverShoot * PAN_OVERSHOOT_PUSH;
			this._calculateFrame();
		}
		if (leftOverShoot < ZERO) {
			this._position.x -= leftOverShoot * PAN_OVERSHOOT_PUSH;
			this._calculateFrame();
		}

		if (topOverShoot > ZERO) {
			this._position.y -= topOverShoot * PAN_OVERSHOOT_PUSH;
			this._calculateFrame();
		}
		if (bottomOverShoot < ZERO) {
			this._position.y -= bottomOverShoot * PAN_OVERSHOOT_PUSH;
			this._calculateFrame();
		}
	}

	// controls
	panLeft() { this._velocity.x -= this._scale * BUTTON_FORCE * this._secondsDelta; }
	panRight() { this._velocity.x += this._scale * BUTTON_FORCE * this._secondsDelta; }
	panDown() { this._velocity.y += this._scale * BUTTON_FORCE * this._secondsDelta; }
	panUp() { this._velocity.y -= this._scale * BUTTON_FORCE * this._secondsDelta; }
	zoomIn() { this._scaleDelta -= this._scale * BUTTON_FORCE * this._secondsDelta; }
	zoomOut() { this._scaleDelta += this._scale * BUTTON_FORCE * this._secondsDelta; }

	drag(x, y) {
		this._velocity.x -= x * this._scale * DRAG_FORCE * this._secondsDelta;
		this._velocity.y -= y * this._scale * DRAG_FORCE * this._secondsDelta;

		// as the scale approaches the whole pool, the drag gets
		// more dampened, until it is fully dampened at the limit.
		let limit = POOL_WIDTH * 0.4;

		if (this._scale > limit) {
			if (this._scale > POOL_WIDTH) {
				this._scale = POOL_WIDTH;
			}
			let dampening = ONE - ((this._scale - limit) / (POOL_WIDTH - limit));

			this._velocity.x *= dampening;
			this._velocity.y *= dampening;
		}
	}

	setPosition(position) {
		this._position.copyFrom(position);
		this._velocity.clear();

		// important
		this._calculateFrame();
	}

	setScale(scale) {
		this._scale = scale;
		this._scaleDelta = ZERO;

		// important
		this._calculateFrame();
	}

	setScaleToMax() {
		this._scale = POOL_RIGHT - POOL_LEFT;
		this._scaleDelta = ZERO;
		this._position.setXY(POOL_LEFT + this._scale * ONE_HALF, POOL_TOP + this._scale * ONE_HALF);
		this._velocity.clear()

		// important
		this._calculateFrame();
	}

	getPosition() {
		return { x: this._position.x, y: this._position.y };
	}

	getScale() {
		return this._scale;
	}

	getXDimension() {
		return this._scale * this._aspectRatio;
	}

	getYDimension() {
		return this._scale;
	}

	getWithinView(position, buffer) {
		if ((position.x < this._right + buffer) &&
			(position.x > this._left - buffer) &&
			(position.y < this._top + buffer) &&
			(position.y > this._bottom - buffer)) {
			return true;
		}

		return false;
	}
}