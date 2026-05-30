/**
 * Renderer2D - Main rendering coordinator
 */
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

  // Bridged for main.js
  handlePaint(clientX, clientY, grid, gameState, gameEngine) {
    this.interaction.handlePaint(clientX, clientY, grid, gameState, gameEngine);
  }
}