import { Cell } from './Cell.js';

export class HeptCell extends Cell {
  constructor(id, vertices, center) {
    super(id, 0); // Use id for both q and r for compatibility
    this.id = id;
    this.vertices = vertices; // Array of {x, y} points
    this.center = center; // {x, y}
    this.q = id; // For compatibility
    this.r = 0;
    this.neighborIds = [];
  }
}