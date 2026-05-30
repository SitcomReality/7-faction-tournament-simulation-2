<<<<<<< SEARCH
# Phase 3: Unit/Power System

## Overview
Implement the 7 units/powers with their relationships and unlocking mechanics.

## Stage 1: Define Units/Powers

### Step 1.1: Unit Data Structure
- Create UnitType.js class
- Define 7 unit types with unique IDs
- Assign SVG path symbols to each unit
- Assign colors to each unit (distinct from player colors)
- Define stats (if any): movement range, strength, etc.

### Step 1.2: Unit Relationships
- Hard-code the 2-paradoxical relationship graph
- Make relationships immutable
- Create helper methods: beats(unitA, unitB)
- Create helper: getCounters(unitType) returns units that beat it
- Create helper: getWinsAgainst(unitType) returns units it beats

### Step 1.3: Unit Instances
- Create Unit.js class for individual unit instances
- Track unit type, owner, position
- Track health/state if needed
- Track movement availability
=======
# Phase 3: Divine Aspects System

## Overview
Implement the 7 Divine Aspects with their cosmic relationships, manifestation mechanics, and Awakening rituals.

## Stage 1: Define Divine Aspects

### Step 1.1: Divine Aspect Data Structure
- Create DivinAspect.js class defining each of the 7 primal forces
- Assign unique IDs (0-6) mapping to Radiance, Umbra, Tempest, Terra, Pyre, Tide, Aether
- Design sacred geometry SVG symbols for each Aspect
- Assign divine light colors (distinct from House sigil colors)
- Define manifestation properties: vision range, special effects

**The Seven Aspects:**
```javascript
{
  id: 0, name: 'Radiance', symbol: '☀️', color: '#FFD700',
  id: 1, name: 'Umbra', symbol: '🌙', color: '#1a1a2e',
  id: 2, name: 'Tempest', symbol: '⚡', color: '#00d4ff',
  id: 3, name: 'Terra', symbol: '⛰️', color: '#8B4513',
  id: 4, name: 'Pyre', symbol: '🔥', color: '#ff4500',
  id: 5, name: 'Tide', symbol: '🌊', color: '#006994',
  id: 6, name: 'Aether', symbol: '✨', color: '#9333ea'
}