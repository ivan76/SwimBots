"use strict";

// ObstacleEndpoint
class ObstacleEndpoint {
	constructor() {
		this._position = new Vector2D();
		this._hovered = false;
		this._moved = false;
		this._color = "rgb( 100, 100, 100 )";

		this.setColor("rgb( 100, 100, 100 )");
	}

	get position() { return this._position; }
	get hovered() { return this._hovered; }
	set hovered(v) { this._hovered = v; }
	get moved() { return this._moved; }
	set moved(v) { this._moved = v; }
	get color() { return this._color; }
	set color(v) { this._color = v; }

	setColor(c) {
		this._color = c;
	}

	setPosition(p) {
		this._position.x = p.x;
		this._position.y = p.y;
	}

	detectHover(p) {
		let x1 = p.x - this._position.x;
		let y1 = p.y - this._position.y;

		let d1 = x1 * x1 + y1 * y1;

		this._hovered = false;
		if (d1 < ObstacleEndpoint.END_HOVER_RADIUS * ObstacleEndpoint.END_HOVER_RADIUS) {
			this._hovered = true;
			return true;
		}

		return false;
	}

	render(camera) {
		canvas.fillStyle = this._color;

		canvas.beginPath();
		canvas.arc(this._position.x, this._position.y, ObstacleEndpoint.END_RADIUS, 0, PI2, false);
		canvas.fill();
		canvas.closePath();

		canvas.lineWidth = 0.003 * camera.getScale();

		canvas.strokeStyle = "rgba( 0, 0, 0, 0.4 )";
		canvas.beginPath();
		canvas.arc(this._position.x, this._position.y, ObstacleEndpoint.END_RADIUS, 0, PI2, false);
		canvas.stroke();
		canvas.closePath();

		if (this._hovered) {
			let r = ObstacleEndpoint.END_HOVER_RADIUS;
			if (this._moved) {
				r = ObstacleEndpoint.END_MOVE_RADIUS;
			}

			canvas.strokeStyle = "rgba(255, 255, 255, 0.4 )";
			canvas.beginPath();
			canvas.arc(this._position.x, this._position.y, r, 0, PI2, false);
			canvas.stroke();
			canvas.closePath();
		}
	}
}

ObstacleEndpoint.END_RADIUS = 20;
ObstacleEndpoint.END_HOVER_RADIUS = 30;
ObstacleEndpoint.END_MOVE_RADIUS = 25;

// Obstacle
class Obstacle {
	constructor() {
		this._end1 = new ObstacleEndpoint();
		this._end2 = new ObstacleEndpoint();
		this._mid = new Vector2D();
		this._axis = new Vector2D();
		this._direction = new Vector2D();
		this._perp = new Vector2D();
		this._testVector = new Vector2D();
		this._collisionForce = new Vector2D();
		this._length = ZERO;

		// set colors....
		this._end1.setColor("rgb( 200, 150, 100 )");
		this._end2.setColor("rgb( 100, 150, 200 )");
	}

	// set the endpoints of the obstacle
	setEndpointPositions(e1, e2) {
		this._end1.setPosition(e1);
		this._end2.setPosition(e2);

		// whenever an endpoint is moved...
		this._calculateStuff();
	}

	// start moving
	startMoving(movePosition) {
		if (this._end1.hovered) {
			this._end1.moved = true;
			this._end1.setPosition(movePosition);
		} else if (this._end2.hovered) {
			this._end2.moved = true;
			this._end2.setPosition(movePosition);
		}

		// whenever an endpoint is moved...
		this._calculateStuff();
	}

	// move
	setMovePosition(movePosition) {
		if (this._end1.moved) {
			this._end1.setPosition(movePosition);
		} else if (this._end2.moved) {
			this._end2.setPosition(movePosition);
		}

		// whenever an endpoint is moved...
		this._calculateStuff();
	}

	// stop moving
	stopMoving() {
		this._end1.moved = false;
		this._end2.moved = false;
	}

