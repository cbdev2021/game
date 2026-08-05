class Player {
  constructor(char, x, y) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1;
    this.onGround = false;
    this.hp = char.hp;
    this.mp = char.mp;
  }

  update(dt, input, level) {
    const p = CONFIG.PLAYER;
    const dir = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    if (dir !== 0) {
      this.vx += dir * p.ACCEL * dt;
      this.vx = clamp(this.vx, -this.char.speed, this.char.speed);
      this.facing = dir;
    } else {
      this.applyFriction(dt, p.FRICTION);
    }

    if (input.pressed('jump') && this.onGround) {
      this.vy = -this.char.jump;
      this.onGround = false;
    }
    if (!input.isDown('jump') && this.vy < 0) {
      this.vy += CONFIG.JUMP_CUT * dt;
    }

    this.vy = Math.min(CONFIG.MAX_FALL, this.vy + CONFIG.GRAVITY * dt);

    this.x += this.vx * dt;
    this.collideHorizontal(level);
    this.y += this.vy * dt;
    this.onGround = false;
    this.collideVertical(level);
  }

  applyFriction(dt, f) {
    if (this.vx > 0) this.vx = Math.max(0, this.vx - f * dt);
    else if (this.vx < 0) this.vx = Math.min(0, this.vx + f * dt);
  }

  collideHorizontal(level) {
    const p = CONFIG.PLAYER;
    const top = tileAt(this.y);
    const bottom = tileAt(this.y + p.H - 1);
    if (this.vx > 0) {
      const right = tileAt(this.x + p.W);
      for (let ty = top; ty <= bottom; ty++) {
        if (level.isSolid(right, ty)) {
          this.x = right * CONFIG.TILE - p.W;
          this.vx = 0;
          break;
        }
      }
    } else if (this.vx < 0) {
      const left = tileAt(this.x);
      for (let ty = top; ty <= bottom; ty++) {
        if (level.isSolid(left, ty)) {
          this.x = (left + 1) * CONFIG.TILE;
          this.vx = 0;
          break;
        }
      }
    }
  }

  collideVertical(level) {
    const p = CONFIG.PLAYER;
    const left = tileAt(this.x);
    const right = tileAt(this.x + p.W - 1);
    if (this.vy >= 0) {
      const bottom = tileAt(this.y + p.H);
      for (let tx = left; tx <= right; tx++) {
        if (level.isSolid(tx, bottom)) {
          this.y = bottom * CONFIG.TILE - p.H;
          this.vy = 0;
          this.onGround = true;
          break;
        }
      }
    } else {
      const top = tileAt(this.y);
      for (let tx = left; tx <= right; tx++) {
        if (level.isSolid(tx, top)) {
          this.y = (top + 1) * CONFIG.TILE;
          this.vy = 0;
          break;
        }
      }
    }
  }

  respawn(level) {
    this.x = level.spawnX;
    this.y = level.spawnY;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
  }
}

function tileAt(px) {
  return Math.floor(px / CONFIG.TILE);
}
