"use strict";

class SwimbotRenderer {

	//  colors
	static COLOR_WHITENESS = 0.4;
	static DEAD_COLOR_RED = 0.2;
	static DEAD_COLOR_GREEN = 0.25;
	static DEAD_COLOR_BLUE = 0.3;
	static ROLLOVER_COLOR = "rgba( 180, 190, 200, 0.7 )";
	static SELECT_COLOR = "rgba( 255, 255, 255, 0.8 )";
	static OUTLINE_COLOR = "rgba( 0, 0, 0, 0.4 )";

	//  spline
	static DEFAULT_SPLINE_FACTOR = 0.4;

	//  egg size
	static EGG_SIZE = 5.0;

	constructor() {
		// variables
		this._colorUtility = new Color();
		this._phenotype = new Phenotype();
		this._growthScale = ZERO;
		this._focusDirection = new Vector2D();
		this._brain = new Brain();
		this._age = 1000;
		this._energy = ZERO;
		this._splineFactor = ZERO;
		this._renderingGenitalsAndMouths = false;
	}

	// get part parent position
	getPartParentPosition(p) {
		if (this._phenotype.parts[p].parent == NULL_PART) {
			return this._phenotype.parts[0].position;
		}

		return this._phenotype.parts[this._phenotype.parts[p].parent].position;
	}

	// set rendering goals
	setRenderingGoals(r) {
		this._renderingGenitalsAndMouths = r;
	}

	// render
	render(
		phenotype,
		brain,
		age,
		energy,
		growthScale,
		focusDirection,
		levelOfDetail
	) {
		this._phenotype = phenotype;
		this._brain = brain;
		this._age = age;
		this._energy = energy;
		this._growthScale = growthScale;
		this._focusDirection = focusDirection;

		if (levelOfDetail == SWIMBOT_LEVEL_OF_DETAIL_DOT) {
			let p = 1;

			this._colorUtility = this.calculatePartColor(p);

			let red = Math.floor(this._colorUtility.red * 255);
			let green = Math.floor(this._colorUtility.green * 255);
			let blue = Math.floor(this._colorUtility.blue * 255);

			canvas.fillStyle = "rgb( " + red + ", " + green + ", " + blue + " )";

			canvas.beginPath();
			canvas.arc(this._phenotype.parts[p].position.x, this._phenotype.parts[p].position.y, SWIMBOT_DOT_RENDER_RADIUS, 0, PI2, false);
			canvas.fill();
			canvas.closePath();
		} else if (levelOfDetail == SWIMBOT_LEVEL_OF_DETAIL_LOW) {
			for (let p = 1; p < this._phenotype.numParts; p++) {
				let parentPosition = this.getPartParentPosition(p);

				this._colorUtility = this.calculatePartColor(p);
				let red = Math.floor(this._colorUtility.red * 255);
				let green = Math.floor(this._colorUtility.green * 255);
				let blue = Math.floor(this._colorUtility.blue * 255);

				canvas.strokeStyle = "rgb( " + red + ", " + green + ", " + blue + " )";
				canvas.lineWidth = this._phenotype.parts[p].width * 2.0;

				canvas.beginPath();
				canvas.moveTo(parentPosition.x, parentPosition.y);
				canvas.lineTo(this._phenotype.parts[p].position.x, this._phenotype.parts[p].position.y);
				canvas.closePath();
				canvas.stroke();
			}
		} else if (levelOfDetail == SWIMBOT_LEVEL_OF_DETAIL_HIGH) {
			for (let p = 1; p < this._phenotype.numParts; p++) {
				if (this._phenotype.parts[p].length > ZERO) {
					// render the part
					this._splineFactor = SwimbotRenderer.DEFAULT_SPLINE_FACTOR;

					if (this._phenotype.parts[p].splined) {
						this.renderPartSplined(p);
					} else {
						this.renderPartNormal(p);
					}

					// if p is mouth part, render mouth!
					if (p === 1) {
						if (this._renderingGenitalsAndMouths) {
							if ((this._brain.getState() == BRAIN_STATE_LOOKING_FOR_FOOD) ||
								(this._brain.getState() == BRAIN_STATE_PURSUING_FOOD)) {
								this.renderMouth();
							}
						}
					}
				}
			}
		}

		if (this._renderingGenitalsAndMouths) {
			// render genital!
			if ((this._brain.getState() == BRAIN_STATE_LOOKING_FOR_MATE) ||
				(this._brain.getState() == BRAIN_STATE_PURSUING_MATE)) {
				this.renderGenital();
			}
		}

	}

