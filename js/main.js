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
  completeTime: 0,
};

function startLevel() {
  game.state = 'play';
  game.level = new Level1();
  game.player = new Player(CHARACTERS[game.selected], game.level.spawnX, game.level.spawnY);
  game.camera = new Camera();
  game.completeTime = 0;
}

function update(dt) {
  if (game.state === 'menu') {
    if (input.pressed('left')) game.selected = (game.selected + CHARACTERS.length - 1) % CHARACTERS.length;
    if (input.pressed('right')) game.selected = (game.selected + 1) % CHARACTERS.length;
    if (input.pressed('jump') || input.pressed('attack')) startLevel();
  } else if (game.state === 'play') {
    game.player.update(dt, input, game.level);
    game.camera.follow(game.player, CONFIG.VIEW_W, CONFIG.VIEW_H, game.level);
    if (game.player.x >= game.level.goalX) {
      game.state = 'complete';
      game.completeTime = 0;
    }
    if (game.player.y > game.level.pixelHeight + 80) {
      game.player.respawn(game.level);
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
