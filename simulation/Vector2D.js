"use strict";

class Vector2D {
	constructor() {
		this.x = 0.0;
		this.y = 0.0;
	}

	setXY(x_, y_) {
		this.x = x_;
		this.y = y_;
	}

	copyFrom(v) {
		this.x = v.x;
		this.y = v.y;
	}

	addXY(x_, y_) {
		this.x += x_;
		this.y += y_;
	}

	set(p_) {
		this.x = p_.x;
		this.y = p_.y;
	}

	setToDifference(v1, v2) {
		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
	}

	normalize() {
		let m = Math.sqrt(this.x * this.x + this.y * this.y);

		if (m > 0) {
			this.x /= m;
			this.y /= m;
		} else {
			this.x = 1.0;
			this.y = 0.0;
		}
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
	}

	subtract(v) {
		this.x -= v.x;
		this.y -= v.y;
	}

	getMagnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	getMagnitudeSquared() {
		return this.x * this.x + this.y * this.y;
	}

	clear() {
		this.x = 0.0;
		this.y = 0.0;
	}

	scale(s) {
		this.x *= s;
		this.y *= s;
	}

	addScaled(vectorToAdd, scale) {
		this.x += vectorToAdd.x * scale;
		this.y += vectorToAdd.y * scale;
	}

	subtractScaled(vectorToSubtract, scale) {
		this.x -= vectorToSubtract.x * scale;
		this.y -= vectorToSubtract.y * scale;
	}

	dotWith(v) {
		return this.x * v.x + this.y * v.y;
	}

	setToRandomLocationInDisk(position, radius) {
		let radian = PI2 * Math.random();
		let magnitude = radius * Math.sqrt(Math.random());

		this.x = position.x + Math.sin(radian) * magnitude;
		this.y = position.y + Math.cos(radian) * magnitude;
	}

	getDistanceSquaredTo(position) {
		let xx = this.x - position.x;
		let yy = this.y - position.y;
		return xx * xx + yy * yy;
	}

	getDistanceTo(position) {
		let xx = this.x - position.x;
		let yy = this.y - position.y;
		return Math.sqrt(xx * xx + yy * yy);
	}

	setToPerpendicular() {
		let px = this.y;
		let py = -this.x;

		this.x = px;
		this.y = py;
	}

	// check to see if segment a crosses segment b
	getSegmentsCrossing(a0, a1, b0, b1) {
		// get the a and b vectors
		let aX = a1.x - a0.x;
		let aY = a1.y - a0.y;

		let bX = b1.x - b0.x;
		let bY = b1.y - b0.y;

		// get their perpendiculars
		let aPerpX = -aY;
		let aPerpY = aX;

		let bPerpX = -bY;
		let bPerpY = bX;

		// get the vector from a0 to b0
		let a0b0x = b0.x - a0.x;
		let a0b0y = b0.y - a0.y;

		// get the vector from a0 to b1
		let a0b1x = b1.x - a0.x;
		let a0b1y = b1.y - a0.y;

		// get the vector from b0 to a0
		let b0a0x = a0.x - b0.x;
		let b0a0y = a0.y - b0.y;

		// get the vector from b0 to a1
		let b0a1x = a1.x - b0.x;
		let b0a1y = a1.y - b0.y;

		// get the dots of aPerp to the vectors to b0 and b1
		let a0Dotb0 = aPerpX * a0b0x + aPerpY * a0b0y;
		let a0Dotb1 = aPerpX * a0b1x + aPerpY * a0b1y;

		// get the dots of bPerp to the vectors to a0 and a1
		let b0Dota0 = bPerpX * b0a0x + bPerpY * b0a0y;
		let b0Dota1 = bPerpX * b0a1x + bPerpY * b0a1y;

		// if both pairs of dots are on opoosite
		// sides of zero, then the lines are crossing.
		if ((((a0Dotb0 > ZERO) && (a0Dotb1 < ZERO)) ||
				((a0Dotb1 > ZERO) && (a0Dotb0 < ZERO))) &&
			(((b0Dota0 > ZERO) && (b0Dota1 < ZERO)) ||
				((b0Dota1 > ZERO) && (b0Dota0 < ZERO)))) {
			return true;
		}

		return false;
	}
}
