const SPRITE_W = 16;

function norm(rows) {
  return rows.map((r) => (r + '................').slice(0, SPRITE_W));
}

const HEAD_BLOCK = [
  '.....HHHHHH.....',
  '....HHHHHHHH....',
  '...HHHHHHHHHH...',
  '..HHSSSSSSSSHH..',
  '...HSWWSSWWSH...',
  '...HSSSSSSSSH...',
  '...HSSSSSSSSH...',
  '....HHSSSSHH....',
];

const TORSO_STAND = [
  '..CCCCCCCCCCCC..',
  '.CCCCCCCCCCCCCC.',
  '.cCCCCCCCCCCCCc.',
  '.cCCCCCCCCCCCCc.',
  '.cCCCCCCCCCCCCc.',
  '..MMMMMMMMMMMM..',
  '..CCCCCCCCCCCC..',
  '..CCCCCCCCCCCC..',
];

const LEGS_STAND = [
  '..CCC......CCC..',
  '..CCC......CCC..',
  '..CCC......CCC..',
  '..CCC......CCC..',
  '..SSS......SSS..',
  '..SSS......SSS..',
  '..KKK......KKK..',
  '..KKK......KKK..',
  '..KKK......KKK..',
  '.KKK........KKK.',
  '.KKK........KKK.',
  '................',
];

const IDLE_A = HEAD_BLOCK.concat(TORSO_STAND, LEGS_STAND);

const TORSO_IDLE_B = [
  '..CCCCCCCCCCCC..',
  '.CCCCCCCCCCCCCC.',
  '.cCCCCCCCCCCCCc.',
  '.cCCCCCCCCCCCCc.',
  '.cCCCCCCCCCCCCc.',
  '..MMMMMMMMMMMM..',
  '..CCCCCCCCCCCC..',
  '..CCCCCCCCCCCC..',
];

const LEGS_IDLE_B = [
  '..CCC......CCC..',
  '..CCC......CCC..',
  '..CCC......CCC..',
  '..CCC......CCC..',
  '..SSS......SSS..',
  '..SSS......SSS..',
  '..KKK......KKK..',
  '..KKK......KKK..',
  '..KKK......KKK..',
  '..KKK......KKK..',
  '..KKK......KKK..',
  '................',
];

const IDLE_B = HEAD_BLOCK.concat(TORSO_IDLE_B, LEGS_IDLE_B);

const RUN_A = HEAD_BLOCK.concat(TORSO_STAND, [
  '..CCC.....CCC....',
  '..CC.......CC....',
  '..CC.......CC....',
  '..CC.......CC....',
  '..SS.......SS....',
  '..SS.....KKK.....',
  '..KKK....KKK.....',
  '..KKK...KKK......',
  '.KKK....KKK......',
  '.KKK.............',
  '................',
  '................',
]);

const RUN_B = HEAD_BLOCK.concat(TORSO_STAND, [
  '..CCC.....CCC....',
  '..CCC.....CCC....',
  '..CC.......CC....',
  '..CC.......CC....',
  '..SS.......SS....',
  '..SS.......SS....',
  '..KKK.....KKK....',
  '..KKK.....KKK....',
  '.KKKK....KKKK....',
  '.KKKK....KKKK....',
  '................',
  '................',
]);

const RUN_C = HEAD_BLOCK.concat(TORSO_STAND, [
  '....CCC.....CCC..',
  '....CC.......CC..',
  '....CC.......CC..',
  '....CC.......CC..',
  '....SS.......SS..',
  '.....KKK.....SS..',
  '.....KKK....KKK..',
  '......KKK...KKK..',
  '......KKK....KKK.',
  '.............KKK.',
  '................',
  '................',
]);

const JUMP_UP = HEAD_BLOCK.concat(TORSO_STAND, [
  '..CCC....CCC.....',
  '..CC......CC.....',
  '..CC......CC.....',
  '..SS......SS.....',
  '..KKK.....KKK....',
  '..KKK.....KKK....',
  '..KKK.....KKK....',
  '..KKK.....KKK....',
  '................',
  '................',
  '................',
  '................',
]);

