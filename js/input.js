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

  endFrame() {
    this.pressedActions.clear();
  }
}
