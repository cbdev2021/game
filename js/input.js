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
