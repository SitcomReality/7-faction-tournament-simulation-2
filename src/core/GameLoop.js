/**
 * GameLoop - Manages the high-frequency execution of updates and rendering.
 */
export class GameLoop {
  constructor(updateCallback, renderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
    this.lastTime = 0;
    this.isRunning = false;
  }

  /**
   * Starts the animation loop
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.tick(t));
  }

  /**
   * Stops the animation loop
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Main loop tick
   */
  tick(currentTime) {
    if (!this.isRunning) return;

    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap delta time to 1 second to prevent massive jumps after tab-away
    if (deltaTime > 1000) deltaTime = 1000;

    if (this.updateCallback) {
      this.updateCallback(deltaTime);
    }

    if (this.renderCallback) {
      this.renderCallback(deltaTime);
    }

    requestAnimationFrame((t) => this.tick(t));
  }
}