const PALETTE = {
  '.': null,
  '#': '#a06a35',
  'T': '#5aa02c',
  '=': '#8f6a3a',
  'G': '#3ecfe0',
};

const SKY_TOP = '#1b2436';
const SKY_BOTTOM = '#3a4a68';

const STARS = [
  [20, 18], [58, 30], [97, 12], [140, 26], [178, 16], [220, 34], [260, 22], [300, 12],
  [40, 40], [120, 42], [200, 44], [280, 42],
];

function render(ctx, game) {
  ctx.imageSmoothingEnabled = false;
  if (game.state === 'menu') {
    drawMenu(ctx, game);
    return;
  }
  drawSky(ctx, game.camera);
  drawLevel(ctx, game.level, game.camera);
  drawEnemies(ctx, game.enemies, game.camera);
  drawPlayer(ctx, game.player, game.camera);
  drawHUD(ctx, game);
  if (game.state === 'complete') drawComplete(ctx);
}

function drawSky(ctx, camera) {
  const g = ctx.createLinearGradient(0, 0, 0, CONFIG.VIEW_H);
  g.addColorStop(0, SKY_TOP);
  g.addColorStop(1, SKY_BOTTOM);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CONFIG.VIEW_W, CONFIG.VIEW_H);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  const camX = camera ? camera.x : 0;
  for (const [sx, sy] of STARS) {
    const x = ((sx - camX * 0.3) % (CONFIG.VIEW_W + 20) + CONFIG.VIEW_W + 20) % (CONFIG.VIEW_W + 20) - 10;
    ctx.fillRect(x, sy, 2, 2);
  }
}

function drawLevel(ctx, level, camera) {
  const x0 = Math.floor(camera.x / CONFIG.TILE);
  const x1 = Math.floor((camera.x + CONFIG.VIEW_W) / CONFIG.TILE);
  for (let ty = 0; ty < level.height; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const tile = level.tileAt(tx, ty);
      const color = PALETTE[tile];
      if (!color) continue;
      const px = tx * CONFIG.TILE - camera.x;
      const py = ty * CONFIG.TILE - camera.y;
      ctx.fillStyle = color;
      ctx.fillRect(px, py, CONFIG.TILE, CONFIG.TILE);
      if (tile === '#') {
        ctx.fillStyle = '#7a4f28';
        ctx.fillRect(px, py, CONFIG.TILE, 3);
        ctx.fillStyle = '#8f5f30';
        ctx.fillRect(px, py + 7, 3, 2);
        ctx.fillRect(px + 8, py + 11, 3, 2);
        if ((tx * 7 + ty * 13) % 4 === 0) {
          ctx.fillStyle = '#8f5f30';
          ctx.fillRect(px + 5, py + 4, 2, 2);
        }
      } else if (tile === 'T') {
        ctx.fillStyle = '#3c7a1e';
        ctx.fillRect(px, py + CONFIG.TILE - 4, CONFIG.TILE, 4);
        ctx.fillStyle = '#6ab83a';
        if (tx % 2 === 0) ctx.fillRect(px + 2, py + 2, 2, 2);
        if (tx % 3 === 0) ctx.fillRect(px + 10, py + 4, 2, 2);
      } else if (tile === '=') {
        ctx.fillStyle = '#b08a4a';
        ctx.fillRect(px, py, CONFIG.TILE, 2);
        ctx.fillStyle = '#5f4526';
        ctx.fillRect(px, py + 8, CONFIG.TILE, 1);
        ctx.fillRect(px, py, 2, CONFIG.TILE);
        ctx.fillRect(px + CONFIG.TILE - 2, py, 2, CONFIG.TILE);
      } else if (tile === 'G') {
        ctx.fillStyle = 'rgba(62,207,224,0.35)';
        ctx.fillRect(px - 2, py - 2, CONFIG.TILE + 4, CONFIG.TILE * 2 + 4);
        ctx.fillStyle = color;
        ctx.fillRect(px, py, CONFIG.TILE, CONFIG.TILE * 2);
        ctx.fillStyle = '#0a1a2a';
        ctx.fillRect(px + 2, py + 2, CONFIG.TILE - 4, CONFIG.TILE * 2 - 4);
        ctx.fillStyle = '#eaffff';
        ctx.fillRect(px + 6, py + 5, 4, 4);
        ctx.fillRect(px + 6, py + 18, 4, 4);
      }
    }
  }
}

function drawSpriteScaled(ctx, grid, palette, x, y, facing, scale) {
  const w = grid[0].length;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < w; col++) {
      const color = palette[grid[row][col]];
      if (!color) continue;
      const sx = x + (facing > 0 ? col : w - 1 - col) * scale;
      ctx.fillStyle = color;
      ctx.fillRect(sx, y + row * scale, scale, scale);
    }
  }
}

function drawSprite(ctx, grid, palette, x, y, facing) {
  drawSpriteScaled(ctx, grid, palette, x, y, facing, 1);
}

