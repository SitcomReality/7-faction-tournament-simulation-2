/**
 * SystemOrchestrator - The central hub that instantiates and coordinates all sub-systems.
 * This is the primary logic container for the game's lifecycle.
 */
import { UnitRelationships } from './UnitRelationships.js';
import { GameState } from './GameState.js';
import { Renderer2D } from '../rendering/Renderer2D.js';
import { GameEngine } from './GameEngine.js';
import { WorldGenerator } from '../grid/WorldGenerator.js';
import { HUD } from '../ui/HUD.js';
import { GameLoop } from './GameLoop.js';
import { WorldController } from './WorldController.js';
import { DebugTools } from '../utils/DebugTools.js';
import { AudioManager } from '../rendering/AudioManager.js';
import { GameSetup } from '../ui/GameSetup.js';
import { ASPECTS } from './DivineAspect.js';

export class SystemOrchestrator {
  constructor() {
    this.unitRelationships = new UnitRelationships();
    this.gameState = new GameState();
    this.worldGenerator = new WorldGenerator();
    this.gameEngine = new GameEngine();
    
    this.worldController = new WorldController(this.gameState, this.gameEngine, this.worldGenerator);
    this.gameLoop = null;
    this.renderer = null;
    this.hud = null;
    this.gameSetup = null;
    this.setupConfig = null;
  }

  async init() {
    console.log('Supernal Interregnum: Initiating Sacred Rite...');

    // Show setup screen
    const setupContainer = document.getElementById('setup-screen');
    this.gameSetup = new GameSetup(setupContainer);
    this.gameSetup.show();

    // Wait for setup completion
    document.addEventListener('gameSetupComplete', (e) => {
      this.setupConfig = e.detail;
      this.startGame();
    });
  }

  startGame() {
    console.log('Starting game with config:', this.setupConfig);

    // Apply setup config to game state
    this.gameState.mapSize = this.setupConfig.mapSize;
    this.gameState.gridType = this.setupConfig.gridType;
    this.gameState.mapType = this.setupConfig.mapType;
    this.gameState.boundaryShape = this.setupConfig.boundaryShape;
    this.gameState.victoryCondition = this.setupConfig.victoryCondition;

    const canvas = document.getElementById('main-canvas');
    const fxCanvas = document.getElementById('fx-canvas');
    this.audio = new AudioManager();
    this.renderer = new Renderer2D(canvas, fxCanvas, this.audio);
    this.renderer.zoom = 0.9;

    // Reset game state and create players from config
    this.gameState.players = [];
    this.gameEngine.initialize(null, this.gameState, this.setupConfig.players);

    // Initial world setup
    this.worldController.setupWorld(null, this.renderer);

    // Initialize HUD
    const hudContainer = document.getElementById('hud');
    this.hud = new HUD(
      hudContainer, 
      this.gameState, 
      this.worldController.grid, 
      this.gameEngine, 
      this.worldGenerator, 
      this.renderer, 
      this.unitRelationships
    );
    this.hud.initialize();

    // Attach global events
    this.attachEvents();

    // Debug access
    DebugTools.expose(this);

    // Start the game loop
    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      (dt) => this.render(dt)
    );
    this.gameLoop.start();
  }

  update(deltaTime) {
    if (this.gameEngine && this.worldController.grid) {
      this.gameEngine.update(deltaTime, this.worldController.grid, this.gameState, this.unitRelationships);
    }
  }

  render(deltaTime) {
    if (this.renderer) {
      this.renderer.render(this.worldController.grid, this.gameState, deltaTime);
    }
  }

  attachEvents() {
    document.addEventListener('worldRegenRequested', () => {
      this.worldController.setupWorld(this.hud, this.renderer);
    });
    
    document.addEventListener('rotationChanged', () => {
      if (this.renderer.hexRenderer) this.renderer.hexRenderer.lastRotation = null;
    });

    document.addEventListener('divineClash', (e) => {
      const { q, r, winner } = e.detail;
      const pos = this.worldController.grid.hexToPixel(q, r, this.gameState.hexRotation);
      
      // More dramatic particle effect for clashes
      if (this.renderer) {
        this.renderer.spawnParticles(pos.x || 0, pos.y || 0, '#FFD700', 25);
        setTimeout(() => this.renderer.spawnParticles(pos.x || 0, pos.y || 0, '#FF4500', 20), 150);
      }
      if (this.audio) this.audio.playClash();
    });

    document.addEventListener('aspectManifested', (e) => {
      const { q, r, aspectId } = e.detail;
      const pos = this.worldController.grid.hexToPixel(q, r, this.gameState.hexRotation);
      const aspect = ASPECTS[aspectId];
      if (aspect && this.renderer) {
        this.renderer.spawnParticles(pos.x || 0, pos.y || 0, aspect.color);
      }
    });

    document.addEventListener('actionExecuted', (e) => {
      if (e.detail && e.detail.type === 'awaken') {
        if (this.audio) this.audio.playAwaken();
      }
    });
  }
}