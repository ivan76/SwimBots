"use strict";

// touch states
const TouchState = {
	NULL: -1,
	BEEN_UP: 0,
	JUST_DOWN: 1,
	BEEN_DOWN: 2,
	JUST_UP: 3
};

class Touch {
	constructor() {
		this._state = TouchState.BEEN_UP;
		this._x = ZERO;
		this._y = ZERO;
		this._previousX = ZERO;
		this._previousY = ZERO;
	}

	// update
	update() {
		this._previousX = this._x;
		this._previousY = this._y;

		if (this._state === TouchState.JUST_DOWN) {
			this._state = TouchState.BEEN_DOWN;
		} else if (this._state === TouchState.JUST_UP) {
			this._state = TouchState.BEEN_UP;
		}
	}

	// set to down
	setToDown(x, y) {
		this._x = x;
		this._y = y;
		this._state = TouchState.JUST_DOWN;
	}

	// set to up
	setToUp(x, y) {
		this._x = x;
		this._y = y;
		this._state = TouchState.JUST_UP;
	}

	// set to move
	setToMove(x, y) {
		this._x = x;
		this._y = y;
	}

	// render
	render() {
		if (this._state === TouchState.BEEN_UP) { canvas.fillStyle = "rgb(   0,   0,   0 )"; }
		if (this._state === TouchState.JUST_DOWN) { canvas.fillStyle = "rgb( 244, 244, 244 )"; }
		if (this._state === TouchState.BEEN_DOWN) { canvas.fillStyle = "rgb(   0, 244,   0 )"; }
		if (this._state === TouchState.JUST_UP) { canvas.fillStyle = "rgb( 244,   0,   0 )"; }

		canvas.beginPath();
		canvas.arc(this._x, this._y, 10.0, 0, PI2, false);
		canvas.fill();
		canvas.closePath();
	}

	// get methods
	getState() { return this._state; }
	getVelocityX() { return this._x - this._previousX; }
	getVelocityY() { return this._y - this._previousY; }
}