	// render part normal (not splined)
	// Sprite cache disabled: original geometry uses a parallelogram with separate
	// outlines that must align perfectly between adjacent parts.
	// Pre-rendered sprites bake outlines into the image, causing visible gaps/artifacts.
	renderPartNormal(p) {
		this._renderPartNormalFallback(p);
	}

	// fallback: original vector-based rendering (if sprite cache misses)
	_renderPartNormalFallback(p) {
		let width = this._phenotype.parts[p].width;
		let position = this._phenotype.parts[p].position;
		let parentPosition = this.getPartParentPosition(p);

		if (this._growthScale < ONE) {
			width = width * this._growthScale + SwimbotRenderer.EGG_SIZE * (ONE - this._growthScale);
		}

		let pp0x = this._phenotype.parts[p].perpendicular.x * width;
		let pp0y = this._phenotype.parts[p].perpendicular.y * width;
		let pp1x = this._phenotype.parts[p].perpendicular.x * width;
		let pp1y = this._phenotype.parts[p].perpendicular.y * width;

		let x0 = parentPosition.x - pp1x;
		let y0 = parentPosition.y - pp1y;
		let x1 = parentPosition.x + pp1x;
		let y1 = parentPosition.y + pp1y;
		let x2 = position.x + pp0x;
		let y2 = position.y + pp0y;
		let x3 = position.x - pp0x;
		let y3 = position.y - pp0y;

		this._colorUtility = this.calculatePartColor(p);
		let red = Math.floor(this._colorUtility.red * 255);
		let green = Math.floor(this._colorUtility.green * 255);
		let blue = Math.floor(this._colorUtility.blue * 255);

		canvas.fillStyle = "rgb( " + red + ", " + green + ", " + blue + " )";

		canvas.beginPath();
		canvas.moveTo(x0, y0);
		canvas.lineTo(x1, y1);
		canvas.lineTo(x2, y2);
		canvas.lineTo(x3, y3);
		canvas.closePath();
		canvas.fill();

		let radius = width;
		canvas.beginPath();
		canvas.arc(position.x, position.y, radius, 0, PI2, false);
		canvas.fill();
		canvas.closePath();
		canvas.beginPath();
		canvas.arc(parentPosition.x, parentPosition.y, radius, 0, PI2, false);
		canvas.fill();
		canvas.closePath();

		canvas.lineWidth = 1.0;
		canvas.strokeStyle = SwimbotRenderer.OUTLINE_COLOR;

		let radian = this._phenotype.parts[p].currentAngle * PI_OVER_180;
		canvas.beginPath();
		canvas.arc(parentPosition.x, parentPosition.y, radius, Math.PI - radian, Math.PI - radian + Math.PI, false);
		canvas.stroke();
		canvas.closePath();
		canvas.beginPath();
		canvas.moveTo(x1, y1);
		canvas.lineTo(x2, y2);
		canvas.arc(position.x, position.y, radius, -radian, -radian + Math.PI, false);
		canvas.moveTo(x0, y0);
		canvas.lineTo(x3, y3);
		canvas.stroke();
		canvas.closePath();
	}

	// render part splined — always uses vector fallback (geometry depends on neighbor angles)
	renderPartSplined(p) {
		this._renderPartSplinedFallback(p);
	}

