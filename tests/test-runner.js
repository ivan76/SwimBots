"use strict";

(function (global) {

    var _suites = [];
    var _results = [];
    var _startTime = 0;
    var _currentSuite = null;

    function describe(name, fn) {
        _suites.push({ name: name, fn: fn });
    }

    function it(name, fn) {
        var suite = _currentSuite || "(global)";
        _results.push({ suite: suite, name: name, fn: fn, status: null, error: null });
    }

    function assertEquals(expected, actual, msg) {
        if (expected !== actual) {
            throw new Error((msg ? msg + ": " : "") + "Expected " + expected + " but got " + actual);
        }
    }

    function assertClose(expected, actual, epsilon, msg) {
        if (Math.abs(expected - actual) > epsilon) {
            throw new Error((msg ? msg + ": " : "") + "Expected " + expected + " +/- " + epsilon + " but got " + actual);
        }
    }

    function assertTrue(value, msg) {
        if (!value) {
            throw new Error((msg ? msg + ": " : "") + "Expected true but got " + value);
        }
    }

    function assertFalse(value, msg) {
        if (value) {
            throw new Error((msg ? msg + ": " : "") + "Expected false but got " + value);
        }
    }

    function assertNotNull(value, msg) {
        if (value === null || value === undefined) {
            throw new Error((msg ? msg + ": " : "") + "Expected non-null but got " + value);
        }
    }

    function assertNull(value, msg) {
        if (value !== null && value !== undefined) {
            throw new Error((msg ? msg + ": " : "") + "Expected null but got " + JSON.stringify(value));
        }
    }

    function assertType(expectedType, value, msg) {
        var actualType = typeof value;
        if (actualType !== expectedType) {
            throw new Error((msg ? msg + ": " : "") + "Expected type '" + expectedType + "' but got '" + actualType + "'");
        }
    }

    function assertArrayLength(expected, arr, msg) {
        if (!Array.isArray(arr) || arr.length !== expected) {
            throw new Error((msg ? msg + ": " : "") + "Expected array length " + expected + " but got " + (arr ? arr.length : typeof arr));
        }
    }

    function assertThrows(fn, msg) {
        try {
            fn();
        } catch (e) {
            return;
        }
        throw new Error((msg ? msg + ": " : "") + "Expected function to throw but it did not");
    }

    global.describe = describe;
    global.it = it;
    global.assertEquals = assertEquals;
    global.assertClose = assertClose;
    global.assertTrue = assertTrue;
    global.assertFalse = assertFalse;
    global.assertNotNull = assertNotNull;
    global.assertNull = assertNull;
    global.assertType = assertType;
    global.assertArrayLength = assertArrayLength;
    global.assertThrows = assertThrows;

    function runTests() {
        _startTime = Date.now();
        var passed = 0;
        var failed = 0;
        var errors = [];

        for (var s = 0; s < _suites.length; s++) {
            _currentSuite = _suites[s].name;
            try {
                _suites[s].fn();
            } catch (e) {
                errors.push({ suite: _suites[s].name, name: "(suite setup)", error: e.message });
                failed++;
            }
        }

        _currentSuite = null;

        for (var t = 0; t < _results.length; t++) {
            var test = _results[t];
            try {
                test.fn();
                test.status = "PASS";
                passed++;
            } catch (e) {
                test.status = "FAIL";
                test.error = e.message;
                failed++;
                errors.push({ suite: test.suite, name: test.name, error: e.message });
            }
        }

        var elapsed = Date.now() - _startTime;
        renderResults(passed, failed, errors, elapsed);
        return { passed: passed, failed: failed, total: passed + failed, elapsed: elapsed };
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function renderResults(passed, failed, errors, elapsed) {
        var html = '<div id="test-results" style="font-family: monospace; padding: 20px; background: #1a1a2e; color: #eee; min-height: 100vh;">';
        html += '<h1 style="margin-top:0;">SwimBots Test Suite</h1>';

        html += '<div style="font-size: 18px; margin-bottom: 20px;">';
        html += '<span style="color: #4caf50;">PASS: ' + passed + '</span> &nbsp; ';
        html += '<span style="color: #f44336;">FAIL: ' + failed + '</span> &nbsp; ';
        html += '<span style="color: #888;">(' + (passed + failed) + ' total, ' + elapsed + 'ms)</span>';
        html += '</div>';

        if (failed === 0) {
            html += '<div style="padding: 20px; background: #1b5e20; border-radius: 8px; font-size: 20px; text-align: center;">';
            html += 'ALL TESTS PASSED';
            html += '</div>';
        } else {
            html += '<div style="border: 1px solid #333; border-radius: 4px; overflow: hidden;">';
            for (var i = 0; i < errors.length; i++) {
                var e = errors[i];
                html += '<div style="padding: 12px 16px; border-bottom: 1px solid #333; background: #2d1b1b;">';
                html += '<div style="color: #f44336; font-weight: bold;">' + escapeHtml(e.suite) + ' > ' + escapeHtml(e.name) + '</div>';
                html += '<div style="color: #ff8a80; margin-top: 4px; white-space: pre-wrap;">' + escapeHtml(e.error) + '</div>';
                html += '</div>';
            }
            html += '</div>';
        }

        var suiteCounts = {};
        for (var r = 0; r < _results.length; r++) {
            var suiteName = _results[r].suite;
            if (!suiteCounts[suiteName]) suiteCounts[suiteName] = { pass: 0, fail: 0 };
            if (_results[r].status === "PASS") suiteCounts[suiteName].pass++;
            else suiteCounts[suiteName].fail++;
        }
        html += '<div style="margin-top: 20px; font-size: 13px; color: #888;">';
        html += '<h3 style="margin-bottom: 8px; color: #aaa;">Per-suite summary</h3>';
        for (var suite in suiteCounts) {
            var c = suiteCounts[suite];
            var color = c.fail === 0 ? "#4caf50" : "#f44336";
            html += '<span style="color:' + color + ';">' + escapeHtml(suite) + ': ' + c.pass + ' pass ' + c.fail + ' fail</span> &nbsp; ';
        }
        html += '</div>';
        html += '</div>';

        document.body.innerHTML = html;
    }

    global.runTests = runTests;

})(window);
