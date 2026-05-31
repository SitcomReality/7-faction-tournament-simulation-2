import { aspectDominates } from './DivineAspect.js';

/**
 * Action - Base class for player actions
 */
export class Action {
  constructor(type, playerId) {
    this.type = type;
    this.playerId = playerId;
    this.priority = 0;
  }

  validate() {
    // Override in subclasses
    return true;
  }

  canExecute(gameState, grid) {
    // Override in subclasses
    return true;
  }

  execute(gameState, grid) {
    // Override in subclasses
  }
}

/**
 * PassAction - Player chooses to skip their turn
 */
export class PassAction extends Action {
  constructor(playerId) {
    super('pass', playerId);
    this.priority = -1; // Lowest priority
  }

  validate() {
    return true;
  }

  canExecute() {
    return true;
  }

  execute() {
    // Do nothing - just pass the turn
  }
}

/**
 * ManifestAction - Player deploys a divine aspect to a sanctum
 */
export class ManifestAction extends Action {
  constructor(playerId, aspectId, q, r) {
    super('manifest', playerId);
    this.aspectId = aspectId;
    this.q = q;
    this.r = r;
    this.priority = 5;
  }

  validate(gameState) {
    const player = gameState.players[this.playerId];
    return player && player.hasAwakenedAspect(this.aspectId) && player.essence >= 1;
  }

  canExecute(gameState, grid) {
    const cell = grid.getCell(this.q, this.r);
    if (!cell || cell.type !== 'land' || !cell.isClaimable || cell.unitType !== null) {
      return false;
    }
    
    // Must be adjacent to owned territory, or player has no territories
    let ownedCount = 0;
    for (const c of grid.getAllCells()) {
      if (c.owner === this.playerId) ownedCount++;
    }
    
    if (ownedCount === 0) return true;
    
    const neighbors = grid.getNeighbors(this.q, this.r);
    return neighbors.some(n => n.owner === this.playerId);
  }

  execute(gameState, grid) {
    const cell = grid.getCell(this.q, this.r);
    const player = gameState.players[this.playerId];
    
    player.essence -= 1;
    cell.unitType = this.aspectId;
    cell.owner = this.playerId;
    
    // Cosmic Conflict Resolution!
    const neighbors = grid.getNeighbors(this.q, this.r);
    for (const neighbor of neighbors) {
      if (neighbor.owner !== null && neighbor.owner !== this.playerId && neighbor.unitType !== null) {
         if (aspectDominates(this.aspectId, neighbor.unitType)) {
             // We dominate! Destroy enemy.
             neighbor.unitType = null;
             neighbor.owner = this.playerId; 
             document.dispatchEvent(new CustomEvent('divineClash', { detail: { winner: this.playerId, q: neighbor.q, r: neighbor.r } }));
         } else if (aspectDominates(neighbor.unitType, this.aspectId)) {
             // They dominate us! Our new manifestation is destroyed!
             cell.unitType = null;
             cell.owner = neighbor.owner; // They claim our spot!
             document.dispatchEvent(new CustomEvent('divineClash', { detail: { winner: neighbor.owner, q: cell.q, r: cell.r } }));
         }
      }
    }
    
    // Stats
    if (gameState.stats) gameState.stats.unitsDeployed = (gameState.stats.unitsDeployed || 0) + 1;
    
    // Visual effect
    document.dispatchEvent(new CustomEvent('aspectManifested', {
      detail: { q: this.q, r: this.r, aspectId: this.aspectId }
    }));
  }
}

/**
 * AwakenAction - Player unlocks a new divine aspect
 */
export class AwakenAction extends Action {
  constructor(playerId, aspectId) {
    super('awaken', playerId);
    this.aspectId = aspectId;
    this.priority = 10; // High priority - happens before manifestation
  }

  validate(gameState) {
    const player = gameState.players[this.playerId];
    return player && !player.hasAwakenedAspect(this.aspectId) && player.canAffordAwakening();
  }

  canExecute(gameState) {
    const player = gameState.players[this.playerId];
    return player && !player.hasAwakenedAspect(this.aspectId) && player.essence >= player.getAwakeningCost();
  }

  execute(gameState) {
    const player = gameState.players[this.playerId];
    const cost = player.getAwakeningCost();
    
    player.essence -= cost;
    player.awakenAspect(this.aspectId);
    
    console.log(`${player.name} awakened aspect ${this.aspectId}`);
  }
}