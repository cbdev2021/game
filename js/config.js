const CONFIG = {
  VIEW_W: 320,
  VIEW_H: 224,
  TILE: 16,
  GRAVITY: 1400,
  MAX_FALL: 300,
  JUMP_CUT: 2600,
  LAND_TIME: 0.12,
  PLAYER: {
    W: 14,
    H: 26,
    CROUCH_H: 18,
    ACCEL: 2600,
    FRICTION: 1800,
    CROUCH_SPEED: 0.5,
  },
  ENEMY: {
    W: 14,
    H: 18,
  },
  ATTACK: {
    RANGE: 20,
    ANTICIPATION: 0.06,
    STRIKE: 0.09,
    RECOVERY: 0.08,
    COOLDOWN: 0.32,
  },
  JUICE: {
    HIT_STOP: 0.05,
    SHAKE_HIT: 0.15,
    SHAKE_HIT_MAG: 3,
    SHAKE_LAND: 0.1,
    SHAKE_LAND_MAG: 1.5,
  },
};

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
