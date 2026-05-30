# Phase 2: Turn System & Game Loop

## Overview
Implement the core turn-based game loop and turn management system.

## Stage 1: Turn State Management

### Step 1.1: Define Turn Structure
- Create TurnManager.js class
- Define turn phases: Planning, Resolution, Cleanup
- Track current turn number
- Track active player index

### Step 1.2: Player Turn Queue
- Implement turn order system
- Support simultaneous turns (when players don't interact)
- Support sequential turns (hot seat mode)
- Handle turn skip/pass functionality

### Step 1.3: Action Queue
- Create action queue for each player
- Store planned actions during planning phase
- Validate actions before adding to queue
- Clear queue after resolution

## Stage 2: Turn Resolution

### Step 2.1: Action Processing
- Process all queued actions in resolution phase
- Implement conflict resolution for simultaneous actions
- Update game state based on action results
- Generate events/notifications from actions

### Step 2.2: State Updates
- Update territory ownership
- Update unit positions
- Update player resources
- Update visibility (fog of war prep)
- Check win/loss conditions

### Step 2.3: Turn Cleanup
- Clear temporary state
- Prepare for next turn
- Advance turn counter
- Advance active player

## Stage 3: Turn UI

### Step 3.1: Turn Control Bar
- Add "End Turn" button
- Add turn counter display
- Add active player indicator
- Add turn phase indicator

### Step 3.2: Turn Feedback
- Show when waiting for other players
- Show turn transition animations
- Display turn summary
- Show action confirmations

### Step 3.3: Turn Timer (Optional)
- Add configurable turn timer
- Show countdown display
- Auto-end turn when timer expires
- Make timer optional in game setup

## Stage 4: Input Handling

### Step 4.1: Action Input
- Capture player actions during planning phase
- Prevent actions outside planning phase
- Show action preview before committing
- Allow action cancellation before turn end

### Step 4.2: Camera/View Controls
- Allow camera movement during any phase
- Allow inspecting units/territories
- Show information panels without committing actions
- Keep view state between turns

## Notes
After this phase, the basic turn structure exists but there are no actual game actions yet (units, movement, etc.). The turn loop should cycle properly even with placeholder/empty actions.