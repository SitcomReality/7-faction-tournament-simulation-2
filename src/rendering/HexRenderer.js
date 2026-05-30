/**
 * HexRenderer - Handles low-level hexagonal shape rendering and color blending
 */
export class HexRenderer {
  constructor() {
    this.hexPath = null;
    this.lastHexSize = 0;
    this.lastRotation = null;
    this._colorCache = new Map();
  }

  /**
   * Get or create a Path2D for a hexagon
   */
  getPath(size, rotation) {
    if (this.hexPath && this.lastHexSize === size && this.lastRotation === rotation) {
      return this.hexPath;
    }

    const path = new Path2D();
    const angleOffset = rotation === 'flat' ? Math.PI / 6 : 0;
    for (let i = 0; i < 6; i++) {
      const angle = 2 * Math.PI / 6 * i + angleOffset;
      const hx = size * Math.cos(angle);
      const hy = size * Math.sin(angle);
      if (i === 0) {
        path.moveTo(hx, hy);
      } else {
        path.lineTo(hx, hy);
      }
    }
    path.closePath();

    this.hexPath = path;
    this.lastHexSize = size;
    this.lastRotation = rotation;
    return path;
  }

  drawFill(ctx, x, y, path, color, strokeColor) {
    ctx.fillStyle = color;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.translate(x, y);
    ctx.fill(path);
    ctx.stroke(path);
    ctx.translate(-x, -y);
  }

  drawGlow(ctx, x, y, path, color, blur = 15) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.translate(x, y);
    ctx.stroke(path);
    ctx.translate(-x, -y);
    ctx.shadowBlur = 0;
  }

  interpolateColor(color1, color2, factor) {
    // Defensive: ensure colors are defined and in expected hex form; fall back to black/neutral
    const safeHex = (c) => {
      if (typeof c !== 'string') return '#000000';
      // Accept #rrggbb or rgb(...) formats minimally — for anything else fallback
      if (c[0] === '#' && (c.length === 7 || c.length === 4)) {
        // Expand short form #rgb to #rrggbb
        if (c.length === 4) {
          return '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
        }
        return c;
      }
      return '#000000';
    };

    color1 = safeHex(color1);
    color2 = safeHex(color2);

    // Clamp factor
    factor = Math.max(0, Math.min(1, isFinite(factor) ? factor : 0));

    // Round factor for cache stability
    const roundedFactor = Math.round(factor * 100) / 100;
    const key = color1 + color2 + roundedFactor;
    
    let result = this._colorCache.get(key);
    if (result) return result;

    if (this._colorCache.size > 5000) this._colorCache.clear();

    const hex1 = color1.substring(1);
    const hex2 = color2.substring(1);
    
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    
    const r = Math.round(r1 + roundedFactor * (r2 - r1));
    const g = Math.round(g1 + roundedFactor * (g2 - g1));
    const b = Math.round(b1 + roundedFactor * (b2 - b1));
    
    result = "#" + (1 << 24 | (r & 0xFF) << 16 | (g & 0xFF) << 8 | (b & 0xFF)).toString(16).slice(1);
    this._colorCache.set(key, result);
    return result;
  }
}