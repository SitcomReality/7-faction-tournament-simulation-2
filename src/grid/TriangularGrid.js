

import { Cell } from './Cell.js';

export class TriangularGrid {
  constructor(hexSize = 20) {
    this.hexSize = hexSize;
    this.cellSize = hexSize;
    this.cells = new Map();
    this.currentRadius = 0;
  }

  _hash(q, r) {
    return (q & 0xFFFF) << 16 | (r & 0xFFFF);
  }

  getCell(q, r) {
    return this.cells.get(this._hash(q, r));
  }

  setCell(q, r, cell) {
    this.cells.set(this._hash(q, r), cell);
  }

  getAllCells() {
    return this.cells.values();
  }

  createHexagonal(radius) {
    this.currentRadius = radius;
    // Create triangular grid in a hexagonal boundary
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      for (let r = r1; r <= r2; r++) {
        // Each hex position gets 6 triangles
        for (let t = 0; t < 6; t++) {
          const cell = new Cell(q * 6 + t, r);
          cell.triangleIndex = t;
          cell.baseQ = q;
          cell.baseR = r;
          this.setCell(q * 6 + t, r, cell);
        }
      }
    }
  }

  hexToPixel(q, r, rotation = 'pointy') {
    const baseQ = Math.floor(q / 6);
    const baseR = r;
    const t = q % 6;
    
    const size = this.hexSize;
    let centerX, centerY;
    
    if (rotation === 'flat') {
      centerX = size * (Math.sqrt(3) * baseQ + Math.sqrt(3)/2 * baseR);
      centerY = size * (3/2 * baseR);
    } else {
      centerX = size * (3/2 * baseQ);
      centerY = size * (Math.sqrt(3)/2 * baseQ + Math.sqrt(3) * baseR);
    }
    
    const angle = (t / 6) * Math.PI * 2 + (rotation === 'flat' ? Math.PI / 6 : 0);
    const nextAngle = ((t + 1) / 6) * Math.PI * 2 + (rotation === 'flat' ? Math.PI / 6 : 0);
    
    return {
      x: centerX,
      y: centerY,
      vertices: [
        { x: centerX, y: centerY },
        { x: centerX + size * Math.cos(angle), y: centerY + size * Math.sin(angle) },
        { x: centerX + size * Math.cos(nextAngle), y: centerY + size * Math.sin(nextAngle) }
      ]
    };
  }

  pixelToHex(x, y, rotation = 'pointy') {
    const size = this.hexSize;
    let baseQ, baseR;
    
    if (rotation === 'flat') {
      baseQ = (Math.sqrt(3)/3 * x - 1/3 * y) / size;
      baseR = (2/3 * y) / size;
    } else {
      baseQ = (2/3 * x) / size;
      baseR = (-1/3 * x + Math.sqrt(3)/3 * y) / size;
    }
    
    const rounded = this.axialRound(baseQ, baseR);
    const centerX = rotation === 'flat' 
      ? size * (Math.sqrt(3) * rounded.q + Math.sqrt(3)/2 * rounded.r)
      : size * (3/2 * rounded.q);
    const centerY = rotation === 'flat'
      ? size * (3/2 * rounded.r)
      : size * (Math.sqrt(3)/2 * rounded.q + Math.sqrt(3) * rounded.r);
    
    const dx = x - centerX;
    const dy = y - centerY;
    const angle = Math.atan2(dy, dx);
    let t = Math.floor(((angle + Math.PI + (rotation === 'flat' ? Math.PI / 6 : 0)) / (Math.PI * 2)) * 6) % 6;
    if (t < 0) t += 6;
    
    return { q: rounded.q * 6 + t, r: rounded.r };
  }

  axialRound(q, r) {
    const x = q;
    const z = r;
    const y = -x - z;

    let rx = Math.round(x);
    let ry = Math.round(y);
    let rz = Math.round(z);

    const xDiff = Math.abs(rx - x);
    const yDiff = Math.abs(ry - y);
    const zDiff = Math.abs(rz - z);

    if (xDiff > yDiff && xDiff > zDiff) {
      rx = -ry - rz;
    } else if (yDiff > zDiff) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }

    return { q: rx, r: rz };
  }

  getNeighbors(q, r) {
    const neighbors = [];
    const baseQ = Math.floor(q / 6);
    const baseR = r;
    const t = q % 6;
    
    // Adjacent triangles in same hex
    const prev = (t + 5) % 6;
    const next = (t + 1) % 6;
    const prevCell = this.getCell(baseQ * 6 + prev, baseR);
    const nextCell = this.getCell(baseQ * 6 + next, baseR);
    if (prevCell) neighbors.push(prevCell);
    if (nextCell) neighbors.push(nextCell);
    
    return neighbors;
  }
}