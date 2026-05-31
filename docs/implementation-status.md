# Implementation Status & Roadmap

## Current State: Phase 1 Complete ✓

The Supernal Interregnum is in early development. Here's what's been accomplished and what's next.

---

## Phase 1: Architecture Refactor ✓ COMPLETE

**Status: All core refactoring done**

✅ Removed simulation systems (InfluenceSystem, ParticleSystem, ConversionAnimation)  
✅ Removed Voronoi/Heptagonal grid support  
✅ Cleaned up SimulationEngine → GameEngine  
✅ Simplified GameState (removed simulation parameters)  
✅ Updated Cell class (removed influence, added owner/unitType properties)  
✅ Updated grid systems (Triangle, Square, Hex all functional)  
✅ Removed obsolete UI (old simulation controls)  
✅ Restructured TournamentGraph → UnitRelationships (read-only)  
✅ Updated RelationshipGraph UI (non-interactive, locked relationships)  

**Ready for Phase 2**

---

## Phase 2: Sacred Turns System ✓ COMPLETE

**Status: Core turn loop and infrastructure finalized**

✅ TurnManager.js handles Planning, Resolution, and Cleanup  
✅ Action queue and simultaneous resolution logic implemented  
✅ HUD integrates turn counters and phase indicators  
✅ Player system supports multi-claimant tracking  
✅ Basic Action base class and PassAction defined  

---

## Phase 3: Divine Aspects System 🔄 IN PROGRESS

**Status: Data structures and cosmic wheel logic implemented**

✅ DivineAspect.js defines the 7 primal forces  
✅ UnitRelationships.js (Cosmic Wheel) handles immutable 2-paradoxical dominion  
✅ Player state tracks Awakened Aspects and Essence reserves  
✅ Essence cost scaling logic implemented in Player.js  

⚠️ **Needs Implementation:**
- [ ] Design sacred geometry SVG paths for each Aspect
- [ ] Create `ManifestAspect` and `AwakenAspect` Action subclasses
- [ ] Implement territorial conflict resolution (dominion-based dispersion)
- [ ] Build AspectPalette UI for selection and awakening rituals
- [ ] Update RelationshipGraph to use sacred symbols and names

---

## Phase 4: Claimant Houses System ⏸️ NOT STARTED

**What's needed:**
- [ ] Define 7 Claimant House identities and lore
- [ ] Create House color palette (distinct from Aspect colors)
- [ ] Implement territory ownership display
- [ ] Create spawn point algorithms (balanced, random, fixed)
- [ ] Grant starting territories to Houses
- [ ] Build PlayerInfo UI panel
- [ ] Add House indicators to top bar
- [ ] Implement hot seat handoff screen

**Dependencies:** Phase 3 (Aspects must exist to grant starting Triad)

---

## Phase 5: The Veil of Knowing ⏸️ NOT STARTED

**What's needed:**
- [ ] Add visibility properties to Cell (per-player visible/explored Sets)
- [ ] Define vision rules (range from Sanctums, from Manifestations)
- [ ] Calculate visible cells each turn
- [ ] Implement fog rendering (unexplored = dark, explored = grayed)
- [ ] Hide/show enemy Aspects in fog
- [ ] Add exploration reveal animations
- [ ] Create fog of war toggle in settings
- [ ] Optional: Minimap with fog

**Dependencies:** Phase 4 (multi-player must work)

---

## Phase 6: AI Claimants ⏸️ NOT STARTED

**What's needed:**
- [ ] Create AIPlayer.js extending Player
- [ ] Implement basic heuristics (territory value, threat assessment)
- [ ] Add difficulty levels (easy/medium/hard)
- [ ] AI turn processing with "thinking" delay
- [ ] AI Awakening strategy (which Aspects to unlock when)
- [ ] AI manifestation logic (optimal placement)
- [ ] AI indicators in UI
- [ ] Difficulty selector in game setup

**Dependencies:** Phase 5 (full game rules must exist)

---

## Phase 7: Visual Manifestation ⏸️ NOT STARTED

**What's needed:**
- [ ] Design final Aspect SVG symbols (sacred geometry)
- [ ] Create House sigil designs
- [ ] Implement divine light color system
- [ ] Add Awakening ceremony animations
- [ ] Add Manifestation spawn effects
- [ ] Create divine conflict clash animations
- [ ] Territory capture animations
- [ ] Polish all button states and transitions
- [ ] Add tooltips and help text
- [ ] Optional: Sound effects and music

**Dependencies:** Phase 6 (all systems operational)

---

## Phase 8: Ritual Configuration ⏸️ NOT STARTED

**What's needed:**
- [ ] Create GameSetup.js UI component
- [ ] Add player count configuration (1-7)
- [ ] Map size/type/generation presets
- [ ] Starting position options
- [ ] Victory condition selection
- [ ] AI difficulty per player
- [ ] Game state serialization (save/load)
- [ ] Hot seat privacy options
- [ ] Preferences persistence
- [ ] Online multiplayer scaffolding (future)

**Dependencies:** Phase 7 (full game polish complete)

---

## Current Development Focus

**Phase 2 & 3 Complete: The Turn System has been vastly improved!**
Pivoted from simultaneous queueing to immediate-action turns. Actions provide instant visual/audio feedback (dopamine hit!). Cosmic conflict dynamically resolves when aspects clash.

**Immediate Priority: Polish & Visuals (Phase 7 Elements)**
The core gameplay loop is incredibly tight now. Next up:
1. Improve UI panels for player stats
2. Add more distinct House Sigils / visual indicators
3. Expand Audio context (ambient drones?)

**Estimated Time to Playable Alpha:**
- Phase 2 completion: 1-2 sessions
- Phase 3 (Divine Aspects): 2-3 sessions  
- Phase 4 (Houses): 1-2 sessions
- **First playable build: ~5-7 sessions total**

At that point, we'll have:
- Turn-based gameplay ✓
- 7 Divine Aspects with cosmic relationships ✓
- Multiple Houses competing for Sanctums ✓
- Basic win conditions ✓
- Hot seat multiplayer ✓

---

## Technical Debt & Known Issues

### Current Issues:
1. **Color interpolation error** (fixed) - HexRenderer now has defensive color handling
2. **Grid regeneration** - Works but could be smoother, terrain preservation toggle added
3. **Paint mode** - Functional but could use better visual feedback

### Future Considerations:
- Performance optimization for large maps (100+ cells should render smoothly)
- Mobile touch controls for Aspect selection
- Accessibility: colorblind modes, screen reader support
- State validation and anti-cheat for online multiplayer
- Replay system to review games
- Map editor for custom scenarios

---

## Success Metrics (from overview.md)

When can we say the game is "done"?

- [ ] New players understand cosmic wheel within 2-3 turns
- [ ] Games feel different each time (varied maps, House matchups)
- [ ] Every decision feels meaningful
- [ ] Smooth performance on mobile and desktop
- [ ] AI provides reasonable challenge
- [ ] Players create memorable "clutch play" stories
- [ ] Visual polish makes actions satisfying
- [ ] Hot seat multiplayer works flawlessly

---

## Notes

This is a passion project focused on creating a tight, polished turn-based strategy experience. We're working methodically through phases, ensuring each system is solid before moving to the next.

**Philosophy:** Better to have 80% of features at 100% quality than 100% of features at 80% quality.

Next session: Focus on completing Phase 2's action system and turn resolution logic.