/**
 * WorldController - Responsible for grid lifecycle, world generation, and map-related state changes.
 */
import { HexGrid } from '../grid/HexGrid.js';
import { TriangularGrid } from '../grid/TriangularGrid.js';
import { SquareGrid } from '../grid/SquareGrid.js';

export class WorldController {
  constructor(gameState, gameEngine, worldGenerator) {
    this.gameState = gameState;
    this.gameEngine = gameEngine;
    this.worldGenerator = worldGenerator;
    this.grid = null;
  }

  /**
   * Constructs the appropriate grid object based on current game state
   */
  createGrid(type) {
    switch (type) {
      case 'triangular': return new TriangularGrid(16);
      case 'square': return new SquareGrid(16);
      default: return new HexGrid(16);
    }
  }

  /**
   * Rebuilds the world grid and regenerates terrain
   */
  setupWorld(hud, renderer) {
    const oldGrid = this.grid;
    this.grid = this.createGrid(this.gameState.gridType);
    
    this.worldGenerator.generateWorld(this.grid, {
      type: this.gameState.mapType,
      radius: this.gameState.mapSize,
      landRatio: 0.65,
      boundaryShape: this.gameState.boundaryShape,
      keepTerrain: this.gameState.keepTerrain
    }, oldGrid);
    
    this.gameEngine.reset();
    this.gameEngine.initialize(this.grid, this.gameState);
    
    if (hud) hud.updateGrid(this.grid);
    if (renderer) renderer.interaction.updateReferences(this.grid, this.gameState, this.gameEngine);
    
    return this.grid;
  }
}