const JUMP_DOWN = HEAD_BLOCK.concat(TORSO_STAND, [
  '..CCC.....CCC....',
  '..CCC.....CCC....',
  '..CCC.....CCC....',
  '..CCC.....CCC....',
  '..SSS.....SSS....',
  '..SSS.....SSS....',
  '..KKK.....KKK....',
  '..KKK.....KKK....',
  '..KKK.....KKK....',
  '.KKK......KKK....',
  '................',
  '................',
]);

const LAND = HEAD_BLOCK.concat(TORSO_STAND, [
  '..CCC......CCC...',
  '..CC........CC...',
  '..CC........CC...',
  '..CC........CC...',
  '..SS........SS...',
  '..SS........SS...',
  '..KKK......KKK...',
  '..KKK......KKK...',
  '..KKK......KKK...',
  '..KKK......KKK...',
  '................',
  '................',
]);

const TORSO_ATTACK = [
  '..CCCCCCCCCCCC..',
  '.CCCCCCCCCCCCCC.',
  '.cCCCCCCCCCCCCc.',
  '.cCCCCCCCCCCCCc.',
  '.cCCCCCCCCCCCCc.',
  '..MMMMMMMMMMMM..',
  '..CCCCCCCCCCCC..',
  '..CCCCCCCCCCCC..',
];

const LEGS_ATTACK = [
  '..CCC.....CCC....',
  '..CCC.....CCC....',
  '..CCC.....CCC....',
  '..CCC.....CCC....',
  '..SSS.....SSS....',
  '..SSS.....SSS....',
  '..KKK.....KKK....',
  '..KKK.....KKK....',
  '..KKK.....KKK....',
  '.KKK......KKK....',
  '................',
  '................',
];

const ATTACK_A = HEAD_BLOCK.concat(TORSO_ATTACK, LEGS_ATTACK);

const ATTACK_B = HEAD_BLOCK.concat([
  '..CCCCCCCCCCCC...',
  '.CCCCCCCCCCCCCCC.',
  '.cCCCCCCCCCCCCcc.',
  '.cCCCCCCCCCCCCcc.',
  '.cCCCCCCCCCCCCcc.',
  '..MMMMMMMMMMMM...',
  '..CCCCCCCCCCCC...',
  '..CCCCCCCCCCCC...',
], [
  '..CCC.....CCC....',
  '..CCC.....CCC....',
  '..CCC.....CCC....',
  '..CCC.....CCC....',
  '..SSS.....SSS....',
  '..SSS.....SSS....',
  '..KKK.....KKK....',
  '..KKK.....KKK....',
  '..KKK.....KKK....',
  '.KKK......KKK....',
  '................',
  '................',
]);

const ATTACK_C = HEAD_BLOCK.concat(TORSO_IDLE_B, LEGS_STAND);

const CROUCH = HEAD_BLOCK.concat([
  '..CCCCCCCCCCCC..',
  '.CCCCCCCCCCCCCC.',
  '.cCCCCCCCCCCCCc.',
  '.cCCCCCCCCCCCCc.',
  '..MMMMMMMMMMMM..',
  '..CCCCCCCCCCCC..',
], [
  '.CCCC....CCCC....',
  '.CC......CC......',
  '.SS......SS......',
  '.KKK.....KKK.....',
  '.KKK.....KKK.....',
  '.KKKK...KKKK.....',
]);

const CROUCH_WALK_A = HEAD_BLOCK.concat([
  '..CCCCCCCCCCCC..',
  '.CCCCCCCCCCCCCC.',
  '.cCCCCCCCCCCCCc.',
  '.cCCCCCCCCCCCCc.',
  '..MMMMMMMMMMMM..',
  '..CCCCCCCCCCCC..',
], [
  '.CCCC....CCCC....',
  '.CC......CC......',
  '.SS......SS......',
  '.KKK.....KKKK....',
  '.KKK.....KKKK....',
  '.KKKK.....KKK....',
]);

