/**
 * Player - Represents a player in the game
 */
export class Player {
  constructor(id, name, color, isAI = false) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.isAI = isAI;
    
    // Awakened Divine Aspects (start with Triad of Foundation: 0, 1, 2)
    this.awakenedAspects = new Set([0, 1, 2]);
    
    // Owned territories (Sanctums)
    this.territories = new Set();
    
    // Divine Essence (resource for awakening and manifestation)
    this.essence = 5; // Start with some essence
  }

  hasAwakenedAspect(aspectId) {
    return this.awakenedAspects.has(aspectId);
  }

  awakenAspect(aspectId) {
    this.awakenedAspects.add(aspectId);
    document.dispatchEvent(new CustomEvent('aspectAwakened', { 
      detail: { playerId: this.id, aspectId } 
    }));
  }

  canAffordAwakening() {
    // Cost increases: 3, 5, 7, 9 for 4th, 5th, 6th, 7th aspect
    const awakenedCount = this.awakenedAspects.size;
    if (awakenedCount >= 7) return false;
    const cost = 3 + (awakenedCount - 3) * 2;
    return this.essence >= cost;
  }

  getAwakeningCost() {
    const awakenedCount = this.awakenedAspects.size;
    if (awakenedCount >= 7) return Infinity;
    return 3 + (awakenedCount - 3) * 2;
  }

  addTerritory(cell) {
    this.territories.add(cell);
  }

  removeTerritory(cell) {
    this.territories.delete(cell);
  }
}