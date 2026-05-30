/**
 * GameState - Manages global simulation state and parameters
 */
import { ColorThemes } from '../utils/ColorThemes.js';

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    // Players (1-7)
    this.players = [];
    this.activePlayer = 0;
    this.currentTurn = 1;
    this.turnPhase = 'planning'; // 'planning', 'resolution', 'cleanup'
    
    // Generation parameters
    this.mapType = localStorage.getItem('sim_mapType') || 'land'; 
    this.mapSize = parseInt(localStorage.getItem('sim_mapSize')) || 14;
    this.gridType = localStorage.getItem('sim_gridType') || 'hexagonal';
    this.boundaryShape = localStorage.getItem('sim_boundary') || 'circular';
    this.keepTerrain = localStorage.getItem('sim_keepTerrain') === 'true';

    // Paint tool state
    this.paintMode = 'land';

    // Visual settings
    this.currentTheme = 'default';
    this.theme = JSON.parse(JSON.stringify(ColorThemes.default));
    this.hexRotation = this.detectPreferredRotation();
    this.showHexFill = true;

    // Stats
    this.stats = {
      turnCount: 0,
      movesMade: 0,
      unitsDeployed: 0
    };
  }

  detectPreferredRotation() {
    return window.innerWidth > window.innerHeight ? 'flat' : 'pointy';
  }

  toggleHexRotation() {
    this.hexRotation = this.hexRotation === 'flat' ? 'pointy' : 'flat';
    document.dispatchEvent(new CustomEvent('rotationChanged'));
  }

  setPaintMode(mode) {
    this.paintMode = mode;
    document.dispatchEvent(new CustomEvent('paintModeChanged'));
  }

  saveGenerationSettings() {
    localStorage.setItem('sim_gridType', this.gridType);
    localStorage.setItem('sim_mapType', this.mapType);
    localStorage.setItem('sim_mapSize', this.mapSize.toString());
    localStorage.setItem('sim_boundary', this.boundaryShape);
    localStorage.setItem('sim_keepTerrain', this.keepTerrain.toString());
  }

  setTheme(themeName) {
    if (ColorThemes[themeName]) {
      this.currentTheme = themeName;
      this.theme = JSON.parse(JSON.stringify(ColorThemes[themeName]));
      document.dispatchEvent(new CustomEvent('themeChanged'));
    }
  }

  shuffleFactionColors() {
    const colors = [...this.theme.factions];
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    this.theme.factions = colors;
    document.dispatchEvent(new CustomEvent('themeChanged'));
  }
}