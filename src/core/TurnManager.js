/**
 * TurnManager - Handles turn flow, action queue, and turn resolution
 */
export class TurnManager {
  constructor() {
    this.currentPhase = 'active'; // Just one phase now!
  }

  initialize(players) {
    this.currentPhase = 'active';
  }

  endTurn(gameState, grid) {
    this.cleanup(gameState, grid);
    this.advanceTurn(gameState, grid);
    return true;
  }

  cleanup(gameState, grid) {
    // Update turn counter
    if (gameState.stats) gameState.stats.turnCount++;
  }

  advanceTurn(gameState, grid) {
    // Move to next player
    gameState.activePlayer = (gameState.activePlayer + 1) % gameState.players.length;
    
    // If back to player 0, increment turn
    if (gameState.activePlayer === 0) {
      gameState.currentTurn++;
    }

    // Generate essence for the new active player
    const activePlayer = gameState.players[gameState.activePlayer];
    let territoryCount = 0;
    
    if (grid) {
      for (const cell of grid.getAllCells()) {
        if (cell.owner === activePlayer.id) {
          territoryCount++;
        }
      }
    }
    
    // Base 2 essence + 1 per 3 territories
    const generated = 2 + Math.floor(territoryCount / 3);
    activePlayer.essence += generated;

    // Dispatch event for UI updates
    document.dispatchEvent(new CustomEvent('turnAdvanced', { 
      detail: { 
        turn: gameState.currentTurn, 
        activePlayer: gameState.activePlayer,
        essenceGenerated: generated
      }
    }));
  }
}