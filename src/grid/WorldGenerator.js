import { Cell } from './Cell.js';

export class WorldGenerator {
  constructor() {
    this.isHeptagonal = false;
  }
  createNoise(seed) {
    // Simple 2D value noise for smooth terrain generation without heavy libraries
    const random = (x, y) => {
      const dot = x * 12.9898 + y * 78.233;
      const s = Math.sin(dot + seed) * 43758.5453123;
      return (s - Math.floor(s));
    };

    const lerp = (a, b, t) => a + t * (b - a);
    const smoothstep = t => t * t * (3 - 2 * t);

    return {
      noise2D: (x, y) => {
        const ix = Math.floor(x);
        const iy = Math.floor(y);
        const fx = x - ix;
        const fy = y - iy;

        const a = random(ix, iy);
        const b = random(ix + 1, iy);
        const c = random(ix, iy + 1);
        const d = random(ix + 1, iy + 1);

        const ux = smoothstep(fx);
        const uy = smoothstep(fy);

        return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
      }
    };
  }

  generateWorld(grid, params, sourceGrid = null) {
    const {
      type = 'random',
      radius = 14,
      landRatio = 0.65,
      seed = Math.random() * 10000,
      boundaryShape = 'circular',
      keepTerrain = false
    } = params;
    
    grid.cells.clear();
    grid.currentRadius = radius;
    
    // Geometry creation
    if (typeof grid.createHexagonal === 'function') {
      grid.createHexagonal(radius);
    } else if (typeof grid.createRectangular === 'function') {
      grid.createRectangular(radius * 2, radius * 2);
    } else if (typeof grid.createSquare === 'function') {
      if (boundaryShape === 'square') {
        grid.createSquare(radius);
      } else {
        grid.createCircular(radius);
      }
    }

    const noise = this.createNoise(seed);
    const cellSize = grid.cellSize || grid.hexSize || 20;
    const maxDist = radius * cellSize * 1.5;

    for (const cell of grid.getAllCells()) {
      const pos = this.getCellWorldPos(grid, cell);
      
      // Janky hack: if keepTerrain is true and we have a source grid, sample it!
      if (keepTerrain && sourceGrid) {
        const sourceCell = this.sampleGridAt(sourceGrid, pos.x, pos.y);
        if (sourceCell) {
          cell.type = sourceCell.type;
          cell.isClaimable = sourceCell.isClaimable;
          continue; // Move to next cell, bypass generation logic
        }
      }

      if (type === 'land') {
        cell.type = 'land';
        cell.isClaimable = true;
      } else if (type === 'ocean') {
        cell.type = 'ocean';
        cell.isClaimable = false;
      } else {
        const d = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
        const distSq = (d / maxDist) ** 2;
        
        let value = noise.noise2D(pos.x * 0.01, pos.y * 0.01) * 0.5 + 
                    noise.noise2D(pos.x * 0.02, pos.y * 0.02) * 0.25 + 
                    noise.noise2D(pos.x * 0.04, pos.y * 0.04) * 0.125;
        
        value -= distSq * 0.6;
        const threshold = 0.4 - (landRatio - 0.5) * 0.4;

        if (value > threshold) {
          cell.type = 'land';
          cell.isClaimable = true;
        } else {
          cell.type = 'ocean';
          cell.isClaimable = false;
        }
      }
    }
  }

  getCellWorldPos(grid, cell) {
    if (grid.getCellCenter) {
      return grid.getCellCenter(cell);
    }
    if (grid.hexToPixel) {
      const p = grid.hexToPixel(cell.q, cell.r);
      return { x: p.x || 0, y: p.y || 0 };
    }
    return { x: 0, y: 0 };
  }

  sampleGridAt(grid, x, y) {
    if (typeof grid.getCellAt === 'function') {
      return grid.getCellAt(x, y);
    }
    if (typeof grid.pixelToHex === 'function') {
      // We don't know the rotation here easily, but we can try to guess or use default
      // Most grids handle this internally via pixelToHex
      const coords = grid.pixelToHex(x, y);
      return grid.getCell(coords.q, coords.r);
    }
    return null;
  }

}