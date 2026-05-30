/**
 * ParticleSystem - Handles visual particle effects for influence spreading
 */
export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emitInfluenceParticle(fromX, fromY, toX, toY, color) {
    this.particles.push({
      fromX,
      fromY,
      toX,
      toY,
      progress: 0,
      color,
      lifetime: 0.5 // seconds
    });
  }

  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.progress += deltaTime / 1000 / p.lifetime;
      
      if (p.progress >= 1) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx, cameraX, cameraY, zoom) {
    ctx.save();
    
    for (const p of this.particles) {
      const t = this.easeOut(p.progress);
      const x = p.fromX + (p.toX - p.fromX) * t;
      const y = p.fromY + (p.toY - p.fromY) * t;
      const alpha = 1 - p.progress;
      const size = 2 + (1 - p.progress) * 2;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    ctx.restore();
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }
}