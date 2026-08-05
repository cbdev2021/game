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
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function playerRect() {
  const p = CONFIG.PLAYER;
  return { x: game.player.x, y: game.player.y, w: p.W, h: p.H };
}

function enemyRect(e) {
  return { x: e.x, y: e.y, w: CONFIG.ENEMY.W, h: CONFIG.ENEMY.H };
}

function update(dt) {
  if (game.state === 'menu') {
    if (input.pressed('left')) game.selected = (game.selected + CHARACTERS.length - 1) % CHARACTERS.length;
    if (input.pressed('right')) game.selected = (game.selected + 1) % CHARACTERS.length;
    if (input.pressed('jump') || input.pressed('attack')) startLevel();
  } else if (game.state === 'play') {
    const p = game.player;
    p.update(dt, input, game.level);
    for (const e of game.enemies) e.update(dt, game.level);

    if (p.attackTimer > 0) {
      const hb = p.getAttackHitbox();
      for (const e of game.enemies) {
        if (e.dead || e.hitTimer > 0) continue;
        if (overlaps(hb, enemyRect(e))) {
          e.hp -= p.attack;
          e.hitTimer = 0.12;
          if (e.hp <= 0) {
            e.dead = true;
            e.deathTimer = 0.25;
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
}

let last = performance.now();

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  render(ctx, game);
  input.endFrame();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
