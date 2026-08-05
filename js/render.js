const SKY_TOP = '#1b2436';
const SKY_BOTTOM = '#3a4a68';

const STARS = [
  [20, 18], [58, 30], [97, 12], [140, 26], [178, 16], [220, 34], [260, 22], [300, 12],
  [40, 40], [120, 42], [200, 44], [280, 42],
];

function hash2(a, b) {
  const n = a * 374761393 + b * 668265263;
  return (Math.abs(n) % 997) / 997;
}

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
  drawLevel(ctx, game.level, game.camera, game.time || 0);
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
  const camX = camera ? camera.x : 0;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (const [sx, sy] of STARS) {
    const x = ((sx - camX * 0.2) % (CONFIG.VIEW_W + 20) + CONFIG.VIEW_W + 20) % (CONFIG.VIEW_W + 20) - 10;
    ctx.fillRect(x, sy, 2, 2);
  }
  drawHills(ctx, camX * 0.12, 148, 26, '#222c44');
  drawHills(ctx, camX * 0.3, 166, 20, '#1a2336');
  ctx.fillStyle = 'rgba(160,180,210,0.35)';
  for (let i = 0; i < 6; i++) {
    const bx = ((i * 187 + 40 - camX * 0.5) % (CONFIG.VIEW_W + 220) + CONFIG.VIEW_W + 220) % (CONFIG.VIEW_W + 220) - 110;
    const by = 28 + ((i * 53) % 96);
    drawCloud(ctx, bx, by);
  }
}

function drawHills(ctx, offset, baseY, amp, color) {
  ctx.fillStyle = color;
  const period = 96;
  const start = Math.floor(offset / period);
  for (let k = start - 1; k < start + Math.ceil(CONFIG.VIEW_W / period) + 2; k++) {
    const x0 = k * period - offset;
    const hgt = amp * (0.3 + 0.7 * Math.abs(Math.sin(k * 1.7 + 2)));
    ctx.fillRect(x0, baseY - hgt, period, hgt + 40);
  }
}

function drawCloud(ctx, bx, by) {
  ctx.fillRect(bx + 4, by + 4, 20, 4);
  ctx.fillRect(bx, by + 8, 28, 4);
  ctx.fillRect(bx + 10, by, 12, 4);
  ctx.fillRect(bx + 7, by + 4, 18, 4);
}

function drawLevel(ctx, level, camera, time) {
  const x0 = Math.floor(camera.x / CONFIG.TILE);
  const x1 = Math.floor((camera.x + CONFIG.VIEW_W) / CONFIG.TILE);
  for (let ty = 0; ty < level.height; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const tile = level.tileAt(tx, ty);
      if (!tile || tile === '.') continue;
      const px = tx * CONFIG.TILE - camera.x;
      const py = ty * CONFIG.TILE - camera.y;
      if (tile === '#') drawDirt(ctx, px, py, tx, ty);
      else if (tile === 'T') drawGrass(ctx, px, py, tx, ty);
      else if (tile === '=') drawPlatform(ctx, px, py);
      else if (tile === 'G') drawPortal(ctx, px, py, tx, ty, time);
    }
  }
}

function drawGrass(ctx, px, py, tx, ty) {
  ctx.fillStyle = '#4a9426';
  ctx.fillRect(px, py, CONFIG.TILE, CONFIG.TILE);
  const bladeCols = ['#6cc23c', '#5ab22e', '#3f8a1e'];
  for (let k = 0; k < 6; k++) {
    const bx = px + Math.floor(hash2(tx * 3 + k, ty * 7 + k) * 14);
    const bh = 2 + Math.floor(hash2(tx + k, ty + 11 + k) * 3);
    ctx.fillStyle = bladeCols[k % 3];
    ctx.fillRect(bx, py + 16 - bh - 1, 1, bh + 1);
    ctx.fillStyle = '#8ad85a';
    ctx.fillRect(bx, py + 16 - bh - 1, 1, 1);
  }
  ctx.fillStyle = '#3a7a1e';
  for (let i = 0; i < 4; i++) {
    const bx = px + Math.floor(i * 4 + hash2(tx, ty) * 2);
    ctx.fillRect(bx, py + 13, 3, 3);
  }
  const fr = hash2(tx * 5 + 1, ty * 3 + 2);
  if (fr < 0.2) {
    const fx = px + 2 + Math.floor(fr * 11);
    const fy = py + 1 + Math.floor(hash2(tx, ty + 9) * 8);
    ctx.fillStyle = fr < 0.1 ? '#ffffff' : '#ff9ac8';
    ctx.fillRect(fx, fy, 3, 3);
    ctx.fillStyle = '#ffe066';
    ctx.fillRect(fx + 1, fy + 1, 1, 1);
  }
}

