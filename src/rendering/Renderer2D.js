/**
 * Renderer2D - Main rendering coordinator
 */
import { Camera } from './Camera.js';
import { HexRenderer } from './HexRenderer.js';
import { InteractionManager } from './InteractionManager.js';
import { ASPECTS } from '../core/DivineAspect.js';
import { AspectIcons } from '../ui/AspectIcons.js';

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
    
    this.fogDirty = true;
    this.lastFogPlayer = null;
    this.lastGrid = null;
    
    document.addEventListener('actionExecuted', () => this.fogDirty = true);
    document.addEventListener('turnAdvanced', () => this.fogDirty = true);
    document.addEventListener('fogOfWarToggled', () => this.fogDirty = true);

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

    // 2. Update visibility if fog enabled
    if (gameState.fogOfWarEnabled && grid) {
      if (this.fogDirty || this.lastFogPlayer !== gameState.activePlayer || this.lastGrid !== grid) {
        this.updateFogOfWar(grid, gameState);
        this.fogDirty = false;
        this.lastFogPlayer = gameState.activePlayer;
        this.lastGrid = grid;
      }
    }

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
        
        const triangleActivePlayer = gameState.players[gameState.activePlayer];
        if (cell.unitType !== null) {
          if (!gameState.fogOfWarEnabled || !triangleActivePlayer || cell.visible.has(triangleActivePlayer.id)) {
            this.drawUnit(ctx, pos.x, pos.y, cell.unitType);
          } else if (cell.explored.has(triangleActivePlayer.id)) {
            this.drawUnit(ctx, pos.x, pos.y, cell.unitType, 0.2);
          }
        }
        
        if (this.interaction.hoveredCoords && 
            cell.q === this.interaction.hoveredCoords.q && 
            cell.r === this.interaction.hoveredCoords.r) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fill();
            if (gameState.selectedAspect !== null) {
                this.drawUnit(ctx, pos.x, pos.y, gameState.selectedAspect, 0.5);
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
        
        const activePlayer = gameState.players[gameState.activePlayer];
        if (cell.unitType !== null) {
          if (!gameState.fogOfWarEnabled || !activePlayer || cell.visible.has(activePlayer.id)) {
            this.drawUnit(ctx, pos.x, pos.y, cell.unitType);
          } else if (cell.explored.has(activePlayer.id)) {
            this.drawUnit(ctx, pos.x, pos.y, cell.unitType, 0.2);
          }
        }
        
        if (this.interaction.hoveredCoords && 
            cell.q === this.interaction.hoveredCoords.q && 
            cell.r === this.interaction.hoveredCoords.r) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(pos.x - halfSize, pos.y - halfSize, pos.size, pos.size);
            if (gameState.selectedAspect !== null) {
                this.drawUnit(ctx, pos.x, pos.y, gameState.selectedAspect, 0.5);
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
        
        const activePlayer = gameState.players[gameState.activePlayer];
        if (cell.unitType !== null) {
          if (!gameState.fogOfWarEnabled || !activePlayer || cell.visible.has(activePlayer.id)) {
            this.drawUnit(ctx, x, y, cell.unitType);
          } else if (cell.explored.has(activePlayer.id)) {
            this.drawUnit(ctx, x, y, cell.unitType, 0.2);
          }
        }
        
        // Draw hover preview
        if (this.interaction.hoveredCoords && 
            cell.q === this.interaction.hoveredCoords.q && 
            cell.r === this.interaction.hoveredCoords.r) {
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.hexRenderer.drawFill(ctx, x, y, path, ctx.fillStyle, 'rgba(255,255,255,0.5)');
            
            if (gameState.selectedAspect !== null) {
                // Ghost unit with alpha parameter
                this.drawUnit(ctx, x, y, gameState.selectedAspect, 0.5);
            }
        }
      }
    }

    ctx.restore();
    fxCtx.restore();
  }

  updateFogOfWar(grid, gameState) {
    const activePlayer = gameState.players[gameState.activePlayer];
    if (!activePlayer) return;
    
    // Clear current visibility
    for (const cell of grid.getAllCells()) {
      cell.visible.delete(activePlayer.id);
    }
    
    let hasOwned = false;

    // Grant vision from owned territories
    for (const cell of grid.getAllCells()) {
      if (cell.owner === activePlayer.id) {
        hasOwned = true;
        cell.visible.add(activePlayer.id);
        cell.explored.add(activePlayer.id);
        
        // Grant vision to neighbors (radius 2)
        const neighbors = grid.getNeighbors(cell.q, cell.r);
        for (const n of neighbors) {
          n.visible.add(activePlayer.id);
          n.explored.add(activePlayer.id);
          
          const farNeighbors = grid.getNeighbors(n.q, n.r);
          for (const fn of farNeighbors) {
            fn.visible.add(activePlayer.id);
            fn.explored.add(activePlayer.id);
          }
        }
      }
    }

    // If player has no territories, reveal all claimable land to allow manifestation
    if (!hasOwned) {
      for (const cell of grid.getAllCells()) {
        if (cell.type === 'land' && cell.isClaimable) {
          cell.visible.add(activePlayer.id);
        }
      }
    }
  }

  getCellColor(cell, gameState) {
    const activePlayer = gameState.players[gameState.activePlayer];
    
    // Fog of war rendering
    if (gameState.fogOfWarEnabled && activePlayer) {
      if (!cell.explored.has(activePlayer.id)) {
        // Unexplored: pure black
        return '#000000';
      }
      if (!cell.visible.has(activePlayer.id)) {
        // Explored but not visible: darkened
        const baseColor = this.getBaseCellColor(cell, gameState);
        return this.darkenColor(baseColor, 0.3);
      }
    }
    
    return this.getBaseCellColor(cell, gameState);
  }
  
  getBaseCellColor(cell, gameState) {
    if (cell.type === 'ocean') return gameState.theme.ocean;
    
    if (cell.owner !== null) {
        const player = gameState.players[cell.owner];
        return player ? player.color : gameState.theme.neutral;
    }
    
    return gameState.theme.neutral;
  }
  
  darkenColor(hexColor, factor) {
    if (!hexColor || hexColor[0] !== '#') return hexColor;
    
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const dr = Math.floor(r * factor);
    const dg = Math.floor(g * factor);
    const db = Math.floor(b * factor);
    
    return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
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

  initIconCache() {
    this.iconCache = new Map();
    for (let i = 0; i < ASPECTS.length; i++) {
      const aspect = ASPECTS[i];
      const canvas = document.createElement('canvas');
      const size = 64; // High res base
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const center = size / 2;
      
      // Draw background halo/circle
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.arc(center, center, 24, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = aspect.color;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Symbol
      ctx.save();
      ctx.translate(center, center);
      ctx.shadowColor = aspect.color;
      ctx.shadowBlur = 6;
      ctx.strokeStyle = 'white';
      AspectIcons.draw(ctx, i, 12);
      ctx.restore();
      
      this.iconCache.set(i, canvas);
    }
  }

  drawUnit(ctx, x, y, aspectId, alpha = 1) {
    if (!this.iconCache) this.initIconCache();
    const icon = this.iconCache.get(aspectId);
    if (!icon) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Gentle pulse scale
    const pulse = Math.sin(Date.now() * 0.003) * 0.05 + 1;
    ctx.translate(x, y);
    ctx.scale(pulse, pulse);
    
    const size = 48; // Draw size (adjust as needed to make it very clear)
    ctx.drawImage(icon, -size/2, -size/2, size, size);
    
    ctx.restore();
  }

  // Bridged for main.js
  handlePaint(clientX, clientY, grid, gameState, gameEngine) {
    this.interaction.handlePaint(clientX, clientY, grid, gameState, gameEngine);
  }
}