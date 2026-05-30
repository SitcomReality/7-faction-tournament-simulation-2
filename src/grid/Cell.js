/**
 * Cell - Represents a single cell in the grid
 */
export class Cell {
  constructor(q, r) {
    this.q = q;
    this.r = r;
    this.owner = null; // player index
    this.unitType = null; // unit/power ID
    this.type = 'land'; // 'land', 'ocean'
    this.isClaimable = true;
    
    // Visibility state per player
    this.visible = new Set();
    this.explored = new Set();
  }

  setOwner(ownerId) {
    this.owner = ownerId;
  }

  setUnit(unitId) {
    this.unitType = unitId;
  }

  reset() {
    this.owner = null;
    this.unitType = null;
    this.visible.clear();
    this.explored.clear();
  }
}