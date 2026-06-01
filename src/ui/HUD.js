/**
 * HUD - Main UI container and coordinator
 */
import { GenerationSettings } from './GenerationSettings.js';
import { VisualSettings } from './VisualSettings.js';
import { CosmicWheel } from './CosmicWheel.js';
import { PlayersPanel } from './PlayersPanel.js';

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
    this.playersPanel = null;
    this.cosmicWheel = null;
    this.isVisible = true;
  }

  initialize() {
    this.createLayout();
    this.attachEvents();

    this.cosmicWheel = new CosmicWheel(
      document.getElementById('cosmic-wheel-container'),
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

    this.playersPanel = new PlayersPanel(
      document.getElementById('players-panel'),
      this.gameState,
      this.grid
    );
  }

  updateGrid(newGrid) {
    this.grid = newGrid;
    if (this.generationSettings) this.generationSettings.grid = newGrid;
    if (this.playersPanel) this.playersPanel.updateGrid(newGrid);
  }

  createLayout() {
    this.container.innerHTML = `
      <!-- Top Bar -->
      <div id="top-bar">
        <div style="font-weight: bold; font-size: 16px; letter-spacing: 2px; text-transform: uppercase;">
          Supernal Interregnum
        </div>
        <div style="margin-left: auto; display: flex; gap: 16px; font-size: 12px; color: var(--text-secondary);">
          <div>Turn: <span id="top-turn" style="color: #fff;">1</span></div>
          <div>Units: <span id="top-units" style="color: #fff;">0</span></div>
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
          <button class="tab-btn active" data-target="players-panel">Houses</button>
          <button class="tab-btn" data-target="generation-settings">Map</button>
          <button class="tab-btn" data-target="visual-settings">Vis</button>
        </div>
        <div class="hud-panels-container">
          <div id="players-panel" class="hud-panel active"></div>
          <div id="generation-settings" class="hud-panel"></div>
          <div id="visual-settings" class="hud-panel"></div>
        </div>
      </div>

      <!-- Victory Screen -->
      <div id="victory-screen" class="setup-screen hidden" style="z-index: 2000; background: rgba(5,5,8,0.95);">
        <div class="setup-container" style="text-align: center; border: 1px solid var(--border-subtle); box-shadow: 0 0 40px rgba(255,215,0,0.2);">
          <div class="setup-subtitle">The Sacred Rite Concludes</div>
          <div class="setup-title" id="victory-player-name" style="margin: 24px 0; font-size: 32px; color: #FFD700;">Player Name Ascends</div>
          <div style="margin-bottom: 32px; font-size: 14px; color: var(--text-primary);">Cosmic balance has been restored.</div>
          <button id="victory-restart-btn" class="setup-btn primary">Begin Anew</button>
        </div>
      </div>

      <!-- Handoff Screen -->
      <div id="handoff-screen" class="setup-screen hidden" style="z-index: 2000; background: rgba(5,5,8,0.95);">
        <div class="setup-container" style="text-align: center; border: 1px solid var(--border-subtle);">
          <div class="setup-subtitle">The Wheel Turns</div>
          <div class="setup-title" id="handoff-player-name" style="margin: 24px 0; font-size: 32px;">Player Name</div>
          <div style="margin-bottom: 32px; font-size: 12px; color: var(--text-secondary);">Pass the device to the next Claimant.</div>
          <button id="handoff-ready-btn" class="setup-btn primary">I Am Ready</button>
        </div>
      </div>

      <!-- Bottom Bar: Controls -->
      <div id="bottom-bar">
        <button id="toggle-graph-btn" class="bar-btn" title="Toggle Cosmic Wheel">🔀</button>
        
        <div class="turn-info">
          <span class="turn-counter">Turn <span id="turn-number">1</span></span>
          <span class="turn-phase" id="turn-phase">Active</span>
          <span class="active-player">Player <span id="active-player-number">1</span></span>
        </div>
        
        <button id="end-turn-btn" class="bar-btn main-action">End Turn</button>
        
        <button id="regen-btn" class="bar-btn" title="Regenerate">🔄</button>
        <button id="toggle-settings-btn" class="bar-btn" title="Settings">⚙️</button>
      </div>
    `;
  }

  attachEvents() {
    // Victory Screen
    const victoryScreen = document.getElementById('victory-screen');
    document.getElementById('victory-restart-btn').addEventListener('click', () => {
      location.reload();
    });

    // Handoff Screen
    const handoffScreen = document.getElementById('handoff-screen');
    document.getElementById('handoff-ready-btn').addEventListener('click', () => {
      handoffScreen.classList.add('hidden');
    });

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

    // Listen for Game Over
    document.addEventListener('gameOver', (e) => {
      const winner = e.detail.winner;
      document.getElementById('victory-player-name').textContent = `${winner.name} Ascends`;
      document.getElementById('victory-player-name').style.color = winner.color;
      document.getElementById('victory-screen').classList.remove('hidden');
    });

    // Listen for turn updates
    document.addEventListener('turnAdvanced', (e) => {
      this.updateTurnDisplay();
      
      const humanPlayers = this.gameState.players.filter(p => !p.isAI);
      const nextPlayer = this.gameState.players[e.detail.activePlayer];
      
      // If hot-seat mode (multiple humans) and next player is human, show handoff
      if (humanPlayers.length > 1 && !nextPlayer.isAI) {
        document.getElementById('handoff-player-name').textContent = nextPlayer.name;
        document.getElementById('handoff-player-name').style.color = nextPlayer.color;
        document.getElementById('handoff-screen').classList.remove('hidden');
      }
    });
    
    // Listen for actions executed
    document.addEventListener('actionExecuted', () => {
      this.updateTurnDisplay(); // To update any player specific visual state if needed
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
    
    const topTurn = document.getElementById('top-turn');
    if (topTurn) topTurn.textContent = this.gameState.currentTurn;
    
    const topUnits = document.getElementById('top-units');
    if (topUnits && this.gameState.stats) topUnits.textContent = this.gameState.stats.unitsDeployed;
  }
}