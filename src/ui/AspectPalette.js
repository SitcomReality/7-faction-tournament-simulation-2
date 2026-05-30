/**
 * AspectPalette - UI component for selecting and awakening Divine Aspects
 */
import { ASPECTS } from '../core/DivineAspect.js';
import { AwakenAction } from '../core/Action.js';

export class AspectPalette {
  constructor(container, gameState, gameEngine) {
    this.container = container;
    this.gameState = gameState;
    this.gameEngine = gameEngine;
    
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('turnAdvanced', () => this.render());
    document.addEventListener('aspectAwakened', () => this.render());
    document.addEventListener('actionQueued', () => this.render());
  }

  render() {
    const activePlayer = this.gameState.players[this.gameState.activePlayer];
    if (!activePlayer) return;

    const currentEssence = activePlayer.essence;
    const nextCost = activePlayer.getAwakeningCost();
    const canAfford = activePlayer.canAffordAwakening();

    this.container.innerHTML = `
      <div class="aspect-palette">
        <div class="palette-header">
          <div class="essence-display">
            <span class="essence-icon">✨</span>
            <span class="essence-value">${currentEssence}</span>
            <span class="essence-label">Essence</span>
          </div>
        </div>
        
        <div class="aspect-grid">
          ${ASPECTS.map(aspect => this.renderAspectButton(aspect, activePlayer)).join('')}
        </div>
        
        ${activePlayer.awakenedAspects.size < 7 ? `
          <div class="awakening-info">
            Next Awakening: <span class="${canAfford ? 'affordable' : 'unaffordable'}">${nextCost} ✨</span>
          </div>
        ` : ''}
      </div>
    `;

    this.attachPaletteEvents();
  }

  renderAspectButton(aspect, player) {
    const isAwakened = player.hasAwakenedAspect(aspect.id);
    const isSelected = this.gameState.selectedAspect === aspect.id;
    const canAfford = player.canAffordAwakening();
    
    let classes = ['aspect-btn'];
    if (isAwakened) classes.push('awakened');
    if (isSelected) classes.push('selected');
    if (!isAwakened && !canAfford) classes.push('disabled');

    return `
      <button class="${classes.join(' ')}" 
              data-id="${aspect.id}" 
              data-awakened="${isAwakened}"
              title="${aspect.name}: ${aspect.description}">
        <span class="aspect-symbol" style="color: ${isAwakened ? aspect.color : 'rgba(255,255,255,0.2)'}">${aspect.symbol}</span>
        ${!isAwakened ? `<span class="lock-icon">🔒</span>` : ''}
      </button>
    `;
  }

  attachPaletteEvents() {
    const buttons = this.container.querySelectorAll('.aspect-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const awakened = btn.dataset.awakened === 'true';
        const player = this.gameState.players[this.gameState.activePlayer];

        if (awakened) {
          // Select for manifestation
          if (this.gameState.selectedAspect === id) {
            this.gameState.selectedAspect = null;
          } else {
            this.gameState.selectedAspect = id;
          }
          this.render();
        } else {
          // Attempt awakening
          if (player.canAffordAwakening()) {
            const action = new AwakenAction(player.id, id);
            if (this.gameEngine.queueAction(player.id, action)) {
              console.log(`Queued awakening for aspect ${id}`);
              document.dispatchEvent(new CustomEvent('actionQueued'));
            }
          }
        }
      });
    });
  }
}