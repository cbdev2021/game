const SKY_TOP = '#1b2436';
const SKY_BOTTOM = '#3a4a68';

const STARS = [
  [20, 18], [58, 30], [97, 12], [140, 26], [178, 16], [220, 34], [260, 22], [300, 12],
  [40, 40], [120, 42], [200, 44], [280, 42],
];

const CROUCH_SCALE = 0.72;

function hash2(a, b) {
  const n = a * 374761393 + b * 668265263;
  return (Math.abs(n) % 997) / 997;
}

function render(ctx, game) {
  ctx.imageSmoothingEnabled = false;
  if (DEBUG_MODE) {
    drawDebug(ctx, game);
    return;
  }
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

function drawArt(ctx, art, frameIdx, dx, dy, flip, sc) {
  const img = art.img;
  if (!img) return;
  const s = sc || 1;
  const w = art.fw * s;
  const h = art.fh * s;
  const sy = frameIdx * art.fh;
  if (flip) {
    ctx.save();
    ctx.translate(dx + w, dy);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, sy, art.fw, art.fh, 0, 0, w, h);
    ctx.restore();
  } else {
    ctx.drawImage(img, 0, sy, art.fw, art.fh, dx, dy, w, h);
  }
}

function drawTile(ctx, cells, idx, px, py) {
  const img = ART.tile.img;
  if (!img) return;
  ctx.drawImage(img, idx * ART.tile.fw, 0, ART.tile.fw, ART.tile.fh, px, py, ART.tile.fw, ART.tile.fh);
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
      if (tile === 'T') drawTile(ctx, ART.tile.grass, (tx * 7 + ty * 13) % ART.tile.grass.length, px, py);
      else if (tile === '#') drawTile(ctx, ART.tile.dirt, (tx * 11 + ty * 3) % ART.tile.dirt.length, px, py);
      else if (tile === '=') drawPlatform(ctx, px, py);
      else if (tile === 'G') drawPortal(ctx, px, py, tx, ty, time);
    }
  }
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

function drawPlayer(ctx, player, camera) {
  const art = ART.hero[player.char.id];
  if (!art || !art.img) return;
  const p = CONFIG.PLAYER;
  const h = player.h();
  const x = Math.round(player.x - camera.x);
  const y = Math.round(player.y - camera.y);
  const crouch = player.animState === 'crouch' || player.animState === 'crouchWalk';
  const sc = crouch ? CROUCH_SCALE : 1;
  const frames = art.anims[player.animState];
  const frame = frames[Math.min(player.frameIndex, frames.length - 1)];
  const flip = art.facesLeft ? player.facing > 0 : player.facing < 0;
  const dx = x + Math.round((p.W - art.fw * sc) / 2);
  const dy = y + Math.round(h - art.foot * sc);
  ctx.globalAlpha = player.invulnTimer > 0 ? 0.4 : 1;
  drawArt(ctx, art, frame, dx, dy, flip, sc);
  ctx.globalAlpha = 1;
  if (player.isStriking()) drawSlashArc(ctx, player, x, y);
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
    const art = ART.enemy[enemy.kind] || ART.enemy.slime;
    if (!art || !art.img) continue;
    const x = Math.round(enemy.x - camera.x);
    const y = Math.round(enemy.y - camera.y);
    const dx = x + Math.round((e.W - art.fw) / 2);
    const dy = y + Math.round(e.H - art.foot);
    const flip = art.facesLeft ? enemy.dir > 0 : enemy.dir < 0;
    if (enemy.dead) {
      const prog = clamp(1 - enemy.deathTimer / 0.6, 0, 1);
      const dframes = art.anims.death;
      const df = dframes[Math.min(Math.floor(prog * dframes.length), dframes.length - 1)];
      ctx.globalAlpha = clamp(enemy.deathTimer / 0.6, 0, 1);
      drawArt(ctx, art, df, dx, dy, flip);
      ctx.globalAlpha = 1;
      continue;
    }
    const frames = art.anims.walk;
    const frame = frames[Math.floor(enemy.animTime * 8) % frames.length];
    drawArt(ctx, art, frame, dx, dy, flip);
    if (enemy.hitTimer > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(x, y, e.W, e.H);
    }
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
    const art = ART.hero[ch.id];
    if (art && art.img) {
      const sc = 1.25;
      const sx = x + Math.round((cardW - art.fw * sc) / 2);
      const sy = cardY + 76 - Math.round(art.foot * sc);
      drawArt(ctx, art, art.anims.idle[0], sx, sy, art.facesLeft, sc);
    }
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

function drawDebug(ctx, game) {
  const W2 = CONFIG.VIEW_W * 2;
  ctx.fillStyle = '#0a0e18';
  ctx.fillRect(0, 0, W2, CONFIG.VIEW_H * 2);
  ctx.textAlign = 'left';
  ctx.font = '8px monospace';
  const poses = ['idle', 'run', 'jump', 'attack', 'land'];
  const pose = poses[Math.floor(game.time / 1.6) % poses.length];
  const facing = Math.floor(game.time / 1.6) % 2 === 0 ? 1 : -1;
  const cellW = W2 / 4;
  const cellH = 128;
  for (let i = 0; i < CHARACTERS.length; i++) {
    const ch = CHARACTERS[i];
    const art = ART.hero[ch.id];
    const cx = i * cellW;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(cx, 0, cellW - 2, cellH);
    ctx.fillStyle = '#fff';
    ctx.fillText(ch.name + ' - ' + pose, cx + 4, 10);
    if (!art || !art.img) {
      ctx.fillStyle = '#f66';
      ctx.fillText('sin arte', cx + 4, 22);
      continue;
    }
    const frames = art.anims[pose];
    const rate = pose === 'run' ? 8 : 4;
    const frame = frames[Math.floor(game.time * rate) % frames.length];
    const sc = 2;
    const dx = cx + Math.round((cellW - art.fw * sc) / 2);
    const dy = cellH - art.foot * sc;
    drawArt(ctx, art, frame, dx, dy, art.facesLeft ? facing > 0 : facing < 0, sc);
  }
  const ey = cellH + 8;
  ctx.fillStyle = '#fff';
  ctx.fillText('Enemigos', 4, ey);
  let ex = 8;
  for (const id in ART.enemy) {
    const art = ART.enemy[id];
    if (!art || !art.img) continue;
    const frames = art.anims.walk;
    const frame = frames[Math.floor(game.time * 8) % frames.length];
    drawArt(ctx, art, frame, ex, ey + 42 - art.foot * 2, false, 2);
    ctx.fillText(id, ex, ey + 14);
    ex += art.fw * 2 + 28;
  }
  const ty2 = ey + 50;
  ctx.fillStyle = '#fff';
  ctx.fillText('Tiles (grass: verde arriba, dirt: marrón)', 4, ty2);
  for (let i = 0; i < ART.tile.grass.length; i++) drawTile(ctx, ART.tile.grass, i, 8 + i * 20, ty2 + 4);
  let tx2 = 8 + ART.tile.grass.length * 20;
  for (let i = 0; i < ART.tile.dirt.length; i++) drawTile(ctx, ART.tile.dirt, i, tx2 + i * 20, ty2 + 4);
  ctx.fillStyle = '#777';
  ctx.fillText('Abrir ' + (DEBUG_MODE ? 'sin ?debug' : 'con ?debug') + ' para el juego normal', 4, CONFIG.VIEW_H * 2 - 8);
}
