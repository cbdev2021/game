const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.VIEW_W;
canvas.height = CONFIG.VIEW_H;

const input = new Input();

const game = {
  state: 'menu',
  selected: 0,
  player: null,
  level: null,
  camera: null,
  enemies: [],
  completeTime: 0,
  particles: [],
  hitStop: 0,
  shakeTimer: 0,
  shakeMag: 0,
  dustTimer: 0,
};

function startLevel() {
  game.state = 'play';
  game.level = new Level1();
  game.player = new Player(CHARACTERS[game.selected], game.level.spawnX, game.level.spawnY);
  game.camera = new Camera();
  game.enemies = game.level.enemyDefs.map(
    (d) => new Enemy(d, d.x * CONFIG.TILE, 11 * CONFIG.TILE - CONFIG.ENEMY.H)
  );
  game.completeTime = 0;
  game.particles = [];
  game.hitStop = 0;
  game.shakeTimer = 0;
  game.shakeMag = 0;
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function playerRect() {
  const p = CONFIG.PLAYER;
  return { x: game.player.x, y: game.player.y, w: p.W, h: game.player.h() };
}

function enemyRect(e) {
  return { x: e.x, y: e.y, w: CONFIG.ENEMY.W, h: CONFIG.ENEMY.H };
}

function spawnDust(x, y, n) {
  for (let i = 0; i < n; i++) {
    game.particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y - Math.random() * 2,
      vx: (Math.random() - 0.5) * 50,
      vy: -Math.random() * 30 - 10,
      life: 0.25 + Math.random() * 0.2,
      color: Math.random() < 0.5 ? '#a06a35' : '#c89a55',
      size: Math.random() < 0.5 ? 1 : 2,
    });
  }
}

function spawnSparks(x, y, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 40 + Math.random() * 80;
    game.particles.push({
      x: x,
      y: y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 20,
      life: 0.15 + Math.random() * 0.15,
      color: Math.random() < 0.5 ? '#ffe066' : '#ffaa33',
      size: 1,
    });
  }
}

function updateParticles(dt) {
  for (const p of game.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 300 * dt;
    p.life -= dt;
  }
  game.particles = game.particles.filter((p) => p.life > 0);
}

function update(dt) {
  if (game.state === 'menu') {
    if (input.pressed('left')) game.selected = (game.selected + CHARACTERS.length - 1) % CHARACTERS.length;
    if (input.pressed('right')) game.selected = (game.selected + 1) % CHARACTERS.length;
    if (input.pressed('jump') || input.pressed('attack')) startLevel();
  } else if (game.state === 'play') {
    const p = game.player;
    const prevY = p.y;
    const prevGround = p.onGround;
    p.update(dt, input, game.level);
    for (const e of game.enemies) e.update(dt, game.level);

    if (!prevGround && p.onGround && p.y > prevY) {
      spawnDust(p.x + CONFIG.PLAYER.W / 2, p.y + p.h(), 4);
      game.shakeTimer = CONFIG.JUICE.SHAKE_LAND;
      game.shakeMag = CONFIG.JUICE.SHAKE_LAND_MAG;
    }

    if (p.onGround && Math.abs(p.vx) > 100 && !p.crouch) {
      game.dustTimer += dt;
      if (game.dustTimer > 0.12) {
        game.dustTimer = 0;
        spawnDust(p.x + CONFIG.PLAYER.W / 2 - p.facing * 6, p.y + p.h(), 1);
      }
    } else {
      game.dustTimer = 0;
    }

    if (p.isStriking()) {
      const hb = p.getAttackHitbox();
      for (const e of game.enemies) {
        if (e.dead || e.hitTimer > 0) continue;
        if (overlaps(hb, enemyRect(e))) {
          e.hp -= p.attack;
          e.hitTimer = 0.12;
          game.hitStop = CONFIG.JUICE.HIT_STOP;
          game.shakeTimer = CONFIG.JUICE.SHAKE_HIT;
          game.shakeMag = CONFIG.JUICE.SHAKE_HIT_MAG;
          spawnSparks(e.x + CONFIG.ENEMY.W / 2, e.y + CONFIG.ENEMY.H / 2, 6);
          if (e.hp <= 0) {
            e.dead = true;
            e.deathTimer = 0.6;
          }
        }
      }
    }

    for (const e of game.enemies) {
      if (e.dead) {
        e.deathTimer -= dt;
        continue;
      }
      if (p.invulnTimer <= 0 && overlaps(playerRect(), enemyRect(e))) {
        p.hp -= e.damage;
        p.invulnTimer = 0.9;
        p.vx = (p.x < e.x ? -1 : 1) * 130;
      }
    }
    game.enemies = game.enemies.filter((e) => !(e.dead && e.deathTimer <= 0));

    if (p.hp <= 0) {
      p.respawn(game.level);
      p.hp = p.char.hp;
      p.invulnTimer = 1;
    }

    game.camera.follow(p, CONFIG.VIEW_W, CONFIG.VIEW_H, game.level);
    if (p.x >= game.level.goalX) {
      game.state = 'complete';
      game.completeTime = 0;
    }
    if (p.y > game.level.pixelHeight + 80) {
      p.respawn(game.level);
    }
  } else if (game.state === 'complete') {
    game.completeTime += dt;
    if (game.completeTime > 0.4 && (input.pressed('jump') || input.pressed('attack'))) {
      game.state = 'menu';
    }
  }

  updateParticles(dt);
  if (game.shakeTimer > 0) {
    game.shakeTimer -= dt;
    if (game.shakeTimer <= 0) game.shakeMag = 0;
  }
}

let last = performance.now();

function frame(now) {
  const realDt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (game.hitStop > 0) {
    game.hitStop -= realDt;
  } else {
    update(realDt);
  }
  render(ctx, game);
  input.endFrame();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
