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

## Stage 2: Unlock System

### Step 2.1: Player Research State
- Add unlockedUnits Set to player state
- Start each player with the same 3 units (0, 1, 2 with R-P-S)
- Track research progress/costs

### Step 2.2: Unlock Actions
- Implement research/unlock action
- Define unlock costs (turns, resources, etc.)
- Validate unlock prerequisites
- Apply unlock to player state

### Step 2.3: Lock Visual Feedback
- Show locked units in UI as unavailable
- Show unlock cost/requirements
- Highlight when unlock is available
- Celebrate unlock with animation/notification

## Stage 3: Unit Placement & Combat

### Step 3.1: Placement System
- Define placement rules (only on owned territory?)
- Implement spawn action
- Limit spawns per turn if needed
- Show available spawn locations

### Step 3.2: Movement System
- Implement move action
- Define movement range per unit type
- Validate move targets (terrain, ownership, etc.)
- Show movement preview

### Step 3.3: Combat Resolution
- Implement combat when units meet
- Use relationship graph for combat outcomes
- Handle ties/conflicts with multiple units
- Remove defeated units
- Transfer territory ownership

## Stage 4: Unit UI

### Step 4.1: Unit Palette
- Create UnitPalette.js UI component
- Show available (unlocked) units
- Show locked units grayed out
- Allow selecting unit for placement

### Step 4.2: Unit Display
- Render unit symbols on grid cells
- Color units by player color
- Add unit type indicator overlay
- Show unit selection state

### Step 4.3: Relationship Graph Updates
- Update RelationshipGraph to show unit types not factions
- Use unit colors and symbols
- Show locked units differently
- Make completely read-only (no drag, no shuffle)

## Notes
After this phase, the 7 units exist with clear relationships. Players start with 3 unlocked and can unlock more. Basic unit placement and combat work within the turn system.