/**
 * AspectIcons - Central registry for Divine Aspect geometric sigils.
 * Provides both Canvas drawing and SVG string generation for cross-UI consistency.
 */

const VIEWBOX = 100;

export const AspectIcons = {
  /**
   * Draws a sigil onto a Canvas 2D context.
   * Assumes context is already translated to the center of the icon.
   */
  draw(ctx, id, size) {
    ctx.beginPath();
    ctx.lineWidth = 2 * (size / 10);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch(id) {
      case 0: // Radiance: Sun-like circle with 4 outer points
        ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
        for(let i=0; i<4; i++) {
          const a = i * Math.PI/2;
          ctx.moveTo(Math.cos(a)*size*0.8, Math.sin(a)*size*0.8);
          ctx.lineTo(Math.cos(a)*size*1.2, Math.sin(a)*size*1.2);
        }
        break;
      case 1: // Umbra: Double crescent
        ctx.arc(-size*0.3, 0, size * 0.8, -Math.PI*0.4, Math.PI*0.4);
        ctx.arc(-size*0.7, 0, size * 0.8, Math.PI*0.3, -Math.PI*0.3, true);
        break;
      case 2: // Tempest: Triple zigzag bolt
        ctx.moveTo(-size*0.5, -size*0.8);
        ctx.lineTo(size*0.3, -size*0.2);
        ctx.lineTo(-size*0.3, size*0.2);
        ctx.lineTo(size*0.5, size*0.8);
        break;
      case 3: // Terra: Square with inner cross
        ctx.rect(-size*0.7, -size*0.7, size*1.4, size*1.4);
        ctx.moveTo(-size*0.4, 0); ctx.lineTo(size*0.4, 0);
        ctx.moveTo(0, -size*0.4); ctx.lineTo(0, size*0.4);
        break;
      case 4: // Pyre: Diamond with central point
        ctx.moveTo(0, -size); ctx.lineTo(size, 0); ctx.lineTo(0, size); ctx.lineTo(-size, 0); ctx.closePath();
        ctx.moveTo(0, -size*0.2); ctx.lineTo(0, size*0.2);
        break;
      case 5: // Tide: Triple waves
        for(let i=-1; i<=1; i++) {
          const dy = i * size * 0.5;
          ctx.moveTo(-size*0.8, dy);
          ctx.bezierCurveTo(-size*0.4, dy-size*0.4, size*0.4, dy+size*0.4, size*0.8, dy);
        }
        break;
      case 6: // Aether: Concentric Hex/Circle
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.moveTo(size*0.4, 0);
        ctx.arc(0, 0, size*0.4, 0, Math.PI * 2);
        break;
    }
    ctx.stroke();
  },

  /**
   * Returns an SVG string for the given aspect.
   */
  getSVG(id, color, size = 24) {
    let inner = '';
    const stroke = color || 'currentColor';
    const sw = 6; // stroke width relative to 100x100

    switch(id) {
      case 0: // Radiance
        inner = `
          <circle cx="50" cy="50" r="30" fill="none" stroke="${stroke}" stroke-width="${sw}" />
          <line x1="50" y1="10" x2="50" y2="20" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" />
          <line x1="50" y1="80" x2="50" y2="90" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" />
          <line x1="10" y1="50" x2="20" y2="50" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" />
          <line x1="80" y1="50" x2="90" y2="50" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" />
        `;
        break;
      case 1: // Umbra
        inner = `<path d="M 40 15 A 40 40 0 1 1 40 85 A 35 35 0 1 0 40 15" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" />`;
        break;
      case 2: // Tempest
        inner = `<path d="M 30 15 L 70 45 L 30 55 L 70 85" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" />`;
        break;
      case 3: // Terra
        inner = `
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="${stroke}" stroke-width="${sw}" />
          <line x1="35" y1="50" x2="65" y2="50" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" />
          <line x1="50" y1="35" x2="50" y2="65" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" />
        `;
        break;
      case 4: // Pyre
        inner = `
          <path d="M 50 10 L 85 50 L 50 90 L 15 50 Z" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
          <line x1="50" y1="40" x2="50" y2="60" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" />
        `;
        break;
      case 5: // Tide
        inner = `
          <path d="M 15 35 C 30 15, 70 55, 85 35" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" />
          <path d="M 15 50 C 30 30, 70 70, 85 50" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" />
          <path d="M 15 65 C 30 45, 70 85, 85 65" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" />
        `;
        break;
      case 6: // Aether
        inner = `
          <circle cx="50" cy="50" r="40" fill="none" stroke="${stroke}" stroke-width="${sw}" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="${stroke}" stroke-width="${sw}" />
        `;
        break;
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display: block;">
        ${inner}
      </svg>
    `;
  }
};