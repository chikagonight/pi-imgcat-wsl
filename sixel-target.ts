export const MAX_SIXEL_ROWS = 110;
const MAX_SIXEL_COLS = 220;
const MAX_SIXEL_PIXELS = 2200;
const DEFAULT_CELL = { widthPx: 9, heightPx: 18 };

export function sixelTarget(
	dims: { widthPx: number; heightPx: number },
	cellDimensions: { widthPx: number; heightPx: number },
	terminalColumns: number,
): { pixelW: number; pixelH: number; rows: number } {
	const cell =
		Number.isFinite(cellDimensions.widthPx) && Number.isFinite(cellDimensions.heightPx) &&
		cellDimensions.widthPx >= 4 && cellDimensions.heightPx >= 8
			? cellDimensions
			: DEFAULT_CELL;
	// Use actual cell pixels when available; allow up to 220 columns (~1980 px at
	// 9 px/cell) for photo detail, but cap either dimension at 2200 px and
	// height at 110 rows so high-DPI probes cannot generate huge Sixel output.
	const cols = Math.max(40, Math.min(MAX_SIXEL_COLS, (Number.isFinite(terminalColumns) ? terminalColumns : 80) - 6));
	let pixelW = Math.min(dims.widthPx, cols * cell.widthPx, MAX_SIXEL_PIXELS);
	let pixelH = Math.max(1, Math.round((pixelW * dims.heightPx) / dims.widthPx));
	const maxPixelH = Math.min(dims.heightPx, MAX_SIXEL_ROWS * cell.heightPx, MAX_SIXEL_PIXELS);
	if (pixelH > maxPixelH) {
		pixelH = maxPixelH;
		pixelW = Math.max(1, Math.round((pixelH * dims.widthPx) / dims.heightPx));
	}
	return { pixelW, pixelH, rows: Math.max(1, Math.min(Math.ceil(pixelH / cell.heightPx), MAX_SIXEL_ROWS)) };
}