	// detect collision with a given position
	getCollision(testPosition, radius) {
		if (radius < ObstacleEndpoint.END_RADIUS) {
			radius = ObstacleEndpoint.END_RADIUS;
		}

		let xx = testPosition.x - this._mid.x;
		let yy = testPosition.y - this._mid.y;

		let distanceSquared = xx * xx + yy * yy;

		let ll = this._length * ONE_HALF + ObstacleEndpoint.END_RADIUS + radius;

		if (distanceSquared < ll * ll) {
			this._testVector.x = testPosition.x - this._end1.position.x;
			this._testVector.y = testPosition.y - this._end1.position.y;

			let dot = this._testVector.dotWith(this._perp);

			if (Math.abs(dot) < radius) {
				let penetration = (ONE - (dot / radius)) /* * COLLISION_FORCE */ ;

				if (dot < ZERO) {
					penetration *= -ONE;
				}

				this._collisionForce.setXY(this._perp.x * penetration, this._perp.y * penetration);
				return true;
			}
		}

		return false;
	}

	// if a collision has been detected, then add the resulting force
	// NOTE: call this immediately after calling "getCollision"
	getCurrentCollisionForce() {
		return this._collisionForce;
	}

	// See if the obstacle lies between these two points
	// (blocking the view or stopping access)
	getObstruction(p1, p2) {
		return p1.getSegmentsCrossing(p1, p2, this._end1.position, this._end2.position);
	}

	// get end positions
	getEnd1Position() { return this._end1.position; }
	getEnd2Position() { return this._end2.position; }

	// detect mouse hover hovered
	detectHover(touchPosition) {
		if ((this._end1.detectHover(touchPosition)) ||
			(this._end2.detectHover(touchPosition))) {
			return true;
		}

		return false;
	}

	// get hovered
	getHovered() {
		if ((this._end1.hovered) ||
			(this._end2.hovered)) {
			//console.log( "OK" );
			return true;
		}

		return false;
	}

	// get being moved
	getBeingMoved() {
		return this._end1.moved || this._end2.moved;
	}

	// calculate stuff when moving an endpoint...
	_calculateStuff() {
		// calculate axis
		this._axis.x = this._end2.position.x - this._end1.position.x;
		this._axis.y = this._end2.position.y - this._end1.position.y;

		// calculate midpoint
		this._mid.x = this._end1.position.x + this._axis.x * ONE_HALF;
		this._mid.y = this._end1.position.y + this._axis.y * ONE_HALF;

		// calculate length
		this._length = Math.sqrt(this._axis.x * this._axis.x + this._axis.y * this._axis.y);

		// calculate direction
		this._direction.x = this._axis.x / this._length;
		this._direction.y = this._axis.y / this._length;

		// calculate perpendicular
		this._perp.x = this._direction.y;
		this._perp.y = -this._direction.x;

		// handle endpoints bumping into each other
		let minLength = ObstacleEndpoint.END_RADIUS * 2;

		if (this._length < minLength) {
			let penetration = ONE - (this._length / minLength);

			let xShift = ObstacleEndpoint.END_RADIUS * this._direction.x * penetration;
			let yShift = ObstacleEndpoint.END_RADIUS * this._direction.y * penetration;

			this._end1.position.x -= xShift;
			this._end1.position.y -= yShift;

			this._end2.position.x += xShift;
			this._end2.position.y += yShift;
		}

		// handle collisions with the pool walls
		let left = POOL_LEFT + ObstacleEndpoint.END_RADIUS;
		let right = POOL_RIGHT - ObstacleEndpoint.END_RADIUS
		let bottom = POOL_BOTTOM - ObstacleEndpoint.END_RADIUS
		let top = POOL_TOP + ObstacleEndpoint.END_RADIUS

		if (this._end1.position.x > right) { this._end1.position.x = right; } else if (this._end1.position.x < left) { this._end1.position.x = left; }
		if (this._end1.position.y > bottom) { this._end1.position.y = bottom; } else if (this._end1.position.y < top) { this._end1.position.y = top; }

		if (this._end2.position.x > right) { this._end2.position.x = right; } else if (this._end2.position.x < left) { this._end2.position.x = left; }
		if (this._end2.position.y > bottom) { this._end2.position.y = bottom; } else if (this._end2.position.y < top) { this._end2.position.y = top; }
	}

	// render
	render(camera) {
		// show main shaft
		canvas.strokeStyle = "rgb( 200, 200, 200 )";
		canvas.lineWidth = ObstacleEndpoint.END_RADIUS;
		canvas.beginPath();
		canvas.moveTo(this._end1.position.x, this._end1.position.y);
		canvas.lineTo(this._end2.position.x, this._end2.position.y);
		canvas.closePath();
		canvas.stroke();

		// show ends
		this._end1.render(camera);
		this._end2.render(camera);
	}
}
