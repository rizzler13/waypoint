import { CameraPosition } from '@/types';

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = 1;

  public targetX: number = 0;
  public targetY: number = 0;
  public targetZoom: number = 1;

  private lerpFactor: number = 0.08; // Smooth factor (higher = faster)

  constructor(initial?: CameraPosition) {
    if (initial) {
      this.x = initial.x;
      this.y = initial.y;
      this.zoom = initial.zoom;
      this.targetX = initial.x;
      this.targetY = initial.y;
      this.targetZoom = initial.zoom;
    }
  }

  public setTarget(x: number, y: number, zoom: number) {
    this.targetX = x;
    this.targetY = y;
    this.targetZoom = Math.max(0.1, Math.min(4.0, zoom));
  }

  public setTargetPosition(pos: CameraPosition) {
    this.setTarget(pos.x, pos.y, pos.zoom);
  }

  public jumpTo(x: number, y: number, zoom: number) {
    this.x = x;
    this.y = y;
    this.zoom = zoom;
    this.targetX = x;
    this.targetY = y;
    this.targetZoom = zoom;
  }

  public update(): boolean {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dz = this.targetZoom - this.zoom;

    // If we are extremely close, snap to target
    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05 && Math.abs(dz) < 0.001) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.zoom = this.targetZoom;
      return false; // Camera has finished moving
    }

    this.x += dx * this.lerpFactor;
    this.y += dy * this.lerpFactor;
    this.zoom += dz * this.lerpFactor;
    return true; // Camera is still moving
  }

  // Convert client/mouse coordinates to canvas space
  public toCanvasCoords(clientX: number, clientY: number, canvasWidth: number, canvasHeight: number): { x: number; y: number } {
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    return {
      x: (clientX - cx - this.x) / this.zoom,
      y: (clientY - cy - this.y) / this.zoom,
    };
  }

  // Center the camera on a specific bounding box in canvas space
  public centerOnBox(
    boxX: number,
    boxY: number,
    boxWidth: number,
    boxHeight: number,
    canvasWidth: number,
    canvasHeight: number,
    padding = 60
  ) {
    const targetZoomX = canvasWidth / (boxWidth + padding * 2);
    const targetZoomY = canvasHeight / (boxHeight + padding * 2);
    const targetZoom = Math.max(0.1, Math.min(3.0, Math.min(targetZoomX, targetZoomY)));

    // In canvas space, the center of the box is:
    const boxCenterX = boxX + boxWidth / 2;
    const boxCenterY = boxY + boxHeight / 2;

    // We want the box center to align with the screen center.
    // Screen coords: screen_center = canvas_space_coord * zoom + camera_offset
    // We want screen_center to match the center of the screen, which means:
    // camera_offset = -boxCenterX * zoom
    this.setTarget(-boxCenterX * targetZoom, -boxCenterY * targetZoom, targetZoom);
  }
}
