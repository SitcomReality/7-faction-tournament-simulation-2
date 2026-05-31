# Implementation Status & Roadmap

## Current State: Core Loop & Divine Aspects Playable ✓

The Supernal Interregnum now has a fast, tactile core loop: you can Awaken Aspects, Manifest them onto a generated map, and watch the cosmic wheel resolve clashes in real time.

---

## Phase 1: Architecture Refactor ✓ COMPLETE

**Status: All core refactoring done**

✅ Removed simulation systems (InfluenceSystem, ParticleSystem, ConversionAnimation)  
✅ Removed Voronoi/Heptagonal grid support  
✅ Cleaned up SimulationEngine → GameEngine  
✅ Simplified GameState (removed old simulation parameters)  
✅ Updated Cell class (removed influence, added owner/unitType/visibility properties)  
✅ Updated grid systems (Triangle, Square, Hex all functional)  
✅ Removed obsolete UI (old simulation controls)  
✅ Restructured TournamentGraph → UnitRelationships (read-only)  
✅ Replaced old RelationshipGraph with CosmicWheel visualization  

**Result:** A lean, modular architecture where `SystemOrchestrator` wires together explicit systems (world, rendering, HUD, engine, audio) and `main.js`/`App.js` are pure entrypoints.

---

## Phase 2: Sacred Turns System ✓ COMPLETE (SIMPLIFIED)

**Status: Turn loop and action execution implemented with an immediacy-first design.**

✅ `TurnManager` handles a single intuitive phase (`active`) and rotates the active player  
✅ `GameEngine.executeAction` validates and executes actions immediately for instant feedback  
✅ Essence generation per turn is implemented in `TurnManager.advanceTurn`  
✅ HUD integrates turn counter and active player display (`HUD.updateTurnDisplay`)  
✅ Basic `Action` base class and `PassAction` defined (pass currently implicit via "End Turn")  

**Design Note:** We deliberately cut the multi-phase queueing (Planning/Resolution/Cleanup) for now in favor of "tap → action → feedback" to keep the dopamine loop tight and UX friction low; the docs now reflect this simplified, more approachable turn structure.

---

## Phase 3: Divine Aspects System ✓ PLAYABLE

**Status: Aspects, cosmic wheel, and core rituals are implemented end‑to‑end.**

✅ `DivineAspect.js` defines the 7 primal forces and the Paley/Fano 7‑tournament  
✅ `aspectDominates` and `UnitRelationships` expose immutable dominion logic  
✅ `Player` tracks `awakenedAspects` (starting Triad 0,1,2) and Essence reserves with escalating Awakening costs  
✅ `AwakenAction` and `ManifestAction` are fully implemented and wired into `GameEngine.executeAction`  
✅ Territorial conflict resolution is in `ManifestAction.execute` (adjacent clashes resolved via the cosmic wheel, ownership updates, events fired)  
✅ `AspectPalette` UI exists and is hooked up to Awakening and Manifestation selection  
✅ `CosmicWheel` visualizes all 7 nodes and all 21 directed edges, highlighting wins/losses on hover  
✅ Audio feedback (`AudioManager`) and particle FX (`Renderer2D.spawnParticles`) reinforce Manifest/Awaken/Clash events  

⚠️ **Remaining / Nice-to-have:**
- [ ] Replace emoji symbols with final sacred-geometry SVGs and draw them consistently in both grid and CosmicWheel
- [ ] Add a lightweight tooltip/legend overlay explaining the wheel (especially on mobile)  
- [ ] Surface Essence income more clearly per turn in the HUD (e.g., "+3 ✨ this turn" micro-feedback)

**Design Note:** The Aspects layer already supports deep strategy; the biggest UX gains now come from explanation and surface polish, not new rules.

---

## Phase 4: Claimant Houses System ⏸️ PARTIALLY EMERGED

**Status: Players exist and own territory, but House identity & UI are minimal.**

