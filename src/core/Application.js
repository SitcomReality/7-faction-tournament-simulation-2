import { UnitRelationships } from './UnitRelationships.js';
import { GameState } from './GameState.js';
import { WorldGenerator } from '../grid/WorldGenerator.js';
import { GameEngine } from './GameEngine.js';
import { Renderer2D } from '../rendering/Renderer2D.js';
import { GridFactory } from '../grid/GridFactory.js';
import { HUD } from '../ui/HUD.js';
import { ASPECTS } from './DivineAspect.js';

/**
 * Application - Main hub orchestrating the game's lifecycle and systems
 */
export class Application {
  constructor() {
    this.gameState = new GameState();
    this.unitRelationships = new UnitRelationships();
    this.worldGenerator = new WorldGenerator();
    this.gameEngine = new GameEngine();
    
    this.grid = null;
    this.renderer = null;
    this.hud = null;
    
    this.lastTime = performance.now();
  }

  /**
   * Main entry point for the application
   */
  init() {
    console.log('Sacred Duel Application initializing...');
    
    const canvas = document.getElementById('main-canvas');
    const fxCanvas = document.getElementById('fx-canvas');
    this.renderer = new Renderer2D(canvas, fxCanvas);
    this.renderer.zoom = 0.9;
    
    this.setupWorld();
    
    // Initialize HUD
    const hudContainer = document.getElementById('hud');
    this.hud = new HUD(
      hudContainer, 
      this.gameState, 
      this.grid, 
      this.gameEngine, 
      this.worldGenerator, 
      this.renderer, 
      this.unitRelationships
    );
    this.hud.initialize();
    
    this.attachGlobalEvents();
    this.setupDebugInterface();
    this.startLoop();
  }

  /**
   * Handles world generation and system re-linking
   */
  setupWorld() {
    const oldGrid = this.grid;
    this.grid = GridFactory.create(this.gameState.gridType, 16);
    
    this.worldGenerator.generateWorld(this.grid, {
      type: this.gameState.mapType,
      radius: this.gameState.mapSize,
      landRatio: 0.65,
      boundaryShape: this.gameState.boundaryShape,
      keepTerrain: this.gameState.keepTerrain
    }, oldGrid);
    
    this.gameEngine.reset();
    this.gameEngine.initialize(this.grid, this.gameState);
    
    if (this.hud) this.hud.updateGrid(this.grid);
    if (this.renderer) this.renderer.interaction.updateReferences(this.grid, this.gameState, this.gameEngine);
  }

  attachGlobalEvents() {
    document.addEventListener('worldRegenRequested', () => this.setupWorld());
    
    document.addEventListener('rotationChanged', () => {
      if (this.renderer && this.renderer.hexRenderer) {
        this.renderer.hexRenderer.lastRotation = null;
      }
    });
  }

  setupDebugInterface() {
    window.game = {
      app: this,
      gameState: this.gameState,
      grid: this.grid,
      gameEngine: this.gameEngine,
      renderer: this.renderer,
      aspects: ASPECTS,
      stats: () => {
        console.log('Total cells:', this.grid.cells.size);
        console.log('Players:', this.gameState.players.length);
        this.gameState.players.forEach(p => {
          console.log(`  ${p.name}: ${p.essence} essence, aspects:`, [...p.awakenedAspects]);
        });
      }
    };
  }

  startLoop() {
    const loop = (currentTime) => {
      let deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      
      if (deltaTime > 1000) deltaTime = 1000;
      
      if (this.gameEngine && this.grid) {
        this.gameEngine.update(deltaTime, this.grid, this.gameState, this.unitRelationships);
      }
      
      if (this.renderer && this.grid) {
        this.renderer.render(this.grid, this.gameState, deltaTime);
      }
      
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}