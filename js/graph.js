"use strict";

function Graph() {
	const GRAPH_LEFT_MARGIN = 20;
	const GRAPH_RIGHT_MARGIN = 20;
	const GRAPH_BOTTOM_MARGIN = 160;
	const GRAPH_TOP_MARGIN = 40;
	const GRAPH_MAX_POPULATION = 2000;
	const RECIPROCAL_OF_MAX_POP = 1 / GRAPH_MAX_POPULATION;

	/**
	 * Maximum buffer size before compression.
	 * Starts high (100000), halves each compression pass.
	 */
	const CAPACITY = 100000;

	// Colors
	const GRAPH_SWIMBOT_COLOR = "rgb(200, 60,  20)";
	const GRAPH_GREEN_PREF_COLOR = "rgb(200,  20, 200)";
	const GRAPH_BLUE_PREF_COLOR = "rgb( 60,  60, 200)";
	const GRAPH_FOODBIT_COLOR = "rgb(20,  100,  20)";
	const GRAPH_FOODBIT_1_COLOR = "rgb(20,  100, 200)";

	// Linear buffer of {clock, swim, green, blue, food0, food1}
	// Oldest entry at index 0, newest at index _data.length - 1.
	let _data = [];

	// Whether food speciation is enabled
	let _foodSpeciationEnabled = false;

	// Samples per call
	let _samplesPerTick = 1;

	// Previous values for interpolation
	let _prevClock = 0;
	let _prevSwim = 0;
	let _prevGreen = 0;
	let _prevBlue = 0;
	let _prevFood0 = 0;
	let _prevFood1 = 0;

	// Latest values for legend
	let _latestClock = 0;
	let _latestSwim = 0;
	let _latestGreen = 0;
	let _latestBlue = 0;
	let _latestFood0 = 0;
	let _latestFood1 = 0;

	// Layout (computed in render)
	let _width, _height, _graphLeft, _graphRight, _graphBottom, _graphTop,
		_graphWidth, _graphHeight, _level1000, _level0500;

	let _graphContext = null;
	let _graphCanvas = null;

	this.initialize = function() {
		_data = [];
		_foodSpeciationEnabled = false;
		_samplesPerTick = 1;
		_prevClock = 0;
		_prevSwim = 0;
		_prevGreen = 0;
		_prevBlue = 0;
		_prevFood0 = 0;
		_prevFood1 = 0;

		_graphCanvas = $('graphCanvas');
		_graphContext = _graphCanvas.getContext('2d');
	};

	this.setSamplesPerTick = function(n) {
		_samplesPerTick = Math.max(1, Math.min(50, n));
	};

	/**
	 * Update graph data.
	 * Writes _samplesPerTick interpolated entries per call.
	 * No-op if clock has not advanced (simulation frozen).
	 */
	this.update = function(time, numSwimbots, numGreenPref, numBluePref, numFoodBits0, numFoodBits1, foodSpeciationEnabled) {
		_foodSpeciationEnabled = !!foodSpeciationEnabled;

		// Skip if clock has not advanced
		if (_data.length > 0 && time <= _prevClock) return;

		var totalSamples = _samplesPerTick;
		if (totalSamples < 1) totalSamples = 1;

		for (var s = 0; s < totalSamples; s++) {
			// totalSamples == 1 → write current values directly.
			// totalSamples > 1 → interpolate evenly (last sample = current).
			var t = totalSamples > 1 ? s / (totalSamples - 1) : 1;

			_data.push({
				clock: _prevClock + Math.round((time - _prevClock) * t),
				swim: _prevSwim + (numSwimbots - _prevSwim) * t,
				green: _prevGreen + (numGreenPref - _prevGreen) * t,
				blue: _prevBlue + (numBluePref - _prevBlue) * t,
				food0: _prevFood0 + (numFoodBits0 - _prevFood0) * t,
				food1: _prevFood1 + (numFoodBits1 - _prevFood1) * t
			});
		}

		// Compress by averaging pairs if over capacity
		var cap = CAPACITY;
		if (_data.length > cap) {
			var compressed = [];
			var i = 0;
			while (i + 1 < _data.length) {
				var a = _data[i];
				var b = _data[i + 1];
				compressed.push({
					clock: (a.clock + b.clock) / 2,
					swim: (a.swim + b.swim) / 2,
					green: (a.green + b.green) / 2,
					blue: (a.blue + b.blue) / 2,
					food0: (a.food0 + b.food0) / 2,
					food1: (a.food1 + b.food1) / 2
				});
				i += 2;
			}
			// If odd number, keep the last entry as-is
			if (i < _data.length) {
				compressed.push(_data[i]);
			}
			_data = compressed;
		}

		// Update previous values
		_prevClock = time;
		_prevSwim = numSwimbots;
		_prevGreen = numGreenPref;
		_prevBlue = numBluePref;
		_prevFood0 = numFoodBits0;
		_prevFood1 = numFoodBits1;

		// Store latest for legend
		_latestClock = time;
		_latestSwim = numSwimbots;
		_latestGreen = numGreenPref;
		_latestBlue = numBluePref;
		_latestFood0 = numFoodBits0;
		_latestFood1 = numFoodBits1;
	};

	this.clear = function() {
		_graphContext.clearRect(0, 0, _graphCanvas.width, _graphCanvas.height);
	};

	this.render = function() {
		var ctx = _graphContext;

		_width = _graphCanvas.width;
		_height = _graphCanvas.height;

		_graphLeft = GRAPH_LEFT_MARGIN;
		_graphRight = _width - GRAPH_RIGHT_MARGIN;
		_graphBottom = _height - GRAPH_BOTTOM_MARGIN;
		_graphTop = GRAPH_TOP_MARGIN;
		_graphWidth = _graphRight - _graphLeft;
		_graphHeight = _graphBottom - _graphTop;

		_level1000 = _graphBottom - (1000 * RECIPROCAL_OF_MAX_POP) * _graphHeight;
		_level0500 = _graphBottom - (500 * RECIPROCAL_OF_MAX_POP) * _graphHeight;

		// Draw box
		ctx.lineWidth = 1;
		ctx.fillStyle = "rgb(240, 238, 230)";
		ctx.strokeStyle = "rgb(0, 0, 0)";
		ctx.fillRect(_graphLeft, _graphTop, _graphWidth, _graphHeight);
		ctx.strokeRect(_graphLeft, _graphTop, _graphWidth, _graphHeight);

		// Horizontal grid lines
		ctx.lineWidth = 1.0;
		ctx.strokeStyle = "rgba(100, 100, 100, 0.5)";
		ctx.beginPath();
		ctx.moveTo(_graphLeft, _level1000);
		ctx.lineTo(_graphRight, _level1000);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(_graphLeft, _level0500);
		ctx.lineTo(_graphRight, _level0500);
		ctx.stroke();

		// Population lines
		this._renderPopulationLines();

		// Legend + labels
		if (_data.length >= 2) {
			var left = _graphLeft;// + 30;

			ctx.clearRect(_graphLeft, _graphBottom, _graphWidth, GRAPH_BOTTOM_MARGIN);

			ctx.font = "20px Times";
			ctx.fillStyle = "rgb(100, 100, 100)";
			ctx.fillText("0", left, _graphBottom - 8);
			ctx.fillText("500", left, _level0500 + 8);
			ctx.fillText("1000", left, _level1000 + 18);

			// Legend: colored line + text label
			var lx1 = left + 10;
			var lx2 = left + 130;
			var ltx = lx2 + 10;

			if (_foodSpeciationEnabled) {
				var y0 = _graphBottom + 50;
				var y1 = _graphBottom + 70;
				var y2 = _graphBottom + 90;
				var y3 = _graphBottom + 110;

				ctx.lineWidth = 2;
				ctx.font = "12px Arial";

				ctx.strokeStyle = GRAPH_GREEN_PREF_COLOR;
				ctx.beginPath(); ctx.moveTo(lx1, y0); ctx.lineTo(lx2, y0); ctx.stroke();
				ctx.fillStyle = GRAPH_GREEN_PREF_COLOR;
				ctx.fillText("green pref: " + Math.round(_latestGreen), ltx, y0 + 5);

				ctx.strokeStyle = GRAPH_BLUE_PREF_COLOR;
				ctx.beginPath(); ctx.moveTo(lx1, y1); ctx.lineTo(lx2, y1); ctx.stroke();
				ctx.fillStyle = GRAPH_BLUE_PREF_COLOR;
				ctx.fillText("blue pref: " + Math.round(_latestBlue), ltx, y1 + 5);

				ctx.strokeStyle = GRAPH_FOODBIT_COLOR;
				ctx.beginPath(); ctx.moveTo(lx1, y2); ctx.lineTo(lx2, y2); ctx.stroke();
				ctx.fillStyle = GRAPH_FOODBIT_COLOR;
				ctx.fillText("food green: " + Math.round(_latestFood0), ltx, y2 + 5);

				ctx.strokeStyle = GRAPH_FOODBIT_1_COLOR;
				ctx.beginPath(); ctx.moveTo(lx1, y3); ctx.lineTo(lx2, y3); ctx.stroke();
				ctx.fillStyle = GRAPH_FOODBIT_1_COLOR;
				ctx.fillText("food blue: " + Math.round(_latestFood1), ltx, y3 + 5);
			} else {
				var y0 = _graphBottom + 50;
				var y1 = _graphBottom + 70;

				ctx.lineWidth = 2;
				ctx.font = "12px Arial";

				ctx.strokeStyle = GRAPH_SWIMBOT_COLOR;
				ctx.beginPath(); ctx.moveTo(lx1, y0); ctx.lineTo(lx2, y0); ctx.stroke();
				ctx.fillStyle = GRAPH_SWIMBOT_COLOR;
				ctx.fillText("swimbots: " + Math.round(_latestSwim), ltx, y0 + 5);

				ctx.strokeStyle = GRAPH_FOODBIT_COLOR;
				ctx.beginPath(); ctx.moveTo(lx1, y1); ctx.lineTo(lx2, y1); ctx.stroke();
				ctx.fillStyle = GRAPH_FOODBIT_COLOR;
				ctx.fillText("food bits: " + Math.round(_latestFood0), ltx, y1 + 5);
			}

			// Time step label
			ctx.fillStyle = "rgb(80, 80, 80)";
			ctx.font = "12px Arial";
			ctx.fillText("time step: " + Math.floor(_latestClock), _graphLeft + 4, _graphBottom + 20);
		}
	};

	/**
	 * Render the population data series.
	 */
	this._renderPopulationLines = function() {
		var ctx = _graphContext;
		if (_data.length < 2) return;

		var startClock = _data[0].clock;
		var endClock = _data[_data.length - 1].clock;
		var clockRange = endClock - startClock;
		if (clockRange < 1) clockRange = 1;

		ctx.lineWidth = 1.0;

		for (var i = 1; i < _data.length; i++) {
			var prev = _data[i - 1];
			var curr = _data[i];

			var x1 = _graphLeft + ((prev.clock - startClock) / clockRange) * _graphWidth;
			var x2 = _graphLeft + ((curr.clock - startClock) / clockRange) * _graphWidth;

			var swimbotY2 = _graphBottom - (curr.swim * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			var greenPrefY2 = _graphBottom - (curr.green * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			var bluePrefY2 = _graphBottom - (curr.blue * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			var food0Y2 = _graphBottom - (curr.food0 * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			var food1Y2 = _graphBottom - (curr.food1 * RECIPROCAL_OF_MAX_POP) * _graphHeight;

			if (_foodSpeciationEnabled) {
				if (greenPrefY2 > _graphTop) {
					var y1 = _graphBottom - (prev.green * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					ctx.strokeStyle = GRAPH_GREEN_PREF_COLOR;
					ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, greenPrefY2); ctx.stroke();
				}
				if (bluePrefY2 > _graphTop) {
					var y1 = _graphBottom - (prev.blue * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					ctx.strokeStyle = GRAPH_BLUE_PREF_COLOR;
					ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, bluePrefY2); ctx.stroke();
				}
				if (food0Y2 > _graphTop) {
					var y1 = _graphBottom - (prev.food0 * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					ctx.strokeStyle = GRAPH_FOODBIT_COLOR;
					ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, food0Y2); ctx.stroke();
				}
				if (food1Y2 > _graphTop) {
					var y1 = _graphBottom - (prev.food1 * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					ctx.strokeStyle = GRAPH_FOODBIT_1_COLOR;
					ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, food1Y2); ctx.stroke();
				}
			} else {
				if (swimbotY2 > _graphTop) {
					var y1 = _graphBottom - (prev.swim * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					ctx.strokeStyle = GRAPH_SWIMBOT_COLOR;
					ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, swimbotY2); ctx.stroke();
				}
				if (food0Y2 > _graphTop) {
					var y1 = _graphBottom - (prev.food0 * RECIPROCAL_OF_MAX_POP) * _graphHeight;
					ctx.strokeStyle = GRAPH_FOODBIT_COLOR;
					ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, food0Y2); ctx.stroke();
				}
			}
		}
	};
}
