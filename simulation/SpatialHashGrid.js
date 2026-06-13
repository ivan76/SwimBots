"use strict";

class SpatialHashGrid {
    constructor(cellSize) {
        this._cellSize = cellSize;
        this._map = new Map();
    }

    _key(x, y) {
        let gx = Math.floor(x / this._cellSize);
        let gy = Math.floor(y / this._cellSize);
        return `${gx},${gy}`;
    }

    clear() {
        this._map.clear();
    }

    add(entity) {
        let key = this._key(entity.getPosition().x, entity.getPosition().y);
        if (!this._map.has(key)) {
            this._map.set(key, []);
        }
        this._map.get(key).push(entity);
    }

    // Get all entities within a radius of a point
    query(x, y, radius) {
        let results = [];
        let cellRadius = Math.ceil(radius / this._cellSize);
        let gx = Math.floor(x / this._cellSize);
        let gy = Math.floor(y / this._cellSize);

        for (let dx = -cellRadius; dx <= cellRadius; dx++) {
            for (let dy = -cellRadius; dy <= cellRadius; dy++) {
                let key = `${gx + dx},${gy + dy}`;
                let cell = this._map.get(key);
                if (cell) {
                    for (let i = 0; i < cell.length; i++) {
                        results.push(cell[i]);
                    }
                }
            }
        }
        return results;
    }

    // Get entities within radiusSquared of a point (with distance filter)
    queryFiltered(x, y, radiusSquared, filterFn) {
        let results = [];
        let cellRadius = Math.ceil(Math.sqrt(radiusSquared) / this._cellSize);
        let gx = Math.floor(x / this._cellSize);
        let gy = Math.floor(y / this._cellSize);

        for (let dx = -cellRadius; dx <= cellRadius; dx++) {
            for (let dy = -cellRadius; dy <= cellRadius; dy++) {
                let key = `${gx + dx},${gy + dy}`;
                let cell = this._map.get(key);
                if (cell) {
                    for (let i = 0; i < cell.length; i++) {
                        let entity = cell[i];
                        if (filterFn(entity)) {
                            results.push(entity);
                        }
                    }
                }
            }
        }
        return results;
    }
}
