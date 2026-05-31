/**
 * DivineAspect - Represents one of the seven primal divine forces
 */
export class DivineAspect {
  constructor(id, name, symbol, color, description) {
    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.color = color;
    this.description = description;
  }

  /**
   * Returns which aspects this one dominates
   */
  dominatesOver(aspects) {
    const dominance = DIVINE_DOMINANCE[this.id];
    return dominance.map(id => aspects[id]);
  }

  /**
   * Returns which aspects dominate this one
   */
  vulnerableTo(aspects) {
    return aspects.filter((_, id) => DIVINE_DOMINANCE[id].includes(this.id));
  }

  /**
   * Check if this aspect dominates another
   */
  dominates(otherAspect) {
    return DIVINE_DOMINANCE[this.id].includes(otherAspect.id);
  }
}

/**
 * The immutable cosmic wheel - a 7-node 2-paradoxical tournament.
 * Each aspect beats 3 others and loses to 3 others.
 * Law: i beats j iff (j - i) mod 7 is in {1, 2, 4}.
 */
const DIVINE_DOMINANCE = [
  [1, 2, 4], // 0: Radiance beats Umbra, Tempest, Pyre
  [2, 3, 5], // 1: Umbra beats Tempest, Terra, Tide
  [3, 4, 6], // 2: Tempest beats Terra, Pyre, Aether
  [4, 5, 0], // 3: Terra beats Pyre, Tide, Radiance
  [5, 6, 1], // 4: Pyre beats Tide, Aether, Umbra
  [6, 0, 2], // 5: Tide beats Aether, Radiance, Tempest
  [0, 1, 3]  // 6: Aether beats Radiance, Umbra, Terra
];

/**
 * The Seven Divine Aspects
 */
export const ASPECTS = [
  new DivineAspect(0, 'Radiance', '☀️', '#FFD700', 'The piercing light that banishes shadow, storm, and fire'),
  new DivineAspect(1, 'Umbra', '🌙', '#6B46C1', 'The encompassing darkness that smothers storm, earth, and tide'),
  new DivineAspect(2, 'Tempest', '⚡', '#00D4FF', 'The raging storm that scatters earth, fire, and void'),
  new DivineAspect(3, 'Terra', '⛰️', '#8B4513', 'The unyielding stone that withstands fire, tide, and light'),
  new DivineAspect(4, 'Pyre', '🔥', '#FF4500', 'The eternal fire that consumes water, void, and shadow'),
  new DivineAspect(5, 'Tide', '🌊', '#006994', 'The flowing sea that reflects void, light, and storm'),
  new DivineAspect(6, 'Aether', '✨', '#9333EA', 'The infinite void that absorbs light, shadow, and earth')
];

/**
 * Helper to check if aspect A dominates aspect B
 */
export function aspectDominates(aspectIdA, aspectIdB) {
  if (aspectIdA === null || aspectIdB === null || aspectIdA === aspectIdB) {
    return false;
  }
  return DIVINE_DOMINANCE[aspectIdA].includes(aspectIdB);
}