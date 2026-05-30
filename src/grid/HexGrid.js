/**
 * HexGrid - Manages the hexagonal grid using axial coordinates
 */
import { Cell } from './Cell.js';

export class HexGrid {
  constructor(hexSize = 20) {
    this.hexSize = hexSize;
    this.cellSize = hexSize;
    this.cells = new Map(); // "q,r" -> Cell
    this.currentRadius = 0;
  }

  /**
   * Neighbor offsets for flat-top hexagons in axial coordinates
   */
  static NEIGHBOR_OFFSETS = [
    [+1,  0], [+1, -1], [ 0, -1],
    [-1,  0], [-1, +1], [ 0, +1]
  ];

  /**
   * Get a cell at the given coordinates
   */
  _hash(q, r) {
    return (q & 0xFFFF) << 16 | (r & 0xFFFF);
  }

  /**
   * Get a cell at the given coordinates
   */
  getCell(q, r) {
    return this.cells.get(this._hash(q, r));
  }

  /**
   * Set a cell at the given coordinates
   */
  setCell(q, r, cell) {
    this.cells.set(this._hash(q, r), cell);
  }

  /**
   * Get all neighboring cells of a hex, with optional wrapping logic
   */
  getNeighbors(q, r, wrappingEnabled = false, radius = 0) {
    const neighbors = [];
    for (const [dq, dr] of HexGrid.NEIGHBOR_OFFSETS) {
      let nq = q + dq;
      let nr = r + dr;
      let neighbor = this.getCell(nq, nr);

      if (!neighbor && wrappingEnabled && radius > 0) {
        // Hexagonal wrapping vectors for a grid of radius R
        const M = 2 * radius + 1;
        const wrapVectors = [
          [M, -radius], [radius, radius + 1], [-radius - 1, M],
          [-M, radius], [-radius, -radius - 1], [radius + 1, -M]
        ];
        
        for (let i = 0; i < 6; i++) {
          const wnq = nq - wrapVectors[i][0];
          const wnr = nr - wrapVectors[i][1];
          const wrapped = this.getCell(wnq, wnr);
          if (wrapped) {
            neighbor = wrapped;
            break;
          }
        }
      }

      if (neighbor) {
        neighbors.push(neighbor);
      }
    }
    return neighbors;
  }

  /**
   * Convert hex coordinates to pixel position
   */
  hexToPixel(q, r, rotation = 'pointy') {
    const size = this.hexSize;
    if (rotation === 'flat') {
      // Flat-top: rotate 30 degrees
      const x = size * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r);
      const y = size * (3/2 * r);
      return { x, y };
    } else {
      // Pointy-top (default)
      const x = size * (3/2 * q);
      const y = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
      return { x, y };
    }
  }

  /**
   * Convert pixel position to hex coordinates
   */
  pixelToHex(x, y, rotation = 'pointy') {
    const size = this.hexSize;
    if (rotation === 'flat') {
      const q = (Math.sqrt(3)/3 * x - 1/3 * y) / size;
      const r = (2/3 * y) / size;
      return this.axialRound(q, r);
    } else {
      const q = (2/3 * x) / size;
      const r = (-1/3 * x + Math.sqrt(3)/3 * y) / size;
      return this.axialRound(q, r);
    }
  }

  /**
   * Round fractional axial coordinates to nearest hex
   */
  axialRound(q, r) {
    // Convert to cube coordinates for rounding
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

  /**
   * Get all cells
   */
  getAllCells() {
    return this.cells.values();
  }

  /**
   * Create a rectangular grid of hexes
   */
  createRectangular(width, height) {
    const halfWidth = Math.floor(width / 2);
    const halfHeight = Math.floor(height / 2);

    for (let q = -halfWidth; q < halfWidth; q++) {
      for (let r = -halfHeight; r < halfHeight; r++) {
        const cell = new Cell(q, r);
        this.setCell(q, r, cell);
      }
    }
  }

  /**
   * Create a hexagonal shaped grid of hexes
   */
  createHexagonal(radius) {
    this.currentRadius = radius;
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      for (let r = r1; r <= r2; r++) {
        const cell = new Cell(q, r);
        this.setCell(q, r, cell);
      }
    }
  }
}