✅ `Player` class represents a claimant with id, name, color, AI flag, territories, Essence, and awakened Aspects  
✅ `GameEngine.createDefaultPlayers` creates two players by default with distinct colors  
✅ `WorldController.setupWorld` assigns each player a random starting land cell with an initial manifested Aspect  
✅ Renderer colors owned cells and manifested Aspects using theme faction colors (`Renderer2D.getCellColor`)  
✅ Basic turn HUD shows active player name and global turn state  

🚧 **To implement / improve:**
- [ ] Flesh out distinct House lore/names from `lore.md` and apply them as player names/sigils
- [ ] Separate "House color" from "Aspect color" more clearly in rendering (e.g., borders vs unit glyphs)
- [ ] Implement more deliberate spawn algorithms (balanced distance, custom presets) instead of pure random land selection
- [ ] Add a dedicated PlayerInfo / Houses panel showing each claimant's Essence, territories, awakened Aspects, and elimination state
- [ ] Handoff/hot‑seat UX (basic "Pass device" overlay) once multi-human play is exposed

**Design Note:** You're already halfway to Houses just by how ownership and Essence work; wrapping this in clear identity/UI will make the game vastly more readable.

---

## Phase 5: The Veil of Knowing (Fog of War) ⏸️ NOT STARTED (STRUCTURAL HOOKS READY)

**Status:** No fog logic or rendering yet, but `Cell.visible`/`explored` Sets already exist and can be used.

**What's needed:**
- [ ] Define vision sources (owned cells vs manifested Aspects vs future "scout" mechanics) and ranges
- [ ] Implement per-player visibility recalculation on each action/turn
- [ ] Fog rendering in `Renderer2D` (unexplored → black, explored-not-visible → dimmed, visible → normal)
- [ ] Adjust unit rendering to hide/ghost enemy Aspects in fog
- [ ] Optionally add fog toggle in settings (with clear "for learning only" warning)
- [ ] Optional: minimap stub that reuses fog data

**UX Note:** When you add fog, pair it with subtle reveal animations and a clear "you just discovered X more Sanctums" prompt to keep exploration feeling rewarding rather than confusing.

---

## Phase 6: AI Claimants ⏸️ BASIC AI HOOKS PRESENT

**Status:** There is a very simple AI loop already in `GameEngine.update` / `takeAITurn`, but no difficulty tiers.

✅ AI players are flagged via `Player.isAI` and created by default for non‑human players  
✅ `GameEngine.update` ticks AI every ~1s and calls `takeAITurn`  
✅ AI will:
  - Attempt to Awaken a random unowned Aspect when it can afford it
  - Attempt to Manifest a random awakened Aspect into a valid land cell (adjacent to its territory or any land if it has none)
  - End turn when no useful actions are found  

🚧 **To expand:**
- [ ] Extract AI logic into dedicated `AIPlayer` / AI modules rather than keeping it baked into `GameEngine`
- [ ] Implement basic heuristics (territory value, matchup awareness via `aspectDominates`, "don't suicide into hard counters")
- [ ] Add difficulty levels that mainly change lookahead depth and risk tolerance
- [ ] Show a subtle "AI thinking…" indicator when the AI holds the turn a moment for UX clarity
- [ ] Allow AI/human assignment and difficulty selection in a future Game Setup screen

**Design Note:** Even this simple AI creates a playable solo loop; next steps should focus on *predictable behavior* (so players can learn) before raw strength.

---

## Phase 7: Visual Manifestation & UX Polish ⏸️ EARLY PASS DONE

**Status:** There is already a cohesive dark-void aesthetic with theme switching, aspect glows, particle FX, and responsive HUD panes, but it's still closer to a prototype than a finished "sacred UI".

✅ Color themes in `ColorThemes` and `themeChanged` wiring in `GameState` / `CosmicWheel`  
✅ `Renderer2D` shows pulsing Aspect glows, manifestation particles, and color-coded territories  
✅ `HUD` uses glassy panels, bottom-bar controls, and tabbed settings (Map Gen / Visual)  
✅ Essence and Awakening costs are visible in the AspectPalette, with disabled states for unaffordable Aspects  
✅ Audio feedback exists for manifesting, awakening, and clashes  

