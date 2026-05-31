import { UnitRelationships } from './UnitRelationships.js';
import { ASPECTS } from './DivineAspect.js';
import { GameState } from './GameState.js';
import { HexGrid } from '../grid/HexGrid.js';
import { TriangularGrid } from '../grid/TriangularGrid.js';
import { SquareGrid } from '../grid/SquareGrid.js';
import { Renderer2D } from '../rendering/Renderer2D.js';
import { GameEngine } from './GameEngine.js';
import { WorldGenerator } from '../grid/WorldGenerator.js';
import { HUD } from '../ui/HUD.js';

/**
 * App - The central orchestrator for the Supernal Interregnum.
 * Manages the lifecycle of systems and high-level game flow.
 */
export class App {
  constructor() {
    this.unitRelationships = new UnitRelationships();
    this.gameState = new GameState();
    this.worldGenerator = new WorldGenerator();
    this.gameEngine = new GameEngine();
    
    this.grid = null;
    this.renderer = null;
    this.hud = null;
    this.lastTime = 0;
  }

  async init() {
    console.log('Supernal Interregnum: Initiating Sacred Rite...');

    const canvas = document.getElementById('main-canvas');
    const fxCanvas = document.getElementById('fx-canvas');
    this.renderer = new Renderer2D(canvas, fxCanvas);
    this.renderer.zoom = 0.9;

    // Initial world setup
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

    // Global Events
    this.attachEvents();

    // Expose for debugging
    this.exposeDebugGlobals();

    // Start loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.renderLoop(t));
  }

  createGrid(type) {
    switch (type) {
      case 'triangular': return new TriangularGrid(16);
      case 'square': return new SquareGrid(16);
      default: return new HexGrid(16);
    }
  }

  setupWorld() {
    const oldGrid = this.grid;
    this.grid = this.createGrid(this.gameState.gridType);
    
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

  attachEvents() {
    document.addEventListener('worldRegenRequested', () => this.setupWorld());
    document.addEventListener('rotationChanged', () => {
      if (this.renderer.hexRenderer) this.renderer.hexRenderer.lastRotation = null;
    });
  }

  renderLoop(currentTime) {
    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    if (deltaTime > 1000) deltaTime = 1000;
    
    if (this.gameEngine && this.grid) {
      this.gameEngine.update(deltaTime, this.grid, this.gameState, this.unitRelationships);
    }
    
    if (this.renderer) {
      this.renderer.render(this.grid, this.gameState, deltaTime);
    }
    
    requestAnimationFrame((t) => this.renderLoop(t));
  }

  exposeDebugGlobals() {
    window.game = {
      app: this,
      gameState: this.gameState,
      grid: this.grid,
      gameEngine: this.gameEngine,
      renderer: this.renderer,
      aspects: ASPECTS,
      stats: () => {
        console.log('Total cells:', this.grid.cells.size);
        this.gameState.players.forEach(p => {
          console.log(`  ${p.name}: ${p.essence} essence, aspects:`, [...p.awakenedAspects]);
        });
      }
    };
  }
}