/**
 * VisualSettings - Control aesthetic and rendering parameters
 */
export class VisualSettings {
  constructor(container, gameState) {
    this.container = container;
    this.gameState = gameState;
    
    this.createUI();
  }

  createUI() {
    const html = `
      <div class="setting-row">
        <span>Blend Influence</span>
        <label class="toggle">
          <input type="checkbox" id="influence-blend-toggle" ${this.gameState.blendInfluenceColors ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <span>Hex Fill</span>
        <label class="toggle">
          <input type="checkbox" id="hex-fill-toggle" ${this.gameState.showHexFill ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <span>Hex Glow</span>
        <label class="toggle">
          <input type="checkbox" id="hex-glow-toggle" ${this.gameState.showHexGlow ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <span>Conversion Ripple</span>
        <label class="toggle">
          <input type="checkbox" id="conversion-star-toggle" ${this.gameState.showConversionStar ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-row" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
        <span>Map Orientation</span>
        <button id="rotate-btn" style="padding: 4px 12px; font-size: 10px;">🔄 Rotate View</button>
      </div>
    `;
    
    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Influence Blending toggle
    const influenceBlendToggle = document.getElementById('influence-blend-toggle');
    influenceBlendToggle.addEventListener('change', (e) => {
      this.gameState.blendInfluenceColors = e.target.checked;
    });

    // Hex fill toggle
    const hexFillToggle = document.getElementById('hex-fill-toggle');
    hexFillToggle.addEventListener('change', (e) => {
      this.gameState.showHexFill = e.target.checked;
    });

    // Hex glow toggle
    const hexGlowToggle = document.getElementById('hex-glow-toggle');
    hexGlowToggle.addEventListener('change', (e) => {
      this.gameState.showHexGlow = e.target.checked;
    });

    // Conversion star toggle
    const conversionStarToggle = document.getElementById('conversion-star-toggle');
    conversionStarToggle.addEventListener('change', (e) => {
      this.gameState.showConversionStar = e.target.checked;
    });

    // Rotate Map button
    const rotateBtn = document.getElementById('rotate-btn');
    rotateBtn.addEventListener('click', () => {
      this.gameState.toggleHexRotation();
    });
  }
}