function drawDirt(ctx, px, py, tx, ty) {
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(px, py, CONFIG.TILE, CONFIG.TILE);
  ctx.fillStyle = '#5c3a1c';
  ctx.fillRect(px, py, CONFIG.TILE, 3);
  for (let k = 0; k < 2; k++) {
    const sy = py + 5 + Math.floor(hash2(tx * 7 + k, ty * 13 + k) * 8);
    const sx = px + Math.floor(hash2(tx + k * 3, ty + k * 5) * 9);
    ctx.fillRect(sx, sy, 4 + Math.floor(hash2(tx + 1, ty + 2 + k) * 4), 1);
  }
  for (let k = 0; k < 3; k++) {
    const px2 = px + Math.floor(hash2(tx * 11 + k, ty * 17 + k) * 12);
    const py2 = py + 4 + Math.floor(hash2(tx * 3 + k, ty * 5 + k) * 9);
    ctx.fillStyle = k === 0 ? '#a06a35' : '#6a4520';
    ctx.fillRect(px2, py2, 2, hash2(tx + k, ty + k + 1) > 0.5 ? 2 : 1);
  }
  ctx.fillStyle = '#b07a44';
  ctx.fillRect(px + Math.floor(hash2(tx, ty * 3 + 7) * 14), py + Math.floor(hash2(tx * 2, ty) * 13), 1, 1);
}

function drawPlatform(ctx, px, py) {
  ctx.fillStyle = '#9a7238';
  ctx.fillRect(px, py, CONFIG.TILE, CONFIG.TILE);
  ctx.fillStyle = '#c8a05a';
  ctx.fillRect(px, py, CONFIG.TILE, 1);
  ctx.fillStyle = '#3f2c12';
  ctx.fillRect(px, py + 14, CONFIG.TILE, 2);
  ctx.fillStyle = '#6f5226';
  ctx.fillRect(px, py + 4, CONFIG.TILE, 1);
  ctx.fillRect(px, py + 8, CONFIG.TILE, 1);
  ctx.fillRect(px, py + 12, CONFIG.TILE, 1);
  for (const sep of [5, 12]) {
    ctx.fillStyle = '#4a3416';
    ctx.fillRect(px + sep, py, 1, CONFIG.TILE);
    ctx.fillStyle = '#2e2010';
    ctx.fillRect(px + sep - 1, py + 1, 3, 1);
    ctx.fillRect(px + sep - 1, py + 13, 3, 1);
  }
}

