# Phase 5: Fog of War

## Overview
Implement visibility system to create information asymmetry and exploration gameplay.

## Stage 1: Visibility System

### Step 1.1: Cell Visibility State
- Add visible property to Cell (per-player)
- Add explored property to Cell (per-player)
- Track visibility separately for each player
- Default all cells to unexplored/invisible

### Step 1.2: Vision Rules
- Define vision range for units
- Define vision from owned territories
- Implement line of sight if needed
- Update vision when state changes

### Step 1.3: Visibility Updates
- Calculate visible cells for active player
- Update explored status (once seen, always revealed)
- Hide enemy units in fog
- Show last-known state for explored but not visible cells

## Stage 2: Fog Rendering

### Step 2.1: Fog Display
- Render unexplored cells as black or very dark
- Render explored but not visible cells as darkened/grayed
- Render visible cells normally
- Add fog border/transition effects

### Step 2.2: Unit Visibility
- Hide units in fog completely
- Show units in explored-but-not-visible as ghost/outline
- Show units in visible cells normally
- Add reveal animation when units appear

### Step 2.3: Territory Visibility
- Show ownership in explored areas even if not visible
- Option to hide exact unit types in fog
- Show approximate territory control
- Update fog smoothly during turn transitions

## Stage 3: Exploration Mechanics

### Step 3.1: Vision Expansion
- Grant vision when claiming new territory
- Grant vision when moving units
- Maintain vision from owned territories
- Lose vision when losing territory

### Step 3.2: Scouting
- Encourage exploration gameplay
- Potentially add scout unit or high-vision unit
- Reveal map features upon exploration
- Track exploration statistics

## Stage 4: Fog of War UI

### Step 4.1: Visibility Toggle
- Add option to toggle fog of war on/off in settings
- Show warning that disabling removes strategic element
- Persist fog setting in game config
- Update fog immediately when toggled

### Step 4.2: Minimap (Optional)
- Add small minimap showing explored areas
- Use fog shading on minimap
- Click minimap to move camera
- Show player positions on minimap

## Notes
After this phase, each player has limited visibility based on their units and territories. Fog of war adds strategic depth and creates opportunities for ambushes and surprises.