import { SystemOrchestrator } from './SystemOrchestrator.js';

/**
 * App - Entry point for the application. 
 * Strictly serves as a loading hub for specialized scripts.
 */
export class App {
  constructor() {
    this.orchestrator = new SystemOrchestrator();
  }

  /**
   * Initializes the game systems via the orchestrator.
   */
  async init() {
    return await this.orchestrator.init();
  }
}