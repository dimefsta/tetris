export enum Block {
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z',
}

export enum EmptyCell {
  Empty = 'Empty',
}

export type CellOptions = Block | EmptyCell;

export type BoardShape = CellOptions[][];

export type BlockShape = boolean[][];

type ShapesObj = {
  [key in Block]: {
    shape: BlockShape;
  };
};

// Standard Tetris Guideline SRS (Super Rotation System) initial matrices
export const SHAPES: ShapesObj = {
  I: {
    shape: [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ],
  },
  J: {
    shape: [
      [true, false, false],
      [true, true, true],
      [false, false, false],
    ],
  },
  L: {
    shape: [
      [false, false, true],
      [true, true, true],
      [false, false, false],
    ],
  },
  O: {
    shape: [
      [true, true],
      [true, true],
    ],
  },
  S: {
    shape: [
      [false, true, true],
      [true, true, false],
      [false, false, false],
    ],
  },
  T: {
    shape: [
      [false, true, false],
      [true, true, true],
      [false, false, false],
    ],
  },
  Z: {
    shape: [
      [true, true, false],
      [false, true, true],
      [false, false, false],
    ],
  },
};

export interface BlockStyle {
  primary: string;
  shadow: string;
  glow: string;
  gradient: string;
}

export const BLOCK_STYLES: Record<Block, BlockStyle> = {
  I: {
    primary: '#00e5ff',
    shadow: '#008b99',
    glow: 'rgba(0, 229, 255, 0.65)',
    gradient: 'linear-gradient(135deg, #80f2ff 0%, #00e5ff 50%, #009ab0 100%)',
  },
  J: {
    primary: '#2979ff',
    shadow: '#1548a8',
    glow: 'rgba(41, 121, 255, 0.65)',
    gradient: 'linear-gradient(135deg, #75a7ff 0%, #2979ff 50%, #104bbb 100%)',
  },
  L: {
    primary: '#ff9100',
    shadow: '#a65e00',
    glow: 'rgba(255, 145, 0, 0.65)',
    gradient: 'linear-gradient(135deg, #ffb74d 0%, #ff9100 50%, #c46800 100%)',
  },
  O: {
    primary: '#ffd600',
    shadow: '#a68b00',
    glow: 'rgba(255, 214, 0, 0.65)',
    gradient: 'linear-gradient(135deg, #ffea00 0%, #ffd600 50%, #bca100 100%)',
  },
  S: {
    primary: '#00e676',
    shadow: '#008a47',
    glow: 'rgba(0, 230, 118, 0.65)',
    gradient: 'linear-gradient(135deg, #69f0ae 0%, #00e676 50%, #009e4d 100%)',
  },
  T: {
    primary: '#d500f9',
    shadow: '#7d0093',
    glow: 'rgba(213, 0, 249, 0.65)',
    gradient: 'linear-gradient(135deg, #ea80fc 0%, #d500f9 50%, #8e00a8 100%)',
  },
  Z: {
    primary: '#ff1744',
    shadow: '#a10022',
    glow: 'rgba(255, 23, 68, 0.65)',
    gradient: 'linear-gradient(135deg, #ff616f 0%, #ff1744 50%, #ba000d 100%)',
  },
};
