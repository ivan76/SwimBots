"use strict";



// helper classes (previously inner functions of Pool constructor)
class PoolTouch {
	constructor() {
		this.down = false;
		this.moving = false;
		this.position = new Vector2D();
		this.time = ZERO;
		this.radius = ZERO;
	}
}

class PoolEffectBlob {
	constructor() {
		this.startTime = ZERO;
		this.xPosition = ZERO;
		this.yPosition = ZERO;
		this.radius = ZERO;
	}
}

// pool
class Pool {
	// constants (previously local to constructor)
	_POOL_COLOR = "rgba( 50, 63, 80, 1.0 )";
	_BOUNDARY_MARGIN_COLOR = "rgb(  0,  0,  0 )";
	_EFFECT_COLOR = "220, 240, 255";
	_POOL_BOUNDARY_MARGIN = 1200.0;
	_TOUCH_RIPPLE_DURATION = 0.3;
	_MAX_TOUCH_RIPPLE_RADIUS = 0.04;
	_NUM_EFFECT_BLOBS = 20;
	_EFFECT_BLOB_COLOR = "70, 80, 90";
	_EFFECT_BLOB_DURATION = 8.0;
	_EFFECT_BLOB_PERIOD = 20;
	_EFFECT_BLOB_ALPHA = 0.5;

	// instance fields (previously local let variables)
	_touch;
	_center;
	_currentEffectBlob = 0;
	_effectClock = 0;
	_effectBlob;

	constructor() {
		this._touch = new PoolTouch();
		this._center = new Vector2D();
		this._effectBlob = Array(this._NUM_EFFECT_BLOBS);

		// do this now
		this._center.x = POOL_LEFT + POOL_WIDTH * ONE_HALF;
		this._center.y = POOL_TOP + POOL_HEIGHT * ONE_HALF;
	}

	// initialize
	initialize(t) {
		this._touch.time = t;

		for (let b = 0; b < this._NUM_EFFECT_BLOBS; b++) {
			this._effectBlob[b] = new PoolEffectBlob();
		}
	}

	// start touch
	startTouch(position, time) {
		this._touch.down = true;
		this._touch.position.x = position.x;
		this._touch.position.y = position.y;
		this._touch.time = time;
	}

	// move touch
	moveTouch(position, time) {
		if (this._touch.down) {
			this._touch.position.x = position.x;
			this._touch.position.y = position.y;
		}
	}

	// end touch
	endTouch(position, time) {
		this._touch.down = false;
		this._touch.position.x = position.x;
		this._touch.position.y = position.y;
		this._touch.time = time;
	}

	// get center
	getCenter() {
		return this._center;
	}

	// render
	render(_seconds, viewport) {
		// show pool background
		let lineWidth = 0.005 + 0.001 * viewport.getScale();

		canvas.fillStyle = this._POOL_COLOR;
		canvas.fillRect(POOL_LEFT, POOL_TOP, POOL_WIDTH, POOL_HEIGHT);

		// show touch
		if ((_seconds - this._touch.time) < this._TOUCH_RIPPLE_DURATION) {
			let f = (_seconds - this._touch.time) / this._TOUCH_RIPPLE_DURATION;

			if (this._touch.down) {
				this._touch.radius = this._MAX_TOUCH_RIPPLE_RADIUS * (ONE - f);
			} else {
				this._touch.radius = this._MAX_TOUCH_RIPPLE_RADIUS * f;
			}

			let radius = this._touch.radius * viewport.getScale();

			if (radius > ZERO) {
				let alpha = ONE - this._touch.radius / this._MAX_TOUCH_RIPPLE_RADIUS;

				canvas.lineWidth = lineWidth;
				canvas.strokeStyle = "rgba( " + this._EFFECT_COLOR + ", " + alpha + " )";
				canvas.beginPath();
				canvas.arc(this._touch.position.x, this._touch.position.y, radius, 0, PI2, false);
				canvas.stroke();
				canvas.closePath();
			}
		}

		// reset this!
		this._touch.moving = false;

		// show boundary
		canvas.fillStyle = this._BOUNDARY_MARGIN_COLOR;
		canvas.fillRect(POOL_LEFT, POOL_TOP - this._POOL_BOUNDARY_MARGIN, POOL_WIDTH, this._POOL_BOUNDARY_MARGIN);
		canvas.fillRect(POOL_LEFT, POOL_BOTTOM, POOL_WIDTH, this._POOL_BOUNDARY_MARGIN);
		canvas.fillRect(POOL_LEFT - this._POOL_BOUNDARY_MARGIN, POOL_TOP, this._POOL_BOUNDARY_MARGIN, POOL_HEIGHT);
		canvas.fillRect(POOL_RIGHT, POOL_TOP, this._POOL_BOUNDARY_MARGIN, POOL_HEIGHT);
	}

	_showWateryEffects(seconds, viewport) {
		let v = viewport.getScale() * 0.3;
		this._effectClock++;

		let viewCenterX = 4000;
		let viewCenterY = 4000;

		if (this._effectClock % this._EFFECT_BLOB_PERIOD === 0) {
			this._currentEffectBlob++;
			if (this._currentEffectBlob >= this._NUM_EFFECT_BLOBS) {
				this._currentEffectBlob = 0;
			}

			this._effectBlob[this._currentEffectBlob].startTime = seconds;
			this._effectBlob[this._currentEffectBlob].radius = v;

			this._effectBlob[this._currentEffectBlob].xPosition = viewport.getPosition().x + v * Math.sin(this._effectClock * 0.040);
			this._effectBlob[this._currentEffectBlob].yPosition = viewport.getPosition().y + v * Math.sin(this._effectClock * 0.080);
		}

		canvas.lineWidth = 3;

		for (let b = 0; b < this._NUM_EFFECT_BLOBS; b++) {
			let timePassed = seconds - this._effectBlob[b].startTime;

			if (timePassed < this._EFFECT_BLOB_DURATION) {
				let fraction = timePassed / this._EFFECT_BLOB_DURATION;
				let wave = ONE_HALF - ONE_HALF * Math.cos(fraction * PI2);
				let radius = this._effectBlob[b].radius * 0.3 + fraction * this._effectBlob[b].radius;
				let alpha = wave * this._EFFECT_BLOB_ALPHA;

				canvas.strokeStyle = "rgba( " + this._EFFECT_BLOB_COLOR + ", " + alpha + " )";
				canvas.fillStyle = "rgba( " + this._EFFECT_BLOB_COLOR + ", " + alpha + " )";
				canvas.beginPath();
				canvas.ellipse(this._effectBlob[b].xPosition, this._effectBlob[b].yPosition, radius, radius * 0.5, 0.0, 0, PI2, false);

				//canvas.stroke();
				canvas.fill();
				canvas.closePath();
			}
		}
	}
}