const CROUCH_WALK_B = HEAD_BLOCK.concat([
  '..CCCCCCCCCCCC..',
  '.CCCCCCCCCCCCCC.',
  '.cCCCCCCCCCCCCc.',
  '.cCCCCCCCCCCCCc.',
  '..MMMMMMMMMMMM..',
  '..CCCCCCCCCCCC..',
], [
  '.CCCC....CCCC....',
  '.CC......CC......',
  '.SS......SS......',
  '.KKKK....KKK.....',
  '.KKKK....KKK.....',
  '.KKK.....KKKK....',
]);

const POSES = {
  idle: [norm(IDLE_A), norm(IDLE_B)],
  run: [norm(RUN_A), norm(RUN_B), norm(RUN_C)],
  jump: [norm(JUMP_UP), norm(JUMP_DOWN)],
  attack: [norm(ATTACK_A), norm(ATTACK_B), norm(ATTACK_C)],
  land: [norm(LAND)],
  crouch: [norm(CROUCH)],
  crouchWalk: [norm(CROUCH_WALK_A), norm(CROUCH_WALK_B)],
};

const WARRIOR_HEAD = [
  '.....AAAAAA.....',
  '....AAAAAAAA....',
  '...AAAAAAAAAA...',
  '...AAAMMMMMAA...',
  '...AAAMMMAAMA...',
  '...AAAAAAAAAA...',
  '....AAAAAAAA....',
  '.....AAAAAA.....',
];

const WIZARD_HEAD = [
  '......AA.......',
  '......AA.......',
  '......AA.......',
  '......AA.......',
  '...AAAAAAAAA...',
  '..AAAAAAAAAAA..',
  '..AAAAAAAAAAA..',
  '..AAAAAAAAAAA..',
];

const NINJA_HEAD = [
  '.....AAAAAA.....',
  '....AAAAAAAA....',
  '...AAAAAAAAAA...',
  '...AASSSSSSAA...',
  '...ASWSSSSWSA...',
  '...ASSSSSSSSA...',
  '....AAAAAAAA....',
  '.....AAAAAA.....',
];

const PRIESTESS_HEAD = [
  '.....AAAAAA.....',
  '....AAAAAAAA....',
  '...AAAAAAAAAA...',
  '...AASSSSSSAA...',
  '...ASWWSSWWSA...',
  '...ASSSSSSSSA...',
  '....AAAAAAAA....',
  '.....AAAAAA.....',
];

const HEADS = {
  warrior: norm(WARRIOR_HEAD),
  wizard: norm(WIZARD_HEAD),
  ninja: norm(NINJA_HEAD),
  priestess: norm(PRIESTESS_HEAD),
};

const ACCENTS = {
  warrior: norm([
    '................',
    '................',
    '.MM..........MM.',
    '.MM..........MM.',
    '................',
    '................',
    '................',
    '................',
  ]),
  wizard: norm([
    '................',
    '................',
    '...AAA..........',
    '..AAA.AAA.......',
    '...AAA.AAA......',
    '....AAA.AAA.....',
    '.....AAA.AAA....',
    '................',
  ]),
  ninja: norm([
    '................',
    '................',
    '.....MMMM.......',
    '....MM..MM......',
    '....MM...MM.....',
    '....MM....MM....',
    '................',
    '................',
  ]),
  priestess: norm([
    '................',
    '................',
    '..AAA......AAA..',
    '..AAA......AAA..',
    '................',
    '................',
    '................',
    '................',
  ]),
};

