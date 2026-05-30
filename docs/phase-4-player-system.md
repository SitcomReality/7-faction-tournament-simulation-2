# Phase 4: Player System & Territory Control

## Overview
Implement multi-player support with distinct player identities and territory ownership.

## Stage 1: Player Data Structure

### Step 1.1: Player Class
- Create Player.js class
- Track player ID, name, color
- Track unlocked units
- Track owned territories (cell references or IDs)
- Track resources if applicable

### Step 1.2: Player Colors
- Define 7 distinct player colors
- Ensure player colors distinct from unit colors
- Ensure player colors distinct from UI colors
- Create color palette that works together visually

### Step 1.3: Player Management
- Add players array to GameState
- Support 1-7 players
- Assign colors sequentially
- Handle player elimination

## Stage 2: Territory Ownership

### Step 2.1: Cell Ownership
- Add owner property to Cell (player index or null)
- Track when ownership changes
- Clear units when territory is captured
- Update adjacent territory logic if needed

### Step 2.2: Territory Display
- Color cells by owner (player color)
- Show borders between different owners
- Highlight contested territories
- Show neutral (unowned) territories distinctly

### Step 2.3: Territory Actions
- Implement claim territory action
- Implement territory transfer in combat
- Define territory control rules
- Track territory statistics per player

## Stage 3: Starting Positions

### Step 3.1: Spawn Point Selection
- Define starting position algorithms
- Implement random spawn
- Implement fixed spawn points
- Implement balanced spawn (equidistant)

### Step 3.2: Initial Territory
- Grant starting territory to each player
- Give each player a small area or single cell
- Optionally spawn starting units
- Ensure fair starting positions

## Stage 4: Player UI

### Step 4.1: Player Info Panel
- Create PlayerInfo.js component
- Show active player clearly
- List all players with colors
- Show eliminated/remaining players
- Display player statistics

### Step 4.2: Player Indicators
- Add player color indicators to top bar
- Show active player with highlight or border
- Display player resources/stats inline
- Update indicators during turn transitions

### Step 4.3: Hot Seat Mode UI
- Show "Pass device to Player X" screen between turns
- Optionally hide game state during handoff
- Confirm before showing next player's view
- Add optional turn password/privacy

## Notes
After this phase, multiple players can participate with distinct colors and territories. Starting positions are assigned and territory ownership is tracked and displayed.