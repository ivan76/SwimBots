"use strict";

/**
 * Central namespace for mutable global state.
 * All classes and constants remain as global (read-only),
 * but mutable instances are namespaced to avoid polluting the global scope.
 */
var SwimbotsApp = {
    genePool: null,
    globalTweakers: null,
    canvas: null,
    canvasID: null
};
