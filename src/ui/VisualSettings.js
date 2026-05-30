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
        <span>Cell Fill</span>
        <label class="toggle">
          <input type="checkbox" id="hex-fill-toggle" ${this.gameState.showHexFill ? 'checked' : ''}>
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
    const hexFillToggle = document.getElementById('hex-fill-toggle');
    hexFillToggle.addEventListener('change', (e) => {
      this.gameState.showHexFill = e.target.checked;
    });

    // Rotate Map button
    const rotateBtn = document.getElementById('rotate-btn');
    rotateBtn.addEventListener('click', () => {
      this.gameState.toggleHexRotation();
    });
  }
}