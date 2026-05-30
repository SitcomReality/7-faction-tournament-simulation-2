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
 * The immutable cosmic wheel - each aspect dominates exactly two others
 * This is the fundamental law of divine opposition
 */
const DIVINE_DOMINANCE = [
  [1, 2], // Radiance dominates Umbra, Tempest
  [2, 3], // Umbra dominates Tempest, Terra  
  [3, 4], // Tempest dominates Terra, Pyre
  [0, 4], // Terra dominates Radiance, Pyre
  [1, 5], // Pyre dominates Umbra, Tide
  [0, 2], // Tide dominates Radiance, Tempest
  [0, 1]  // Aether dominates Radiance, Umbra
];

/**
 * The Seven Divine Aspects
 */
export const ASPECTS = [
  new DivineAspect(0, 'Radiance', '☀️', '#FFD700', 'The piercing light that banishes shadow'),
  new DivineAspect(1, 'Umbra', '🌙', '#6B46C1', 'The encompassing darkness that smothers light'),
  new DivineAspect(2, 'Tempest', '⚡', '#00D4FF', 'The raging storm that scatters flame'),
  new DivineAspect(3, 'Terra', '⛰️', '#8B4513', 'The unyielding stone that withstands tempest'),
  new DivineAspect(4, 'Pyre', '🔥', '#FF4500', 'The eternal fire that burns through shadow'),
  new DivineAspect(5, 'Tide', '🌊', '#006994', 'The flowing sea that drowns earth'),
  new DivineAspect(6, 'Aether', '✨', '#9333EA', 'The infinite void that absorbs all')
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