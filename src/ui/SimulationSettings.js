/**
 * SimulationSettings - Control simulation parameters
 */
export class SimulationSettings {
  constructor(container, gameState) {
    this.container = container;
    this.gameState = gameState;
    
    this.createUI();
  }

  createUI() {
    const html = `


      <div class="setting-row">
        <span>Map Wrapping</span>
        <label class="toggle">
          <input type="checkbox" id="wrap-toggle" ${this.gameState.isWrappingEnabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-slider">
        <div class="slider-header">
          <span>Speed (ticks/s)</span>
          <span id="speed-value">${this.gameState.simulationSpeed.toFixed(1)}</span>
        </div>
        <input type="range" id="speed-slider" min="0.1" max="50" step="0.1" value="${this.gameState.simulationSpeed}">
      </div>
      
      <div class="setting-slider">
        <div class="slider-header">
          <span>Influence Per Tick</span>
          <span id="influence-value">${this.gameState.influencePerTick.toFixed(1)}</span>
        </div>
        <input type="range" id="influence-slider" min="0.1" max="5" step="0.1" value="${this.gameState.influencePerTick}">
      </div>
      
      <div class="setting-slider">
        <div class="slider-header">
          <span>Threshold</span>
          <span id="threshold-value">${this.gameState.conversionThreshold.toFixed(0)}</span>
        </div>
        <input type="range" id="threshold-slider" min="2" max="100" step="1" value="${this.gameState.conversionThreshold}">
      </div>

      <div class="setting-slider">
        <div class="slider-header">
          <span>Decay Rate</span>
          <span id="decay-value">${this.gameState.influenceDecayRate.toFixed(3)}</span>
        </div>
        <input type="range" id="decay-slider" min="0.8" max="1.0" step="0.005" value="${this.gameState.influenceDecayRate}">
      </div>

      <div class="setting-slider">
        <div class="slider-header">
          <span>Variation (%)</span>
          <span id="variation-value">${(this.gameState.randomVariation * 100).toFixed(0)}</span>
        </div>
        <input type="range" id="variation-slider" min="0" max="1" step="0.01" value="${this.gameState.randomVariation}">
      </div>
    `;
    
    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Speed slider
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    speedSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.gameState.setSimulationSpeed(value);
      speedValue.textContent = value.toFixed(1);
    });

    // Influence slider
    const influenceSlider = document.getElementById('influence-slider');
    const influenceValue = document.getElementById('influence-value');
    influenceSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.gameState.setInfluencePerTick(value);
      influenceValue.textContent = value.toFixed(1);
    });

    // Threshold slider
    const thresholdSlider = document.getElementById('threshold-slider');
    const thresholdValue = document.getElementById('threshold-value');
    thresholdSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.gameState.setConversionThreshold(value);
      thresholdValue.textContent = value.toFixed(0);
    });

    // Decay slider
    const decaySlider = document.getElementById('decay-slider');
    const decayValue = document.getElementById('decay-value');
    decaySlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.gameState.setInfluenceDecayRate(value);
      decayValue.textContent = value.toFixed(3);
    });

    // Variation slider
    const variationSlider = document.getElementById('variation-slider');
    const variationValue = document.getElementById('variation-value');
    variationSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.gameState.setRandomVariation(value);
      variationValue.textContent = (value * 100).toFixed(0);
    });

    // Wrapping toggle
    const wrapToggle = document.getElementById('wrap-toggle');
    wrapToggle.addEventListener('change', (e) => {
      this.gameState.isWrappingEnabled = e.target.checked;
    });
  }
}