class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  follow(target, viewW, viewH, level) {
    const px = target.x + CONFIG.PLAYER.W / 2 - viewW / 2;
    this.x = clamp(px, 0, Math.max(0, level.pixelWidth - viewW));
    this.y = 0;
  }
}
