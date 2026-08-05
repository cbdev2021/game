const WIDTH = 200;
const HEIGHT = 14;

const T = {
  EMPTY: '.',
  GROUND: '#',
  GRASS: 'T',
  PLATFORM: '=',
  GOAL: 'G',
};

const grid = [];
for (let y = 0; y < HEIGHT; y++) {
  grid.push(new Array(WIDTH).fill(T.EMPTY));
}

function rect(x, y, w, h, tile) {
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (y + j >= 0 && y + j < HEIGHT && x + i >= 0 && x + i < WIDTH) {
        grid[y + j][x + i] = tile;
      }
    }
  }
}

const groundSegments = [
  { x: 0, w: 44 },
  { x: 47, w: 46 },
  { x: 96, w: 50 },
  { x: 149, w: 51 },
];

for (const s of groundSegments) {
  rect(s.x, 11, s.w, 3, T.GROUND);
  rect(s.x, 11, s.w, 1, T.GRASS);
}

const platforms = [
  [48, 8, 3],
  [54, 5, 3],
  [58, 5, 14],
  [160, 8, 3],
  [166, 5, 3],
  [170, 5, 10],
];

for (const [x, y, w] of platforms) {
  rect(x, y, w, 1, T.PLATFORM);
}

rect(186, 6, 4, 5, T.GROUND);
rect(186, 6, 4, 1, T.GRASS);
rect(189, 6, 1, 3, T.GOAL);

class Level1 {
  constructor() {
    this.tiles = grid;
    this.width = WIDTH;
    this.height = HEIGHT;
    this.pixelWidth = WIDTH * CONFIG.TILE;
    this.pixelHeight = HEIGHT * CONFIG.TILE;
    this.solidSet = new Set([T.GROUND, T.GRASS, T.PLATFORM]);
    this.spawnX = CONFIG.TILE;
    this.spawnY = 11 * CONFIG.TILE - CONFIG.PLAYER.H;
    this.goalX = 185 * CONFIG.TILE;
  }

  isSolid(tx, ty) {
    if (tx < 0 || tx >= this.width || ty >= this.height) return true;
    if (ty < 0) return false;
    return this.solidSet.has(this.tiles[ty][tx]);
  }

  tileAt(tx, ty) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return T.EMPTY;
    return this.tiles[ty][tx];
  }
}