const CLASS_SPRITES = {
  warrior: {
    palette: {
      S: '#e8b07a', s: '#c8935f', C: '#c0392b', c: '#8a2216',
      M: '#c8c8d0', H: '#6b3a1f', h: '#4a2812', W: '#ffffff', A: '#d0d0d8',
    },
    head: HEADS.warrior,
    accent: ACCENTS.warrior,
  },
  wizard: {
    palette: {
      S: '#e8b07a', s: '#c8935f', C: '#2e5cc8', c: '#1c3a80',
      M: '#c8c8d0', H: '#c8c8d0', h: '#a8a8b0', W: '#ffffff', A: '#d9a63a',
    },
    head: HEADS.wizard,
    accent: ACCENTS.wizard,
  },
  ninja: {
    palette: {
      S: '#e8b07a', s: '#c8935f', C: '#6a2fc0', c: '#461b8a',
      M: '#c8c8d0', H: '#1a1a1a', h: '#000000', W: '#ffffff', A: '#c0392b',
    },
    head: HEADS.ninja,
    accent: ACCENTS.ninja,
  },
  priestess: {
    palette: {
      S: '#e8b07a', s: '#c8935f', C: '#d9a63a', c: '#a87b22',
      M: '#c8c8d0', H: '#f0d8a0', h: '#d0b878', W: '#ffffff', A: '#f5f5f0',
    },
    head: HEADS.priestess,
    accent: ACCENTS.priestess,
  },
};

const WEAPONS = {
  warrior: {
    dx: 4,
    dy: 8,
    grid: [
      '...........MMM.',
      '...........MMM.',
      '..........MM...',
      '.........MM....',
      '........MM.....',
      '.......MM......',
      '......MM.......',
      '.....MM........',
      '....MM.........',
      '...MM..........',
      '..MM...........',
      '.MM............',
    ],
  },
  wizard: {
    dx: 5,
    dy: 2,
    grid: [
      '......AAA......',
      '......A.A......',
      '......AAA......',
      '.......A.......',
      '.......A.......',
      '.......A.......',
      '.......M.......',
      '.......M.......',
      '.......M.......',
      '.......M.......',
      '.......M.......',
      '.......M.......',
      '.......M.......',
      '.......M.......',
      '.......M.......',
    ],
  },
  ninja: {
    dx: 4,
    dy: 6,
    grid: [
      '............MM',
      '............MM',
      '...........MM.',
      '..........MM..',
      '.........MM...',
      '........MM....',
      '.......MM.....',
      '......MM......',
      '.....MM.......',
      '....MM........',
      '...MM.........',
      '..MM..........',
      'MM............',
    ],
  },
  priestess: {
    dx: 5,
    dy: 8,
    grid: [
      '....AAAAAA....',
      '...AASSSSAA...',
      '....AAAAAA....',
      '......MM......',
      '......MM......',
      '......MM......',
      '......MM......',
      '......MM......',
    ],
  },
};

const ENEMY_A = [
  '......KKKK......',
  '.....KSSSSK.....',
  '....KSSSSSSK....',
  '....KSSWWSSK....',
  '....KSSSSSSK....',
  '.....KKKKKK.....',
  '....KCCCCCCK....',
  '...KCCCCCCCCK...',
  '...KCCCCCCCCK...',
  '...KCCCCCCCCK...',
  '...KCCCCCCCCK...',
  '...KCCCCCCCCK...',
  '..KcCCCCCCCCcK..',
  '..KcCCCCCCCCcK..',
  '...KcCCCCCCcK...',
  '....KCCCCCCK....',
  '.....KKKKKK.....',
  '....KK....KK....',
];

const ENEMY_B = [
  '......KKKK......',
  '.....KSSSSK.....',
  '....KSSSSSSK....',
  '....KSSWWSSK....',
  '....KSSSSSSK....',
  '.....KKKKKK.....',
  '....KCCCCCCK....',
  '...KCCCCCCCCK...',
  '...KCCCCCCCCK...',
  '...KCCCCCCCCK...',
  '...KCCCCCCCCK...',
  '...KCCCCCCCCK...',
  '..KcCCCCCCCCcK..',
  '..KcCCCCCCCCcK..',
  '...KcCCCCCCcK...',
  '....KCCCCCCK....',
  '.....KKK.KK.....',
  '.....KK..KK.....',
];

const ENEMY_SPRITES = [norm(ENEMY_A), norm(ENEMY_B)];

const ENEMY_PALETTE = {
  K: '#0a0a0a',
  S: '#e8b07a',
  C: '#b23b4a',
  c: '#7a2230',
  W: '#ffe066',
};
