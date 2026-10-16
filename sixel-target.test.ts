import assert from "node:assert/strict";
import { test } from "node:test";
import { sixelTarget } from "./sixel-target.ts";

const photo = { widthPx: 2251, heightPx: 1353 };
const cell = { widthPx: 9, heightPx: 18 };

function assertAspectRatio(target: { pixelW: number; pixelH: number }, source: { widthPx: number; heightPx: number }): void {
	assert.ok(Math.abs(target.pixelW / target.pixelH - source.widthPx / source.heightPx) < 0.01);
}

test("landscape photo uses a high-resolution Sixel target with correct aspect ratio", () => {
	const target = sixelTarget(photo, cell, 120);
	assert.ok(target.pixelW >= 1000);
	assert.ok(target.pixelH >= 600);
	assertAspectRatio(target, photo);
	assert.equal(target.rows, Math.ceil(target.pixelH / cell.heightPx));
});

test("invalid cell dimensions fall back to 9x18 instead of collapsing to two pixels", () => {
	const expected = sixelTarget(photo, cell, 120);
	for (const broken of [{ widthPx: 0, heightPx: 18 }, { widthPx: 9, heightPx: 0 }, { widthPx: 0, heightPx: 0 }, { widthPx: 1, heightPx: 2 }]) {
		assert.deepEqual(sixelTarget(photo, broken, 120), expected);
	}
	assert.ok(expected.pixelH > 2);
});

test("small images are not enlarged", () => {
	assert.deepEqual(sixelTarget({ widthPx: 24, heightPx: 16 }, cell, 120), { pixelW: 24, pixelH: 16, rows: 1 });
	assert.deepEqual(sixelTarget({ widthPx: 1, heightPx: 1 }, cell, 120), { pixelW: 1, pixelH: 1, rows: 1 });
});

test("portrait is height-limited without distortion or upscaling", () => {
	const portrait = { widthPx: 1000, heightPx: 4000 };
	const target = sixelTarget(portrait, cell, 120);
	assert.ok(target.pixelH <= 80 * cell.heightPx);
	assert.ok(target.pixelW <= portrait.widthPx);
	assertAspectRatio(target, portrait);
	assert.equal(target.rows, 80);
});

test("wide terminals can render beyond the old 120-column quality ceiling without unbounded output", () => {
	const wide = sixelTarget({ widthPx: 4000, heightPx: 2000 }, cell, 240);
	assert.ok(wide.pixelW > 120 * cell.widthPx);
	assert.ok(wide.pixelW <= 160 * cell.widthPx);
	assert.ok(wide.pixelH <= 80 * cell.heightPx);
	assertAspectRatio(wide, { widthPx: 4000, heightPx: 2000 });
	const highDpi = sixelTarget({ widthPx: 8000, heightPx: 6000 }, { widthPx: 24, heightPx: 48 }, 240);
	assert.ok(highDpi.pixelW <= 1600);
	assert.ok(highDpi.pixelH <= 1600);
	assertAspectRatio(highDpi, { widthPx: 8000, heightPx: 6000 });
});
