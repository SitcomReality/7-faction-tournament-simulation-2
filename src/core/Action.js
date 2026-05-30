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