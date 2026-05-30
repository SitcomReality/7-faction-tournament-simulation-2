# Phase 6: AI System

## Overview
Implement computer opponents with configurable difficulty.

## Stage 1: Basic AI Structure

### Step 1.1: AI Player Class
- Create AIPlayer.js extending Player
- Add difficulty property (easy, medium, hard)
- Add decision-making methods
- Track AI-specific state

### Step 1.2: AI Turn Processing
- Implement AI turn in TurnManager
- Give AI time to "think" (delay for UX)
- Make AI decisions feel natural
- Process AI actions in resolution phase

### Step 1.3: AI Action Selection
- Define action priorities
- Select units to place/move
- Select targets for actions
- Balance offensive vs defensive actions

## Stage 2: AI Heuristics

### Step 2.1: Territory Evaluation
- Score territories by value
- Consider territory placement (central vs edge)
- Factor in adjacent territories
- Account for resource generation

### Step 2.2: Threat Assessment
- Identify nearby enemy units
- Calculate power balance
- Recognize favorable matchups (via unit relationships)
- Retreat from unfavorable situations

### Step 2.3: Expansion Strategy
- Expand toward unoccupied territories
- Avoid overextension
- Maintain defensive positions
- Balance expansion with consolidation

## Stage 3: Difficulty Scaling

### Step 3.1: Easy AI
- Random but legal moves
- No long-term planning
- Makes obvious mistakes
- Reacts only to immediate threats

### Step 3.2: Medium AI
- Evaluates matchups correctly
- Plans 1-2 turns ahead
- Expands systematically
- Uses basic tactics

### Step 3.3: Hard AI
- Optimizes unit placement
- Plans several turns ahead
- Adapts to player strategy
- Uses advanced tactics
- Unlocks units strategically

## Stage 4: AI UI

### Step 4.1: AI Indicators
- Show which players are AI
- Display AI difficulty
- Show AI "thinking" state
- Animate AI actions clearly

### Step 4.2: AI Configuration
- Add AI difficulty selector in game setup
- Allow mix of human and AI players
- Configure AI behavior parameters
- Optionally view AI decision logic

## Notes
After this phase, players can compete against computer opponents at different difficulty levels. AI provides single-player gameplay and fills empty player slots in multiplayer.