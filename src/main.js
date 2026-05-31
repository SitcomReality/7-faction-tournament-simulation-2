/**
 * Supernal Interregnum
 * Loading hub and entrypoint.
 */
import { Application } from './core/Application.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = new Application();
  app.init();
});