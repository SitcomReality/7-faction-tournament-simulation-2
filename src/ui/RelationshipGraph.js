/**
 * RelationshipGraph - Interactive visualization of faction relationships
 */
export class RelationshipGraph {
  constructor(container, gameState, tournamentGraph) {
    this.container = container;
    this.gameState = gameState;
    this.tournamentGraph = tournamentGraph;
    
    this.canvas = null;
    this.ctx = null;
    this.size = 260; // Slightly smaller to fit UI panel padding
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
        <canvas id="relationship-canvas" width="${this.size}" height="${this.size}" 
                style="border-radius: 8px; background: rgba(0,0,0,0.3); cursor: default; touch-action: none;"></canvas>
        
        <div style="font-size: 10px; opacity: 0.6; text-align: center;">
          The Cosmic Wheel (Immutable)
        </div>

        <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 8px 0;">

        <div class="theme-row" style="margin-top: 0; padding-top: 0; border-top: none;">
          <select id="theme-select" title="Theme">
            <option value="default" ${this.gameState.currentTheme === 'default' ? 'selected' : ''}>Default</option>
            <option value="cyberpunk" ${this.gameState.currentTheme === 'cyberpunk' ? 'selected' : ''}>Cyberpunk</option>
            <option value="pastel" ${this.gameState.currentTheme === 'pastel' ? 'selected' : ''}>Pastel</option>
          </select>
          <button id="shuffle-colors-btn" title="Shuffle Colors">🎲</button>
        </div>
      </div>
    `;
    
    this.canvas = this.container.querySelector('#relationship-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      this.hoveredNode = this.getNodeAt(e.offsetX, e.offsetY);
      this.render();
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredNode = null;
      this.render();
    });

    const shuffleBtn = this.container.querySelector('#shuffle-colors-btn');
    shuffleBtn.addEventListener('click', () => {
      this.gameState.shuffleFactionColors();
      this.render();
    });
    
    const themeSelect = this.container.querySelector('#theme-select');
    themeSelect.addEventListener('change', (e) => {
      this.gameState.setTheme(e.target.value);
      this.render();
    });
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
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);
    
    const activeNode = this.hoveredNode;
    const highlightedEdges = [];
    const normalEdges = [];

    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i !== j && this.tournamentGraph.beats(i, j)) {
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
    const pos = this.getNodePosition(index);
    const color = this.gameState.theme.factions[index];
    const ctx = this.ctx;
    
    const isHovered = this.hoveredNode === index;
    
    if (isHovered) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
    }
    
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Space Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(index.toString(), pos.x, pos.y);
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
    let edgeColor = 'rgba(255, 255, 255, 0.2)';
    let arrowColor = 'rgba(255, 255, 255, 0.4)';
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