	// fallback: original vector-based splined rendering
	_renderPartSplinedFallback(p) {
		let parentIndex = this._phenotype.parts[p].parent;
		let position = this._phenotype.parts[p].position;
		let parentPosition = this.getPartParentPosition(p);
		let width = this._phenotype.parts[p].width;
		let parentWidth = this._phenotype.parts[parentIndex].width;

		if (this._growthScale < ONE) {
			width = width * this._growthScale + SwimbotRenderer.EGG_SIZE * (ONE - this._growthScale);
			parentWidth = parentWidth * this._growthScale + SwimbotRenderer.EGG_SIZE * (ONE - this._growthScale);
		}

		let perpStartX = this._phenotype.parts[p].perpendicular.x;
		let perpStartY = this._phenotype.parts[p].perpendicular.y;
		let perpEndX = this._phenotype.parts[p].perpendicular.x;
		let perpEndY = this._phenotype.parts[p].perpendicular.y;

		let controlVectorLength = this._phenotype.parts[p].length * this._splineFactor;

		if ((p > 1) && (!this._phenotype.parts[p].branch)) {
			perpStartX += this._phenotype.parts[parentIndex].perpendicular.x;
			perpStartY += this._phenotype.parts[parentIndex].perpendicular.y;
			let length = Math.sqrt(perpStartX * perpStartX + perpStartY * perpStartY);
			perpStartX /= length;
			perpStartY /= length;
		}

		if (this._phenotype.parts[p].child != NULL_INDEX) {
			perpEndX += this._phenotype.parts[this._phenotype.parts[p].child].perpendicular.x;
			perpEndY += this._phenotype.parts[this._phenotype.parts[p].child].perpendicular.y;
			let length = Math.sqrt(perpEndX * perpEndX + perpEndY * perpEndY);
			perpEndX /= length;
			perpEndY /= length;
		}

		let control1DirectionX = -perpStartY;
		let control1DirectionY = perpStartX;
		let control2DirectionX = perpEndY;
		let control2DirectionY = -perpEndX;

		let control1VectorX = control1DirectionX * controlVectorLength;
		let control1VectorY = control1DirectionY * controlVectorLength;
		let control2VectorX = control2DirectionX * controlVectorLength;
		let control2VectorY = control2DirectionY * controlVectorLength;

		perpEndX *= width;
		perpEndY *= width;

		if (p === 1) {
			perpStartX *= width;
			perpStartY *= width;
		} else {
			perpStartX *= parentWidth;
			perpStartY *= parentWidth;
		}

		let startLeftX = parentPosition.x - perpStartX;
		let startLeftY = parentPosition.y - perpStartY;
		let startRightX = parentPosition.x + perpStartX;
		let startRightY = parentPosition.y + perpStartY;
		let control1X = parentPosition.x + control1VectorX;
		let control1Y = parentPosition.y + control1VectorY;
		let control1LeftX = parentPosition.x - perpStartX + control1VectorX;
		let control1LeftY = parentPosition.y - perpStartY + control1VectorY;
		let control1RightX = parentPosition.x + perpStartX + control1VectorX;
		let control1RightY = parentPosition.y + perpStartY + control1VectorY;

		let endLeftX = position.x - perpEndX;
		let endLeftY = position.y - perpEndY;
		let endRightX = position.x + perpEndX;
		let endRightY = position.y + perpEndY;
		let control2X = position.x + control2VectorX;
		let control2Y = position.y + control2VectorY;
		let control2LeftX = position.x - perpEndX + control2VectorX;
		let control2LeftY = position.y - perpEndY + control2VectorY;
		let control2RightX = position.x + perpEndX + control2VectorX;
		let control2RightY = position.y + perpEndY + control2VectorY;

		this._colorUtility = this.calculatePartColor(p);
		let red = Math.floor(this._colorUtility.red * 255);
		let green = Math.floor(this._colorUtility.green * 255);
		let blue = Math.floor(this._colorUtility.blue * 255);

		canvas.fillStyle = "rgb( " + red + ", " + green + ", " + blue + " )";
		canvas.strokeStyle = SwimbotRenderer.OUTLINE_COLOR;

		if (p === 1) {
			canvas.beginPath();
			canvas.arc(this._phenotype.parts[parentIndex].position.x, this._phenotype.parts[parentIndex].position.y, width, 0, PI2, false);
			canvas.fill();
			canvas.closePath();

			let radian = this._phenotype.parts[parentIndex].currentAngle * PI_OVER_180;
			canvas.beginPath();
			canvas.arc(
				this._phenotype.parts[parentIndex].position.x,
				this._phenotype.parts[parentIndex].position.y,
				width,
				Math.PI - radian,
				Math.PI - radian + Math.PI,
				false
			);
			canvas.stroke();
			canvas.closePath();
		}

		if (this._phenotype.parts[p].child === NULL_INDEX) {
			let s = width * this._phenotype.parts[p].endCapSpline;
			let f = -1.0;
			let axisNormalX = this._phenotype.parts[p].axis.x / this._phenotype.parts[p].length;
			let axisNormalY = this._phenotype.parts[p].axis.y / this._phenotype.parts[p].length;

			let startx = endLeftX + axisNormalX * f;
			let starty = endLeftY + axisNormalY * f;
			let endx = endRightX + axisNormalX * f;
			let endy = endRightY + axisNormalY * f;
			let c1x = endLeftX + axisNormalX * s;
			let c1y = endLeftY + axisNormalY * s;
			let c2x = endRightX + axisNormalX * s;
			let c2y = endRightY + axisNormalY * s;

			canvas.beginPath();
			canvas.moveTo(startx, starty);
			canvas.bezierCurveTo(c1x, c1y, c2x, c2y, endx, endy);
			canvas.closePath();
			canvas.fill();

			canvas.moveTo(startx, starty);
			canvas.bezierCurveTo(c1x, c1y, c2x, c2y, endx, endy);
			canvas.stroke();
		}

		canvas.beginPath();
		canvas.moveTo(startLeftX, startLeftY);
		canvas.bezierCurveTo(control1LeftX, control1LeftY, control2LeftX, control2LeftY, endLeftX, endLeftY);
		canvas.lineTo(endRightX, endRightY);
		canvas.bezierCurveTo(control2RightX, control2RightY, control1RightX, control1RightY, startRightX, startRightY);
		canvas.lineTo(startLeftX, startLeftY);
		canvas.closePath();
		canvas.fill();

		canvas.beginPath();
		canvas.arc(parentPosition.x, parentPosition.y, parentWidth * 0.9, 0, PI2, false);
		canvas.fill();
		canvas.closePath();

		canvas.lineWidth = 1.0;
		canvas.beginPath();
		canvas.moveTo(startLeftX, startLeftY);
		canvas.bezierCurveTo(control1LeftX, control1LeftY, control2LeftX, control2LeftY, endLeftX, endLeftY);
		canvas.moveTo(endRightX, endRightY);
		canvas.bezierCurveTo(control2RightX, control2RightY, control1RightX, control1RightY, startRightX, startRightY);
		canvas.stroke();
		canvas.closePath();
	}

