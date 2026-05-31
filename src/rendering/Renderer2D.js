/**
 * Renderer2D - Main rendering coordinator
 */
import { Camera } from './Camera.js';
import { HexRenderer } from './HexRenderer.js';
import { InteractionManager } from './InteractionManager.js';
import { ASPECTS } from '../core/DivineAspect.js';

export class Renderer2D {
  constructor(canvas, fxCanvas, audio) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fxCanvas = fxCanvas;
    this.fxCtx = fxCanvas.getContext('2d');
    
    // Modular sub-systems
    this.audio = audio;
    this.camera = new Camera();
    this.particles = [];
    this.hexRenderer = new HexRenderer();
    this.interaction = new InteractionManager(this, this.camera, this.canvas);

    this.setupCanvas();
  }

  // Legacy accessor for zoom (backward compatibility with main.js)
  get zoom() { return this.camera.zoom; }
  set zoom(v) { this.camera.zoom = v; }
  get cameraX() { return this.camera.x; }
  set cameraX(v) { this.camera.x = v; }
  get cameraY() { return this.camera.y; }
  set cameraY(v) { this.camera.y = v; }

  setupCanvas() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      if (this.fxCanvas) {
        this.fxCanvas.width = window.innerWidth;
        this.fxCanvas.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
  }

  render(grid, gameState, deltaTime = 16) {
    const { ctx, fxCtx, canvas } = this;
    const { width, height } = canvas;

    // 1. Clear canvases
    ctx.fillStyle = gameState.theme.background;
    ctx.fillRect(0, 0, width, height);
    fxCtx.clearRect(0, 0, width, height);

    // 3. Setup transforms
    ctx.save();
    fxCtx.save();
    
    this.camera.apply(ctx, width, height);
    this.camera.apply(fxCtx, width, height);
    
    fxCtx.globalCompositeOperation = 'lighter';

    // Render particles on fxCanvas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= deltaTime;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      p.x += p.vx * deltaTime * 0.05;
      p.y += p.vy * deltaTime * 0.05;
      
      const alpha = p.life / p.maxLife;
      fxCtx.fillStyle = `rgba(${p.color}, ${alpha})`;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      fxCtx.fill();
    }

    // 3. Check grid type
    const isTriangularGrid = grid.constructor.name.includes('Triangular');
    const isSquareGrid = grid.constructor.name.includes('Square');
    const bounds = this.camera.getBounds(width, height, (grid.hexSize || grid.cellSize) * 2);

    if (isTriangularGrid) {
      // Render triangles
      for (const cell of grid.getAllCells()) {
        const pos = grid.hexToPixel(cell.q, cell.r, gameState.hexRotation);
        
        if (pos.x < bounds.left - 100 || pos.x > bounds.right + 100 || 
            pos.y < bounds.top - 100 || pos.y > bounds.bottom + 100) {
          continue;
        }
        
        const color = this.getCellColor(cell, gameState);
        const fillColor = gameState.showHexFill === false ? gameState.theme.neutral : color;
        
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = gameState.theme.background;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pos.vertices[0].x, pos.vertices[0].y);
        ctx.lineTo(pos.vertices[1].x, pos.vertices[1].y);
        ctx.lineTo(pos.vertices[2].x, pos.vertices[2].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        if (cell.unitType !== null) {
          this.drawUnit(ctx, pos.x, pos.y, cell.unitType);
        }
        
        if (this.interaction.hoveredCoords && 
            cell.q === this.interaction.hoveredCoords.q && 
            cell.r === this.interaction.hoveredCoords.r) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fill();
            if (gameState.selectedAspect !== null) {
                ctx.globalAlpha = 0.5;
                this.drawUnit(ctx, pos.x, pos.y, gameState.selectedAspect);
                ctx.globalAlpha = 1.0;
            }
        }
      }
    } else if (isSquareGrid) {
      // Render squares
      for (const cell of grid.getAllCells()) {
        const pos = grid.hexToPixel(cell.q, cell.r);
        
        if (pos.x < bounds.left - pos.size || pos.x > bounds.right + pos.size || 
            pos.y < bounds.top - pos.size || pos.y > bounds.bottom + pos.size) {
          continue;
        }
        
        const color = this.getCellColor(cell, gameState);
        const fillColor = gameState.showHexFill === false ? gameState.theme.neutral : color;
        const halfSize = pos.size / 2;
        
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = gameState.theme.background;
        ctx.lineWidth = 1;
        ctx.fillRect(pos.x - halfSize, pos.y - halfSize, pos.size, pos.size);
        ctx.strokeRect(pos.x - halfSize, pos.y - halfSize, pos.size, pos.size);
        
        if (cell.unitType !== null) {
          this.drawUnit(ctx, pos.x, pos.y, cell.unitType);
        }
        
        if (this.interaction.hoveredCoords && 
            cell.q === this.interaction.hoveredCoords.q && 
            cell.r === this.interaction.hoveredCoords.r) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(pos.x - halfSize, pos.y - halfSize, pos.size, pos.size);
            if (gameState.selectedAspect !== null) {
                ctx.globalAlpha = 0.5;
                this.drawUnit(ctx, pos.x, pos.y, gameState.selectedAspect);
                ctx.globalAlpha = 1.0;
            }
        }
      }
    } else {
      // Render hexagons
      const rotation = gameState.hexRotation;
      const path = this.hexRenderer.getPath(grid.hexSize, rotation);

      for (const cell of grid.getAllCells()) {
        const { x, y } = grid.hexToPixel(cell.q, cell.r, rotation);
        
        if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) {
          continue;
        }
        
        const color = this.getCellColor(cell, gameState);
        const fillColor = gameState.showHexFill === false ? gameState.theme.neutral : color;
        this.hexRenderer.drawFill(ctx, x, y, path, fillColor, gameState.theme.background);
        
        if (cell.unitType !== null) {
          this.drawUnit(ctx, x, y, cell.unitType);
        }
        
        // Draw hover preview
        if (this.interaction.hoveredCoords && 
            cell.q === this.interaction.hoveredCoords.q && 
            cell.r === this.interaction.hoveredCoords.r) {
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.hexRenderer.drawFill(ctx, x, y, path, ctx.fillStyle, 'rgba(255,255,255,0.5)');
            
            if (gameState.selectedAspect !== null) {
                // Ghost unit
                ctx.globalAlpha = 0.5;
                this.drawUnit(ctx, x, y, gameState.selectedAspect);
                ctx.globalAlpha = 1.0;
            }
        }
      }
    }

    ctx.restore();
    fxCtx.restore();
  }

  getCellColor(cell, gameState) {
    if (cell.type === 'ocean') return gameState.theme.ocean;
    
    // In phase 1, we just return neutral or owner color (if we had players setup).
    // For now, if there's an owner, we'd use their color, but we'll map unitType to theme colors just to see something temporarily
    if (cell.unitType !== null) {
        return gameState.theme.factions[cell.unitType] || gameState.theme.neutral;
    }
    if (cell.owner !== null) {
        return gameState.theme.factions[cell.owner] || gameState.theme.neutral;
    }
    
    return gameState.theme.neutral;
  }

  spawnParticles(x, y, colorStr, count = 15) {
    // Parse hex to rgb roughly or just use a nice white/gold
    let rgb = '255, 215, 0'; // default gold
    if (colorStr.startsWith('#')) {
      const hex = colorStr.substring(1);
      const r = parseInt(hex.substring(0,2), 16);
      const g = parseInt(hex.substring(2,4), 16);
      const b = parseInt(hex.substring(4,6), 16);
      rgb = `${r}, ${g}, ${b}`;
    }

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 500 + Math.random() * 500,
        maxLife: 1000,
        size: Math.random() * 4 + 2,
        color: rgb
      });
    }
  }

  drawUnit(ctx, x, y, aspectId) {
    const aspect = ASPECTS[aspectId];
    if (!aspect) return;

    // Pulsing divine glow
    const pulse = Math.sin(Date.now() * 0.002) * 0.3 + 0.7;
    
    // Outer glow ring
    ctx.strokeStyle = aspect.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4 * pulse;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'bold 16px Space Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Divine radiance
    ctx.shadowColor = aspect.color;
    ctx.shadowBlur = 12 * pulse;
    ctx.fillText(aspect.symbol, x, y);
    ctx.shadowBlur = 0;
  }

  // Bridged for main.js
  handlePaint(clientX, clientY, grid, gameState, gameEngine) {
    this.interaction.handlePaint(clientX, clientY, grid, gameState, gameEngine);
  }
}