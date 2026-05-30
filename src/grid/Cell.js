/**
 * Cell - Represents a single hexagonal cell in the grid
 */
export class Cell {
  constructor(q, r) {
    this.q = q;
    this.r = r;
    this.factionId = null;
    this.influences = new Float32Array(7);
    this.hasInfluence = false;
    this.type = 'land'; // 'land', 'ocean', 'unclaimable'
    this.isClaimable = true;
  }

  /**
   * Add influence from a faction
   */
  addInfluence(factionId, amount) {
    this.influences[factionId] += amount;
    this.hasInfluence = true;
  }

  /**
   * Decay all influences by a factor
   */
  decayInfluences(decayRate) {
    let active = false;
    for (let i = 0; i < 7; i++) {
      if (this.influences[i] > 0) {
        this.influences[i] *= decayRate;
        if (this.influences[i] < 0.01) {
          this.influences[i] = 0;
        } else {
          active = true;
        }
      }
    }
    this.hasInfluence = active;
  }

  /**
   * Clear all influences from a specific faction
   */
  clearFactionInfluence(factionId) {
    this.influences[factionId] = 0;
    this.updateHasInfluence();
  }

  updateHasInfluence() {
    this.hasInfluence = false;
    for (let i = 0; i < 7; i++) {
      if (this.influences[i] > 0) {
        this.hasInfluence = true;
        break;
      }
    }
  }

  /**
   * Check if this cell has any active influence
   */
  hasActiveInfluence() {
    return this.hasInfluence || this.factionId !== null;
  }

  /**
   * Clear influence from a specific faction
   */
  clearInfluence(factionId) {
    this.clearFactionInfluence(factionId);
  }
  
  clearAllInfluence() {
    this.influences.fill(0);
    this.hasInfluence = false;
  }

  /**
   * Get the strongest influence on this cell
   */
  getStrongestInfluence() {
    let strongest = null;
    let maxAmount = 0;

    for (let i = 0; i < 7; i++) {
      const amount = this.influences[i];
      if (amount > maxAmount) {
        maxAmount = amount;
        strongest = { faction: i, amount };
      }
    }

    return strongest;
  }

  /**
   * Set the faction that controls this cell
   */
  setFaction(factionId) {
    this.factionId = factionId;
  }

  /**
   * Reset cell to initial state
   */
  reset() {
    this.factionId = null;
    this.clearAllInfluence();
  }
}