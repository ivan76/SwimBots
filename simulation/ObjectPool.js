"use strict";

/**
 * VectorPool - A pool of reusable Vector2D objects to avoid creating
 * temporary vectors on every frame, reducing GC pressure.
 */
class VectorPool {
    constructor(initialSize = 100) {
        this._pool = [];
        this._index = 0;
        // Pre-allocate
        for (let i = 0; i < initialSize; i++) {
            this._pool.push(new Vector2D());
        }
    }

    /**
     * Get a vector from the pool (creates new if pool exhausted).
     */
    acquire() {
        if (this._index < this._pool.length) {
            let v = this._pool[this._index++];
            v.clear();
            return v;
        }
        return new Vector2D();
    }

    /**
     * Return a vector to the pool (no-op, just decrement index).
     * The vector stays in the array; we simply allow it to be re-acquired.
     */
    release(v) {
        if (this._index > 0) {
            this._index--;
        }
    }

    /**
     * Get a vector with specific values.
     */
    create(x, y) {
        let v = this.acquire();
        v.setXY(x, y);
        return v;
    }

    /**
     * Reset the pool for a new frame.
     */
    reset() {
        this._index = 0;
    }
}

/**
 * ColorCache - Caches computed color strings to avoid repeated
 * string concatenation in the renderer.
 */
class ColorCache {
    constructor(maxSize = 500) {
        this._cache = {};
        this._maxSize = maxSize;
        this._size = 0;
    }

    /**
     * Cache RGB to rgba string.
     */
    getRGBA(r, g, b, a) {
        // Quantize to reduce cache entries
        let key = `${Math.round(r)},${Math.round(g)},${Math.round(b)},${a}`;
        if (!this._cache[key]) {
            if (this._size >= this._maxSize) {
                this._evict();
            }
            this._cache[key] = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
            this._size++;
        }
        return this._cache[key];
    }

    /**
     * Cache HSL to rgb string.
     */
    getRGBFromHSL(h, s, l) {
        let key = `${Math.round(h)},${Math.round(s * 10)},${Math.round(l * 10)}`;
        if (!this._cache[key]) {
            if (this._size >= this._maxSize) {
                this._evict();
            }
            // Simple HSL to RGB conversion
            let rgb = this._hslToRgb(h / 360, s, l);
            this._cache[key] = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
            this._size++;
        }
        return this._cache[key];
    }

    /**
     * HSL to RGB conversion helper.
     */
    _hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    /**
     * Simple eviction: clear half the cache.
     */
    _evict() {
        let keys = Object.keys(this._cache);
        for (let i = 0; i < keys.length / 2; i++) {
            delete this._cache[keys[i]];
            this._size--;
        }
    }

    /**
     * Clear all cached entries.
     */
    clear() {
        this._cache = {};
        this._size = 0;
    }
}

// Singleton instances for global access
const vectorPool = new VectorPool(200);
const colorCache = new ColorCache(1000);
