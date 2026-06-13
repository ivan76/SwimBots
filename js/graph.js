"use strict";

function Graph() {
	const GRAPH_LEFT_MARGIN = 20;
	const GRAPH_RIGHT_MARGIN = 20;
	const GRAPH_BOTTOM_MARGIN = 160;
	const GRAPH_TOP_MARGIN = 40;
	const GRAPH_MAX_POPULATION = 2000;
	const RECIPROCAL_OF_MAX_POP = 1 / GRAPH_MAX_POPULATION;
	const GRAPH_FOODBIT_COLOR = "rgb(20,  100,  20)";
	const GRAPH_FOODBIT_1_COLOR = "rgb(20,  100, 200)";
	const GRAPH_SWIMBOT_COLOR = "rgb(200, 60,  20)";
	//const GRAPH_SWIMBOT_1_COLOR = "rgb(200,  20, 200)";

	//let _maxPopulationValue = 0;
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
	let _time = [];
	let _numSwimbots = [];
	//let _numSwimbots1   = []; 
	let _numFoodBits = [];
	let _numFoodBits1 = [];
	let _graphContext = null;
	let _graphCanvas = null;
	let _writeIndex = 0;
	const GRAPH_CAPACITY = 1001; // _maxGraphCount caps at 1000, +1 for the overflow slot

	this.initialize = function() {
		_currentCount = 0;
		_maxGraphCount = 20;
		_writeIndex = 0;

		// Pre-allocate to maximum capacity — avoids reallocation during warmup
		_time = new Array(GRAPH_CAPACITY);
		_numSwimbots = new Array(GRAPH_CAPACITY);
		_numFoodBits = new Array(GRAPH_CAPACITY);
		_numFoodBits1 = new Array(GRAPH_CAPACITY);

		_graphCanvas = document.getElementById('graphCanvas');
		_graphContext = _graphCanvas.getContext('2d');
	}

	this.update = function(time, numSwimbots, numFoodBits, numFoodBits1) {
		if (_maxGraphCount < 1000) {
			_maxGraphCount++;
		}

		// Write at the current circular index
		_time[_writeIndex] = time;
		_numSwimbots[_writeIndex] = numSwimbots;
		_numFoodBits[_writeIndex] = numFoodBits;
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

		// show data
		if (_currentCount > 1) {
			//let timeStepString = _time       [ _currentCount -1 ].toString();
			//let swimbotString  = _numSwimbots[ _currentCount -1 ].toString();
			//let foodbitString  = _numFoodBits[ _currentCount -1 ].toString();
			//let foodbit1String = _numFoodBits1[ _currentCount -1 ].toString();

			let timeStep = _bottom - GRAPH_BOTTOM_MARGIN + 30;
			let swimbotY = _bottom - GRAPH_BOTTOM_MARGIN + 50;
			//let swimbot1  = _bottom - GRAPH_BOTTOM_MARGIN +  70;
			let foodbitY = _bottom - GRAPH_BOTTOM_MARGIN + 67;
			let foodbit1Y = _bottom - GRAPH_BOTTOM_MARGIN + 84;

			let left = _graphLeft + 30;

			graphCanvas.clearRect(_graphLeft, _bottom - GRAPH_BOTTOM_MARGIN, _graphWidth, GRAPH_BOTTOM_MARGIN);

			graphCanvas.font = "20px Times";
			graphCanvas.fillStyle = "rgb(100, 100, 100)";

			graphCanvas.fillText("0", left, _level0000 - 8);
			graphCanvas.fillText("500", left, _level0500 + 8);
			graphCanvas.fillText("1000", left, _level1000 + 18);

			graphCanvas.lineWidth = 2;
			graphCanvas.strokeStyle = GRAPH_FOODBIT_COLOR;
			graphCanvas.beginPath();
			graphCanvas.moveTo(left + 140, foodbitY);
			graphCanvas.lineTo(left + 250, foodbitY);
			graphCanvas.stroke();
			graphCanvas.closePath();

			graphCanvas.lineWidth = 2;
			graphCanvas.strokeStyle = GRAPH_FOODBIT_1_COLOR;
			graphCanvas.beginPath();
			graphCanvas.moveTo(left + 140, foodbit1Y);
			graphCanvas.lineTo(left + 250, foodbit1Y);
			graphCanvas.stroke();
			graphCanvas.closePath();

			graphCanvas.lineWidth = 2;
			graphCanvas.strokeStyle = GRAPH_SWIMBOT_COLOR;
			graphCanvas.beginPath();
			graphCanvas.moveTo(left + 140, swimbotY);
			graphCanvas.lineTo(left + 250, swimbotY);
			graphCanvas.stroke();
			graphCanvas.closePath();

			/*
			graphCanvas.lineWidth = 2; 
			graphCanvas.strokeStyle = GRAPH_SWIMBOT_1_COLOR;
			graphCanvas.beginPath();
			graphCanvas.moveTo(left + 120, swimbot1 - 6);
			graphCanvas.lineTo(left + 180, swimbot1 - 6);
			graphCanvas.stroke();
			graphCanvas.closePath();
			*/
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

			let foodY1 = _graphBottom - (_numFoodBits[iPrev] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			let foodY2 = _graphBottom - (_numFoodBits[iCurr] * RECIPROCAL_OF_MAX_POP) * _graphHeight;

			let food1Y1 = _graphBottom - (_numFoodBits1[iPrev] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			let food1Y2 = _graphBottom - (_numFoodBits1[iCurr] * RECIPROCAL_OF_MAX_POP) * _graphHeight;

			let swimbotY1 = _graphBottom - (_numSwimbots[iPrev] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			let swimbotY2 = _graphBottom - (_numSwimbots[iCurr] * RECIPROCAL_OF_MAX_POP) * _graphHeight;

			//let swimbot1Y1  = _graphBottom - (_numSwimbots1[g-1] * RECIPROCAL_OF_MAX_POP) * _graphHeight;
			//let swimbot1Y2  = _graphBottom - (_numSwimbots1[g  ] * RECIPROCAL_OF_MAX_POP) * _graphHeight;

			if (foodY2 > _graphBottom - _graphHeight) {
				graphCanvas.strokeStyle = GRAPH_FOODBIT_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(x1, foodY1);
				graphCanvas.lineTo(x2, foodY2);
				graphCanvas.stroke();
				graphCanvas.closePath();
			}

			if (food1Y2 > _graphBottom - _graphHeight) {
				graphCanvas.strokeStyle = GRAPH_FOODBIT_1_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(x1, food1Y1);
				graphCanvas.lineTo(x2, food1Y2);
				graphCanvas.stroke();
				graphCanvas.closePath();
			}

			if (swimbotY2 > _graphBottom - _graphHeight) {
				graphCanvas.strokeStyle = GRAPH_SWIMBOT_COLOR;
				graphCanvas.beginPath();
				graphCanvas.moveTo(x1, swimbotY1);
				graphCanvas.lineTo(x2, swimbotY2);
				graphCanvas.stroke();
				graphCanvas.closePath();
			}

			/*
			if (swimbot1Y2 > _graphBottom - _graphHeight)
			{
				graphCanvas.strokeStyle = GRAPH_SWIMBOT_1_COLOR;
				graphCanvas.beginPath();

				//graphCanvas.moveTo(x1, swimbot1Y1);
				//graphCanvas.lineTo(x2, swimbot1Y2);

				graphCanvas.moveTo(x1, swimbot1Y1);
				graphCanvas.lineTo(x2, swimbot1Y2);

				graphCanvas.stroke();
				graphCanvas.closePath();
			}
			*/
		}
	}
}