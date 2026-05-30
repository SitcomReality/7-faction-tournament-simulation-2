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
    return cell && cell.type === 'land' && cell.isClaimable;
  }

  execute(gameState, grid) {
    const cell = grid.getCell(this.q, this.r);
    const player = gameState.players[this.playerId];
    
    // Deduct cost
    player.essence -= 1;
    
    // Manifest
    cell.unitType = this.aspectId;
    cell.owner = this.playerId;
    
    console.log(`${player.name} manifested aspect ${this.aspectId} at ${this.q},${this.r}`);
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