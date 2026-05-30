/**
 * HUD - Main UI container and coordinator
 */
import { GenerationSettings } from './GenerationSettings.js';
import { VisualSettings } from './VisualSettings.js';
import { CosmicWheel } from './CosmicWheel.js';
import { AspectPalette } from './AspectPalette.js';

export class HUD {
  constructor(container, gameState, grid, gameEngine, worldGenerator, renderer, unitRelationships) {
    this.container = container;
    this.gameState = gameState;
    this.grid = grid;
    this.gameEngine = gameEngine;
    this.worldGenerator = worldGenerator;
    this.renderer = renderer;
    this.unitRelationships = unitRelationships;
    
    this.visualSettings = null;
    this.generationSettings = null;
    this.cosmicWheel = null;
    this.aspectPalette = null;
    this.isVisible = true;
  }

  initialize() {
    this.createLayout();
    this.attachEvents();

    this.cosmicWheel = new CosmicWheel(
      document.getElementById('cosmic-wheel-container'),
      this.gameState
    );

    this.aspectPalette = new AspectPalette(
      document.getElementById('aspect-palette-container'),
      this.gameState,
      this.gameEngine
    );

    this.visualSettings = new VisualSettings(
      document.getElementById('visual-settings'),
      this.gameState
    );

    this.generationSettings = new GenerationSettings(
      document.getElementById('generation-settings'),
      this.gameState,
      this.grid,
      this.worldGenerator,
      this.gameEngine
    );
  }

  updateGrid(newGrid) {
    this.grid = newGrid;
    if (this.generationSettings) this.generationSettings.grid = newGrid;
  }

  createLayout() {
    this.container.innerHTML = `
      <!-- Top Bar: Map editing for now -->
      <div id="top-bar">
        <div class="paint-options">
          <button class="paint-option ${this.gameState.paintMode === 'land' ? 'selected' : ''}" data-mode="land">
            <span class="paint-icon">🏝️</span>
          </button>
          <button class="paint-option ${this.gameState.paintMode === 'ocean' ? 'selected' : ''}" data-mode="ocean">
            <span class="paint-icon">🌊</span>
          </button>
        </div>
      </div>

      <!-- Left Panel: Cosmic Wheel -->
      <div id="graph-window" class="hud-window left">
        <div class="hud-header">Cosmic Wheel</div>
        <div class="hud-panels-container">
          <div id="cosmic-wheel-container"></div>
        </div>
      </div>

      <!-- Right Panel: Settings -->
      <div id="settings-window" class="hud-window right">
        <div class="hud-tabs">
          <button class="tab-btn active" data-target="generation-settings">Map Gen</button>
          <button class="tab-btn" data-target="visual-settings">Vis</button>
        </div>
        <div class="hud-panels-container">
          <div id="generation-settings" class="hud-panel active"></div>
          <div id="visual-settings" class="hud-panel"></div>
        </div>
      </div>

      <!-- Bottom Bar: Controls -->
      <div id="bottom-bar">
        <button id="toggle-graph-btn" class="bar-btn" title="Toggle Cosmic Wheel">🔀</button>
        
        <div id="aspect-palette-container"></div>

        <div class="turn-info">
          <span class="turn-counter">Turn <span id="turn-number">1</span></span>
          <span class="turn-phase" id="turn-phase">Planning</span>
          <span class="active-player">Player <span id="active-player-number">1</span></span>
        </div>
        
        <button id="end-turn-btn" class="bar-btn main-action">End Turn</button>
        
        <button id="regen-btn" class="bar-btn" title="Regenerate">🔄</button>
        <button id="toggle-settings-btn" class="bar-btn" title="Settings">⚙️</button>
      </div>
    `;
  }

  attachEvents() {
    // Settings tabs
    const settingsWindow = document.getElementById('settings-window');
    const tabs = settingsWindow.querySelectorAll('.tab-btn');
    const panels = settingsWindow.querySelectorAll('.hud-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
      });
    });

    // Paint mode buttons
    const paintOptions = document.querySelectorAll('.paint-option');
    paintOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        this.gameState.setPaintMode(btn.dataset.mode);
      });
    });

    // Panel toggles
    const graphWindow = document.getElementById('graph-window');
    const toggleGraphBtn = document.getElementById('toggle-graph-btn');
    const toggleSettingsBtn = document.getElementById('toggle-settings-btn');

    toggleGraphBtn.addEventListener('click', () => {
      graphWindow.classList.toggle('hidden');
      toggleGraphBtn.classList.toggle('active');
    });

    toggleSettingsBtn.addEventListener('click', () => {
      settingsWindow.classList.toggle('hidden');
      toggleSettingsBtn.classList.toggle('active');
    });

    // Bottom bar controls
    const regenBtn = document.getElementById('regen-btn');
    regenBtn.addEventListener('click', () => {
      this.generationSettings.regenerateWorld();
    });

    // Turn controls
    const endTurnBtn = document.getElementById('end-turn-btn');
    endTurnBtn.addEventListener('click', () => {
      if (this.gameEngine.endTurn(this.gameState, this.grid)) {
        this.updateTurnDisplay();
      }
    });

    // Listen for turn updates
    document.addEventListener('turnAdvanced', () => {
      this.updateTurnDisplay();
    });

    // Listen for paint mode changes
    document.addEventListener('paintModeChanged', () => {
      const buttons = document.querySelectorAll('.paint-option');
      buttons.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.mode === this.gameState.paintMode);
      });
    });
  }

  update() {
    // Update HUD elements if needed
  }

  updateTurnDisplay() {
    const turnNumber = document.getElementById('turn-number');
    const turnPhase = document.getElementById('turn-phase');
    const activePlayerNumber = document.getElementById('active-player-number');
    
    if (turnNumber) turnNumber.textContent = this.gameState.currentTurn;
    if (turnPhase) turnPhase.textContent = this.gameState.turnPhase.charAt(0).toUpperCase() + this.gameState.turnPhase.slice(1);
    if (activePlayerNumber) {
      const player = this.gameState.players[this.gameState.activePlayer];
      activePlayerNumber.textContent = player ? player.name : (this.gameState.activePlayer + 1);
    }
  }
}