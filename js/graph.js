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

	// Samples per tick: how many buffer entries to write per clock tick
	let _samplesPerTick = 1;

	// Previous values for interpolation when writing multiple samples per tick
	let _prevClock = 0;
	let _prevNumSwimbots = 0;
	let _prevNumGreenPref = 0;
	let _prevNumBluePref = 0;
	let _prevNumFoodBits0 = 0;
	let _prevNumFoodBits1 = 0;

	// Latest values for legend rendering
	let _latestClock = 0;
	let _latestNumSwimbots = 0;
	let _latestNumGreenPref = 0;
	let _latestNumBluePref = 0;
	let _latestNumFoodBits0 = 0;
	let _latestNumFoodBits1 = 0;

	this.initialize = function() {
		_currentCount = 0;
		_maxGraphCount = 20;
		_writeIndex = 0;
		_foodSpeciationEnabled = false;
		_samplesPerTick = 1;
		_prevClock = 0;
		_prevNumSwimbots = 0;
		_prevNumGreenPref = 0;
		_prevNumBluePref = 0;
		_prevNumFoodBits0 = 0;
		_prevNumFoodBits1 = 0;

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

	this.setSamplesPerTick = function(n) {
		_samplesPerTick = Math.max(1, Math.min(50, n));
	}

	/**
	 * Update graph data.
	 * Writes _samplesPerTick interpolated entries per call.
	 * No-op if clock has not advanced (simulation frozen).
	 * @param {number} time - current time step
	 * @param {number} numSwimbots - total alive swimbots
	 * @param {number} numGreenPref - swimbots preferring green food
	 * @param {number} numBluePref - swimbots preferring blue food
	 * @param {number} numFoodBits0 - green food bits alive
	 * @param {number} numFoodBits1 - blue food bits alive
	 * @param {boolean} foodSpeciationEnabled - whether food speciation is active
	 */
	this.update = function(time, numSwimbots, numGreenPref, numBluePref, numFoodBits0, numFoodBits1, foodSpeciationEnabled) {
		_foodSpeciationEnabled = !!foodSpeciationEnabled;

		// Skip if clock has not advanced (simulation frozen or paused)
		if (_currentCount > 0 && time <= _prevClock) return;

		if (_maxGraphCount < 1000) {
			_maxGraphCount++;
		}

		var totalSamples = _samplesPerTick;
		if (totalSamples < 1) totalSamples = 1;

		for (var s = 0; s < totalSamples; s++) {
			// When totalSamples == 1, write the current values directly (original behavior).
			// When totalSamples > 1, interpolate evenly from previous to current,
			// with the last sample landing exactly on the current values.
			var t = totalSamples > 1 ? s / (totalSamples - 1) : 1;

			var iTime = _prevClock + Math.round((time - _prevClock) * t);
			var iSwim = _prevNumSwimbots + (numSwimbots - _prevNumSwimbots) * t;
			var iGreen = _prevNumGreenPref + (numGreenPref - _prevNumGreenPref) * t;
			var iBlue = _prevNumBluePref + (numBluePref - _prevNumBluePref) * t;
			var iFood0 = _prevNumFoodBits0 + (numFoodBits0 - _prevNumFoodBits0) * t;
			var iFood1 = _prevNumFoodBits1 + (numFoodBits1 - _prevNumFoodBits1) * t;

			// Write at the current circular index
			_time[_writeIndex] = iTime;
			_numSwimbots[_writeIndex] = iSwim;
			_numGreenPref[_writeIndex] = iGreen;
			_numBluePref[_writeIndex] = iBlue;
			_numFoodBits0[_writeIndex] = iFood0;
			_numFoodBits1[_writeIndex] = iFood1;

			// Advance the write pointer (circular)
			_writeIndex = (_writeIndex + 1) % GRAPH_CAPACITY;

			// Track how many entries we have filled
			if (_currentCount < _maxGraphCount) {
				_currentCount++;
			}
		}

		// Update previous values for next interpolation
		_prevClock = time;
		_prevNumSwimbots = numSwimbots;
		_prevNumGreenPref = numGreenPref;
		_prevNumBluePref = numBluePref;
		_prevNumFoodBits0 = numFoodBits0;
		_prevNumFoodBits1 = numFoodBits1;

		// Store latest values for legend
		_latestClock = time;
		_latestNumSwimbots = numSwimbots;
		_latestNumGreenPref = numGreenPref;
		_latestNumBluePref = numBluePref;
		_latestNumFoodBits0 = numFoodBits0;
		_latestNumFoodBits1 = numFoodBits1;
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

		// show legend + X-axis labels
		if (_currentCount > 1) {
			let left = _graphLeft + 30;

			graphCanvas.clearRect(_graphLeft, _bottom - GRAPH_BOTTOM_MARGIN, _graphWidth, GRAPH_BOTTOM_MARGIN);

			graphCanvas.font = "20px Times";
			graphCanvas.fillStyle = "rgb(100, 100, 100)";

			graphCanvas.fillText("0", left, _level0000 - 8);
			graphCanvas.fillText("500", left, _level0500 + 8);
			graphCanvas.fillText("1000", left, _level1000 + 18);

			// X-axis clock labels (bottom of the graph area)
			if (_currentCount >= 2) {
				graphCanvas.font = "12px Arial";
				graphCanvas.fillStyle = "rgb(80, 80, 80)";

				var startIdx = _idx(0);
				var endIdx = _idx(_currentCount - 1);
				var startClock = _time[startIdx] || 0;
				var endClock = _time[endIdx] || 0;

				graphCanvas.fillText(
					Math.floor(startClock).toString(),
					_graphLeft + 4,
					_graphBottom + 14
				);
				graphCanvas.fillText(
					Math.floor(endClock).toString(),
					_graphRight - 40,
					_graphBottom + 14
				);
			}

			// Legend: colored line + text label, aligned on the canvas
			let legendX1 = left + 10;
			let legendX2 = left + 130;
			let legendTextX = legendX2 + 10;

			if (_foodSpeciationEnabled) {
				// --- Food speciation ON: 4 entries ---
				let y0 = _bottom - GRAPH_BOTTOM_MARGIN + 50;
				let y1 = _bottom - GRAPH_BOTTOM_MARGIN + 70;
				let y2 = _bottom - GRAPH_BOTTOM_MARGIN + 90;
				let y3 = _bottom - GRAPH_BOTTOM_MARGIN + 110;

				graphCanvas.lineWidth = 2;

				// green pref swimbots (magenta)
				graphCanvas.strokeStyle = GRAPH_GREEN_PREF_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(legendX1, y0);
				graphCanvas.lineTo(legendX2, y0);
				graphCanvas.stroke();
				graphCanvas.closePath();
				graphCanvas.fillStyle = GRAPH_GREEN_PREF_COLOR;
				graphCanvas.font = "12px Arial";
				graphCanvas.fillText("green pref: " + Math.round(_latestNumGreenPref), legendTextX, y0 + 5);

				// blue pref swimbots (dark blue)
				graphCanvas.strokeStyle = GRAPH_BLUE_PREF_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(legendX1, y1);
				graphCanvas.lineTo(legendX2, y1);
				graphCanvas.stroke();
				graphCanvas.closePath();
				graphCanvas.fillStyle = GRAPH_BLUE_PREF_COLOR;
				graphCanvas.fillText("blue pref: " + Math.round(_latestNumBluePref), legendTextX, y1 + 5);

				// green food bits (green)
				graphCanvas.strokeStyle = GRAPH_FOODBIT_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(legendX1, y2);
				graphCanvas.lineTo(legendX2, y2);
				graphCanvas.stroke();
				graphCanvas.closePath();
				graphCanvas.fillStyle = GRAPH_FOODBIT_COLOR;
				graphCanvas.fillText("food green: " + Math.round(_latestNumFoodBits0), legendTextX, y2 + 5);

				// blue food bits (blue)
				graphCanvas.strokeStyle = GRAPH_FOODBIT_1_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(legendX1, y3);
				graphCanvas.lineTo(legendX2, y3);
				graphCanvas.stroke();
				graphCanvas.closePath();
				graphCanvas.fillStyle = GRAPH_FOODBIT_1_COLOR;
				graphCanvas.fillText("food blue: " + Math.round(_latestNumFoodBits1), legendTextX, y3 + 5);
			} else {
				// --- Food speciation OFF: 2 entries ---
				let y0 = _bottom - GRAPH_BOTTOM_MARGIN + 50;
				let y1 = _bottom - GRAPH_BOTTOM_MARGIN + 70;

				graphCanvas.lineWidth = 2;

				// swimbots (orange)
				graphCanvas.strokeStyle = GRAPH_SWIMBOT_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(legendX1, y0);
				graphCanvas.lineTo(legendX2, y0);
				graphCanvas.stroke();
				graphCanvas.closePath();
				graphCanvas.fillStyle = GRAPH_SWIMBOT_COLOR;
				graphCanvas.font = "12px Arial";
				graphCanvas.fillText("swimbots: " + Math.round(_latestNumSwimbots), legendTextX, y0 + 5);

				// food bits (green)
				graphCanvas.strokeStyle = GRAPH_FOODBIT_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(legendX1, y1);
				graphCanvas.lineTo(legendX2, y1);
				graphCanvas.stroke();
				graphCanvas.closePath();
				graphCanvas.fillStyle = GRAPH_FOODBIT_COLOR;
				graphCanvas.fillText("food bits: " + Math.round(_latestNumFoodBits0), legendTextX, y1 + 5);
			}

			// Time step label
			graphCanvas.fillStyle = "rgb(80, 80, 80)";
			graphCanvas.font = "12px Arial";
			graphCanvas.fillText("time step: " + Math.floor(_latestClock), _graphLeft + 4, _bottom - GRAPH_BOTTOM_MARGIN + 20);
		}
	}

	// Helper: map a logical (oldest-first) index to the circular buffer slot
	function _idx(logical) {
		return (_writeIndex - _currentCount + logical + GRAPH_CAPACITY) % GRAPH_CAPACITY;
	}

	this.renderPopulationLines = function() {
		let graphCanvas = _graphContext;

		if (_currentCount < 2) return;

		graphCanvas.lineWidth = 1.0;

		// Compute clock range of visible data for X-axis scaling
		var startClock = _time[_idx(0)];
		var endClock = _time[_idx(_currentCount - 1)];
		var clockRange = endClock - startClock;
		if (clockRange < 1) clockRange = 1;

		for (var g = 1; g < _currentCount; g++) {
			// Resolve circular indices for previous and current data points
			let iPrev = _idx(g - 1);
			let iCurr = _idx(g);

			// Position X based on actual clock values, not index
			let clockPrev = _time[iPrev];
			let clockCurr = _time[iCurr];
			let x1 = _graphLeft + ((clockPrev - startClock) / clockRange) * _graphWidth;
			let x2 = _graphLeft + ((clockCurr - startClock) / clockRange) * _graphWidth;

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
