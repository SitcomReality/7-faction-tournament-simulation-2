/**
 * Player - Represents a player in the game
 */
export class Player {
  constructor(id, name, color, isAI = false) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.isAI = isAI;
    
    // Unlocked units (start with 0, 1, 2 - rock-paper-scissors trio)
    this.unlockedUnits = new Set([0, 1, 2]);
    
    // Owned territories
    this.territories = new Set();
    
    // Resources/stats
    this.resources = 0;
  }

  hasUnlockedUnit(unitId) {
    return this.unlockedUnits.has(unitId);
  }

  unlockUnit(unitId) {
    this.unlockedUnits.add(unitId);
    document.dispatchEvent(new CustomEvent('unitUnlocked', { 
      detail: { playerId: this.id, unitId } 
    }));
  }

  addTerritory(cell) {
    this.territories.add(cell);
  }

  removeTerritory(cell) {
    this.territories.delete(cell);
  }
}