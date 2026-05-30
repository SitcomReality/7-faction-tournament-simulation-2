

import { Cell } from './Cell.js';

export class SquareGrid {
  constructor(hexSize = 20) {
    this.hexSize = hexSize;
    this.cellSize = hexSize * 1.2;
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
    this.createCircular(radius);
  }

  createCircular(radius) {
    this.currentRadius = radius;
    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        if (q * q + r * r <= radius * radius) {
          const cell = new Cell(q, r);
          this.setCell(q, r, cell);
        }
      }
    }
  }

  createSquare(radius) {
    this.currentRadius = radius;
    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        const cell = new Cell(q, r);
        this.setCell(q, r, cell);
      }
    }
  }

  hexToPixel(q, r) {
    return {
      x: q * this.cellSize,
      y: r * this.cellSize,
      size: this.cellSize
    };
  }

  pixelToHex(x, y) {
    const q = Math.round(x / this.cellSize);
    const r = Math.round(y / this.cellSize);
    return { q, r };
  }

  getNeighbors(q, r) {
    const neighbors = [];
    const offsets = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    
    for (const [dq, dr] of offsets) {
      const neighbor = this.getCell(q + dq, r + dr);
      if (neighbor) neighbors.push(neighbor);
    }
    
    return neighbors;
  }
}