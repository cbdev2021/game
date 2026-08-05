class Enemy {
  constructor(def, px, py) {
    this.x = px;
    this.y = py;
    this.vx = 0;
    this.vy = 0;
    this.dir = -1;
    this.onGround = false;
    this.maxHp = 40;
    this.hp = this.maxHp;
    this.damage = 8;
    this.speed = 45;
    this.hitTimer = 0;
    this.deathTimer = 0;
    this.dead = false;
    this.xpReward = 25;
    this.animTime = 0;
    this.minX = def.min * CONFIG.TILE;
    this.maxX = def.max * CONFIG.TILE;
  }

  update(dt, level) {
    this.x += this.speed * this.dir * dt;
    this.applyBounds();
    this.collideHorizontal(level);
    this.vy = Math.min(CONFIG.MAX_FALL, this.vy + CONFIG.GRAVITY * dt);
    this.y += this.vy * dt;
    this.onGround = false;
    this.collideVertical(level);
    this.hitTimer = Math.max(0, this.hitTimer - dt);
    this.animTime += dt;
  }

  applyBounds() {
    const e = CONFIG.ENEMY;
    if (this.x <= this.minX) {
      this.x = this.minX;
      this.dir = 1;
    } else if (this.x + e.W >= this.maxX) {
      this.x = this.maxX - e.W;
      this.dir = -1;
    }
  }

  collideHorizontal(level) {
    const e = CONFIG.ENEMY;
    const top = tileAt(this.y);
    const bottom = tileAt(this.y + e.H - 1);
    if (this.dir > 0) {
      const right = tileAt(this.x + e.W);
      for (let ty = top; ty <= bottom; ty++) {
        if (level.isSolid(right, ty)) {
          this.x = right * CONFIG.TILE - e.W;
          this.dir = -1;
          break;
        }
      }
    } else {
      const left = tileAt(this.x);
      for (let ty = top; ty <= bottom; ty++) {
        if (level.isSolid(left, ty)) {
          this.x = (left + 1) * CONFIG.TILE;
          this.dir = 1;
          break;
        }
      }
    }
  }

  collideVertical(level) {
    const e = CONFIG.ENEMY;
    const left = tileAt(this.x);
    const right = tileAt(this.x + e.W - 1);
    if (this.vy >= 0) {
      const bottom = tileAt(this.y + e.H);
      for (let tx = left; tx <= right; tx++) {
        if (level.isSolid(tx, bottom)) {
          this.y = bottom * CONFIG.TILE - e.H;
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
}