function drawPortal(ctx, px, py, tx, ty, time) {
  const pulse = 0.6 + 0.4 * Math.sin(time * 4 + tx);
  ctx.fillStyle = 'rgba(62,207,224,' + (0.25 * pulse).toFixed(3) + ')';
  ctx.fillRect(px - 3, py - 3, CONFIG.TILE + 6, CONFIG.TILE * 2 + 6);
  ctx.fillStyle = '#0a1a2a';
  ctx.fillRect(px, py, CONFIG.TILE, CONFIG.TILE * 2);
  ctx.fillStyle = 'rgba(62,207,224,' + (0.7 * pulse).toFixed(3) + ')';
  for (let y = 0; y < CONFIG.TILE * 2; y += 4) {
    const sx = px + 3 + Math.floor(hash2(tx * 3, ty * 3 + y / 4) * 9);
    ctx.fillRect(sx, py + y + 1, 4, 2);
  }
  ctx.fillStyle = '#eaffff';
  for (let k = 0; k < 5; k++) {
    const sy = (k * 41 + Math.floor(time * 8)) % (CONFIG.TILE * 2);
    const sx = 2 + Math.floor((hash2(tx + k, ty + k) + Math.sin(time * 3 + k) * 0.25) * 10);
    ctx.fillRect(px + sx, py + sy, 1, 1);
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
  const cls = player.char.id;
  const body = SPRITES[cls][player.animState][player.frameIndex];
  const off = spriteOffsets(body, p.W, h);
  const crouch = player.animState === 'crouch' || player.animState === 'crouchWalk';
  ctx.globalAlpha = player.invulnTimer > 0 ? 0.4 : 1;
  drawSprite(ctx, crouch ? BACK_LAYERS[cls].crouch : BACK_LAYERS[cls].stand, CLASS_PALETTES[cls], x + off.x, y + off.y, player.facing);
  drawSprite(ctx, body, CLASS_PALETTES[cls], x + off.x, y + off.y, player.facing);
  drawSprite(ctx, crouch ? ACCENTS[cls].crouch : ACCENTS[cls].stand, CLASS_PALETTES[cls], x + off.x, y + off.y, player.facing);
  drawSprite(ctx, HEADS[cls], CLASS_PALETTES[cls], x + off.x, y + off.y, player.facing);
  ctx.globalAlpha = 1;
  if (player.animState === 'attack') {
    const wp = WEAPONS[cls];
    if (wp) drawWeapon(ctx, wp, CLASS_PALETTES[cls], x, y, player.facing, off);
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
  const eoff = spriteOffsets(ENEMY_SPRITES[0], e.W, e.H);
  for (const enemy of enemies) {
    const x = Math.round(enemy.x - camera.x);
    const y = Math.round(enemy.y - camera.y);
    if (enemy.dead) {
      const a = clamp(enemy.deathTimer / 0.6, 0, 1);
      ctx.globalAlpha = a;
      drawSprite(ctx, ENEMY_SPRITES[1], ENEMY_PALETTE, x + eoff.x, y + eoff.y, enemy.dir);
      ctx.globalAlpha = 1;
      continue;
    }
    const frame = Math.floor(enemy.animTime * 8) % ENEMY_SPRITES.length;
    drawSprite(ctx, ENEMY_SPRITES[frame], ENEMY_PALETTE, x + eoff.x, y + eoff.y, enemy.dir, enemy.hitTimer > 0);
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
  const cardY = 56;
  const cardH = 130;

  for (let i = 0; i < CHARACTERS.length; i++) {
    const ch = CHARACTERS[i];
    const x = startX + i * (cardW + gap);
    const selected = i === game.selected;
    ctx.fillStyle = selected ? '#ffd24a' : '#333';
    ctx.fillRect(x - 1, cardY - 1, cardW + 2, cardH + 2);
    ctx.fillStyle = selected ? '#1a1a2a' : '#11151f';
    ctx.fillRect(x, cardY, cardW, cardH);
    const sp = CLASS_PALETTES[ch.id];
    const grid = SPRITES[ch.id].idle[0];
    const sx = x + Math.round((cardW - grid[0].length * 2) / 2);
    drawSpriteScaled(ctx, BACK_LAYERS[ch.id].stand, sp, sx, cardY + 6, 1, 2);
    drawSpriteScaled(ctx, grid, sp, sx, cardY + 6, 1, 2);
    drawSpriteScaled(ctx, ACCENTS[ch.id].stand, sp, sx, cardY + 6, 1, 2);
    drawSpriteScaled(ctx, HEADS[ch.id], sp, sx, cardY + 6, 1, 2);
    ctx.fillStyle = '#fff';
    ctx.fillText(ch.name, x + cardW / 2, cardY + 88);
    ctx.fillText('HP ' + ch.hp, x + cardW / 2, cardY + 100);
    ctx.fillText('MP ' + ch.mp, x + cardW / 2, cardY + 110);
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
