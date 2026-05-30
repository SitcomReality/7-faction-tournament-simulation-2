/**
 * ConversionAnimation - Handles cell conversion visual effects
 */
export class ConversionAnimation {
  constructor(cell, x, y, size, fromColor, toColor) {
    this.cell = cell;
    this.x = x;
    this.y = y;
    this.size = size;
    this.fromColor = fromColor;
    this.toColor = toColor;
    this.progress = 0;
    this.duration = 0.4; // seconds
  }

  update(deltaTime) {
    this.progress += deltaTime / 1000 / this.duration;
    return this.progress < 1;
  }

  render(ctx) {
    const t = this.easeOut(this.progress);
    const rippleSize = this.size * (1 + this.progress * 0.6);
    const alpha = 1 - this.progress;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = this.toColor;
    ctx.shadowColor = this.toColor;
    ctx.shadowBlur = 15;
    ctx.lineWidth = 2;
    
    // Draw expanding ripple
    this.drawHex(ctx, this.x, this.y, rippleSize);
    
    ctx.restore();
  }

  drawHex(ctx, x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = 2 * Math.PI / 6 * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(hx, hy);
      } else {
        ctx.lineTo(hx, hy);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }
}