function drawPlayer(ctx, player, camera) {
  const x = Math.round(player.x - camera.x);
  const y = Math.round(player.y - camera.y);
  const sp = CLASS_SPRITES[player.char.id];
  const grid = POSES[player.animState][player.frameIndex];
  ctx.globalAlpha = player.invulnTimer > 0 ? 0.4 : 1;
  drawSprite(ctx, grid, sp.palette, x, y, player.facing);
  if (sp.head) drawSprite(ctx, sp.head, sp.palette, x, y, player.facing);
  ctx.globalAlpha = 1;
  if (player.attackTimer > 0) {
    const ax = player.facing > 0 ? x + CONFIG.PLAYER.W : x - CONFIG.ATTACK.RANGE;
    ctx.fillStyle = 'rgba(255,230,120,0.85)';
    ctx.fillRect(ax, y + 6, CONFIG.ATTACK.RANGE, 6);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(ax, y + 7, CONFIG.ATTACK.RANGE, 2);
  }
}

function drawEnemies(ctx, enemies, camera) {
  const e = CONFIG.ENEMY;
  for (const enemy of enemies) {
    const x = Math.round(enemy.x - camera.x);
    const y = Math.round(enemy.y - camera.y);
    if (enemy.dead) {
      const a = clamp(enemy.deathTimer / 0.25, 0, 1) * 0.6;
      ctx.fillStyle = 'rgba(178,59,74,' + a.toFixed(2) + ')';
      ctx.fillRect(x, y, e.W, e.H);
      continue;
    }
    const frame = Math.floor(enemy.animTime * 8) % ENEMY_SPRITES.length;
    drawSprite(ctx, ENEMY_SPRITES[frame], ENEMY_PALETTE, x, y, enemy.dir);
    if (enemy.hitTimer > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(x, y, e.W, e.H);
    }
    drawBar(ctx, x, y - 4, e.W, 3, enemy.hp / enemy.maxHp, '#40d040', '#2a5a2a');
  }
}

function drawHUD(ctx, game) {
  const p = game.player;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, CONFIG.VIEW_W, 26);
  ctx.font = '8px monospace';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.fillText(p.char.name, 6, 11);
  ctx.fillText('HP', 6, 22);
  drawBar(ctx, 22, 16, 60, 6, p.hp / p.char.hp, '#e04040', '#600000');
  ctx.fillText('MP', 88, 22);
  drawBar(ctx, 104, 16, 60, 6, p.mp / p.char.mp, '#4080e0', '#002060');
  ctx.fillStyle = '#aaa';
  ctx.textAlign = 'right';
  ctx.fillText('Cadash Web', CONFIG.VIEW_W - 6, 11);
  ctx.textAlign = 'left';
}

function drawBar(ctx, x, y, w, h, ratio, color, back) {
  ctx.fillStyle = back;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * clamp(ratio, 0, 1), h);
}

function drawMenu(ctx, game) {
  drawSky(ctx, null);
  ctx.textAlign = 'center';
  ctx.font = '16px monospace';
  ctx.fillStyle = '#ffd24a';
  ctx.fillText('CADASH', CONFIG.VIEW_W / 2, 40);
  ctx.font = '8px monospace';
  ctx.fillStyle = '#fff';
  ctx.fillText('Elige tu personaje', CONFIG.VIEW_W / 2, 56);

  const cardW = 60;
  const gap = 8;
  const startX = Math.floor((CONFIG.VIEW_W - (4 * cardW + 3 * gap)) / 2);
  const cardY = 66;
  const cardH = 104;

  for (let i = 0; i < CHARACTERS.length; i++) {
    const ch = CHARACTERS[i];
    const x = startX + i * (cardW + gap);
    const selected = i === game.selected;
    ctx.fillStyle = selected ? '#ffd24a' : '#333';
    ctx.fillRect(x - 1, cardY - 1, cardW + 2, cardH + 2);
    ctx.fillStyle = selected ? '#1a1a2a' : '#11151f';
    ctx.fillRect(x, cardY, cardW, cardH);
    const sp = CLASS_SPRITES[ch.id];
    drawSpriteScaled(ctx, POSES.idle[0], sp.palette, x + (cardW - 28) / 2, cardY + 4, 1, 2);
    if (sp.head) drawSpriteScaled(ctx, sp.head, sp.palette, x + (cardW - 28) / 2, cardY + 4, 1, 2);
    ctx.fillStyle = '#fff';
    ctx.fillText(ch.name, x + cardW / 2, cardY + 62);
    ctx.fillText('HP ' + ch.hp, x + cardW / 2, cardY + 74);
    ctx.fillText('MP ' + ch.mp, x + cardW / 2, cardY + 84);
  }

  ctx.fillStyle = '#aaa';
  ctx.fillText('← → elegir    Saltar/Golpear: comenzar', CONFIG.VIEW_W / 2, CONFIG.VIEW_H - 34);
  ctx.fillText('Mover: ← → / A D    Saltar: ↑ W Espacio K', CONFIG.VIEW_W / 2, CONFIG.VIEW_H - 24);
  ctx.fillText('Golpear: Ctrl / J', CONFIG.VIEW_W / 2, CONFIG.VIEW_H - 14);
  ctx.textAlign = 'left';
}

function drawComplete(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, CONFIG.VIEW_W, CONFIG.VIEW_H);
  ctx.textAlign = 'center';
  ctx.font = '10px monospace';
  ctx.fillStyle = '#ffd24a';
  ctx.fillText('¡NIVEL COMPLETO!', CONFIG.VIEW_W / 2, CONFIG.VIEW_H / 2 - 8);
  ctx.font = '8px monospace';
  ctx.fillStyle = '#fff';
  ctx.fillText('Pulsa Saltar o Golpear para volver al menú', CONFIG.VIEW_W / 2, CONFIG.VIEW_H / 2 + 8);
  ctx.textAlign = 'left';
}
