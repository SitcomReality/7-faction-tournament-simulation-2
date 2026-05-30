import { InfluenceSystem } from './InfluenceSystem.js';

export class SimulationEngine {
  constructor() {
    this.influenceSystem = new InfluenceSystem();
    this.lastTickTime = 0;
    this.initialized = false;
  }

  initialize(grid, gameState) {
    // Build initial active cell set
    this.influenceSystem.updateActiveCells(grid, gameState);
    this.initialized = true;
    console.log(`✓ Simulation initialized with ${gameState.stats.activeCells} active cells`);
  }

  update(deltaTime, grid, gameState, tournamentGraph, renderer = null) {
    if (gameState.isPaused) return;
    
    // Lazy initialization
    if (!this.initialized) {
      this.initialize(grid, gameState);
    }
    
    this.lastTickTime += deltaTime;
    const tickInterval = 1000 / gameState.simulationSpeed;
    
    const tickStart = performance.now();
    
    // Process all pending ticks
    while (this.lastTickTime >= tickInterval) {
      this.lastTickTime -= tickInterval;
      gameState.currentTick++;
      
      this.influenceSystem.spreadInfluence(grid, gameState, tournamentGraph);
      this.influenceSystem.checkConversions(grid, gameState, tournamentGraph, renderer);
    }
    
    gameState.stats.lastTickTime = performance.now() - tickStart;
    
    // Update faction counts
    this.updateFactionCounts(grid, gameState);
  }

  updateFactionCounts(grid, gameState) {
    const counts = new Array(7).fill(0);
    for (const cell of grid.getAllCells()) {
      if (cell.factionId !== null) {
        counts[cell.factionId]++;
      }
    }
    gameState.stats.factionCounts = counts;
  }

  reset() {
    this.lastTickTime = 0;
    this.initialized = false;
  }

  /**
   * Called when a faction is toggled - clears its influence
   */
  onFactionToggled(grid, gameState, factionId) {
    if (!gameState.activeFactions.has(factionId)) {
      // Faction was disabled - clear its influence
      this.influenceSystem.clearDisabledFactionInfluence(grid, gameState);
      this.influenceSystem.updateActiveCells(grid, gameState);
    }
  }
}