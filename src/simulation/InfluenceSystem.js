export class InfluenceSystem {
  constructor() {
    this.activeCells = new Set(); // Track cells with factions or influence for performance
  }

  /**
   * Mark a cell as active (needs simulation processing)
   */
  markActive(cell) {
    this.activeCells.add(cell);
  }

  /**
   * Update the active cells set - called when major changes occur
   */
  updateActiveCells(grid, gameState) {
    this.activeCells.clear();
    for (const cell of grid.getAllCells()) {
      if (cell.hasActiveInfluence()) {
        this.activeCells.add(cell);
      }
    }
    gameState.stats.activeCells = this.activeCells.size;
  }

  /**
   * Utility to apply random variance to a value
   */
  vary(value, variation) {
    if (variation <= 0) return value;
    const factor = 1 + (Math.random() * 2 - 1) * variation;
    return value * factor;
  }

  spreadInfluence(grid, gameState, tournamentGraph) {
    const influencePerTick = gameState.influencePerTick;
    const variation = gameState.randomVariation;
    const oceanRate = gameState.oceanTransmissionRate;
    
    const newlyInfluenced = new Set();
    const isVoronoiGrid = grid.getCellCenter !== undefined;
    
    for (const cell of this.activeCells) {
      if (cell.factionId === null || !gameState.activeFactions.has(cell.factionId)) {
        if (cell.factionId !== null && !gameState.activeFactions.has(cell.factionId)) {
          cell.clearFactionInfluence(cell.factionId);
        }
        continue;
      }
      
      // Get neighbors (different method for Voronoi vs regular grids)
      const neighbors = isVoronoiGrid 
        ? grid.getNeighbors(cell)
        : grid.getNeighbors(cell.q, cell.r, gameState.isWrappingEnabled, grid.currentRadius);
      
      for (const neighbor of neighbors) {
        const variedInfluence = this.vary(influencePerTick, variation);
        
        if (neighbor.type === 'ocean') {
          neighbor.addInfluence(cell.factionId, variedInfluence * oceanRate);
          newlyInfluenced.add(neighbor);
        } 
        else if (neighbor.isClaimable && neighbor.factionId !== cell.factionId) {
          neighbor.addInfluence(cell.factionId, variedInfluence);
          newlyInfluenced.add(neighbor);
        }
      }
    }
    
    for (const cell of newlyInfluenced) {
      this.activeCells.add(cell);
    }
    
    this.applyDecay(gameState);
  }

  applyDecay(gameState) {
    const decayRate = gameState.influenceDecayRate;
    const variation = gameState.randomVariation;
    const deadCells = [];
    
    for (const cell of this.activeCells) {
      // Vary decay per cell for more natural organic spread
      const variedDecay = this.vary(decayRate, variation * 0.1); // Scaled down for stability
      cell.decayInfluences(variedDecay);
      
      // Remove from active set if no longer active
      if (!cell.hasActiveInfluence()) {
        deadCells.push(cell);
      }
    }
    
    // Clean up inactive cells
    for (const cell of deadCells) {
      this.activeCells.delete(cell);
    }
  }

  checkConversions(grid, gameState, tournamentGraph, renderer = null) {
    const threshold = gameState.conversionThreshold;
    const variation = gameState.randomVariation;
    const conversions = [];
    
    // Only check active cells (performance optimization)
    for (const cell of this.activeCells) {
      if (!cell.isClaimable || cell.type === 'ocean') continue;
      
      // Local variation of threshold for this specific cell check
      const localThreshold = this.vary(threshold, variation);

      // Find all factions that have surpassed the threshold
      const competitors = [];
      for (let factionId = 0; factionId < 7; factionId++) {
        const influence = cell.influences[factionId];
        if (influence >= localThreshold && 
            gameState.activeFactions.has(factionId) &&
            factionId !== cell.factionId) {
          
          // You can only steal a cell if it's empty, or if you dominate the current owner
          if (cell.factionId === null || tournamentGraph.beats(factionId, cell.factionId)) {
            competitors.push(factionId);
          }
        }
      }
      
      if (competitors.length > 0) {
        // Resolve conflict using tournament graph
        const winner = tournamentGraph.resolveConflict(competitors);
        conversions.push({ cell, winner, oldFaction: cell.factionId });
      }
    }
    
    // Apply all conversions with visual effects
    const factionColors = gameState.theme.factions;
    
    for (const { cell, winner, oldFaction } of conversions) {
      // Trigger conversion animation if renderer available
      if (renderer && renderer.addConversionAnimation) {
        const fromColor = oldFaction !== null ? factionColors[oldFaction] : '#1a1a2e';
        const toColor = factionColors[winner];
        renderer.addConversionAnimation(cell, grid, fromColor, toColor, gameState);
      }
      
      cell.setFaction(winner);
      cell.clearAllInfluence(); // Reset all influences after conversion
      this.activeCells.add(cell); // Ensure converted cell stays active
    }
    
    gameState.stats.conversions = conversions.length;
  }

  /**
   * Clear all influence from disabled factions across the entire grid
   */
  clearDisabledFactionInfluence(grid, gameState) {
    for (const cell of grid.getAllCells()) {
      if (!cell.hasInfluence) continue;
      for (let factionId = 0; factionId < 7; factionId++) {
        if (cell.influences[factionId] > 0 && !gameState.activeFactions.has(factionId)) {
          cell.clearFactionInfluence(factionId);
        }
      }
    }
  }
}