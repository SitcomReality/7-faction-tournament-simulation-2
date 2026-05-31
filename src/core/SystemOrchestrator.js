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
  }

  async init() {
    console.log('Supernal Interregnum: Initiating Sacred Rite...');

    const canvas = document.getElementById('main-canvas');
    const fxCanvas = document.getElementById('fx-canvas');
    this.renderer = new Renderer2D(canvas, fxCanvas);
    this.renderer.zoom = 0.9;

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
  }
}