	// calculate part color
	calculatePartColor(p) {
		this._colorUtility.red = this._phenotype.parts[p].red;
		this._colorUtility.green = this._phenotype.parts[p].green;
		this._colorUtility.blue = this._phenotype.parts[p].blue;

		if (this._age < globalTweakers.maximumLifeSpan - OLD_AGE_DURATION) {
			if (this._age < YOUNG_AGE_DURATION) {
				// newborns start white...
				this._colorUtility.red = (ONE - this._growthScale) + (this._colorUtility.red * this._growthScale);
				this._colorUtility.green = (ONE - this._growthScale) + (this._colorUtility.green * this._growthScale);
				this._colorUtility.blue = (ONE - this._growthScale) + (this._colorUtility.blue * this._growthScale);
			} else {
				if (this._energy < STARVING) {
					assert(this._energy >= ZERO, "_energy >= ZERO");

					let f = ONE - (this._energy / STARVING);

					this._colorUtility.red = SwimbotRenderer.DEAD_COLOR_RED * f + this._phenotype.parts[p].red * (ONE - f);
					this._colorUtility.green = SwimbotRenderer.DEAD_COLOR_GREEN * f + this._phenotype.parts[p].green * (ONE - f);
					this._colorUtility.blue = SwimbotRenderer.DEAD_COLOR_BLUE * f + this._phenotype.parts[p].blue * (ONE - f);
				}
			}
		} else {
			let oldAgeThreshold = globalTweakers.maximumLifeSpan - OLD_AGE_DURATION;

			let f = (this._age - oldAgeThreshold) / OLD_AGE_DURATION;

			assert(f >= ZERO, "SwibotRenderer:renderPartSplined: f >= ZERO");
			assert(f <= ONE, "SwibotRenderer:renderPartSplined: f <= ONE");

			if (f > ONE) {
				f = ONE;
			}

			this._colorUtility.red = SwimbotRenderer.DEAD_COLOR_RED * f + this._phenotype.parts[p].red * (ONE - f);
			this._colorUtility.green = SwimbotRenderer.DEAD_COLOR_GREEN * f + this._phenotype.parts[p].green * (ONE - f);
			this._colorUtility.blue = SwimbotRenderer.DEAD_COLOR_BLUE * f + this._phenotype.parts[p].blue * (ONE - f);
		}

		assert(this._colorUtility.red >= ZERO, "_colorUtility.red   >= ZERO");
		assert(this._colorUtility.red <= ONE, "_colorUtility.red   <= ONE");

		assert(this._colorUtility.green >= ZERO, "_colorUtility.green >= ZERO");
		assert(this._colorUtility.green <= ONE, "_colorUtility.green <= ONE");

		assert(this._colorUtility.blue >= ZERO, "_colorUtility.blue  >= ZERO");
		assert(this._colorUtility.blue <= ONE, "_colorUtility.blue  <= ONE");

		return this._colorUtility;
	}

