# The Supernal Interregnum: Design Overview

## Setting
In the aftermath of the Godsfall, seven Divine Aspects remain scattered across the shattered realm. Ancient pantheons have crumbled, and mortal champions now vie to claim the fragments of divine power, seeking to ascend or restore the cosmic order.

## Core Concepts

### The Seven Divine Aspects
Seven primal forces with cosmic opposition embedded in their nature. Each Aspect:
- Manifests through unique sacred geometry (SVG symbol)
- Resonates with a specific color of divine light
- Forms natural dominion over two others while yielding to two others (2-paradoxical cosmic wheel)
- Grants unique tactical advantages when invoked

**The Aspects:**
1. **Radiance** (Light/Sun) - Pierces shadow, blinds storm
2. **Umbra** (Shadow/Moon) - Smothers radiance, drowns earth  
3. **Tempest** (Storm/Sky) - Scatters fire, erodes earth
4. **Terra** (Earth/Stone) - Grounds tempest, ossifies tide
5. **Pyre** (Fire/Forge) - Consumes umbra, evaporates tide
6. **Tide** (Water/Sea) - Quenches pyre, reflects radiance
7. **Aether** (Void/Stars) - Absorbs terra, disperses tempest

### The Claimant Houses
1-7 divine champions or fallen houses competing to restore cosmic balance:
- Each Claimant bears a unique sigil and divine bloodline
- All begin with the Triad of Foundation (Aspects 0, 1, 2 - an eternal cycle)
- Claimants Awaken additional Aspects by claiming Sanctums and performing Rites
- Victory through Ascension: controlling enough sacred sites to channel all Seven Aspects

### Sacred Turns & Divine Invocation
- **Planning Phase**: Claimants commune with their Aspects, channeling divine will
- **Resolution Phase**: The cosmic wheel turns; all wills manifest simultaneously
- **Consecration Phase**: New territories are sanctified, divine essence flows
- Reality remains static between turns - only mortal will shapes destiny

### The Veil of Knowing
- Claimants perceive only what their Sanctums reveal
- Vision emanates from consecrated ground and manifested Aspects
- Unexplored lands remain shrouded in primordial mist
- Once glimpsed, the memory of sacred geography persists

## Implementation Phases

Phase 1: Architecture Refactor
Remove simulation systems, establish core structure for turn-based divine strategy.

Phase 2: Sacred Turns System  
Implement turn management with Planning/Resolution/Consecration phases.

Phase 3: Divine Aspects System
Create the 7 Aspects with cosmic relationships, manifestation, and Awakening mechanics.

Phase 4: Claimant Houses System
Add multi-player support, House identities, and Sanctum control.

Phase 5: The Veil of Knowing
Implement fog of war as limited divine perception.

Phase 6: AI Claimants
Create computer-controlled Houses with difficulty-based divine wisdom.

Phase 7: Visual Manifestation
Design sacred geometry symbols, divine light effects, and satisfying Aspect animations.

Phase 8: Ritual Configuration
Comprehensive game setup and preparation for online sacred duels.

## Visual Design Goals

### Divine Light Palette
Three distinct color systems embodying the sacred:
1. **Aspect Colors**: 7 colors representing divine forces (cosmic wheel gradient)
2. **House Sigils**: 7 distinct colors marking Claimant territories  
3. **Sacred Interface**: Dark void background with glowing divine UI elements

### Visual Communication of the Divine
- Instant recognition of Aspect symbols through sacred geometry
- Clear House territory control via sigil colors
- Divine Veil rendered as primordial darkness
- Glowing consecration effects when manifesting Aspects
- Satisfying divine radiance when Awakening new powers

### Art Style: Sacred Geometry
Mystical, geometric, ethereal. Visual references:
- **Hades** (divine glow effects and UI)
- **Into the Breach** (clarity of tactical choices)
- **Slay the Spire** (sacred symbols and clean presentation)
- **Gris** (minimalist beauty and color theory)

The aesthetic should evoke ancient star charts, alchemical diagrams, and sacred mandalas.

## Technical Considerations

### Grid Systems
Support three grid types:
- Triangular
- Square  
- Hexagonal

Each must work consistently with all game systems.

### Performance
- Efficient rendering for large maps
- Smooth animations without frame drops
- Fast turn resolution
- Quick fog of war updates

### Multiplayer Architecture
- Hot seat for now (local multiplayer)
- Prepare for online multiplayer
- State synchronization
- Action validation

## Success Criteria: Achieving Divine Resonance

A worthy manifestation of the Supernal Interregnum will:
- **Teach the Cosmic Wheel Naturally**: New Claimants understand Aspect relationships within 2-3 turns
- **Reward Mastery**: Experienced players discover deep strategic interactions in the divine dance
- **Run Across Realms**: Smooth performance on tablets, phones, and sacred browser windows
- **Support Sacred Duels**: Both solo practice against AI and multiplayer consecration
- **Feel Transcendent**: Polished divine effects that make each manifestation satisfying
- **Inspire Repeated Communion**: Varied map generation, House matchups, and Awakening paths create different games each time
- **Make Choices Matter**: Every Essence spent, every Aspect manifested, every Sanctum claimed should feel meaningful
- **Create Memorable Moments**: "I can't believe that Pyre/Tempest combo worked!" stories

### Core Gameplay Loop
1. Survey the Veil - what's revealed? What's hidden?
2. Assess divine balance - which Aspects counter my opponents?
3. Generate Essence from Sanctums
4. Decide: Awaken a new Aspect OR Manifest existing powers?
5. Deploy Aspects strategically using cosmic wheel knowledge
6. Resolve conflicts - divine forces clash according to eternal law
7. Consecrate new ground - expand your domain
8. React to opponent moves - the cosmic wheel turns for everyone

**The game succeeds when players feel they're conducting divine forces, not just moving pieces.**

## Development Approach

Work incrementally through phases. Each phase should result in a playable (if incomplete) game state. Test thoroughly at each stage before proceeding. Prioritize core gameplay over peripheral features. Polish continuously rather than saving it for the end.