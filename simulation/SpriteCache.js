"use strict";

/**
 * SpriteCache — pre-renders part shapes to offscreen canvases
 * and reuses them via drawImage instead of re-tracing vector paths each frame.
 *
 * Sprite coordinate convention:
 *   parent endpoint at (0, 0), child endpoint at (length, 0), oriented along +X.
 * The caller applies: ctx.save(); ctx.translate(parentX, parentY);
 *   ctx.rotate(angle); ctx.drawImage(sprite, 0, 0); ctx.restore();
 *
 * Cache key: (length_q, width_q, parentWidth_q, isSplined, red, green, blue)
 */

const SPRITE_CACHE_MAX_SIZE = 500;
const SPRITE_QUANT_LENGTH = 0.5;  // fine enough to avoid visible gaps between parts
const SPRITE_QUANT_WIDTH  = 0.5;
const SPRITE_PADDING = 4;

class SpriteCache {
	constructor(maxSize) {
		this._maxSize = maxSize || SPRITE_CACHE_MAX_SIZE;
		this._cache = {};
		this._order = [];
		this._size = 0;
	}

	_makeKey(length, width, parentWidth, isSplined, red, green, blue) {
		// No quantization on length — parts chain end-to-end, any rounding causes visible gaps
		var lq = Math.max(0, length);
		var wq = Math.max(0, Math.round(width  / SPRITE_QUANT_WIDTH)  * SPRITE_QUANT_WIDTH);
		var pq = Math.max(0, Math.round(parentWidth / SPRITE_QUANT_WIDTH) * SPRITE_QUANT_WIDTH);
		return lq + "," + wq + "," + pq + "," + (isSplined ? 1 : 0) + "," +
			Math.round(red) + "," + Math.round(green) + "," + Math.round(blue);
	}

	get(length, width, parentWidth, isSplined, red, green, blue) {
		if (length <= 0) return null;

		var key = this._makeKey(length, width, parentWidth, isSplined, red, green, blue);
		var entry = this._cache[key];
		if (entry) {
			// LRU promotion
			var idx = this._order.indexOf(key);
			if (idx >= 0) {
				this._order.splice(idx, 1);
				this._order.push(key);
			}
			return entry;
		}

		var sprite = this._renderSprite(length, width, parentWidth, isSplined, red, green, blue);
		if (!sprite) return null;

		if (this._size >= this._maxSize) {
			this._evictHalf();
		}

		this._cache[key] = sprite;
		this._order.push(key);
		this._size++;
		return sprite;
	}

	_evictHalf() {
		var removeCount = Math.floor(this._size / 2);
		for (var i = 0; i < removeCount; i++) {
			var k = this._order.shift();
			if (k) {
				delete this._cache[k];
				this._size--;
			}
		}
	}

