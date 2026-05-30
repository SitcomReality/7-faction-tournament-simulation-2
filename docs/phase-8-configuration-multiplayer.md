# Phase 8: Configuration & Multiplayer

## Overview
Implement comprehensive game setup options and prepare for online multiplayer.

## Stage 1: Game Setup Screen

### Step 1.1: Setup UI
- Create GameSetup.js component
- Show before game starts
- Allow returning to setup from game
- Save setup configurations

### Step 1.2: Basic Options
- Number of players (1-7)
- Map size
- Grid type (triangle, square, hex)
- Map type (continents, pangaea, archipelago, etc.)

### Step 1.3: Advanced Options
- Starting territories per player
- Starting units per player
- Fog of war on/off
- Turn timer on/off and duration
- Victory conditions

### Step 1.4: Player Configuration
- Assign player names
- Assign player colors (auto or manual)
- Set player as human or AI
- Set AI difficulty per AI player

## Stage 2: Map Generation Options

### Step 2.1: Map Templates
- Small/Medium/Large presets
- Balanced competitive maps
- Asymmetric maps
- Custom map size

### Step 2.2: Terrain Types
- Land/ocean ratio
- Mountain/forest features if applicable
- Starting position balance
- Resource distribution

### Step 2.3: Starting Positions
- Random spawn
- Fixed spawn points
- Mirrored/symmetrical spawns
- Custom placement mode

## Stage 3: Hot Seat Implementation

### Step 3.1: Turn Handoff
- Hide game state during handoff
- Show "Pass to Player X" screen
- Optional turn password
- Confirm before revealing next player's view

### Step 3.2: Privacy Options
- Option to hide all units during handoff
- Option to clear fog temporarily
- Option to skip handoff screen
- Trusted mode (no hiding)

## Stage 4: Online Multiplayer Prep

### Step 4.1: Game State Serialization
- Serialize entire game state to JSON
- Deserialize and validate state
- Implement state diffing for efficiency
- Handle state conflicts

### Step 4.2: Network Architecture Planning
- Choose backend (Firebase, Socket.io, WebRTC, etc.)
- Design game room system
- Design matchmaking or lobby
- Plan reconnection handling

### Step 4.3: Action Validation
- Validate all actions server-side (or client-side if P2P)
- Prevent cheating
- Handle latency
- Synchronize turn timing

### Step 4.4: Online UI Scaffolding
- Login/account system stub
- Game lobby stub
- Friend system stub
- Chat system stub

## Stage 5: Configuration Persistence

### Step 5.1: Save/Load Games
- Export game state to file
- Import game state from file
- Auto-save on turn end
- Load saved game on startup

### Step 5.2: Preferences
- Save UI preferences (volume, tooltips, etc.)
- Save default game setup options
- Save keybindings if applicable
- Sync preferences across sessions

## Notes
After this phase, the game is feature-complete for local play with comprehensive configuration options. Online multiplayer infrastructure is planned and scaffolded but not fully implemented. Online play will be a future phase/version.