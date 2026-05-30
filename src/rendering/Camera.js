/**
 * Camera - Manages viewport translation, zoom, and frustum culling bounds
 */
export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.zoom = 1.0;
  }

  /**
   * Applies the camera transformation to a 2D context
   */
  apply(ctx, width, height) {
    ctx.translate(width / 2, height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(this.x, this.y);
  }

  /**
   * Calculates the current view bounds in world space
   */
  getBounds(width, height, padding = 0) {
    const invZoom = 1 / this.zoom;
    return {
      left: -this.x - (width / 2) * invZoom - padding,
      right: -this.x + (width / 2) * invZoom + padding,
      top: -this.y - (height / 2) * invZoom - padding,
      bottom: -this.y + (height / 2) * invZoom + padding
    };
  }

  /**
   * Screen coordinates to world coordinates
   */
  screenToWorld(screenX, screenY, width, height) {
    const x = (screenX - width / 2) / this.zoom - this.x;
    const y = (screenY - height / 2) / this.zoom - this.y;
    return { x, y };
  }
}