/**
 * Bounds clamping utilities
 * Ensures stickers stay within the laptop canvas area
 */

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Clamp sticker position within canvas bounds
 * @param {number} x - Sticker X position
 * @param {number} y - Sticker Y position  
 * @param {number} stickerWidth - Sticker width
 * @param {number} stickerHeight - Sticker height
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @returns {{ x: number, y: number }}
 */
export function clampToCanvas(x, y, stickerWidth, stickerHeight, canvasWidth, canvasHeight) {
  return {
    x: clamp(x, 0, canvasWidth - stickerWidth),
    y: clamp(y, 0, canvasHeight - stickerHeight),
  };
}

/**
 * Check if a point is inside a rect
 */
export function isPointInRect(px, py, rect) {
  return px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom;
}
