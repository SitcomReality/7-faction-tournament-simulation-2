import { TurnManager } from './TurnManager.js';
import { Player } from './Player.js';

export class GameEngine {
  constructor() {
    this.initialized = false;
    this.turnManager = new TurnManager();
  }

  initialize(grid, gameState) {
    // Initialize players if not already created
    if (gameState.players.length === 0) {
      this.createDefaultPlayers(gameState);
    }
    
    this.turnManager.initialize(gameState.players);
    this.initialized = true;
    console.log(`✓ Game engine initialized with ${gameState.players.length} players`);
  }

  createDefaultPlayers(gameState) {
    // Create 2 players by default (can be configured later)
    const playerColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    
    for (let i = 0; i < 2; i++) {
      const player = new Player(
        i,
        `Player ${i + 1}`,
        playerColors[i],
        i > 0 // Player 0 is human, others are AI for now
      );
      gameState.players.push(player);
    }
    
    gameState.activePlayer = 0;
    gameState.currentTurn = 1;
    gameState.turnPhase = 'planning';
  }

  update(deltaTime, grid, gameState, unitRelationships) {
    // In turn-based mode, we don't need continuous updates
    // Game state only changes when actions are executed
  }

  endTurn(gameState, grid) {
    return this.turnManager.endTurn(gameState, grid);
  }

  queueAction(playerId, action) {
    return this.turnManager.queueAction(playerId, action);
  }

  getQueuedActions(playerId) {
    return this.turnManager.getQueuedActions(playerId);
  }

  reset() {
    this.initialized = false;
    this.turnManager = new TurnManager();
  }
}