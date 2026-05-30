/**
 * 7-Faction 2-Paradoxical Tournament Simulation
 * Entry point and initialization
 */

import { TournamentGraph } from './core/TournamentGraph.js';
import { GameState } from './core/GameState.js';
import { HexGrid } from './grid/HexGrid.js';
import { TriangularGrid } from './grid/TriangularGrid.js';
import { SquareGrid } from './grid/SquareGrid.js';
import { HeptagonalGrid } from './grid/HeptagonalGrid.js';
import { Renderer2D } from './rendering/Renderer2D.js';
import { SimulationEngine } from './simulation/SimulationEngine.js';
import { WorldGenerator } from './grid/WorldGenerator.js';
import { HUD } from './ui/HUD.js';

console.log('7-Faction Tournament Simulation initializing...');

// Initialize core systems
const tournamentGraph = new TournamentGraph();
const gameState = new GameState();

// Initialize core variables
let grid;
let renderer;
let simulationEngine;
let worldGenerator;
let hud;

function createGrid(type) {
  switch (type) {
    case 'triangular':
      return new TriangularGrid(16);
    case 'square':
      return new SquareGrid(16);
    case 'voronoi':
      return new HeptagonalGrid(22);
    default:
      return new HexGrid(16);
  }
}

function setupWorld() {
  console.log(`Setting up world: ${gameState.gridType}`);
  
  const oldGrid = grid; // Keep reference for terrain sampling if requested
  
  // Create grid
  grid = createGrid(gameState.gridType);
  
  // Generate geometry and terrain
  if (!worldGenerator) worldGenerator = new WorldGenerator();
  worldGenerator.generateWorld(grid, {
    type: gameState.mapType,
    radius: gameState.mapSize,
    landRatio: 0.65,
    boundaryShape: gameState.boundaryShape,
    keepTerrain: gameState.keepTerrain
  }, oldGrid);
  
  // Seed factions
  worldGenerator.seedFactions(grid, gameState, gameState.initialPattern, gameState.seedsPerFaction);
  
  // Setup simulation
  if (!simulationEngine) simulationEngine = new SimulationEngine();
  simulationEngine.reset();
  simulationEngine.initialize(grid, gameState);
  
  // Update UI references
  if (hud) hud.updateGrid(grid);
  
  // Update global debug object
  if (window.sim) window.sim.grid = grid;
  
  gameState.currentTick = 0;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded. Starting initialization...');
  
  tournamentGraph.validate();
  
  const canvas = document.getElementById('main-canvas');
  const fxCanvas = document.getElementById('fx-canvas');
  renderer = new Renderer2D(canvas, fxCanvas);
  renderer.zoom = 0.9;
  
  // Initial setup
  setupWorld();
  
  // Initialize HUD
  const hudContainer = document.getElementById('hud');
  hud = new HUD(hudContainer, gameState, grid, simulationEngine, worldGenerator, renderer, tournamentGraph);
  hud.initialize();
  
  // Events
  document.addEventListener('worldRegenRequested', () => setupWorld());
  document.addEventListener('rotationChanged', () => {
    if (renderer.hexRenderer) renderer.hexRenderer.lastRotation = null;
  });

  // Painting Logic
  let isPainting = false;
  const handlePaintEvent = (x, y) => {
    renderer.handlePaint(x, y, grid, gameState, simulationEngine);
  };

  canvas.addEventListener('mousedown', (e) => {
    if (!e.shiftKey && e.button === 0) {
      isPainting = true;
      handlePaintEvent(e.clientX, e.clientY);
    }
  });
  
  canvas.addEventListener('mousemove', (e) => {
    if (isPainting && !e.shiftKey) handlePaintEvent(e.clientX, e.clientY);
  });
  
  window.addEventListener('mouseup', () => isPainting = false);
  
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isPainting = true;
      handlePaintEvent(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  
  canvas.addEventListener('touchmove', (e) => {
    if (isPainting && e.touches.length === 1) {
      handlePaintEvent(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  
  canvas.addEventListener('touchend', () => isPainting = false);
  
  startRenderLoop();
  
  window.sim = {
    gameState,
    grid,
    tournamentGraph,
    simulationEngine,
    renderer,
    setupWorld,
    stats: () => {
      console.log('Active cells:', gameState.stats.activeCells);
      console.log('Last tick time:', gameState.stats.lastTickTime.toFixed(2), 'ms');
      console.log('Total cells:', grid.cells.size);
    }
  };
});

function startRenderLoop() {
  let lastTime = performance.now();
  
  function render(currentTime) {
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Cap deltaTime to avoid huge leaps when tab is inactive
    if (deltaTime > 1000) deltaTime = 1000;
    
    if (simulationEngine && grid) {
      simulationEngine.update(deltaTime, grid, gameState, tournamentGraph, renderer);
    }
    
    renderer.render(grid, gameState, deltaTime);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}