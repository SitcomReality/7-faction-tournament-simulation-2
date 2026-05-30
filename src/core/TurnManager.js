/**
 * TurnManager - Handles turn flow, action queue, and turn resolution
 */
export class TurnManager {
  constructor() {
    this.actionQueue = new Map(); // playerId -> Action[]
    this.currentPhase = 'planning'; // 'planning' | 'resolution' | 'cleanup'
  }

  initialize(players) {
    this.actionQueue.clear();
    for (const player of players) {
      this.actionQueue.set(player.id, []);
    }
    this.currentPhase = 'planning';
  }

  queueAction(playerId, action) {
    if (this.currentPhase !== 'planning') {
      console.warn('Cannot queue actions outside planning phase');
      return false;
    }

    if (!this.actionQueue.has(playerId)) {
      console.warn('Invalid player ID');
      return false;
    }

    // Validate action
    if (!action.validate()) {
      console.warn('Action validation failed');
      return false;
    }

    this.actionQueue.get(playerId).push(action);
    return true;
  }

  clearPlayerActions(playerId) {
    if (this.actionQueue.has(playerId)) {
      this.actionQueue.set(playerId, []);
    }
  }

  endTurn(gameState, grid) {
    // Move through turn phases
    if (this.currentPhase === 'planning') {
      this.currentPhase = 'resolution';
      this.resolveActions(gameState, grid);
      this.currentPhase = 'cleanup';
      this.cleanup(gameState);
      
      // Advance to next player or next turn
      this.advanceTurn(gameState);
      this.currentPhase = 'planning';
      
      return true;
    }
    return false;
  }

  resolveActions(gameState, grid) {
    // Process all queued actions
    const allActions = [];
    for (const [playerId, actions] of this.actionQueue) {
      for (const action of actions) {
        allActions.push({ playerId, action });
      }
    }

    // Sort by priority (high first)
    allActions.sort((a, b) => (b.action.priority || 0) - (a.action.priority || 0));

    // Execute actions
    for (const { playerId, action } of allActions) {
      if (action.validate(gameState) && action.canExecute(gameState, grid)) {
        action.execute(gameState, grid);
        
        // Track stats
        if (action.type === 'manifest') gameState.stats.unitsDeployed++;
      }
    }
  }

  cleanup(gameState) {
    // Clear action queues
    for (const playerId of this.actionQueue.keys()) {
      this.actionQueue.set(playerId, []);
    }

    // Update turn counter
    gameState.stats.turnCount++;
  }

  advanceTurn(gameState) {
    // Move to next player
    gameState.activePlayer = (gameState.activePlayer + 1) % gameState.players.length;
    
    // If back to player 0, increment turn
    if (gameState.activePlayer === 0) {
      gameState.currentTurn++;
    }

    // Dispatch event for UI updates
    document.dispatchEvent(new CustomEvent('turnAdvanced', { 
      detail: { 
        turn: gameState.currentTurn, 
        activePlayer: gameState.activePlayer 
      }
    }));
  }

  getQueuedActions(playerId) {
    return this.actionQueue.get(playerId) || [];
  }
}