/**
 * GameState - Manages global simulation state and parameters
 */
import { ColorThemes } from '../utils/ColorThemes.js';

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    // Load persisted generation settings
    const savedGridType = localStorage.getItem('sim_gridType') || 'hexagonal';
    const savedMapType = localStorage.getItem('sim_mapType') || 'land';
    const savedMapSize = parseInt(localStorage.getItem('sim_mapSize')) || 14;
    const savedSeeds = parseInt(localStorage.getItem('sim_seeds')) || 1;
    const savedKeepTerrain = localStorage.getItem('sim_keepTerrain') === 'true';

    // Faction management
    this.activeFactions = new Set([0, 1, 2, 3, 4, 5, 6]); // All factions enabled by default

    // Simulation parameters
    this.isWrappingEnabled = true;
    this.simulationSpeed = 5; // ticks per second
    this.influencePerTick = 1;
    this.conversionThreshold = 40;
    this.influenceDecayRate = 0.98; // Influence decays by 2% per tick
    this.randomVariation = 0.1; // Random variance in simulation parameters
    this.oceanTransmissionRate = 0.3; // Ocean transmits at 30% efficiency
    
    // Generation parameters
    this.mapType = savedMapType; 
    this.mapSize = savedMapSize;
    this.seedsPerFaction = savedSeeds;
    this.gridType = savedGridType;
    this.keepTerrain = savedKeepTerrain;
    this.initialPattern = localStorage.getItem('sim_pattern') || 'scattered';
    this.boundaryShape = localStorage.getItem('sim_boundary') || 'circular';

    // Simulation state
    this.currentTick = 0;
    this.isPaused = false;

    // Paint tool state
    this.paintMode = 'land'; // 'land', 'ocean', 'faction'
    this.selectedPaintFaction = 0;

    // Visual settings
    this.currentTheme = 'default';
    this.theme = JSON.parse(JSON.stringify(ColorThemes.default));
    this.hexRotation = this.detectPreferredRotation(); // 'flat' or 'pointy'
    // Visual toggle defaults (can be overridden via UI)
    this.showConversionStar = true;
    this.showHexGlow = true;
    this.showHexFill = true;
    this.blendInfluenceColors = true;

    // Performance tracking
    this.stats = {
      activeCells: 0,
      lastTickTime: 0,
      conversions: 0,
      factionCounts: new Array(7).fill(0)
    };
  }

  detectPreferredRotation() {
    // Use flat-top on wider screens, pointy-top on taller screens
    return window.innerWidth > window.innerHeight ? 'flat' : 'pointy';
  }

  toggleHexRotation() {
    this.hexRotation = this.hexRotation === 'flat' ? 'pointy' : 'flat';
    document.dispatchEvent(new CustomEvent('rotationChanged'));
  }

  setPaintMode(mode, factionId = null) {
    this.paintMode = mode;
    if (mode === 'faction' && factionId !== null) {
      this.selectedPaintFaction = factionId;
    }
    document.dispatchEvent(new CustomEvent('paintModeChanged'));
  }

  /**
   * Toggle a faction on/off
   * Returns true if faction was disabled, false if enabled
   */
  toggleFaction(factionId) {
    if (this.activeFactions.has(factionId)) {
      this.activeFactions.delete(factionId);
      console.log(`Faction ${factionId} disabled`);
      return true; // Was disabled
    } else {
      this.activeFactions.add(factionId);
      console.log(`Faction ${factionId} enabled`);
      return false; // Was enabled
    }
  }

  /**
   * Set simulation speed (ticks per second)
   */
  setSimulationSpeed(speed) {
    this.simulationSpeed = Math.max(0.1, Math.min(100, speed));
    console.log(`Simulation speed: ${this.simulationSpeed} ticks/sec`);
  }

  /**
   * Set influence per tick
   */
  setInfluencePerTick(amount) {
    this.influencePerTick = Math.max(0.1, Math.min(10, amount));
    console.log(`Influence per tick: ${this.influencePerTick}`);
  }

  /**
   * Set conversion threshold
   */
  setConversionThreshold(threshold) {
    this.conversionThreshold = Math.max(1, Math.min(100, threshold));
    console.log(`Conversion threshold: ${this.conversionThreshold}`);
  }

  /**
   * Set influence decay rate
   */
  setInfluenceDecayRate(rate) {
    this.influenceDecayRate = Math.max(0.7, Math.min(1.0, rate));
    console.log(`Influence decay rate: ${this.influenceDecayRate}`);
  }

  /**
   * Set random variation
   */
  setRandomVariation(variation) {
    this.randomVariation = Math.max(0, Math.min(1.0, variation));
    console.log(`Random variation: ${this.randomVariation}`);
  }

  /**
   * Pause/unpause the simulation
   */
  togglePause() {
    this.isPaused = !this.isPaused;
    console.log(this.isPaused ? 'Simulation paused' : 'Simulation resumed');
  }

  saveGenerationSettings() {
    localStorage.setItem('sim_gridType', this.gridType);
    localStorage.setItem('sim_mapType', this.mapType);
    localStorage.setItem('sim_mapSize', this.mapSize.toString());
    localStorage.setItem('sim_seeds', this.seedsPerFaction.toString());
    localStorage.setItem('sim_pattern', this.initialPattern);
    localStorage.setItem('sim_boundary', this.boundaryShape);
    localStorage.setItem('sim_keepTerrain', this.keepTerrain.toString());
  }

  setTheme(themeName) {
    if (ColorThemes[themeName]) {
      this.currentTheme = themeName;
      // Clone the theme object so that shuffles/modifications are isolated to this session
      this.theme = JSON.parse(JSON.stringify(ColorThemes[themeName]));
      document.dispatchEvent(new CustomEvent('themeChanged'));
      console.log(`Theme changed to: ${themeName}`);
    }
  }

  /**
   * Randomly re-assigns colors within the current theme's faction list
   */
  shuffleFactionColors() {
    const colors = [...this.theme.factions];
    // Fisher-Yates shuffle algorithm
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    this.theme.factions = colors;
    // Dispatch event so UI elements (like FactionControls) know to refresh
    document.dispatchEvent(new CustomEvent('themeChanged'));
    console.log('Faction colors shuffled');
  }
}