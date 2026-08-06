const KEYMAP = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  down: ['ArrowDown', 'KeyS'],
  jump: ['ArrowUp', 'KeyW', 'Space', 'KeyK'],
  attack: ['ControlLeft', 'ControlRight', 'KeyJ'],
};

const ACTION_BY_CODE = {};
for (const action in KEYMAP) {
  for (const code of KEYMAP[action]) {
    ACTION_BY_CODE[code] = action;
  }
}

class Input {
  constructor() {
    this.down = new Set();
    this.pressedActions = new Set();
    window.addEventListener('keydown', (e) => this.keyEvent(e, true));
    window.addEventListener('keyup', (e) => this.keyEvent(e, false));
    window.addEventListener('blur', () => {
      this.down.clear();
      this.pressedActions.clear();
    });
  }

  keyEvent(e, isDown) {
    const action = ACTION_BY_CODE[e.code];
    if (!action) return;
    e.preventDefault();
    if (isDown && !this.down.has(action)) {
      this.down.add(action);
      this.pressedActions.add(action);
    }
    if (!isDown) this.down.delete(action);
  }

  isDown(action) {
    return this.down.has(action);
  }

  pressed(action) {
    return this.pressedActions.has(action);
  }

  virtual(action, down) {
    if (down && !this.down.has(action)) {
      this.down.add(action);
      this.pressedActions.add(action);
    }
    if (!down) this.down.delete(action);
  }

  endFrame() {
    this.pressedActions.clear();
  }
}

function bindTouchControls(input) {
  const ui = document.getElementById('touch-ui');
  if (!ui) return;
  if (ui.addEventListener) {
    ui.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  const buttons = ui.querySelectorAll('.touch-btn');
  for (const btn of buttons) {
    const action = btn.dataset.action;
    if (!action) continue;
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      try { btn.setPointerCapture(e.pointerId); } catch (err) {}
      input.virtual(action, true);
    });
    btn.addEventListener('pointerup', (e) => {
      input.virtual(action, false);
    });
    btn.addEventListener('pointercancel', () => {
      input.virtual(action, false);
    });
  }
}

function bindDpad(input) {
  const pad = document.getElementById('dpad');
  if (!pad) return;
  let pid = null;
  let lastH = 0;
  let lastV = 0;

  function coords(e) {
    const rect = pad.getBoundingClientRect();
    return [e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2)];
  }

  function apply(dx, dy) {
    const dead = pad.offsetWidth * 0.12;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (adx < dead && ady < dead) return;
    const horiz = adx > ady;
    const h = horiz ? (dx < 0 ? -1 : 1) : 0;
    const v = horiz ? 0 : (dy < 0 ? -1 : 1);
    if (h !== lastH) {
      input.virtual('left', h === -1);
      input.virtual('right', h === 1);
    }
    if (v !== lastV) {
      input.virtual('jump', v === -1);
      input.virtual('down', v === 1);
    }
    lastH = h;
    lastV = v;
  }

  function release(e) {
    if (e.pointerId !== pid) return;
    pid = null;
    lastH = 0;
    lastV = 0;
    input.virtual('left', false);
    input.virtual('right', false);
    input.virtual('jump', false);
    input.virtual('down', false);
  }

  pad.addEventListener('pointerdown', (e) => {
    if (pid !== null) return;
    pid = e.pointerId;
    e.preventDefault();
    try { pad.setPointerCapture(pid); } catch (err) {}
    const [dx, dy] = coords(e);
    apply(dx, dy);
  });
  pad.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pid) return;
    const [dx, dy] = coords(e);
    apply(dx, dy);
  });
  pad.addEventListener('pointerup', release);
  pad.addEventListener('pointercancel', release);
}

function bindFullscreenButton() {
  const stage = document.getElementById('stage');
  const btn = document.getElementById('fullscreen-btn');
  if (!stage || !btn) return;
  const enterFn = stage.requestFullscreen || stage.webkitRequestFullscreen;
  const exitFn = document.exitFullscreen || document.webkitExitFullscreen;
  const isFullscreen = () => document.fullscreenElement || document.webkitFullscreenElement;
  if (!enterFn) {
    btn.style.display = 'none';
    return;
  }
  btn.addEventListener('click', () => {
    if (isFullscreen()) {
      if (exitFn) exitFn.call(document);
    } else if (enterFn) {
      enterFn.call(stage);
    }
  });
}