	// render genital
	renderGenital() {
		let genitalLength = SWIMBOT_GENITAL_LENGTH * this._growthScale;

		let x = this._phenotype.parts[GENITAL_INDEX].position.x + this._focusDirection.x * genitalLength;
		let y = this._phenotype.parts[GENITAL_INDEX].position.y + this._focusDirection.y * genitalLength;

		canvas.lineWidth = 1.0;
		canvas.strokeStyle = "rgba( 255, 255, 255, 0.7 )";
		canvas.beginPath();
		canvas.moveTo(this._phenotype.parts[GENITAL_INDEX].position.x, this._phenotype.parts[GENITAL_INDEX].position.y);
		canvas.lineTo(x, y);
		canvas.stroke();
		canvas.closePath();

		// if pursuing a mate, show arrow head
		if (this._brain.getState() === BRAIN_STATE_PURSUING_MATE) {
			let arrowLength = genitalLength * 0.4;
			let arrowWidth = genitalLength * 0.25;
			let xLeft = x - this._focusDirection.y * arrowWidth - this._focusDirection.x * arrowLength;
			let yLeft = y + this._focusDirection.x * arrowWidth - this._focusDirection.y * arrowLength;

			let xRight = x + this._focusDirection.y * arrowWidth - this._focusDirection.x * arrowLength;
			let yRight = y - this._focusDirection.x * arrowWidth - this._focusDirection.y * arrowLength;

			canvas.beginPath();
			canvas.moveTo(xLeft, yLeft);
			canvas.lineTo(x, y);
			canvas.lineTo(xRight, yRight);
			canvas.stroke();
			canvas.closePath();
		}
	}

