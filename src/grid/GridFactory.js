import { HexGrid } from './HexGrid.js';
import { TriangularGrid } from './TriangularGrid.js';
import { SquareGrid } from './SquareGrid.js';

/**
 * GridFactory - Static utility for creating different grid types
 */
export class GridFactory {
  /**
   * Create a grid based on type string
   */
  static create(type, size = 16) {
    switch (type) {
      case 'triangular':
        return new TriangularGrid(size);
      case 'square':
        return new SquareGrid(size);
      case 'hexagonal':
      default:
        return new HexGrid(size);
    }
  }
}