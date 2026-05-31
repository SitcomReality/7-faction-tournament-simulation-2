/**
 * Supernal Interregnum
 * Entry point: Bootstraps the App orchestrator.
 */
import { App } from './core/App.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init().catch(err => {
    console.error('The Sacred Rite has failed to initiate:', err);
  });
});