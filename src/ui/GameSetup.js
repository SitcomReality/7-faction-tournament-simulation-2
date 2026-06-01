/**
 * GameSetup - Pre-game configuration screen
 */
export class GameSetup {
  constructor(container) {
    this.container = container;
    this.config = this.getDefaultConfig();
  }

  getDefaultConfig() {
    return {
      playerCount: 2,
      players: [
        { name: 'House Aurorus', type: 'human', difficulty: null },
        { name: 'House Nocturn', type: 'ai', difficulty: 'medium' }
      ],
      mapSize: 14,
      gridType: 'hexagonal',
      mapType: 'land',
      boundaryShape: 'circular',
      victoryCondition: 'ascension'
    };
  }

  show() {
    this.render();
    this.container.classList.remove('hidden');
  }

  hide() {
    this.container.classList.add('hidden');
  }

  render() {
    const playerColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const houseNames = [
      'House Aurorus', 'House Nocturn', 'House Vortan', 
      'House Lithic', 'House Ignaar', 'House Pelagos', 'House Astral'
    ];

    this.container.innerHTML = `
      <div class="setup-container">
        <div class="setup-header">
          <div class="setup-title">Supernal Interregnum</div>
          <div class="setup-subtitle">Configure Sacred Duel</div>
        </div>

        <div class="setup-section">
          <div class="setup-section-title">Claimant Houses</div>
          <div class="setting-row">
            <span>Player Count</span>
            <select id="player-count-select">
              ${[2, 3, 4, 5, 6, 7].map(n => 
                `<option value="${n}" ${n === this.config.playerCount ? 'selected' : ''}>${n} Houses</option>`
              ).join('')}
            </select>
          </div>
          <div id="player-configs" style="margin-top: 16px;">
            ${this.config.players.map((p, i) => this.renderPlayerConfig(p, i, playerColors[i], houseNames)).join('')}
          </div>
        </div>

        <div class="setup-section">
          <div class="setup-section-title">Sacred Realm</div>
          <div class="setting-row">
            <span>Grid Type</span>
            <select id="setup-grid-type">
              <option value="triangular" ${this.config.gridType === 'triangular' ? 'selected' : ''}>Triangular</option>
              <option value="square" ${this.config.gridType === 'square' ? 'selected' : ''}>Square</option>
              <option value="hexagonal" ${this.config.gridType === 'hexagonal' ? 'selected' : ''}>Hexagonal</option>
            </select>
          </div>
          <div class="setting-row">
            <span>Map Type</span>
            <select id="setup-map-type">
              <option value="random" ${this.config.mapType === 'random' ? 'selected' : ''}>Island</option>
              <option value="land" ${this.config.mapType === 'land' ? 'selected' : ''}>Land</option>
              <option value="ocean" ${this.config.mapType === 'ocean' ? 'selected' : ''}>Ocean</option>
            </select>
          </div>
          <div class="setting-row">
            <span>Boundary</span>
            <select id="setup-boundary">
              <option value="circular" ${this.config.boundaryShape === 'circular' ? 'selected' : ''}>Circular</option>
              <option value="square" ${this.config.boundaryShape === 'square' ? 'selected' : ''}>Square</option>
            </select>
          </div>
          <div class="setting-slider">
            <div class="slider-header">
              <span>Map Size</span>
              <span id="setup-map-size-value">${this.config.mapSize}</span>
            </div>
            <input type="range" id="setup-map-size" min="10" max="60" step="1" value="${this.config.mapSize}">
          </div>
        </div>

        <div class="setup-section">
          <div class="setup-section-title">Victory Condition</div>
          <div class="setting-row">
            <select id="setup-victory-condition" style="width: 100%;">
              <option value="ascension" ${this.config.victoryCondition === 'ascension' ? 'selected' : ''}>Ascension (Control 50% Sanctums)</option>
              <option value="omniscience" ${this.config.victoryCondition === 'omniscience' ? 'selected' : ''}>Divine Omniscience (Awaken All Aspects)</option>
              <option value="elimination" ${this.config.victoryCondition === 'elimination' ? 'selected' : ''}>Last House Standing</option>
            </select>
          </div>
        </div>

        <div class="setup-actions">
          <button class="setup-btn" id="quick-start-btn" style="flex: 0.5;">Quick Start</button>
          <button class="setup-btn primary" id="start-game-btn" style="flex: 1;">Begin Sacred Rite</button>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  renderPlayerConfig(player, index, color, houseNames) {
    return `
      <div class="player-config">
        <div class="player-color-indicator" style="background: ${color};"></div>
        <input type="text" 
               class="player-name-input" 
               data-index="${index}" 
               value="${player.name}" 
               placeholder="House Name">
        <select class="player-type-select" data-index="${index}">
          <option value="human" ${player.type === 'human' ? 'selected' : ''}>Human</option>
          <option value="ai" ${player.type === 'ai' ? 'selected' : ''}>AI</option>
        </select>
        ${player.type === 'ai' ? `
          <select class="player-difficulty-select" data-index="${index}">
            <option value="easy" ${player.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
            <option value="medium" ${player.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="hard" ${player.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
          </select>
        ` : ''}
      </div>
    `;
  }

  attachEvents() {
    const playerCountSelect = document.getElementById('player-count-select');
    playerCountSelect.addEventListener('change', (e) => {
      this.config.playerCount = parseInt(e.target.value);
      this.updatePlayerConfigs();
    });

    const mapSizeSlider = document.getElementById('setup-map-size');
    const mapSizeValue = document.getElementById('setup-map-size-value');
    mapSizeSlider.addEventListener('input', (e) => {
      this.config.mapSize = parseInt(e.target.value);
      mapSizeValue.textContent = this.config.mapSize;
    });

    document.getElementById('setup-grid-type').addEventListener('change', (e) => {
      this.config.gridType = e.target.value;
    });

    document.getElementById('setup-map-type').addEventListener('change', (e) => {
      this.config.mapType = e.target.value;
    });

    document.getElementById('setup-boundary').addEventListener('change', (e) => {
      this.config.boundaryShape = e.target.value;
    });

    document.getElementById('setup-victory-condition').addEventListener('change', (e) => {
      this.config.victoryCondition = e.target.value;
    });

    document.getElementById('start-game-btn').addEventListener('click', () => {
      this.collectPlayerData();
      document.dispatchEvent(new CustomEvent('gameSetupComplete', { detail: this.config }));
      this.hide();
    });

    document.getElementById('quick-start-btn').addEventListener('click', () => {
      this.config = this.getDefaultConfig();
      document.dispatchEvent(new CustomEvent('gameSetupComplete', { detail: this.config }));
      this.hide();
    });

    this.attachPlayerConfigEvents();
  }

  attachPlayerConfigEvents() {
    const nameInputs = document.querySelectorAll('.player-name-input');
    nameInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.config.players[index].name = e.target.value;
      });
    });

    const typeSelects = document.querySelectorAll('.player-type-select');
    typeSelects.forEach(select => {
      select.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.config.players[index].type = e.target.value;
        this.render(); // Re-render to show/hide difficulty
      });
    });

    const difficultySelects = document.querySelectorAll('.player-difficulty-select');
    difficultySelects.forEach(select => {
      select.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.config.players[index].difficulty = e.target.value;
      });
    });
  }

  updatePlayerConfigs() {
    const houseNames = [
      'House Aurorus', 'House Nocturn', 'House Vortan', 
      'House Lithic', 'House Ignaar', 'House Pelagos', 'House Astral'
    ];

    while (this.config.players.length < this.config.playerCount) {
      this.config.players.push({
        name: houseNames[this.config.players.length],
        type: 'ai',
        difficulty: 'medium'
      });
    }

    while (this.config.players.length > this.config.playerCount) {
      this.config.players.pop();
    }

    this.render();
  }

  collectPlayerData() {
    // Already collected via event listeners, but ensure it's up to date
    const nameInputs = document.querySelectorAll('.player-name-input');
    nameInputs.forEach((input, i) => {
      if (this.config.players[i]) {
        this.config.players[i].name = input.value;
      }
    });
  }

  getConfig() {
    return this.config;
  }
}