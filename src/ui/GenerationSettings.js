export class GenerationSettings {
  constructor(container, gameState, grid, worldGenerator, gameEngine) {
    this.container = container;
    this.gameState = gameState;
    this.grid = grid;
    this.worldGenerator = worldGenerator;
    this.gameEngine = gameEngine;
    this.initialGridType = this.detectGridType();
    
    this.createUI();
  }

  detectGridType() {
    if (this.grid.constructor.name.includes('Triangular')) return 'triangular';
    if (this.grid.constructor.name.includes('Square')) return 'square';
    return 'hexagonal';
  }

  getInitialGridType() {
    return this.initialGridType;
  }

  createUI() {
    const html = `
      <div class="setting-row">
        <span>Grid Type</span>
        <select id="grid-type-select" style="width: 140px;">
          <option value="triangular" ${this.gameState.gridType === 'triangular' ? 'selected' : ''}>Triangular</option>
          <option value="square" ${this.gameState.gridType === 'square' ? 'selected' : ''}>Square</option>
          <option value="hexagonal" ${this.gameState.gridType === 'hexagonal' ? 'selected' : ''}>Hexagonal</option>
        </select>
      </div>

      <div class="setting-row">
        <span>Map Type</span>
        <select id="map-type-select" style="width: 140px;">
          <option value="random" ${this.gameState.mapType === 'random' ? 'selected' : ''}>Island</option>
          <option value="land" ${this.gameState.mapType === 'land' ? 'selected' : ''}>Land</option>
          <option value="ocean" ${this.gameState.mapType === 'ocean' ? 'selected' : ''}>Ocean</option>
        </select>
      </div>

      <div class="setting-row">
        <span>Boundary</span>
        <select id="boundary-select" style="width: 140px;">
          <option value="circular" ${this.gameState.boundaryShape === 'circular' ? 'selected' : ''}>Circular</option>
          <option value="square" ${this.gameState.boundaryShape === 'square' ? 'selected' : ''}>Square</option>
        </select>
      </div>

      <div class="setting-row">
        <span>Keep Terrain</span>
        <label class="toggle">
          <input type="checkbox" id="keep-terrain-toggle" ${this.gameState.keepTerrain ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="setting-slider">
        <div class="slider-header">
          <span>Map Size</span>
          <span id="map-size-value">${this.gameState.mapSize}</span>
        </div>
        <input type="range" id="map-size-slider" min="10" max="60" step="1" value="${this.gameState.mapSize}">
      </div>
      
      <div style="display: flex; gap: 8px; margin-top: 24px;">
        <button id="reset-btn" style="flex: 1; padding: 12px 8px; background: rgba(76, 175, 80, 0.2); border-color: #4CAF50;">Regenerate Map</button>
      </div>
    `;
    
    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  attachEventListeners() {
    const gridTypeSelect = document.getElementById('grid-type-select');
    gridTypeSelect.addEventListener('change', (e) => {
      this.gameState.gridType = e.target.value;
      this.gameState.saveGenerationSettings();
    });

    const boundarySelect = document.getElementById('boundary-select');
    boundarySelect.addEventListener('change', (e) => {
      this.gameState.boundaryShape = e.target.value;
      this.gameState.saveGenerationSettings();
    });

    const keepTerrainToggle = document.getElementById('keep-terrain-toggle');
    keepTerrainToggle.addEventListener('change', (e) => {
      this.gameState.keepTerrain = e.target.checked;
      this.gameState.saveGenerationSettings();
    });

    const mapTypeSelect = document.getElementById('map-type-select');
    mapTypeSelect.addEventListener('change', (e) => {
      this.gameState.mapType = e.target.value;
      this.gameState.saveGenerationSettings();
    });

    const mapSizeSlider = document.getElementById('map-size-slider');
    const mapSizeValue = document.getElementById('map-size-value');
    mapSizeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.gameState.mapSize = val;
      mapSizeValue.textContent = val;
      this.gameState.saveGenerationSettings();
    });

    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', () => {
      this.regenerateWorld();
    });
  }

  regenerateWorld() {
    this.gameState.saveGenerationSettings();
    // Dispatch event to main simulation controller to rebuild everything
    document.dispatchEvent(new CustomEvent('worldRegenRequested'));
  }
}