	/**
	 * Render part shape onto an offscreen canvas.
	 * Convention: parent at world (0,0), child at world (length, 0), +X axis.
	 * The canvas is sized to tightly fit the shape with padding.
	 * Returns { canvas, w, h, ox, oy } where (ox, oy) is the parent point in canvas coords.
	 * The caller draws as: ctx.drawImage(sprite.canvas, -sprite.ox, -sprite.oy);
	 */
	_renderSprite(length, width, parentWidth, isSplined, red, green, blue) {
		// bounding box: from x=-parentWidth to x=length+width, y=-maxW to y=+maxW
		var maxW = Math.max(width, parentWidth);
		var w = Math.ceil(length + maxW * 2 + SPRITE_PADDING * 2);
		var h = Math.ceil(maxW * 2 + SPRITE_PADDING * 2);
		if (w <= 0 || h <= 0) return null;

		// offset so that (0,0) in world space maps to (ox, oy) on canvas
		var ox = maxW + SPRITE_PADDING;
		var oy = h / 2;

		var offscreen;
		try {
			offscreen = new OffscreenCanvas(w, h);
		} catch (e) {
			offscreen = document.createElement("canvas");
			offscreen.width = w;
			offscreen.height = h;
		}
		var ctx = offscreen.getContext("2d");

		var color = "rgb(" + Math.round(red) + "," + Math.round(green) + "," + Math.round(blue) + ")";
		var outline = "rgba(0,0,0,0.4)";
		ctx.fillStyle = color;
		ctx.strokeStyle = outline;
		ctx.lineWidth = 1.0;

		// parent at (ox, oy), child at (ox + length, oy)
		var px = ox;
		var chx = ox + length;

		if (isSplined) {
			// --- Splined part (straight, no bend) ---
			var ps = parentWidth;  // perp start
			var pe = width;        // perp end
			var ctrlLen = length * 0.4;

			var sLx = px - ps, sLy = oy - ps;
			var sRx = px + ps, sRy = oy + ps;
			var c1Lx = px - ps + ctrlLen, c1Ly = oy;
			var c1Rx = px + ps + ctrlLen, c1Ry = oy;
			var eLx = chx - pe, eLy = oy - pe;
			var eRx = chx + pe, eRy = oy + pe;
			var c2Lx = chx - pe + ctrlLen, c2Ly = oy;
			var c2Rx = chx + pe + ctrlLen, c2Ry = oy;

			// fill body
			ctx.beginPath();
			ctx.moveTo(sLx, sLy);
			ctx.bezierCurveTo(c1Lx, c1Ly, c2Lx, c2Ly, eLx, eLy);
			ctx.lineTo(eRx, eRy);
			ctx.bezierCurveTo(c2Rx, c2Ry, c1Rx, c1Ry, sRx, sRy);
			ctx.closePath();
			ctx.fill();

			// parent cap
			ctx.beginPath();
			ctx.arc(px, oy, parentWidth * 0.9, 0, Math.PI * 2, false);
			ctx.fill();

			// child end-cap (rounded Bezier)
			var s = width * 1.0;
			var f = -1.0;
			ctx.beginPath();
			ctx.moveTo(eLx + f, eLy);
			ctx.bezierCurveTo(eLx + s, eLy, eRx + s, eRy, eRx + f, eRy);
			ctx.closePath();
			ctx.fill();

			// outline
			ctx.beginPath();
			ctx.moveTo(sLx, sLy);
			ctx.bezierCurveTo(c1Lx, c1Ly, c2Lx, c2Ly, eLx, eLy);
			ctx.moveTo(eRx, eRy);
			ctx.bezierCurveTo(c2Rx, c2Ry, c1Rx, c1Ry, sRx, sRy);
			ctx.stroke();

		} else {
			// --- Non-splined part: parallelogram + circular caps ---
			var x0 = px - width, y0 = oy - width;
			var x1 = px + width, y1 = oy + width;
			var x2 = chx + width, y2 = oy + width;
			var x3 = chx - width, y3 = oy - width;

			// body
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.lineTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.closePath();
			ctx.fill();

			// child cap
			ctx.beginPath();
			ctx.arc(chx, oy, width, 0, Math.PI * 2, false);
			ctx.fill();

			// parent cap
			ctx.beginPath();
			ctx.arc(px, oy, width, 0, Math.PI * 2, false);
			ctx.fill();

			// outline — half-circle on parent side
			ctx.beginPath();
			ctx.arc(px, oy, width, Math.PI, Math.PI * 2, false);
			ctx.stroke();

			// outline — straight edges + child arc
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(chx + width, oy);
			ctx.arc(chx, oy, width, 0, Math.PI, false);
			ctx.moveTo(x0, y0);
			ctx.lineTo(chx - width, oy);
			ctx.stroke();
		}

		return { canvas: offscreen, w, h, ox, oy };
	}

	clear() {
		this._cache = {};
		this._order = [];
		this._size = 0;
	}

	getSize() {
		return this._size;
	}
}

// Global singleton
var spriteCache = new SpriteCache(SPRITE_CACHE_MAX_SIZE);
