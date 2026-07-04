"use strict";

function Graph() {
	const GRAPH_LEFT_MARGIN = 20;
	const GRAPH_RIGHT_MARGIN = 20;
	const GRAPH_BOTTOM_MARGIN = 160;
	const GRAPH_TOP_MARGIN = 40;
	const GRAPH_MAX_POPULATION = 2000;
	const RECIPROCAL_OF_MAX_POP = 1 / GRAPH_MAX_POPULATION;

	// Colors for each data series
	const GRAPH_SWIMBOT_COLOR = "rgb(200, 60,  20)";   // orange — total swimbots
	const GRAPH_GREEN_PREF_COLOR = "rgb(200,  20, 200)"; // magenta — green-pref swimbots
	const GRAPH_BLUE_PREF_COLOR = "rgb( 60,  60, 200)";  // dark blue — blue-pref swimbots
	const GRAPH_FOODBIT_COLOR = "rgb(20,  100,  20)";    // green — green food
	const GRAPH_FOODBIT_1_COLOR = "rgb(20,  100, 200)";  // blue — blue food

	let _currentCount = 0;
	let _left = 0;
	let _top = 0;
	let _right = 0;
	let _bottom = 0;
	let _width = 0;
	let _height = 0;
	let _maxGraphCount = 0;
	let _level1000 = 0;
	let _level0500 = 0;
	let _level0000 = 0;
	let _graphLeft = 0;
	let _graphRight = 0;
	let _graphBottom = 0;
	let _graphTop = 0;
	let _graphWidth = 0;
	let _graphHeight = 0;

	// Data arrays (circular buffers)
	let _time = [];
	let _numSwimbots = [];
	let _numGreenPref = [];
	let _numBluePref = [];
	let _numFoodBits0 = [];
	let _numFoodBits1 = [];

	let _graphContext = null;
	let _graphCanvas = null;
	let _writeIndex = 0;
	const GRAPH_CAPACITY = 1001; // _maxGraphCount caps at 1000, +1 for the overflow slot

	// Whether food speciation is enabled (2 types vs 1 type)
	let _foodSpeciationEnabled = false;

	this.initialize = function() {
		_currentCount = 0;
		_maxGraphCount = 20;
		_writeIndex = 0;
		_foodSpeciationEnabled = false;

		// Pre-allocate to maximum capacity — avoids reallocation during warmup
		_time = new Array(GRAPH_CAPACITY);
		_numSwimbots = new Array(GRAPH_CAPACITY);
		_numGreenPref = new Array(GRAPH_CAPACITY);
		_numBluePref = new Array(GRAPH_CAPACITY);
		_numFoodBits0 = new Array(GRAPH_CAPACITY);
		_numFoodBits1 = new Array(GRAPH_CAPACITY);

		_graphCanvas = $('graphCanvas');
		_graphContext = _graphCanvas.getContext('2d');
	}

	/**
	 * Update graph data.
	 * @param {number} time - current time step
	 * @param {number} numSwimbots - total alive swimbots
	 * @param {number} numGreenPref - swimbots preferring green food
	 * @param {number} numBluePref - swimbots preferring blue food
	 * @param {number} numFoodBits0 - green food bits alive
	 * @param {number} numFoodBits1 - blue food bits alive
	 * @param {boolean} foodSpeciationEnabled - whether food speciation is active
	 */
	this.update = function(time, numSwimbots, numGreenPref, numBluePref, numFoodBits0, numFoodBits1, foodSpeciationEnabled) {
		if (_maxGraphCount < 1000) {
			_maxGraphCount++;
		}

		_foodSpeciationEnabled = !!foodSpeciationEnabled;

		// Write at the current circular index
		_time[_writeIndex] = time;
		_numSwimbots[_writeIndex] = numSwimbots;
		_numGreenPref[_writeIndex] = numGreenPref;
		_numBluePref[_writeIndex] = numBluePref;
		_numFoodBits0[_writeIndex] = numFoodBits0;
		_numFoodBits1[_writeIndex] = numFoodBits1;

		// Advance the write pointer (circular)
		_writeIndex = (_writeIndex + 1) % GRAPH_CAPACITY;

		// Track how many entries we have filled
		if (_currentCount < _maxGraphCount) {
			_currentCount++;
		}
	}

	this.clear = function() {
		_graphContext.clearRect(0, 0, _graphCanvas.width, _graphCanvas.height);
	}

	this.render = function() {
		let graphCanvas = _graphContext;

		_width = _graphCanvas.width;
		_height = _graphCanvas.height;

		_left = 0;
		_top = 0;

		_bottom = _top + _height;
		_right = _left + _width;

		_graphLeft = _left + GRAPH_LEFT_MARGIN;
		_graphRight = _right - GRAPH_RIGHT_MARGIN;
		_graphBottom = _bottom - GRAPH_BOTTOM_MARGIN;
		_graphTop = _top + GRAPH_TOP_MARGIN;
		_graphWidth = _graphRight - _graphLeft;
		_graphHeight = _graphBottom - _graphTop;

		_level1000 = _graphBottom - (1000 * RECIPROCAL_OF_MAX_POP) * _graphHeight;
		_level0500 = _graphBottom - (500 * RECIPROCAL_OF_MAX_POP) * _graphHeight;
		_level0000 = _graphBottom - (0 * RECIPROCAL_OF_MAX_POP) * _graphHeight;

		// draw the box
		graphCanvas.lineWidth = 1;
		graphCanvas.fillStyle = "rgb(240, 238, 230)";
		graphCanvas.strokeStyle = "rgb(0, 0, 0)";
		graphCanvas.fillRect(_graphLeft, _graphTop, _graphWidth, _graphHeight);
		graphCanvas.strokeRect(_graphLeft, _graphTop, _graphWidth, _graphHeight);

		// render the horizontal lines
		graphCanvas.lineWidth = 1.0;
		graphCanvas.strokeStyle = "rgba(100, 100, 100, 0.5)";
		graphCanvas.beginPath();
		graphCanvas.moveTo(_graphLeft, _level1000);
		graphCanvas.lineTo(_graphRight, _level1000);
		graphCanvas.stroke();
		graphCanvas.closePath();

		graphCanvas.beginPath();
		graphCanvas.moveTo(_graphLeft, _level0500);
		graphCanvas.lineTo(_graphRight, _level0500);
		graphCanvas.stroke();
		graphCanvas.closePath();

		// render the actual graph
		this.renderPopulationLines();

		// show legend
		if (_currentCount > 1) {
			let left = _graphLeft + 30;

			graphCanvas.clearRect(_graphLeft, _bottom - GRAPH_BOTTOM_MARGIN, _graphWidth, GRAPH_BOTTOM_MARGIN);

			graphCanvas.font = "20px Times";
			graphCanvas.fillStyle = "rgb(100, 100, 100)";

			graphCanvas.fillText("0", left, _level0000 - 8);
			graphCanvas.fillText("500", left, _level0500 + 8);
			graphCanvas.fillText("1000", left, _level1000 + 18);

			if (_foodSpeciationEnabled) {
				// --- Food speciation ON: 4 entries ---
				let greenPrefY = _bottom - GRAPH_BOTTOM_MARGIN + 50;
				let bluePrefY = _bottom - GRAPH_BOTTOM_MARGIN + 67;
				let foodGreenY = _bottom - GRAPH_BOTTOM_MARGIN + 84;
				let foodBlueY = _bottom - GRAPH_BOTTOM_MARGIN + 101;

				// legend — green pref swimbots (magenta)
				graphCanvas.lineWidth = 2;
				graphCanvas.strokeStyle = GRAPH_GREEN_PREF_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(left + 140, greenPrefY);
				graphCanvas.lineTo(left + 250, greenPrefY);
				graphCanvas.stroke();
				graphCanvas.closePath();

				// legend — blue pref swimbots (dark blue)
				graphCanvas.lineWidth = 2;
				graphCanvas.strokeStyle = GRAPH_BLUE_PREF_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(left + 140, bluePrefY);
				graphCanvas.lineTo(left + 250, bluePrefY);
				graphCanvas.stroke();
				graphCanvas.closePath();

				// legend — green food bits (green)
				graphCanvas.lineWidth = 2;
				graphCanvas.strokeStyle = GRAPH_FOODBIT_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(left + 140, foodGreenY);
				graphCanvas.lineTo(left + 250, foodGreenY);
				graphCanvas.stroke();
				graphCanvas.closePath();

				// legend — blue food bits (blue)
				graphCanvas.lineWidth = 2;
				graphCanvas.strokeStyle = GRAPH_FOODBIT_1_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(left + 140, foodBlueY);
				graphCanvas.lineTo(left + 250, foodBlueY);
				graphCanvas.stroke();
				graphCanvas.closePath();
			} else {
				// --- Food speciation OFF: 2 entries ---
				let swimbotY = _bottom - GRAPH_BOTTOM_MARGIN + 50;
				let foodbitY = _bottom - GRAPH_BOTTOM_MARGIN + 67;

				// legend — swimbots (orange)
				graphCanvas.lineWidth = 2;
				graphCanvas.strokeStyle = GRAPH_SWIMBOT_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(left + 140, swimbotY);
				graphCanvas.lineTo(left + 250, swimbotY);
				graphCanvas.stroke();
				graphCanvas.closePath();

				// legend — food bits (green)
				graphCanvas.lineWidth = 2;
				graphCanvas.strokeStyle = GRAPH_FOODBIT_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(left + 140, foodbitY);
				graphCanvas.lineTo(left + 250, foodbitY);
				graphCanvas.stroke();
				graphCanvas.closePath();
			}
		}
	}

	// Helper: map a logical (oldest-first) index to the circular buffer slot
	function _idx(logical) {
		return (_writeIndex - _currentCount + logical + GRAPH_CAPACITY) % GRAPH_CAPACITY;
	}

	this.renderPopulationLines = function() {
		let graphCanvas = _graphContext;

		let xInc = _width / (_maxGraphCount);

		graphCanvas.lineWidth = 1.0;

		for (let g = 1; g < _currentCount; g++) {
			let xFraction = (g - 1) / _maxGraphCount;
			let x1 = _graphLeft + xFraction * _graphWidth;
			let x2 = x1 + xInc;

			// Resolve circular indices for previous and current data points
			let iPrev = _idx(g - 1);
			let iCurr = _idx(g);

			let swimbotY2 = _graphBottom - (_numSwimbots[iCurr] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			let greenPrefY2 = _graphBottom - (_numGreenPref[iCurr] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			let bluePrefY2 = _graphBottom - (_numBluePref[iCurr] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			let food0Y2 = _graphBottom - (_numFoodBits0[iCurr] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			let food1Y2 = _graphBottom - (_numFoodBits1[iCurr] * RECIPROCAL_OF_MAX_POP) * _graphHeight;

			if (_foodSpeciationEnabled) {
				// --- Food speciation ON: green pref, blue pref, food bits green, food bits blue ---

				if (greenPrefY2 > _graphBottom - _graphHeight) {
					let greenPrefY1 = _graphBottom - (_numGreenPref[iPrev] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					graphCanvas.strokeStyle = GRAPH_GREEN_PREF_COLOR;
					graphCanvas.beginPath();
					graphCanvas.moveTo(x1, greenPrefY1);
					graphCanvas.lineTo(x2, greenPrefY2);
					graphCanvas.stroke();
					graphCanvas.closePath();
				}

				if (bluePrefY2 > _graphBottom - _graphHeight) {
					let bluePrefY1 = _graphBottom - (_numBluePref[iPrev] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					graphCanvas.strokeStyle = GRAPH_BLUE_PREF_COLOR;
					graphCanvas.beginPath();
					graphCanvas.moveTo(x1, bluePrefY1);
					graphCanvas.lineTo(x2, bluePrefY2);
					graphCanvas.stroke();
					graphCanvas.closePath();
				}

				if (food0Y2 > _graphBottom - _graphHeight) {
					let food0Y1 = _graphBottom - (_numFoodBits0[iPrev] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					graphCanvas.strokeStyle = GRAPH_FOODBIT_COLOR;
					graphCanvas.beginPath();
					graphCanvas.moveTo(x1, food0Y1);
					graphCanvas.lineTo(x2, food0Y2);
					graphCanvas.stroke();
					graphCanvas.closePath();
				}

				if (food1Y2 > _graphBottom - _graphHeight) {
					let food1Y1 = _graphBottom - (_numFoodBits1[iPrev] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					graphCanvas.strokeStyle = GRAPH_FOODBIT_1_COLOR;
					graphCanvas.beginPath();
					graphCanvas.moveTo(x1, food1Y1);
					graphCanvas.lineTo(x2, food1Y2);
					graphCanvas.stroke();
					graphCanvas.closePath();
				}
			} else {
				// --- Food speciation OFF: swimbots (total), food bits (total green) ---

				if (swimbotY2 > _graphBottom - _graphHeight) {
					let swimbotY1 = _graphBottom - (_numSwimbots[iPrev] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					graphCanvas.strokeStyle = GRAPH_SWIMBOT_COLOR;
					graphCanvas.beginPath();
					graphCanvas.moveTo(x1, swimbotY1);
					graphCanvas.lineTo(x2, swimbotY2);
					graphCanvas.stroke();
					graphCanvas.closePath();
				}

				if (food0Y2 > _graphBottom - _graphHeight) {
					let food0Y1 = _graphBottom - (_numFoodBits0[iPrev] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					graphCanvas.strokeStyle = GRAPH_FOODBIT_COLOR;
					graphCanvas.beginPath();
					graphCanvas.moveTo(x1, food0Y1);
					graphCanvas.lineTo(x2, food0Y2);
					graphCanvas.stroke();
					graphCanvas.closePath();
				}
			}
		}
	}
}
