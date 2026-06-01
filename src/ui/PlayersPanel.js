export class PlayersPanel {
  constructor(container, gameState, grid) {
    this.container = container;
    this.gameState = gameState;
    this.grid = grid;
    
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('turnAdvanced', () => this.render());
    document.addEventListener('actionExecuted', () => this.render());
    document.addEventListener('divineClash', () => this.render());
  }

  updateGrid(grid) {
    this.grid = grid;
    this.render();
  }

  render() {
    if (!this.gameState.players || this.gameState.players.length === 0) return;

    // Calculate territories
    const territoryCounts = new Array(this.gameState.players.length).fill(0);
    if (this.grid) {
      for (const cell of this.grid.getAllCells()) {
        if (cell.owner !== null) {
          territoryCounts[cell.owner]++;
        }
      }
    }

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${this.gameState.players.map((p, i) => `
          <div style="background: rgba(0,0,0,0.3); border-left: 4px solid ${p.color}; padding: 8px; border-radius: 4px; ${this.gameState.activePlayer === i ? 'box-shadow: 0 0 8px ' + p.color : ''}; opacity: ${territoryCounts[i] === 0 && this.gameState.stats.turnCount > 0 ? '0.5' : '1'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="color: ${p.color}; font-size: 12px;">${p.name} ${p.isAI ? '(AI)' : ''}</strong>
              <span style="font-size: 11px; color: #4CAF50;">${p.essence} ✨</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-secondary);">
              <span>Territories: <span style="color: white;">${territoryCounts[i]}</span></span>
              <span>Awakened: <span style="color: white;">${p.awakenedAspects.size}/7</span></span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}