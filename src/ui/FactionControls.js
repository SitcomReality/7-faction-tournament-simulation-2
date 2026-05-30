/**
 * FactionControls - Displays faction chips in top bar
 */
export class FactionControls {
  constructor(container, gameState, simulationEngine, grid, tournamentGraph) {
    this.container = container;
    this.gameState = gameState;
    this.simulationEngine = simulationEngine;
    this.grid = grid;
    this.tournamentGraph = tournamentGraph;
    
    this.createUI();
    
    document.addEventListener('themeChanged', () => {
      this.refresh();
    });
    
    document.addEventListener('paintModeChanged', () => {
      this.refresh();
    });
    
    // Update counts periodically
    setInterval(() => this.updateCounts(), 500);
  }

  createUI() {
    const html = `
      ${this.gameState.theme.factions.map((color, id) => this.createFactionItem(id, color)).join('')}
    `;
    
    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  createFactionItem(factionId, color) {
    const isSelected = this.gameState.paintMode === 'faction' && this.gameState.selectedPaintFaction === factionId;
    const count = this.gameState.stats.factionCounts[factionId] || 0;
    
    return `
      <div class="faction-chip ${isSelected ? 'selected' : ''}" data-faction="${factionId}">
        <div class="faction-color" style="background: ${color}; box-shadow: 0 0 8px ${color};"></div>
        <span class="faction-count">${count}</span>
      </div>
    `;
  }

  attachEventListeners() {
    // Faction chips (click to select for painting)
    const factionChips = this.container.querySelectorAll('.faction-chip');
    factionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const factionId = parseInt(chip.dataset.faction);
        this.gameState.setPaintMode('faction', factionId);
      });
    });
  }

  updateGrid(newGrid) {
    this.grid = newGrid;
  }

  refresh() {
    this.createUI();
  }

  updateCounts() {
    const items = this.container.querySelectorAll('.faction-count');
    items.forEach((item, i) => {
      const count = this.gameState.stats.factionCounts[i] || 0;
      if (item.textContent !== count.toString()) {
        item.textContent = count;
      }
    });
  }
}