	// render mouth
	renderMouth() {
		let mouthLength = this._phenotype.parts[1].width * 2.5;
		if (mouthLength < SWIMBOT_MIN_MOUTH_LENGTH) {
			mouthLength = SWIMBOT_MIN_MOUTH_LENGTH;
		}

		let mouthWidth = this._phenotype.parts[1].width;
		if (mouthWidth < SWIMBOT_MIN_MOUTH_WIDTH) {
			mouthWidth = SWIMBOT_MIN_MOUTH_WIDTH;
		}

		mouthLength *= this._growthScale;
		mouthWidth *= this._growthScale;

		let baseX = this._phenotype.parts[MOUTH_INDEX].position.x;
		let baseY = this._phenotype.parts[MOUTH_INDEX].position.y;

		let mouthStartX = baseX + this._focusDirection.x * mouthLength * 0.3;
		let mouthStartY = baseY + this._focusDirection.y * mouthLength * 0.3;

		let mouthEndX = baseX + this._focusDirection.x * mouthLength;
		let mouthEndY = baseY + this._focusDirection.y * mouthLength;

		let basePerpX = this._focusDirection.y * this._phenotype.parts[1].width * 0.5;
		let basePerpY = -this._focusDirection.x * this._phenotype.parts[1].width * 0.5;

		let endPerpX = this._focusDirection.y * mouthWidth;
		let endPerpY = -this._focusDirection.x * mouthWidth;

		let leftJawX = baseX - basePerpX;
		let leftJawY = baseY - basePerpY;
		let rightJawX = baseX + basePerpX;
		let rightJawY = baseY + basePerpY;

		let leftEndX = mouthEndX;
		let leftEndY = mouthEndY;
		let rightEndX = mouthEndX;
		let rightEndY = mouthEndY;

		canvas.lineWidth = SWIMBOT_MOUTH_WIDTH;

		this._colorUtility = this.calculatePartColor(1);
		let red = Math.floor(this._colorUtility.red * 255);
		let green = Math.floor(this._colorUtility.green * 255);
		let blue = Math.floor(this._colorUtility.blue * 255);

		canvas.fillStyle = "rgb( " + red + ", " + green + ", " + blue + " )";

		// open jaws
		if (this._brain.getState() === BRAIN_STATE_PURSUING_FOOD) {
			leftEndX -= endPerpX;
			leftEndY -= endPerpY;
			rightEndX += endPerpX;
			rightEndY += endPerpY;
		}

		canvas.beginPath();
		canvas.moveTo(mouthStartX, mouthStartY);
		canvas.lineTo(leftJawX, leftJawY);
		canvas.lineTo(leftEndX, leftEndY);
		canvas.lineTo(mouthStartX, mouthStartY);
		canvas.lineTo(rightEndX, rightEndY);
		canvas.lineTo(rightJawX, rightJawY);
		canvas.lineTo(leftJawX, leftJawY);
		canvas.fill();
		canvas.closePath();

		canvas.strokeStyle = "rgba( 255, 255, 255, 0.7 )";
		canvas.beginPath();
		canvas.moveTo(rightEndX, rightEndY);
		canvas.lineTo(mouthStartX, mouthStartY);
		canvas.lineTo(leftEndX, leftEndY);
		canvas.stroke();
		canvas.closePath();

		canvas.strokeStyle = SwimbotRenderer.OUTLINE_COLOR;
		canvas.beginPath();
		canvas.moveTo(leftJawX, leftJawY);
		canvas.lineTo(leftEndX, leftEndY);
		canvas.stroke();
		canvas.closePath();

		canvas.beginPath();
		canvas.moveTo(rightJawX, rightJawY);
		canvas.lineTo(rightEndX, rightEndY);
		canvas.stroke();
		canvas.closePath();

	}
}
