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
  [1, 2, 3], // Radiance dominates Umbra, Tempest, Terra
  [2, 3, 4], // Umbra dominates Tempest, Terra, Pyre
  [3, 4, 5], // Tempest dominates Terra, Pyre, Tide
  [4, 5, 6], // Terra dominates Pyre, Tide, Aether
  [5, 6, 0], // Pyre dominates Tide, Aether, Radiance
  [6, 0, 1], // Tide dominates Aether, Radiance, Umbra
  [0, 1, 2]  // Aether dominates Radiance, Umbra, Tempest
];

/**
 * The Seven Divine Aspects
 */
export const ASPECTS = [
  new DivineAspect(0, 'Radiance', '☀️', '#FFD700', 'The piercing light that banishes shadow, storm, and earth'),
  new DivineAspect(1, 'Umbra', '🌙', '#6B46C1', 'The encompassing darkness that smothers storm, earth, and fire'),
  new DivineAspect(2, 'Tempest', '⚡', '#00D4FF', 'The raging storm that scatters earth, fire, and water'),
  new DivineAspect(3, 'Terra', '⛰️', '#8B4513', 'The unyielding stone that withstands fire, tide, and void'),
  new DivineAspect(4, 'Pyre', '🔥', '#FF4500', 'The eternal fire that consumes water, void, and light'),
  new DivineAspect(5, 'Tide', '🌊', '#006994', 'The flowing sea that reflects void, light, and shadow'),
  new DivineAspect(6, 'Aether', '✨', '#9333EA', 'The infinite void that absorbs light, shadow, and storm')
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