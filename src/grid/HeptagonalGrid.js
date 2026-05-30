import { VoronoiBuilder } from './VoronoiBuilder.js';

export class HeptagonalGrid {
  constructor(cellSize = 20) {
    this.cellSize = cellSize;
    this.cells = new Map(); // id -> HeptCell
    this.cellsByPosition = new Map(); // spatial hash for lookup
    this.currentRadius = 0;
  }

  createHeptagonal(radius) {
    this.currentRadius = radius;
    this.cells = VoronoiBuilder.build(radius, this.cellSize, 3);
    this.indexCells();
    console.log(`Generated ${this.cells.size} irregular voronoi cells.`);
  }

  indexCells() {
    this.cellsByPosition.clear();
    const gridSize = this.cellSize * 3;
    
    for (const cell of this.cells.values()) {
      const key = this.spatialHash(cell.center.x, cell.center.y, gridSize);
      if (!this.cellsByPosition.has(key)) {
        this.cellsByPosition.set(key, []);
      }
      this.cellsByPosition.get(key).push(cell.id);
    }
  }



  spatialHash(x, y, gridSize) {
    const gx = Math.floor(x / gridSize);
    const gy = Math.floor(y / gridSize);
    return `${gx},${gy}`;
  }

  getCell(id) {
    return this.cells.get(id);
  }

  getAllCells() {
    return this.cells.values();
  }

  getCellAt(x, y) {
    const gridSize = this.cellSize * 3;
    const gx = Math.floor(x / gridSize);
    const gy = Math.floor(y / gridSize);
    
    // Check current and surrounding spatial buckets
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${gx + dx},${gy + dy}`;
        const nearby = this.cellsByPosition.get(key);
        if (!nearby) continue;
        
        for (const cellId of nearby) {
          const cell = this.cells.get(cellId);
          if (this.pointInPolygon(x, y, cell.vertices)) {
            return cell;
          }
        }
      }
    }
    
    return null;
  }

  pointInPolygon(x, y, vertices) {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].x, yi = vertices[i].y;
      const xj = vertices[j].x, yj = vertices[j].y;
      
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  getNeighbors(cell) {
    return cell.neighborIds.map(id => this.cells.get(id));
  }
  
  getCellCenter(cell) {
    return cell.center;
  }
}