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
  setupWorld(hud, renderer, playerConfigs = null) {
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
    this.gameEngine.initialize(this.grid, this.gameState, playerConfigs);

    // Assign starting capitals
    if (!this.gameState.keepTerrain) {
      const landCells = Array.from(this.grid.getAllCells()).filter(c => c.type === 'land');
      for (const player of this.gameState.players) {
         if (landCells.length > 0) {
             const idx = Math.floor(Math.random() * landCells.length);
             const cell = landCells.splice(idx, 1)[0];
             cell.owner = player.id;
             // Give a random initial aspect!
             cell.unitType = Array.from(player.awakenedAspects)[Math.floor(Math.random() * player.awakenedAspects.size)];
         }
      }
    }
    
    if (hud) hud.updateGrid(this.grid);
    if (renderer) renderer.interaction.updateReferences(this.grid, this.gameState, this.gameEngine);
    
    return this.grid;
  }
}