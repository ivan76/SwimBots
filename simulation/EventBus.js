"use strict";

/**
 * Lightweight Publish/Subscribe (Event Bus) for decoupling
 * the simulation engine from the UI layer.
 *
 * Usage:
 *   eventBus.on('SWIMBOTS_UPDATED', (data) => { ... });
 *   eventBus.emit('SWIMBOTS_UPDATED', { numSwimbots: 42 });
 */
class _EventBus {
    constructor() {
        this._listeners = {};
    }

    /**
     * Subscribe to an event.
     * @param {string} event - Event name
     * @param {Function} callback - Handler invoked with (data)
     * @returns {_EventBus} this, for chaining
     */
    on(event, callback) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
        return this;
    }

    /**
     * Unsubscribe from an event.
     * If callback is omitted, remove all listeners for that event.
     * @param {string} event - Event name
     * @param {Function} [callback] - Specific handler to remove
     * @returns {_EventBus} this, for chaining
     */
    off(event, callback) {
        if (!this._listeners[event]) return this;
        if (!callback) {
            this._listeners[event] = [];
        } else {
            this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
        }
        return this;
    }

    /**
     * Emit an event to all registered listeners.
     * @param {string} event - Event name
     * @param {*} [data] - Payload passed to each handler
     * @returns {_EventBus} this, for chaining
     */
    emit(event, data) {
        if (!this._listeners[event]) return this;
        const listeners = this._listeners[event];
        for (let i = 0; i < listeners.length; i++) {
            listeners[i](data);
        }
        return this;
    }

    /**
     * Subscribe to an event, but only fire once.
     * @param {string} event - Event name
     * @param {Function} callback - Handler invoked with (data)
     * @returns {_EventBus} this, for chaining
     */
    once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(event, wrapper);
        };
        return this.on(event, wrapper);
    }
}

const eventBus = new _EventBus();
