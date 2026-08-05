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

const FLASH_CACHE = new Map();

function flashPalette(palette) {
  let out = FLASH_CACHE.get(palette);
  if (out) return out;
  out = {};
  for (const key in palette) {
    const n = parseInt(palette[key].slice(1), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const m = 0.72;
    out[key] = '#' + (
      (Math.round(r + (255 - r) * m) << 16) |
      (Math.round(g + (255 - g) * m) << 8) |
      Math.round(b + (255 - b) * m)
    ).toString(16).padStart(6, '0');
  }
  FLASH_CACHE.set(palette, out);
  return out;
}

function render(ctx, game) {
  ctx.imageSmoothingEnabled = false;
  if (game.state === 'menu') {
    drawMenu(ctx, game);
    return;
  }
  const sh = game.shakeTimer > 0
    ? { x: (Math.random() * 2 - 1) * game.shakeMag, y: (Math.random() * 2 - 1) * game.shakeMag }
    : { x: 0, y: 0 };
  ctx.save();
  ctx.translate(sh.x, sh.y);
  drawSky(ctx, game.camera);
  drawLevel(ctx, game.level, game.camera);
  drawEnemies(ctx, game.enemies, game.camera);
  drawPlayer(ctx, game.player, game.camera);
  drawParticles(ctx, game.camera);
  ctx.restore();
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

function drawSpriteScaled(ctx, grid, palette, x, y, facing, scale, flash) {
  const pal = flash ? flashPalette(palette) : palette;
  const w = grid[0].length;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < w; col++) {
      const color = pal[grid[row][col]];
      if (!color) continue;
      const sx = x + (facing > 0 ? col : w - 1 - col) * scale;
      ctx.fillStyle = color;
      ctx.fillRect(sx, y + row * scale, scale, scale);
    }
  }
}

function drawSprite(ctx, grid, palette, x, y, facing, flash) {
  drawSpriteScaled(ctx, grid, palette, x, y, facing, 1, flash);
}

function spriteOffsets(grid, hitboxW, hitboxH) {
  const gx = grid[0].length;
  const gy = grid.length;
  return {
    x: Math.round((hitboxW - gx) / 2),
    y: hitboxH - gy,
  };
}

function drawPlayer(ctx, player, camera) {
  const p = CONFIG.PLAYER;
  const h = player.h();
  const x = Math.round(player.x - camera.x);
  const y = Math.round(player.y - camera.y);
  const sp = CLASS_SPRITES[player.char.id];
  const grid = POSES[player.animState][player.frameIndex];
  const off = spriteOffsets(grid, p.W, h);
  ctx.globalAlpha = player.invulnTimer > 0 ? 0.4 : 1;
  drawSprite(ctx, grid, sp.palette, x + off.x, y + off.y, player.facing);
  if (sp.accent) drawSprite(ctx, sp.accent, sp.palette, x + off.x, y + off.y, player.facing);
  if (sp.head) drawSprite(ctx, sp.head, sp.palette, x + off.x, y + off.y, player.facing);
  ctx.globalAlpha = 1;
  if (player.animState === 'attack') {
    const wp = WEAPONS[player.char.id];
    if (wp) drawWeapon(ctx, wp, sp.palette, x, y, player.facing, off);
  }
  if (player.isStriking()) drawSlashArc(ctx, player, x, y);
}

function drawWeapon(ctx, wp, palette, x, y, facing, off) {
  const grid = wp.grid;
  const gx = grid[0].length;
  const wpx = x + off.x + (facing > 0 ? wp.dx : SPRITE_W - wp.dx - gx);
  drawSprite(ctx, grid, palette, wpx, y + off.y + wp.dy, facing);
}

function drawSlashArc(ctx, player, x, y) {
  const p = CONFIG.PLAYER;
  const cy = y + p.H * 0.45;
  const cx = x + p.W / 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (player.facing > 0) {
    ctx.arc(cx + 8, cy, 16, -Math.PI / 2, Math.PI / 2);
  } else {
    ctx.arc(cx - 8, cy, 16, Math.PI / 2, Math.PI * 1.5);
  }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(120,220,255,0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (player.facing > 0) {
    ctx.arc(cx + 8, cy, 13, -Math.PI / 2.6, Math.PI / 2.6);
  } else {
    ctx.arc(cx - 8, cy, 13, Math.PI - Math.PI / 2.6, Math.PI + Math.PI / 2.6);
  }
  ctx.stroke();
}

function drawEnemies(ctx, enemies, camera) {
  const e = CONFIG.ENEMY;
  for (const enemy of enemies) {
    const x = Math.round(enemy.x - camera.x);
    const y = Math.round(enemy.y - camera.y);
    if (enemy.dead) {
      const a = clamp(enemy.deathTimer / 0.6, 0, 1);
      ctx.globalAlpha = a;
      drawSprite(ctx, ENEMY_SPRITES[1], ENEMY_PALETTE, x - 1, y, enemy.dir);
      ctx.globalAlpha = 1;
      continue;
    }
    const frame = Math.floor(enemy.animTime * 8) % ENEMY_SPRITES.length;
    drawSprite(ctx, ENEMY_SPRITES[frame], ENEMY_PALETTE, x - 1, y, enemy.dir, enemy.hitTimer > 0);
    drawBar(ctx, x, y - 4, e.W, 3, enemy.hp / enemy.maxHp, '#40d040', '#2a5a2a');
  }
}

function drawParticles(ctx, camera) {
  for (const p of game.particles) {
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x - camera.x), Math.round(p.y - camera.y), p.size, p.size);
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
    const grid = POSES.idle[0];
    const sx = x + Math.round((cardW - grid[0].length * 2) / 2);
    drawSpriteScaled(ctx, grid, sp.palette, sx, cardY + 4, 1, 2);
    if (sp.accent) drawSpriteScaled(ctx, sp.accent, sp.palette, sx, cardY + 4, 1, 2);
    if (sp.head) drawSpriteScaled(ctx, sp.head, sp.palette, sx, cardY + 4, 1, 2);
    ctx.fillStyle = '#fff';
    ctx.fillText(ch.name, x + cardW / 2, cardY + 62);
    ctx.fillText('HP ' + ch.hp, x + cardW / 2, cardY + 74);
    ctx.fillText('MP ' + ch.mp, x + cardW / 2, cardY + 84);
  }

  ctx.fillStyle = '#aaa';
  ctx.fillText('← → elegir    Saltar/Golpear: comenzar', CONFIG.VIEW_W / 2, CONFIG.VIEW_H - 34);
  ctx.fillText('Mover: ← → / A D    Saltar: ↑ W Espacio K', CONFIG.VIEW_W / 2, CONFIG.VIEW_H - 24);
  ctx.fillText('Golpear: Ctrl / J    Agacharse: ↓ / S', CONFIG.VIEW_W / 2, CONFIG.VIEW_H - 14);
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
