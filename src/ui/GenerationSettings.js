export class GenerationSettings {
  constructor(container, gameState, grid, worldGenerator, simulationEngine) {
    this.container = container;
    this.gameState = gameState;
    this.grid = grid;
    this.worldGenerator = worldGenerator;
    this.simulationEngine = simulationEngine;
    this.initialGridType = this.detectGridType();
    
    this.createUI();
  }

  detectGridType() {
    if (this.grid.constructor.name.includes('Triangular')) return 'triangular';
    if (this.grid.constructor.name.includes('Square')) return 'square';
    if (this.grid.constructor.name.includes('Heptagonal')) return 'voronoi';
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
          <option value="voronoi" ${this.gameState.gridType === 'voronoi' ? 'selected' : ''}>Voronoi</option>
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

      <div class="setting-row">
        <span>Initial Pattern</span>
        <select id="pattern-select" style="width: 140px;">
          <option value="scattered" ${this.gameState.initialPattern === 'scattered' ? 'selected' : ''}>Scattered</option>
          <option value="stripes" ${this.gameState.initialPattern === 'stripes' ? 'selected' : ''}>Stripes</option>
          <option value="checkerboard" ${this.gameState.initialPattern === 'checkerboard' ? 'selected' : ''}>Checkerboard</option>
          <option value="random" ${this.gameState.initialPattern === 'random' ? 'selected' : ''}>Random Fill</option>
        </select>
      </div>

      <div class="setting-slider" id="seeds-slider-container" style="${this.gameState.initialPattern === 'scattered' ? '' : 'display: none;'}">
        <div class="slider-header">
          <span>Seeds per Faction</span>
          <span id="seeds-value">${this.gameState.seedsPerFaction}</span>
        </div>
        <input type="range" id="seeds-slider" min="1" max="10" step="1" value="${this.gameState.seedsPerFaction}">
      </div>
      
      <div style="display: flex; gap: 8px; margin-top: 24px;">
        <button id="pause-btn" style="flex: 1; padding: 12px 8px;">${this.gameState.isPaused ? 'Resume' : 'Pause'}</button>
        <button id="reset-btn" style="flex: 1; padding: 12px 8px; background: rgba(76, 175, 80, 0.2); border-color: #4CAF50;">Regenerate</button>
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

    const patternSelect = document.getElementById('pattern-select');
    const seedsSliderContainer = document.getElementById('seeds-slider-container');
    patternSelect.addEventListener('change', (e) => {
      this.gameState.initialPattern = e.target.value;
      seedsSliderContainer.style.display = e.target.value === 'scattered' ? '' : 'none';
      this.gameState.saveGenerationSettings();
    });

    const seedsSlider = document.getElementById('seeds-slider');
    const seedsValue = document.getElementById('seeds-value');
    seedsSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.gameState.seedsPerFaction = val;
      seedsValue.textContent = val;
      this.gameState.saveGenerationSettings();
    });

    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.addEventListener('click', () => {
      this.gameState.togglePause();
      pauseBtn.textContent = this.gameState.isPaused ? 'Resume' : 'Pause';
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