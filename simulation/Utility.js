	// color
	function Color() {
		this.red = ZERO;
		this.green = ZERO;
		this.blue = ZERO;
	}

	const DEBUG_MODE = true;

	// assert
	function assert(assertion, string) {
		if (!assertion) {
			if (DEBUG_MODE) {
				console.error("assertion failed: " + string);
			}
		}
	}

	// assert integer
	function assertInteger(value, string) {
		if (value - Math.floor(value) > 0) {
			if (DEBUG_MODE) {
				console.error("assertInteger: value not an integer! - " + string);
			}
		}
	}

	// getRandomAngleInDegrees
	function getRandomAngleInDegrees() {
		return -180.0 + Math.random() * 360.0;
	}