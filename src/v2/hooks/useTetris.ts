import { useCallback, useEffect, useRef, useState } from 'react';
import { Block, BoardShape, EmptyCell, SHAPES } from '../types';
import { useInterval } from './useInterval';
import {
  useTetrisBoard,
  hasCollisions,
  getGhostRow,
  createBag,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  getEmptyBoard,
} from './useTetrisBoard';
import { sound } from '../utils/audio';

const BASE_SPEED = 800;
const SOFT_DROP_SPEED = 45;
const LOCK_DELAY = 500; // ms to slide/rotate before locking at bottom

export function useTetris() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tetris_high_score');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [lines, setLines] = useState(0);
  const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);
  const [heldBlock, setHeldBlock] = useState<Block | null>(null);
  const [canHold, setCanHold] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [clearMessage, setClearMessage] = useState<{ text: string; id: number } | null>(null);
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());

  const [isSoftDropping, setIsSoftDropping] = useState(false);

  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  // Internal bag queue ref to ensure endless supply of 7-bag pieces
  const bagRef = useRef<Block[]>([]);
  const lockTimerRef = useRef<number | null>(null);
  const isCommittingRef = useRef(false);

  const level = Math.floor(lines / 10) + 1;
  const normalSpeed = Math.max(90, BASE_SPEED - (level - 1) * 70);

  const getNextPieceFromQueue = useCallback((): Block => {
    let currentQueue = [...upcomingBlocks];
    if (currentQueue.length < 5) {
      if (bagRef.current.length < 7) {
        bagRef.current = [...bagRef.current, ...createBag()];
      }
      const needed = 7 - currentQueue.length;
      currentQueue = [...currentQueue, ...bagRef.current.splice(0, needed)];
    }
    const next = currentQueue.shift() as Block;
    setUpcomingBlocks(currentQueue);
    return next;
  }, [upcomingBlocks]);

  // Sync high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('tetris_high_score', score.toString());
      } catch {
        // ignore
      }
    }
  }, [score, highScore]);

  // Calculate ghost row
  const ghostRow = isPlaying
    ? getGhostRow(board, droppingShape, droppingRow, droppingColumn)
    : droppingRow;

  // Toggle sound
  const toggleSound = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  // Lock and commit position
  const lockPiece = useCallback(() => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
    isCommittingRef.current = false;

    // Check if piece can still drop (in case user shifted it)
    if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
      return;
    }

    // 1. Bake dropping piece into locked board
    const newBoard = structuredClone(board) as BoardShape;
    for (let r = 0; r < droppingShape.length; r++) {
      for (let c = 0; c < droppingShape[r].length; c++) {
        if (droppingShape[r][c]) {
          const boardR = droppingRow + r;
          const boardC = droppingColumn + c;
          if (boardR >= 0 && boardR < BOARD_HEIGHT && boardC >= 0 && boardC < BOARD_WIDTH) {
            newBoard[boardR][boardC] = droppingBlock;
          }
        }
      }
    }

    // 2. Identify filled rows
    const filled: number[] = [];
    for (let r = 0; r < BOARD_HEIGHT; r++) {
      if (newBoard[r].every((cell) => cell !== EmptyCell.Empty)) {
        filled.push(r);
      }
    }

    const nextBlock = getNextPieceFromQueue();
    const spawnCol = nextBlock === Block.O ? 4 : 3;

    if (filled.length > 0) {
      // Trigger line-clear animation
      setClearingRows(filled);
      sound.playLineClear(filled.length);

      const pointsTable = [0, 100, 300, 500, 800];
      const earned = (pointsTable[filled.length] || 800) * level;
      const labels = ['', 'SINGLE', 'DOUBLE', 'TRIPLE', '★ TETRIS! ★'];
      setClearMessage({
        text: `${labels[filled.length]} +${earned}`,
        id: Date.now(),
      });

      // Pause briefly for clear animation
      setTimeout(() => {
        // Remove cleared rows and insert empty rows at top
        const remainingBoard = newBoard.filter((_, idx) => !filled.includes(idx));
        const emptyRows = getEmptyBoard(filled.length);
        const resolvedBoard = [...emptyRows, ...remainingBoard];

        setLines((prev) => {
          const updatedLines = prev + filled.length;
          const newLvl = Math.floor(updatedLines / 10) + 1;
          if (newLvl > level) {
            sound.playLevelUp();
          }
          return updatedLines;
        });
        setScore((prev) => prev + earned);
        setClearingRows([]);

        // Check game over
        if (hasCollisions(resolvedBoard, SHAPES[nextBlock].shape, 0, spawnCol)) {
          setIsPlaying(false);
          setIsGameOver(true);
          sound.playGameOver();
        } else {
          dispatchBoardState({
            type: 'commit',
            newBoard: resolvedBoard,
            nextBlock,
          });
          setCanHold(true);
        }
      }, 260);
    } else {
      sound.playDrop();
      // Check game over
      if (hasCollisions(newBoard, SHAPES[nextBlock].shape, 0, spawnCol)) {
        setIsPlaying(false);
        setIsGameOver(true);
        sound.playGameOver();
      } else {
        dispatchBoardState({
          type: 'commit',
          newBoard,
          nextBlock,
        });
        setCanHold(true);
      }
    }
  }, [
    board,
    dispatchBoardState,
    droppingBlock,
    droppingColumn,
    droppingRow,
    droppingShape,
    getNextPieceFromQueue,
    level,
  ]);

  // Start new game
  const startGame = useCallback(() => {
    const bag1 = createBag();
    const bag2 = createBag();
    bagRef.current = [...bag2];

    const firstPiece = bag1[0];
    const preview = bag1.slice(1);

    setScore(0);
    setLines(0);
    setHeldBlock(null);
    setCanHold(true);
    setClearingRows([]);
    setClearMessage(null);
    setUpcomingBlocks(preview);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setIsSoftDropping(false);
    isCommittingRef.current = false;

    dispatchBoardState({ type: 'start', block: firstPiece });
    sound.playRotate();
  }, [dispatchBoardState]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (!isPlaying || isGameOver) return;
    setIsPaused((prev) => !prev);
  }, [isGameOver, isPlaying]);

  // Move left
  const moveLeft = useCallback(() => {
    if (!isPlaying || isPaused || clearingRows.length > 0) return;
    dispatchBoardState({ type: 'move', isPressingLeft: true });
    sound.playMove();
  }, [clearingRows.length, dispatchBoardState, isPaused, isPlaying]);

  // Move right
  const moveRight = useCallback(() => {
    if (!isPlaying || isPaused || clearingRows.length > 0) return;
    dispatchBoardState({ type: 'move', isPressingRight: true });
    sound.playMove();
  }, [clearingRows.length, dispatchBoardState, isPaused, isPlaying]);

  // Rotate piece
  const rotatePiece = useCallback(
    (clockwise = true) => {
      if (!isPlaying || isPaused || clearingRows.length > 0) return;
      dispatchBoardState({ type: 'rotate', clockwise });
      sound.playRotate();
    },
    [clearingRows.length, dispatchBoardState, isPaused, isPlaying]
  );

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!isPlaying || isPaused || clearingRows.length > 0) return;
    const target = getGhostRow(board, droppingShape, droppingRow, droppingColumn);
    const dropDistance = target - droppingRow;
    setScore((prev) => prev + dropDistance * 2);

    dispatchBoardState({ type: 'hardDrop', targetRow: target });
    sound.playHardDrop();

    // Immediately lock
    setTimeout(() => {
      lockPiece();
    }, 20);
  }, [
    board,
    clearingRows.length,
    dispatchBoardState,
    droppingColumn,
    droppingRow,
    droppingShape,
    isPaused,
    isPlaying,
    lockPiece,
  ]);

  // Hold piece mechanic
  const holdPiece = useCallback(() => {
    if (!isPlaying || isPaused || !canHold || clearingRows.length > 0) return;

    sound.playHold();
    setCanHold(false);

    if (heldBlock === null) {
      setHeldBlock(droppingBlock);
      const next = getNextPieceFromQueue();
      dispatchBoardState({ type: 'setPiece', block: next });
    } else {
      const prevHeld = heldBlock;
      setHeldBlock(droppingBlock);
      dispatchBoardState({ type: 'setPiece', block: prevHeld });
    }
  }, [
    canHold,
    clearingRows.length,
    dispatchBoardState,
    droppingBlock,
    getNextPieceFromQueue,
    heldBlock,
    isPaused,
    isPlaying,
  ]);

  // Tick loop
  const gameTick = useCallback(() => {
    if (!isPlaying || isPaused || clearingRows.length > 0) return;

    const collidesBelow = hasCollisions(
      board,
      droppingShape,
      droppingRow + 1,
      droppingColumn
    );

    if (collidesBelow) {
      if (!isCommittingRef.current) {
        isCommittingRef.current = true;
        lockTimerRef.current = window.setTimeout(() => {
          lockPiece();
        }, LOCK_DELAY);
      }
    } else {
      if (isCommittingRef.current) {
        isCommittingRef.current = false;
        if (lockTimerRef.current) {
          clearTimeout(lockTimerRef.current);
          lockTimerRef.current = null;
        }
      }
      dispatchBoardState({ type: 'drop' });
      if (isSoftDropping) {
        setScore((prev) => prev + 1);
      }
    }
  }, [
    board,
    clearingRows.length,
    dispatchBoardState,
    droppingColumn,
    droppingRow,
    droppingShape,
    isPaused,
    isPlaying,
    isSoftDropping,
    lockPiece,
  ]);

  // Active tick speed
  const currentSpeed = isPlaying && !isPaused && clearingRows.length === 0
    ? isSoftDropping
      ? SOFT_DROP_SPEED
      : normalSpeed
    : null;

  useInterval(gameTick, currentSpeed);

  // Keyboard controls with smooth DAS (Delayed Auto Shift)
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    let dasTimer: number | null = null;
    let arrInterval: number | null = null;
    let currentDir: 'left' | 'right' | null = null;

    const startShift = (dir: 'left' | 'right') => {
      currentDir = dir;
      if (dir === 'left') moveLeft();
      else moveRight();

      if (dasTimer) clearTimeout(dasTimer);
      if (arrInterval) clearInterval(arrInterval);

      dasTimer = window.setTimeout(() => {
        arrInterval = window.setInterval(() => {
          if (dir === 'left') moveLeft();
          else moveRight();
        }, 45); // ARR (Auto Repeat Rate)
      }, 160); // DAS (Delayed Auto Shift)
    };

    const stopShift = (dir: 'left' | 'right') => {
      if (currentDir === dir) {
        if (dasTimer) clearTimeout(dasTimer);
        if (arrInterval) clearInterval(arrInterval);
        dasTimer = null;
        arrInterval = null;
        currentDir = null;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        togglePause();
        return;
      }

      if (e.repeat && e.key !== 'ArrowDown' && e.key !== 's' && e.key !== 'S') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          startShift('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          startShift('right');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setIsSoftDropping(true);
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'x':
        case 'X':
          rotatePiece(true);
          break;
        case 'z':
        case 'Z':
        case 'Control':
          rotatePiece(false);
          break;
        case ' ':
          hardDrop();
          break;
        case 'c':
        case 'C':
        case 'Shift':
          holdPiece();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          stopShift('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          stopShift('right');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setIsSoftDropping(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (dasTimer) clearTimeout(dasTimer);
      if (arrInterval) clearInterval(arrInterval);
    };
  }, [hardDrop, holdPiece, isPaused, isPlaying, moveLeft, moveRight, rotatePiece, togglePause]);

  return {
    board,
    droppingRow,
    droppingColumn,
    droppingBlock,
    droppingShape,
    ghostRow,
    upcomingBlocks,
    heldBlock,
    canHold,
    score,
    highScore,
    lines,
    level,
    isPlaying,
    isPaused,
    isGameOver,
    clearingRows,
    clearMessage,
    isMuted,
    startGame,
    togglePause,
    toggleSound,
    moveLeft,
    moveRight,
    rotatePiece,
    softDrop: () => setIsSoftDropping(true),
    stopSoftDrop: () => setIsSoftDropping(false),
    hardDrop,
    holdPiece,
  };
}
