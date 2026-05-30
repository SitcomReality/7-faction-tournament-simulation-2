# Phase 1: Architecture Refactor

## Overview
Remove simulation-specific systems and prepare the codebase for turn-based gameplay.

## Stage 1: Remove Simulation Systems

### Step 1.1: Remove Influence System
- Delete InfluenceSystem.js
- Remove influence tracking from Cell.js (influences array, hasInfluence, etc.)
- Remove influence-related methods from Cell class

### Step 1.2: Remove Particle and Animation Systems
- Delete ParticleSystem.js
- Delete ConversionAnimation.js
- Remove particle/animation rendering from Renderer2D
- Remove FX canvas references

### Step 1.3: Clean Up SimulationEngine
- Remove real-time update loop
- Remove tick-based spreading mechanics
- Simplify to basic state management
- Rename to GameEngine or similar

### Step 1.4: Remove Voronoi Grid
- Delete HeptagonalGrid.js
- Delete HeptCell.js
- Delete VoronoiBuilder.js
- Update grid type selector to only include triangle, square, hex

## Stage 2: Simplify GameState

### Step 2.1: Remove Simulation Parameters
- Remove influencePerTick, conversionThreshold, influenceDecayRate
- Remove randomVariation, oceanTransmissionRate
- Remove simulationSpeed and tick-based timing
- Remove wrapping enable/disable (decide on a fixed approach)

### Step 2.2: Add Turn-Based State
- Add currentTurn property (number)
- Add activePlayer property (player index)
- Add turnPhase property (planning, resolution, etc.)
- Add players array with player state objects

### Step 2.3: Restructure Stats
- Remove active cells, tick time tracking
- Add turn count, moves made, units deployed stats
- Add per-player statistics

## Stage 3: Update Grid Systems

### Step 3.1: Simplify Cell Class
- Remove all influence-related properties
- Add owner property (player index or null)
- Add unitType property (which of 7 units/powers occupies this cell)
- Add visibility property (for fog of war)
- Add terrain property (if keeping different terrain types)

### Step 3.2: Update Grid Classes
- Ensure TriangularGrid, SquareGrid, HexGrid work correctly
- Remove any simulation-specific methods
- Add methods for neighbor queries needed for gameplay
- Ensure consistent interface across all grid types

## Stage 4: Clean Up UI

### Step 4.1: Remove Obsolete UI
- Delete SimulationSettings.js (will rebuild as GameSettings)
- Remove faction controls from HUD
- Remove influence blending toggle
- Remove conversion animation toggle
- Remove speed/tick controls

### Step 4.2: Simplify Visual Settings
- Keep only essential visual toggles
- Remove glow/fill settings if not needed for turn-based game
- Prepare for new UI elements in later phases

### Step 4.3: Update HUD Structure
- Remove bottom bar simulation controls
- Prepare space for turn controls
- Prepare space for player info display
- Keep relationship graph area (will be repurposed)

## Stage 5: Restructure Tournament Graph

### Step 5.1: Rename and Repurpose
- Rename TournamentGraph to UnitRelationships or PowerGraph
- Make relationships read-only (remove shuffle, drag-to-edit)
- Lock in default 2-paradoxical structure

### Step 5.2: Update Relationship Display
- Make RelationshipGraph.js non-interactive
- Show clear win/loss indicators
- Add locked icon or visual to show it cannot be edited
- Optimize display for quick reference during gameplay

## Notes
This phase focuses on removing complexity and preparing a clean foundation. Code will be broken/incomplete after this phase - that is expected and intentional. Subsequent phases will rebuild functionality in a turn-based context.