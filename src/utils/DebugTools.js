/**
 * DebugTools - Utility to expose game internal state for console-based debugging.
 */
import { ASPECTS } from '../core/DivineAspect.js';

export class DebugTools {
  /**
   * Exposes key game objects to window.game
   */
  static expose(context) {
    window.game = {
      app: context,
      gameState: context.gameState,
      grid: context.worldController.grid,
      gameEngine: context.gameEngine,
      renderer: context.renderer,
      aspects: ASPECTS,
      stats: () => {
        console.log('Total cells:', context.worldController.grid.cells.size);
        context.gameState.players.forEach(p => {
          console.log(`  ${p.name}: ${p.essence} essence, aspects:`, [...p.awakenedAspects]);
        });
      }
    };
  }
}