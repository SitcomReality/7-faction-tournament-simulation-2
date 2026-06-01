import { TurnManager } from './TurnManager.js';
import { Player } from './Player.js';
import { AwakenAction, ManifestAction } from './Action.js';

export class GameEngine {
  constructor() {
    this.initialized = false;
    this.turnManager = new TurnManager();
  }

  initialize(grid, gameState, playerConfigs = null) {
    // Initialize players if not already created
    if (gameState.players.length === 0) {
      this.createPlayers(gameState, playerConfigs);
    }
    
    this.turnManager.initialize(gameState.players);
    this.initialized = true;
    console.log(`✓ Game engine initialized with ${gameState.players.length} players`);
  }

  createPlayers(gameState, playerConfigs = null) {
    const playerColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    
    if (!playerConfigs) {
      // Default: 2 players
      playerConfigs = [
        { name: 'House Aurorus', type: 'human', difficulty: null },
        { name: 'House Nocturn', type: 'ai', difficulty: 'medium' }
      ];
    }
    
    for (let i = 0; i < playerConfigs.length; i++) {
      const config = playerConfigs[i];
      const player = new Player(
        i,
        config.name,
        playerColors[i],
        config.type === 'ai',
        config.difficulty
      );
      gameState.players.push(player);
    }
    
    gameState.activePlayer = 0;
    gameState.currentTurn = 1;
    gameState.turnPhase = 'active';
    
    // Give initial essence
    for (const player of gameState.players) {
      player.essence = 5;
    }
  }

  update(deltaTime, grid, gameState, unitRelationships) {
    if (!this.initialized) return;
    
    const activePlayer = gameState.players[gameState.activePlayer];
    if (activePlayer && activePlayer.isAI) {
      this.aiTimer = (this.aiTimer || 0) + deltaTime;
      
      // Wait 1 second between AI actions to make it observable
      if (this.aiTimer > 1000) {
        this.aiTimer = 0;
        this.takeAITurn(activePlayer, gameState, grid);
      }
    }
  }

  takeAITurn(aiPlayer, gameState, grid) {
    // 1. Can we awaken something?
    if (aiPlayer.canAffordAwakening()) {
      // Find an aspect we don't have
      const available = [0,1,2,3,4,5,6].filter(id => !aiPlayer.hasAwakenedAspect(id));
      if (available.length > 0) {
        const toAwaken = available[Math.floor(Math.random() * available.length)];
        const action = new AwakenAction(aiPlayer.id, toAwaken);
        if (this.executeAction(aiPlayer.id, action, gameState, grid)) {
          return; // Did an action, wait for next tick
        }
      }
    }

    // 2. Can we manifest?
    if (aiPlayer.essence >= 1) {
      // Find valid cells to manifest
      const validCells = [];
      const ownedCells = [];
      
      for (const c of grid.getAllCells()) {
        if (c.owner === aiPlayer.id) ownedCells.push(c);
      }
      
      if (ownedCells.length === 0) {
        // Find any land
        for (const c of grid.getAllCells()) {
          if (c.type === 'land' && c.isClaimable && c.unitType === null) validCells.push(c);
        }
      } else {
        // Find land adjacent to owned
        for (const owned of ownedCells) {
          const neighbors = grid.getNeighbors(owned.q, owned.r);
          for (const n of neighbors) {
            if (n.type === 'land' && n.isClaimable && n.unitType === null) {
              validCells.push(n);
            }
          }
        }
      }
      
      if (validCells.length > 0) {
        const target = validCells[Math.floor(Math.random() * validCells.length)];
        const awakened = Array.from(aiPlayer.awakenedAspects);
        const aspect = awakened[Math.floor(Math.random() * awakened.length)];
        
        const action = new ManifestAction(aiPlayer.id, aspect, target.q, target.r);
        if (this.executeAction(aiPlayer.id, action, gameState, grid)) {
          return; // Did an action, wait
        }
      }
    }
    
    // 3. Nothing to do, end turn
    this.endTurn(gameState, grid);
  }

  endTurn(gameState, grid) {
    const result = this.turnManager.endTurn(gameState, grid);
    this.checkVictoryConditions(gameState, grid);
    return result;
  }

  executeAction(playerId, action, gameState, grid) {
    if (gameState.players[gameState.activePlayer].id !== playerId) return false;
    
    if (action.validate(gameState) && action.canExecute(gameState, grid)) {
      action.execute(gameState, grid);
      
      this.checkVictoryConditions(gameState, grid);
      
      return true;
    }
    return false;
  }

  checkVictoryConditions(gameState, grid) {
    if (gameState.winner !== null || !grid) return; // Already finished or no grid

    const players = gameState.players;
    let winner = null;

    if (gameState.victoryCondition === 'omniscience') {
      for (const p of players) {
        if (p.awakenedAspects.size === 7) {
          winner = p;
          break;
        }
      }
    } else if (gameState.victoryCondition === 'ascension') {
      let totalClaimable = 0;
      const territories = new Array(players.length).fill(0);
      
      for (const cell of grid.getAllCells()) {
        if (cell.type === 'land' && cell.isClaimable) {
          totalClaimable++;
          if (cell.owner !== null) {
            territories[cell.owner]++;
          }
        }
      }
      
      if (totalClaimable > 0) {
        for (let i = 0; i < players.length; i++) {
          if (players[i].awakenedAspects.size >= 5 && (territories[i] / totalClaimable) >= 0.5) {
            winner = players[i];
            break;
          }
        }
      }
    } else if (gameState.victoryCondition === 'elimination') {
      let aliveCount = 0;
      let lastAlive = null;
      
      const territories = new Array(players.length).fill(0);
      for (const cell of grid.getAllCells()) {
        if (cell.owner !== null) {
          territories[cell.owner]++;
        }
      }

      for (let i = 0; i < players.length; i++) {
        // A player is alive if they have territories, or it's early game (turn 1)
        if (territories[i] > 0 || gameState.stats.turnCount < players.length) {
          aliveCount++;
          lastAlive = players[i];
        }
      }

      if (aliveCount === 1 && gameState.stats.turnCount >= players.length) {
        winner = lastAlive;
      }
    }

    if (winner !== null) {
      gameState.winner = winner;
      document.dispatchEvent(new CustomEvent('gameOver', { detail: { winner } }));
    }
  }

  reset() {
    this.initialized = false;
    this.turnManager = new TurnManager();
  }
}