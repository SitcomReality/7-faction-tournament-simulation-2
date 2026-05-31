# Phase 3: Divine Aspects System

## Overview
Implement the 7 Divine Aspects with their cosmic relationships, manifestation mechanics, and Awakening rituals.

## Stage 1: Define Divine Aspects

### Step 1.1: Divine Aspect Data Structure
- Create DivinAspect.js class defining each of the 7 primal forces
- Assign unique IDs (0-6) mapping to Radiance, Umbra, Tempest, Terra, Pyre, Tide, Aether
- Design sacred geometry SVG symbols for each Aspect
- Assign divine light colors (distinct from House sigil colors)
- Define manifestation properties: vision range, special effects

**The Seven Aspects:**
<js>
{
  id: 0, name: 'Radiance', symbol: '☀️', color: '#FFD700',
  id: 1, name: 'Umbra', symbol: '🌙', color: '#1a1a2e',
  id: 2, name: 'Tempest', symbol: '⚡', color: '#00d4ff',
  id: 3, name: 'Terra', symbol: '⛰️', color: '#8B4513',
  id: 4, name: 'Pyre', symbol: '🔥', color: '#ff4500',
  id: 5, name: 'Tide', symbol: '🌊', color: '#006994',
  id: 6, name: 'Aether', symbol: '✨', color: '#9333ea'
}
</js>

### Step 1.2: Cosmic Wheel Relationships
- Hard-code the 2-paradoxical divine dominion graph
- Make cosmic opposition immutable (fundamental law of reality)
- Helper methods: `dominates(aspectA, aspectB)` returns if A defeats B
- Helper: `vulnerableTo(aspect)` returns which Aspects defeat it
- Helper: `dominatesOver(aspect)` returns which Aspects it defeats

### Step 1.3: Manifestation Instances
- Create Manifestation.js class for Aspects deployed to Sanctums
- Track: aspect type, controlling House, Sanctum location
- Track: consecration strength (for potential future mechanics)
- Manifestations grant vision and territorial control


## Stage 2: Awakening System
### Step 2.1: House Divine Attunement
- Add `awakenedAspects` Set to Claimant House state
- All Houses begin with the Triad of Foundation (Aspects 0, 1, 2 - eternal cycle)
- Track Essence reserves (resource for Awakening)

### Step 2.2: Awakening Ritual Actions
- Implement AwakeningRitual.js action class
- Define Essence costs: 1st = 3, 2nd = 5, 3rd = 7, 4th = 9 Essence
- Validate: House has sufficient Essence and hasn't already Awakened this Aspect
- On execution: Deduct Essence, add Aspect to awakenedAspects Set

### Step 2.3: Awakening Visual Ceremony
- Display dormant Aspects in UI with divine seal overlay
- Show Essence cost and "Awaken" button when affordable
- Divine radiance animation when Awakening completes
- Cosmic wheel updates to show newly available Aspect

## Stage 3: Manifestation & Divine Conflict
### Step 3.1: Manifestation System
- Manifestation only allowed on controlled Sanctums
- Implement ManifestAspect.js action (costs 1 Essence)
- One Aspect per Sanctum maximum
- Show available Sanctums and Awakened Aspects for manifestation

### Step 3.2: No Movement - Aspects are Eternal
- **Aspects do NOT move** - they are divine forces, not armies
- Once manifested, an Aspect remains at that Sanctum
- Control is contested through *new* manifestations, not piece movement
- This creates strategic territory battles, not chess-like unit positioning

### Step 3.3: Divine Conflict Resolution
- When opposing Aspects occupy adjacent Sanctums, divine conflict occurs
- Use cosmic wheel for dominion: `dominates(aspectA, aspectB)` determines victor
- Defeated Manifestation is **dispersed** (removed from board)
- Controlling House loses the Sanctum (becomes neutral or transfers)
- Dispersed Aspects can be re-manifested elsewhere (still costs Essence)
- Multiple Aspects can support each other if adjacent

## Stage 4: Divine Interface
### Step 4.1: Aspect Palette
- Create AspectPalette.js UI component  
- Display all 7 Aspects with sacred geometry symbols
- Awakened Aspects glow with divine light
- Dormant Aspects show ethereal outline + Essence cost
- Click Awakened Aspect to select for manifestation

### Step 4.2: Sanctum Manifestation Display
- Render Aspect symbols on consecrated Sanctums
- Layer divine symbol over House sigil color
- Pulsing glow effect for active Manifestations
- Show Essence cost when hovering valid manifestation targets

### Step 4.3: Cosmic Wheel Updates
- Rename RelationshipGraph to CosmicWheel.js
- Display using Aspect names and sacred symbols
- Show Awakened vs Dormant with distinct visual treatment
- Add tooltips: "Radiance dominates Umbra and Tempest"
- Completely read-only (immutable divine law)

## Notes
After this phase, the 7 Divine Aspects exist with immutable cosmic relationships. Houses begin with the Triad of Foundation and can Awaken others through Essence expenditure. Aspects manifest on Sanctums (not armies that move), creating strategic territorial divine conflicts.
=======
# Phase 3: Divine Aspects System

