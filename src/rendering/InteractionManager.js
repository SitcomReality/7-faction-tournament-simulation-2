/**
 * InteractionManager - Handles mouse/touch input for panning, zooming and painting
 */
import { ManifestAction } from '../core/Action.js';

export class InteractionManager {
  constructor(renderer, camera, canvas) {
    this.renderer = renderer;
    this.camera = camera;
    this.canvas = canvas;
    
    this.isDragging = false;
    this.isPainting = false;
    this.lastX = 0;
    this.lastY = 0;
    this.touchStartDist = 0;
    this.dragButton = null; // track which button started the drag (null | 0 = left | 1 = middle)
    
    this.setupEventListeners();
  }

  updateReferences(grid, gameState, gameEngine) {
    this.grid = grid;
    this.gameState = gameState;
    this.gameEngine = gameEngine;
  }

  setupEventListeners() {
    // Desktop Panning/Painting
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        this.isDragging = true;
        this.dragButton = e.button;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        if (e.button === 1) e.preventDefault();
      } else if (e.button === 0) {
        this.isPainting = true;
        this.handlePaint(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;
        this.camera.x += dx / this.camera.zoom;
        this.camera.y += dy / this.camera.zoom;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      } else if (this.isPainting) {
        this.handlePaint(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.isPainting = false;
      this.dragButton = null;
    });

    // Prevent context menu on middle-click drag start interfering
    this.canvas.addEventListener('contextmenu', (e) => {
      if (this.dragButton === 1) e.preventDefault();
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      this.camera.zoom *= zoomFactor;
      this.camera.zoom = Math.max(0.05, Math.min(5, this.camera.zoom));
    }, { passive: false });

    // Mobile Panning/Zooming/Painting
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        this.isDragging = true;
        this.lastX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        this.lastY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        this.touchStartDist = Math.sqrt(dx * dx + dy * dy);
      } else if (e.touches.length === 1) {
        this.isPainting = true;
        this.handlePaint(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 2) {
        e.preventDefault();
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const dx = centerX - this.lastX;
        const dy = centerY - this.lastY;
        this.camera.x += dx / this.camera.zoom;
        this.camera.y += dy / this.camera.zoom;
        this.lastX = centerX;
        this.lastY = centerY;
        
        const dx2 = e.touches[1].clientX - e.touches[0].clientX;
        const dy2 = e.touches[1].clientY - e.touches[0].clientY;
        const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const zoomFactor = dist / (this.touchStartDist || 1);
        this.camera.zoom *= zoomFactor;
        this.camera.zoom = Math.max(0.05, Math.min(5, this.camera.zoom));
        this.touchStartDist = dist;
      } else if (this.isPainting && e.touches.length === 1) {
        this.handlePaint(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
      this.isPainting = false;
    });
  }

  handlePaint(clientX, clientY) {
    const { grid, gameState, gameEngine } = this;
    if (!grid || !gameState || !gameEngine) return;
    const rect = this.canvas.getBoundingClientRect();
    const worldPos = this.camera.screenToWorld(
      clientX - rect.left, 
      clientY - rect.top, 
      this.canvas.width, 
      this.canvas.height
    );
    
    const coords = grid.pixelToHex(worldPos.x, worldPos.y, gameState.hexRotation);
    const cell = grid.getCell(coords.q, coords.r);
    
    if (cell) {
      // If an aspect is selected, queue a manifestation action instead of painting
      if (gameState.selectedAspect !== null) {
        const player = gameState.players[gameState.activePlayer];
        const action = new ManifestAction(player.id, gameState.selectedAspect, coords.q, coords.r);
        
        if (gameEngine.queueAction(player.id, action, gameState)) {
          console.log(`Queued manifestation of aspect ${gameState.selectedAspect} at ${coords.q},${coords.r}`);
          document.dispatchEvent(new CustomEvent('actionQueued'));
          gameState.selectedAspect = null; // Deselect after queuing
        }
        return;
      }

      // Normal paint mode
      if (gameState.paintMode === 'land') {
        cell.type = 'land';
        cell.isClaimable = true;
      } else if (gameState.paintMode === 'ocean') {
        cell.type = 'ocean';
        cell.isClaimable = false;
        cell.reset();
      }
    }
  }
}