🚧 **High-impact polish tasks:**
- [ ] Replace emojis with consistent sacred-geometry icons across UI and grid
- [ ] Add a compact "What beats what?" legend accessible from the bottom bar for first-time players
- [ ] Improve mobile ergonomics: slightly larger tap targets for palette/aspect buttons and bottom-bar controls
- [ ] Add micro-feedback for Essence changes (e.g., a brief "+2 ✨" float near the Essence display each turn)
- [ ] Animate panel show/hide with slightly shorter durations for snappier feel on mobile
- [ ] Add subtle hover/tap outlines for valid Manifest cells when an Aspect is selected

**UX Note:** The experience is already very "one screen, no scrolling" friendly; the biggest wins are in clarity and teaching, not new widgets.

---

## Phase 8: Ritual Configuration & Multiplayer Scaffolding ⏸️ NOT STARTED

**Status:** None of the configuration/multiplayer scaffolding from the Phase 8 doc is implemented yet; the game boots directly into a default local skirmish.

**What's needed:**
- [ ] Create a `GameSetup` UI shown before the main loop, with options for:
  - Player count (1–7), human vs AI toggles, and AI difficulty per player
  - Map size, grid type, map type, and boundary shape (reusing `GenerationSettings` under the hood)
  - Starting territory / Essence presets and victory conditions
- [ ] Add hot-seat privacy options and a simple "Pass to Player X" overlay at turn end when multiple humans are present
- [ ] Implement game state serialization (export/import JSON) and basic save/load from localStorage
- [ ] Stub online systems (lobby, room codes, reconnection strategy) without committing to a protocol yet  

**Design Note:** You already have a flexible world and state model; the setup screen is mostly about wiring existing knobs into a friendly, low-friction flow.

---

## Technical Debt & Known Issues

### Current Issues / Mismatches with Older Docs:
1. **Turn Phases** – Docs referenced Planning/Resolution/Cleanup queueing, but code now uses a single `active` phase with immediate execution; docs and roadmap updated to match.
2. **Unit vs Aspect language** – Older "unit/power" terminology has been superseded by Divine Aspects and Manifestations; remaining references should be treated as flavor rather than separate systems.
3. **Player/Houses** – Code already supports multi-player with basic colors, but the "House" flavor layer and sigils are not yet implemented.

### Future Considerations:
- Performance optimization for very large maps (e.g., culling, batched drawing)
- Additional mobile affordances (long-press hints, haptics if available)
- Accessibility: colorblind-friendly themes and higher-contrast mode
- Replay / export of finished matches for shareable "divine stories"
- More granular Audio controls (music vs SFX sliders)

---

## Success Metrics (from overview.md)

We can call this version "spiritually complete" when:

- [ ] New players understand the cosmic wheel within 2–3 turns thanks to visual teaching aids
- [ ] Games feel different each time (varied maps, House personalities, AI behaviors)
- [ ] Every Essence decision feels meaningful (no obvious "always do X" heuristic)
- [ ] Performance is smooth on mobile and desktop
- [ ] AI provides a learnable, gradually increasing challenge
- [ ] Players create memorable clutch stories ("my Tide surrounded their Pyre just in time...")
- [ ] Visual/audio polish makes every Manifest/Awaken/Clash satisfying
- [ ] Hot seat multiplayer works without confusion or spoilers between players

---

## Notes

The current build already delivers a surprisingly tight little divine skirmish; the remaining roadmap focuses on clarity (teaching the wheel), identity (Houses, sigils), and flexibility (setup and multiplayer) rather than adding more raw rules.

**Philosophy:** Keep the core loop simple, legible, and satisfying; reserve complexity for the cosmic relationships and long-term planning, not the UI.