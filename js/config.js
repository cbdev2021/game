const CONFIG = {
  VIEW_W: 320,
  VIEW_H: 224,
  TILE: 16,
  GRAVITY: 1400,
  MAX_FALL: 300,
  JUMP_CUT: 2600,
  PLAYER: {
    W: 14,
    H: 26,
    ACCEL: 2600,
    FRICTION: 1800,
  },
};

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
