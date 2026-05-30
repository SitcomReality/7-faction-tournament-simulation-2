/**
 * Renderer2D - Main rendering coordinator
 */
import { ParticleSystem } from './ParticleSystem.js';
import { ConversionAnimation } from './ConversionAnimation.js';
import { Camera } from './Camera.js';
import { HexRenderer } from './HexRenderer.js';
import { InteractionManager } from './InteractionManager.js';

export class Renderer2D {
  constructor(canvas, fxCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fxCanvas = fxCanvas;
    this.fxCtx = fxCanvas.getContext('2d');
    
    // Modular sub-systems
    this.camera = new Camera();
    this.hexRenderer = new HexRenderer();
    this.interaction = new InteractionManager(this, this.camera, this.canvas);
    
    // Visual effects state
    this.particleSystem = new ParticleSystem();
    this.conversionAnimations = [];

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

    // 1. Update visual systems
    this.particleSystem.update(deltaTime);
    for (let i = this.conversionAnimations.length - 1; i >= 0; i--) {
      if (!this.conversionAnimations[i].update(deltaTime)) {
        this.conversionAnimations.splice(i, 1);
      }
    }

    // 2. Clear canvases
    ctx.fillStyle = gameState.theme.background;
    ctx.fillRect(0, 0, width, height);
    fxCtx.clearRect(0, 0, width, height);

    // 3. Setup transforms
    ctx.save();
    fxCtx.save();
    
    this.camera.apply(ctx, width, height);
    this.camera.apply(fxCtx, width, height);
    
    fxCtx.globalCompositeOperation = 'lighter';

    // 4. Check grid type
    const isVoronoiGrid = grid.getCellCenter !== undefined;
    const isTriangularGrid = grid.constructor.name.includes('Triangular');
    const isSquareGrid = grid.constructor.name.includes('Square');
    const bounds = this.camera.getBounds(width, height, (grid.hexSize || grid.cellSize) * 2);

    if (isVoronoiGrid) {
      // Render irregular Voronoi cells
      for (const cell of grid.getAllCells()) {
        const center = grid.getCellCenter(cell);
        
        if (center.x < bounds.left || center.x > bounds.right || 
            center.y < bounds.top || center.y > bounds.bottom) {
          continue;
        }
        
        const color = this.getCellColor(cell, gameState);
        const fillColor = gameState.showHexFill === false ? gameState.theme.neutral : color;
        
        // Draw polygon
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = gameState.theme.background;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < cell.vertices.length; i++) {
          const v = cell.vertices[i];
          if (i === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // FX glow
        if (cell.factionId !== null && gameState.showHexGlow !== false) {
          fxCtx.shadowColor = color;
          fxCtx.shadowBlur = 15;
          fxCtx.strokeStyle = color;
          fxCtx.lineWidth = 1.5;
          fxCtx.beginPath();
          for (let i = 0; i < cell.vertices.length; i++) {
            const v = cell.vertices[i];
            if (i === 0) fxCtx.moveTo(v.x, v.y);
            else fxCtx.lineTo(v.x, v.y);
          }
          fxCtx.closePath();
          fxCtx.stroke();
          fxCtx.shadowBlur = 0;
        }
      }
    } else if (isTriangularGrid) {
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
        
        if (cell.factionId !== null && gameState.showHexGlow !== false) {
          fxCtx.shadowColor = color;
          fxCtx.shadowBlur = 10;
          fxCtx.strokeStyle = color;
          fxCtx.lineWidth = 1;
          fxCtx.beginPath();
          fxCtx.moveTo(pos.vertices[0].x, pos.vertices[0].y);
          fxCtx.lineTo(pos.vertices[1].x, pos.vertices[1].y);
          fxCtx.lineTo(pos.vertices[2].x, pos.vertices[2].y);
          fxCtx.closePath();
          fxCtx.stroke();
          fxCtx.shadowBlur = 0;
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
        
        if (cell.factionId !== null && gameState.showHexGlow !== false) {
          fxCtx.shadowColor = color;
          fxCtx.shadowBlur = 12;
          fxCtx.strokeStyle = color;
          fxCtx.lineWidth = 1.5;
          fxCtx.strokeRect(pos.x - halfSize, pos.y - halfSize, pos.size, pos.size);
          fxCtx.shadowBlur = 0;
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
        
        if (cell.factionId !== null && (gameState.showHexGlow !== false)) {
          this.hexRenderer.drawGlow(fxCtx, x, y, path, color);
        }
      }
    }

    // 5. Draw overlay effects
    for (const anim of this.conversionAnimations) {
      anim.render(fxCtx);
    }
    this.particleSystem.render(fxCtx, this.camera.x, this.camera.y, this.camera.zoom);

    ctx.restore();
    fxCtx.restore();
  }

  getCellColor(cell, gameState) {
    if (cell.type === 'ocean') return gameState.theme.ocean;
    
    let baseColor = cell.factionId !== null 
      ? gameState.theme.factions[cell.factionId] 
      : gameState.theme.neutral;
    
    if (gameState.blendInfluenceColors) {
      const strongest = cell.getStrongestInfluence();
      if (strongest && strongest.faction !== cell.factionId) {
        const competitorColor = gameState.theme.factions[strongest.faction];
        const blend = Math.min(strongest.amount / gameState.conversionThreshold, 0.4);
        return this.hexRenderer.interpolateColor(baseColor, competitorColor, blend);
      }
    }
    
    return baseColor;
  }

  addConversionAnimation(cell, grid, fromColor, toColor, gameState) {
    if (gameState && gameState.showConversionStar === false) return;

    const isVoronoiGrid = grid.getCellCenter !== undefined;
    const isTriangularGrid = grid.constructor.name.includes('Triangular');
    const isSquareGrid = grid.constructor.name.includes('Square');
    let x, y, size;
    
    if (isVoronoiGrid) {
      const center = grid.getCellCenter(cell);
      x = center.x;
      y = center.y;
      size = grid.cellSize;
    } else if (isTriangularGrid) {
      const pos = grid.hexToPixel(cell.q, cell.r, gameState.hexRotation);
      x = (pos.vertices[0].x + pos.vertices[1].x + pos.vertices[2].x) / 3;
      y = (pos.vertices[0].y + pos.vertices[1].y + pos.vertices[2].y) / 3;
      size = grid.hexSize * 0.6;
    } else if (isSquareGrid) {
      const pos = grid.hexToPixel(cell.q, cell.r);
      x = pos.x;
      y = pos.y;
      size = pos.size * 0.7;
    } else {
      const pos = grid.hexToPixel(cell.q, cell.r, gameState.hexRotation);
      x = pos.x;
      y = pos.y;
      size = grid.hexSize;
    }
    
    this.conversionAnimations.push(
      new ConversionAnimation(cell, x, y, size, fromColor, toColor)
    );
  }

  // Bridged for main.js
  handlePaint(clientX, clientY, grid, gameState, simulationEngine) {
    this.interaction.handlePaint(clientX, clientY, grid, gameState, simulationEngine);
  }
}