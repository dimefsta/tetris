import { useReducer, Dispatch } from 'react';
import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from '../types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  droppingShape: BlockShape;
};

export type Action =
  | { type: 'start'; block: Block }
  | { type: 'drop' }
  | { type: 'hardDrop'; targetRow: number }
  | { type: 'commit'; newBoard: BoardShape; nextBlock: Block }
  | { type: 'move'; isPressingLeft?: boolean; isPressingRight?: boolean }
  | { type: 'rotate'; clockwise?: boolean }
  | { type: 'setPiece'; block: Block };

export function useTetrisBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(boardReducer, {
    board: getEmptyBoard(),
    droppingRow: 0,
    droppingColumn: 3,
    droppingBlock: Block.I,
    droppingShape: SHAPES.I.shape,
  });

  return [boardState, dispatchBoardState];
}

export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array.from({ length: height }, () =>
    Array(BOARD_WIDTH).fill(EmptyCell.Empty)
  );
}

// 7-Bag Randomizer
export function createBag(): Block[] {
  const pieces = [
    Block.I,
    Block.J,
    Block.L,
    Block.O,
    Block.S,
    Block.T,
    Block.Z,
  ];
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}

export function getRandomBlock(): Block {
  const blockValues = Object.values(Block);
  return blockValues[Math.floor(Math.random() * blockValues.length)] as Block;
}

export function hasCollisions(
  board: BoardShape,
  currentShape: BlockShape,
  row: number,
  column: number
): boolean {
  for (let r = 0; r < currentShape.length; r++) {
    for (let c = 0; c < currentShape[r].length; c++) {
      if (currentShape[r][c]) {
        const boardRow = row + r;
        const boardCol = column + c;

        // Check horizontal bounds (walls)
        if (boardCol < 0 || boardCol >= BOARD_WIDTH) {
          return true;
        }

        // Check bottom bound (floor)
        if (boardRow >= BOARD_HEIGHT) {
          return true;
        }

        // Check locked board blocks (only if within board height)
        if (boardRow >= 0) {
          if (board[boardRow][boardCol] !== EmptyCell.Empty) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

export function rotateBlock(shape: BlockShape): BlockShape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: BlockShape = Array(cols)
    .fill(null)
    .map(() => Array(rows).fill(false));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

export function rotateBlockCCW(shape: BlockShape): BlockShape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: BlockShape = Array(cols)
    .fill(null)
    .map(() => Array(rows).fill(false));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[cols - 1 - c][r] = shape[r][c];
    }
  }
  return rotated;
}

const KICK_OFFSETS = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [-2, 0],
  [2, 0],
  [0, -1],
  [-1, -1],
  [1, -1],
];

export function getWallKickedRotation(
  board: BoardShape,
  shape: BlockShape,
  row: number,
  column: number,
  clockwise = true
): { shape: BlockShape; row: number; column: number } | null {
  const rotated = clockwise ? rotateBlock(shape) : rotateBlockCCW(shape);

  for (const [dx, dy] of KICK_OFFSETS) {
    if (!hasCollisions(board, rotated, row + dy, column + dx)) {
      return {
        shape: rotated,
        row: row + dy,
        column: column + dx,
      };
    }
  }
  return null;
}

export function getGhostRow(
  board: BoardShape,
  shape: BlockShape,
  row: number,
  column: number
): number {
  let ghost = row;
  while (!hasCollisions(board, shape, ghost + 1, column)) {
    ghost++;
  }
  return ghost;
}

function boardReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case 'start': {
      const col = action.block === Block.O ? 4 : 3;
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: col,
        droppingBlock: action.block,
        droppingShape: SHAPES[action.block].shape,
      };
    }
    case 'drop':
      return {
        ...state,
        droppingRow: state.droppingRow + 1,
      };
    case 'hardDrop':
      return {
        ...state,
        droppingRow: action.targetRow,
      };
    case 'commit': {
      const col = action.nextBlock === Block.O ? 4 : 3;
      return {
        board: action.newBoard,
        droppingRow: 0,
        droppingColumn: col,
        droppingBlock: action.nextBlock,
        droppingShape: SHAPES[action.nextBlock].shape,
      };
    }
    case 'setPiece': {
      const col = action.block === Block.O ? 4 : 3;
      return {
        ...state,
        droppingRow: 0,
        droppingColumn: col,
        droppingBlock: action.block,
        droppingShape: SHAPES[action.block].shape,
      };
    }
    case 'move': {
      let offset = 0;
      if (action.isPressingLeft) offset -= 1;
      if (action.isPressingRight) offset += 1;
      if (offset === 0) return state;

      if (
        !hasCollisions(
          state.board,
          state.droppingShape,
          state.droppingRow,
          state.droppingColumn + offset
        )
      ) {
        return {
          ...state,
          droppingColumn: state.droppingColumn + offset,
        };
      }
      return state;
    }
    case 'rotate': {
      const result = getWallKickedRotation(
        state.board,
        state.droppingShape,
        state.droppingRow,
        state.droppingColumn,
        action.clockwise ?? true
      );
      if (result) {
        return {
          ...state,
          droppingShape: result.shape,
          droppingRow: result.row,
          droppingColumn: result.column,
        };
      }
      return state;
    }
    default:
      return state;
  }
}
