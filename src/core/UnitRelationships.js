import { aspectDominates } from './DivineAspect.js';

/**
 * UnitRelationships - Wrapper around the Divine Aspects cosmic wheel
 * Maintains compatibility with existing relationship graph UI
 */
export class UnitRelationships {
  constructor() {
    // Divine dominance is immutable - defined in DivineAspect.js
  }

  /**
   * Check if aspect A beats aspect B in divine conflict
   */
  beats(a, b) {
    return aspectDominates(a, b);
  }
}