## Overview
Implement the 7 Divine Aspects with their cosmic relationships, manifestation mechanics, and Awakening rituals.

## Stage 1: Define Divine Aspects

### Step 1.1: Divine Aspect Data Structure
- Create DivinAspect.js class defining each of the 7 primal forces
- Assign unique IDs (0-6) mapping to Radiance, Umbra, Tempest, Terra, Pyre, Tide, Aether
- Design sacred geometry SVG symbols for each Aspect
- Assign divine light colors (distinct from House sigil colors)
- Define manifestation properties: vision range, special effects

**The Seven Aspects:**
<js>
{
  id: 0, name: 'Radiance', symbol: '☀️', color: '#FFD700',
  id: 1, name: 'Umbra', symbol: '🌙', color: '#1a1a2e',
  id: 2, name: 'Tempest', symbol: '⚡', color: '#00d4ff',
  id: 3, name: 'Terra', symbol: '⛰️', color: '#8B4513',
  id: 4, name: 'Pyre', symbol: '🔥', color: '#ff4500',
  id: 5, name: 'Tide', symbol: '🌊', color: '#006994',
  id: 6, name: 'Aether', symbol: '✨', color: '#9333ea'
}
</js>

### Step 1.2: Cosmic Wheel Relationships
- Hard-code the 2-paradoxical divine dominion graph
- Make cosmic opposition immutable (fundamental law of reality)
- Helper methods: `dominates(aspectA, aspectB)` returns if A defeats B
- Helper: `vulnerableTo(aspect)` returns which Aspects defeat it
- Helper: `dominatesOver(aspect)` returns which Aspects it defeats

### Step 1.3: Manifestation Instances
- Create Manifestation.js class for Aspects deployed to Sanctums
- Track: aspect type, controlling House, Sanctum location
- Track: consecration strength (for potential future mechanics)
- Manifestations grant vision and territorial control


## Stage 2: Awakening System
### Step 2.1: House Divine Attunement
- Add `awakenedAspects` Set to Claimant House state
- All Houses begin with the Triad of Foundation (Aspects 0, 1, 2 - eternal cycle)
- Track Essence reserves (resource for Awakening)

### Step 2.2: Awakening Ritual Actions
- Implement AwakeningRitual.js action class
- Define Essence costs: 1st = 3, 2nd = 5, 3rd = 7, 4th = 9 Essence
- Validate: House has sufficient Essence and hasn't already Awakened this Aspect
- On execution: Deduct Essence, add Aspect to awakenedAspects Set

### Step 2.3: Awakening Visual Ceremony
- Display dormant Aspects in UI with divine seal overlay
- Show Essence cost and "Awaken" button when affordable
- Divine radiance animation when Awakening completes
- Cosmic wheel updates to show newly available Aspect

## Stage 3: Manifestation & Divine Conflict
### Step 3.1: Manifestation System
- Manifestation only allowed on controlled Sanctums
- Implement ManifestAspect.js action (costs 1 Essence)
- One Aspect per Sanctum maximum
- Show available Sanctums and Awakened Aspects for manifestation

### Step 3.2: No Movement - Aspects are Eternal
- **Aspects do NOT move** - they are divine forces, not armies
- Once manifested, an Aspect remains at that Sanctum
- Control is contested through *new* manifestations, not piece movement
- This creates strategic territory battles, not chess-like unit positioning

### Step 3.3: Divine Conflict Resolution
- When opposing Aspects occupy adjacent Sanctums, divine conflict occurs
- Use cosmic wheel for dominion: `dominates(aspectA, aspectB)` determines victor
- Defeated Manifestation is **dispersed** (removed from board)
- Controlling House loses the Sanctum (becomes neutral or transfers)
- Dispersed Aspects can be re-manifested elsewhere (still costs Essence)
- Multiple Aspects can support each other if adjacent

## Stage 4: Divine Interface
### Step 4.1: Aspect Palette
- Create AspectPalette.js UI component  
- Display all 7 Aspects with sacred geometry symbols
- Awakened Aspects glow with divine light
- Dormant Aspects show ethereal outline + Essence cost
- Click Awakened Aspect to select for manifestation

### Step 4.2: Sanctum Manifestation Display
- Render Aspect symbols on consecrated Sanctums
- Layer divine symbol over House sigil color
- Pulsing glow effect for active Manifestations
- Show Essence cost when hovering valid manifestation targets

### Step 4.3: Cosmic Wheel Updates
- Rename RelationshipGraph to CosmicWheel.js
- Display using Aspect names and sacred symbols
- Show Awakened vs Dormant with distinct visual treatment
- Add tooltips: "Radiance dominates Umbra and Tempest"
- Completely read-only (immutable divine law)

## Notes
After this phase, the 7 Divine Aspects exist with immutable cosmic relationships. Houses begin with the Triad of Foundation and can Awaken others through Essence expenditure. Aspects manifest on Sanctums (not armies that move), creating strategic territorial divine conflicts.