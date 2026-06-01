/**
 * CosmicWheel - Interactive visualization of the immutable Divine Aspects relationships
 */
import { ASPECTS, aspectDominates } from '../core/DivineAspect.js';
import { AspectIcons } from './AspectIcons.js';

export class CosmicWheel {
  constructor(container, gameState) {
    this.container = container;
    this.gameState = gameState;
    
    this.canvas = null;
    this.ctx = null;
    this.size = 260;
    this.centerX = this.size / 2;
    this.centerY = this.size / 2;
    this.radius = 85;
    this.nodeRadius = 22;
    
    this.hoveredNode = null;
    
    this.createUI();
    this.setupEventListeners();
    this.render();
  }

  createUI() {
    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <canvas id="cosmic-wheel-canvas" width="${this.size}" height="${this.size}" 
                style="border-radius: 8px; background: rgba(0,0,0,0.3); cursor: default; touch-action: none;"></canvas>
        
        <div style="font-size: 10px; opacity: 0.6; text-align: center;">
          The Cosmic Wheel (Immutable Divine Law)
        </div>

        <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 8px 0;">

        <div class="theme-row" style="margin-top: 0; padding-top: 0; border-top: none;">
          <select id="theme-select" title="Theme">
            <option value="default" ${this.gameState.currentTheme === 'default' ? 'selected' : ''}>Default</option>
            <option value="cyberpunk" ${this.gameState.currentTheme === 'cyberpunk' ? 'selected' : ''}>Cyberpunk</option>
            <option value="pastel" ${this.gameState.currentTheme === 'pastel' ? 'selected' : ''}>Pastel</option>
          </select>
        </div>
      </div>
    `;
    
    this.canvas = this.container.querySelector('#cosmic-wheel-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.hoveredNode = this.getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
      this.render();
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredNode = null;
      this.render();
    });
    
    const themeSelect = this.container.querySelector('#theme-select');
    themeSelect.addEventListener('change', (e) => {
      this.gameState.setTheme(e.target.value);
      this.render();
    });

    document.addEventListener('themeChanged', () => this.render());
  }

  getNodeAt(x, y) {
    for (let i = 0; i < 7; i++) {
      const pos = this.getNodePosition(i);
      const dx = x - pos.x;
      const dy = y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < this.nodeRadius) {
        return i;
      }
    }
    return null;
  }

  getNodePosition(index) {
    const angle = (index / 7) * Math.PI * 2 - Math.PI / 2;
    return {
      x: this.centerX + Math.cos(angle) * this.radius,
      y: this.centerY + Math.sin(angle) * this.radius
    };
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);
    
    // Request animation frame for pulsing effect
    requestAnimationFrame(() => this.render());
    
    const activeNode = this.hoveredNode;
    const highlightedEdges = [];
    const normalEdges = [];

    // Draw all dominion edges
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i !== j && aspectDominates(i, j)) {
          if (activeNode !== null && (i === activeNode || j === activeNode)) {
            highlightedEdges.push([i, j]);
          } else {
            normalEdges.push([i, j]);
          }
        }
      }
    }

    for (const [i, j] of normalEdges) {
      this.drawEdge(i, j);
    }
    for (const [i, j] of highlightedEdges) {
      this.drawEdge(i, j);
    }
    
    for (let i = 0; i < 7; i++) {
      this.drawNode(i);
    }
  }

  drawNode(index) {
    const aspect = ASPECTS[index];
    const pos = this.getNodePosition(index);
    const color = aspect.color;
    const ctx = this.ctx;
    
    const isHovered = this.hoveredNode === index;
    const isAwakened = this.gameState.players[this.gameState.activePlayer]?.hasAwakenedAspect(index);
    
    // Pulsing glow for awakened aspects
    if (isAwakened && !isHovered) {
      const pulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.7;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10 * pulse;
      
      // Draw glow ring
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3 * pulse;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.nodeRadius + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    
    if (isHovered) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
    }
    
    ctx.fillStyle = isAwakened ? color : 'rgba(40, 40, 60, 0.8)';
    ctx.strokeStyle = isAwakened ? 'white' : 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = isAwakened ? 2 : 1;
    
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    // Symbol with subtle glow for awakened
    if (isAwakened) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 5;
    }
    
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.strokeStyle = isAwakened ? '#000' : 'rgba(255, 255, 255, 0.4)';
    AspectIcons.draw(ctx, index, 10);
    ctx.restore();
    
    ctx.shadowBlur = 0;

    if (isHovered) {
        ctx.fillStyle = 'white';
        ctx.font = '10px Space Mono';
        ctx.fillText(aspect.name, pos.x, pos.y + this.nodeRadius + 12);
    }
  }

  drawEdge(from, to) {
    const fromPos = this.getNodePosition(from);
    const toPos = this.getNodePosition(to);
    
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ratio = (dist - this.nodeRadius) / dist;
    
    const endX = fromPos.x + dx * ratio;
    const endY = fromPos.y + dy * ratio;
    
    const ctx = this.ctx;
    
    const activeNode = this.hoveredNode;
    let edgeColor = 'rgba(255, 255, 255, 0.15)';
    let arrowColor = 'rgba(255, 255, 255, 0.3)';
    let lineWidth = 1;

    if (activeNode !== null) {
      if (from === activeNode) {
        edgeColor = '#4CAF50';
        arrowColor = '#4CAF50';
        lineWidth = 2;
      } else if (to === activeNode) {
        edgeColor = '#FF5252';
        arrowColor = '#FF5252';
        lineWidth = 2;
      }
    }

    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(fromPos.x, fromPos.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    this.drawArrowHead(fromPos.x, fromPos.y, endX, endY, arrowColor);
  }

  drawArrowHead(fromX, fromY, toX, toY, color) {
    const ctx = this.ctx;
    const headLen = 8;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLen * Math.cos(angle - Math.PI / 6),
      toY - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLen * Math.cos(angle + Math.PI / 6),
      toY - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  }
}