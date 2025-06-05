import { useState, useEffect, useCallback, useRef } from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tetris" },
    { name: "description", content: "A classic block game. Fit the blocks in the grid and clear rows!" },
  ];
}

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

// Type definitions
interface Cell {
  filled: boolean;
  color: string;
  clearing?: boolean;
}

interface Piece {
  type: string;
  shape: number[][];
  color: string;
}

interface Position {
  x: number;
  y: number;
}

// Tetris pieces
const PIECES = {
  I: { shape: [[1,1,1,1]], color: 'bg-cyan-400' },
  O: { shape: [[1,1],[1,1]], color: 'bg-yellow-400' },
  T: { shape: [[0,1,0],[1,1,1]], color: 'bg-purple-400' },
  S: { shape: [[0,1,1],[1,1,0]], color: 'bg-green-400' },
  Z: { shape: [[1,1,0],[0,1,1]], color: 'bg-red-400' },
  J: { shape: [[1,0,0],[1,1,1]], color: 'bg-blue-400' },
  L: { shape: [[0,0,1],[1,1,1]], color: 'bg-orange-400' }
};

const PIECE_TYPES = Object.keys(PIECES);

export default function Tetris() {
  if(isMobile()){
    return (
      <div className="flex flex-col items-center pt-16 px-2 sm:px-0">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video tetris-background flex flex-col items-center justify-center rounded-2xl p-2 sm:p-4 text-white relative overflow-x-hidden">
            <h1 className="text-2xl font-bold mb-4 text-center">Tetris</h1>
            <div className="text-lg font-semibold text-center">
              Game not yet supported on mobile devices.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(window.innerHeight > window.innerWidth);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [clearedLines, setClearedLines] = useState<number[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const [pieceRotating, setPieceRotating] = useState(false);
  const [scorePopup, setScorePopup] = useState<{show: boolean, points: number, type: string}>({
    show: false,
    points: 0,
    type: ''
  });

  // Game state
  const [grid, setGrid] = useState<Cell[][]>(() => 
    Array(20).fill(null).map(() => Array(10).fill({ filled: false, color: '' }))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 0, y: 0 });
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const dropTimeRef = useRef(1000);

  // Generate random piece
  const generatePiece = useCallback((): Piece => {
    const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    const pieceData = PIECES[type as keyof typeof PIECES];
    return { type, ...pieceData };
  }, []);

  // Check collision
  const checkCollision = useCallback((piece: Piece, position: Position, testGrid: Cell[][] = grid): boolean => {
    if (!piece) return false;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = position.x + x;
          const newY = position.y + y;
          
          if (newX < 0 || newX >= 10 || newY >= 20) return true;
          if (newY >= 0 && testGrid[newY][newX].filled) return true;
        }
      }
    }
    return false;
  }, [grid]);

  // Rotate piece
  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  // Place piece on grid
  const placePiece = useCallback((piece: Piece, position: Position): Cell[][] => {
    const newGrid = grid.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const gridY = position.y + y;
          const gridX = position.x + x;
          if (gridY >= 0 && gridY < 20 && gridX >= 0 && gridX < 10) {
            newGrid[gridY][gridX] = { filled: true, color: piece.color };
          }
        }
      }
    }
    return newGrid;
  }, [grid]);

  // Show score popup
  const showScorePopup = useCallback((points: number, type: string) => {
    setScorePopup({ show: true, points, type });
    setTimeout(() => setScorePopup({ show: false, points: 0, type: '' }), 1000);
  }, []);

  // Clear completed lines with animation
  const clearLines = useCallback((testGrid: Cell[][]): { grid: Cell[][], linesCleared: number } => {
    const linesToClear: number[] = [];
    
    for (let y = 0; y < 20; y++) {
      if (testGrid[y].every(cell => cell.filled)) {
        linesToClear.push(y);
      }
    }
    
    if (linesToClear.length > 0) {
      // Mark lines for clearing animation
      setClearedLines(linesToClear);
      setIsClearing(true);
      
      // Show score popup based on lines cleared
      const points = linesToClear.length * 100 * level;
      const type = linesToClear.length === 4 ? 'TETRIS!' : 
                   linesToClear.length === 3 ? 'TRIPLE!' :
                   linesToClear.length === 2 ? 'DOUBLE!' : 'SINGLE!';
      showScorePopup(points, type);
      
      // Clear animation after delay
      setTimeout(() => {
        const newGrid: Cell[][] = [];
        
        for (let y = 0; y < 20; y++) {
          if (!linesToClear.includes(y)) {
            newGrid.push([...testGrid[y]]);
          }
        }
        
        // Add empty lines at top
        while (newGrid.length < 20) {
          newGrid.unshift(Array(10).fill({ filled: false, color: '' }));
        }
        
        setGrid(newGrid);
        setClearedLines([]);
        setIsClearing(false);
      }, 500);
      
      return { grid: testGrid, linesCleared: linesToClear.length };
    }
    
    return { grid: testGrid, linesCleared: 0 };
  }, [level, showScorePopup]);

  // Spawn new piece
  const spawnPiece = useCallback(() => {
    const piece = nextPiece || generatePiece();
    const startPosition: Position = { x: Math.floor((10 - piece.shape[0].length) / 2), y: 0 };
    
    if (checkCollision(piece, startPosition)) {
      setGameOver(true);
      return;
    }
    
    setCurrentPiece(piece);
    setCurrentPosition(startPosition);
    setNextPiece(generatePiece());
  }, [nextPiece, generatePiece, checkCollision]);

  // Move piece
  const movePiece = useCallback((dx: number, dy: number): boolean => {
    if (!currentPiece || gameOver || paused || isClearing) return false;
    
    const newPosition: Position = { x: currentPosition.x + dx, y: currentPosition.y + dy };
    
    if (!checkCollision(currentPiece, newPosition)) {
      setCurrentPosition(newPosition);
      return true;
    }
    return false;
  }, [currentPiece, currentPosition, checkCollision, gameOver, paused, isClearing]);

  // Drop piece
  const dropPiece = useCallback(() => {
    if (!movePiece(0, 1)) {
      // Piece can't move down, place it
      if (currentPiece && !isClearing) {
        const newGrid = placePiece(currentPiece, currentPosition);
        const { grid: clearedGrid, linesCleared } = clearLines(newGrid);
        
        if (linesCleared === 0) {
          setGrid(clearedGrid);
          showScorePopup(10, 'DROP');
        }
        
        setLines(prev => prev + linesCleared);
        setScore(prev => prev + (linesCleared * 100 * level) + 10);
        
        if (!isClearing) {
          spawnPiece();
        }
      }
    }
  }, [movePiece, placePiece, currentPiece, currentPosition, clearLines, level, spawnPiece, isClearing, showScorePopup]);

  // Rotate current piece
  const rotateCurrent = useCallback(() => {
    if (!currentPiece || gameOver || paused || isClearing) return;
    
    const rotated = rotatePiece(currentPiece);
    if (!checkCollision(rotated, currentPosition)) {
      setPieceRotating(true);
      setCurrentPiece(rotated);
      setTimeout(() => setPieceRotating(false), 150);
    }
  }, [currentPiece, currentPosition, rotatePiece, checkCollision, gameOver, paused, isClearing]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || paused || isClearing) return;
    
    let testPosition = { ...currentPosition };
    let dropDistance = 0;
    
    while (!checkCollision(currentPiece, { ...testPosition, y: testPosition.y + 1 })) {
      testPosition.y++;
      dropDistance++;
    }
    
    setCurrentPosition(testPosition);
    showScorePopup(dropDistance * 2, 'HARD DROP');
    
    // Immediately place the piece after moving to bottom
    setTimeout(() => {
      const newGrid = placePiece(currentPiece, testPosition);
      const { grid: clearedGrid, linesCleared } = clearLines(newGrid);
      
      if (linesCleared === 0) {
        setGrid(clearedGrid);
      }
      
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + (linesCleared * 100 * level) + 10 + (dropDistance * 2));
      
      if (!isClearing) {
        spawnPiece();
      }
    }, 100);
  }, [currentPiece, currentPosition, checkCollision, placePiece, clearLines, level, spawnPiece, gameOver, paused, isClearing, showScorePopup]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameStarted && !gameOver) {
        setGameStarted(true);
        return;
      }
      
      if (gameOver) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
          rotateCurrent();
          break;
        case ' ':
          event.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          setPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, movePiece, dropPiece, rotateCurrent, hardDrop]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || paused || isClearing) return;
    
    dropTimeRef.current = Math.max(100, 1000 - (level - 1) * 100);
    
    gameLoopRef.current = setInterval(() => {
      dropPiece();
    }, dropTimeRef.current);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, paused, level, dropPiece, isClearing]);

  // Update level based on lines
  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      showScorePopup(0, `LEVEL ${newLevel}!`);
    }
  }, [lines, level, showScorePopup]);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  // Initialize game
  useEffect(() => {
    if (gameStarted && !currentPiece && !gameOver) {
      setNextPiece(generatePiece());
      spawnPiece();
    }
  }, [gameStarted, currentPiece, gameOver, generatePiece, spawnPiece]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileLayout(window.innerHeight > (window.innerWidth - 128));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset game
  const resetGame = () => {
    setGameOver(false);
    setGameStarted(false);
    setPaused(false);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGrid(Array(20).fill(null).map(() => Array(10).fill({ filled: false, color: '' })));
    setCurrentPiece(null);
    setNextPiece(null);
    setCurrentPosition({ x: 0, y: 0 });
    setClearedLines([]);
    setIsClearing(false);
    setPieceRotating(false);
    setScorePopup({ show: false, points: 0, type: '' });
  };

  // Render grid with current piece
  const renderGrid = () => {
    const displayGrid = grid.map(row => row.map(cell => ({ ...cell })));
    
    // Add current piece to display grid
    if (currentPiece && !gameOver) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const gridY = currentPosition.y + y;
            const gridX = currentPosition.x + x;
            if (gridY >= 0 && gridY < 20 && gridX >= 0 && gridX < 10) {
              displayGrid[gridY][gridX] = { filled: true, color: currentPiece.color };
            }
          }
        }
      }
    }
    
    return displayGrid.flat().map((cell, index) => {
      const row = Math.floor(index / 10);
      const isClearing = clearedLines.includes(row);
      
      return (
        <div
          key={index}
          className={`
            border border-slate-700 transition-all duration-300
            ${cell.filled ? cell.color : 'bg-blue-950'}
            ${isClearing ? 'animate-pulse bg-white' : ''}
            ${pieceRotating && cell.filled && currentPiece ? 'animate-spin' : ''}
          `}
          style={{ 
            width: "100%", 
            height: "100%",
            transform: isClearing ? 'scale(1.1)' : 'scale(1)',
            animation: isClearing ? 'flash 0.5s ease-in-out' : undefined
          }}
        />
      );
    });
  };

  // Render next piece
  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    const maxSize = 4;
    const grid = Array(maxSize).fill(null).map(() => Array(maxSize).fill(false));
    
    const offsetY = Math.floor((maxSize - nextPiece.shape.length) / 2);
    const offsetX = Math.floor((maxSize - nextPiece.shape[0].length) / 2);
    
    for (let y = 0; y < nextPiece.shape.length; y++) {
      for (let x = 0; x < nextPiece.shape[y].length; x++) {
        if (nextPiece.shape[y][x]) {
          grid[offsetY + y][offsetX + x] = true;
        }
      }
    }
    
    return grid.flat().map((filled, index) => (
      <div
        key={index}
        className={`
          border border-slate-600 transition-all duration-300 hover:scale-105
          ${filled ? nextPiece.color : 'bg-slate-800'}
        `}
        style={{ width: "100%", height: "100%" }}
      />
    ));
  };

  return (
    <div className="flex flex-col items-center px-2 sm:px-0 bg-gray-900">
      
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 sm:p-5 text-center text-white animate-pulse">Tetris</h1>
        <div className={`w-full sm:w-4/6 aspect-[5/7] ${isMobileLayout ? "" : "sm:aspect-video "}tetris-background flex flex-col items-center justify-center rounded-2xl p-2 sm:p-4 text-white relative overflow-x-auto`}>
          
          {/* Score Popup */}
          {scorePopup.show && (
            <div 
              className="absolute top-1/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
              style={{ animation: 'scorePopup 1s ease-out forwards' }}
            >
              <div className="bg-yellow-400 opacity-40 text-black px-4 py-2 rounded-lg font-bold text-xl shadow-lg">
                {scorePopup.type}
                {scorePopup.points > 0 && (
                  <div className="text-sm">+{scorePopup.points}</div>
                )}
              </div>
            </div>
          )}
          
          {!gameStarted && !gameOver && (
            <div onClick={() => setGameStarted(true)} className="cursor-pointer">
              <div className="absolute inset-0 bg-black opacity-50 rounded-2xl"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full animate-pulse">
                <p className="text-lg sm:text-xl font-semibold mb-4">Play Tetris in your browser!</p>
                <p className="text-sm sm:text-base">Use the arrow keys to move and rotate the blocks.</p>
                <p className="text-sm sm:text-base">Press 'Space' to drop the block quickly.</p>
                <p className="text-sm sm:text-base">Press 'P' to pause the game.</p>
                <p className="text-xs sm:text-sm mt-4 opacity-75 animate-bounce">Click here or press any key to start!</p>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black opacity-75 rounded-2xl flex items-center justify-center z-20">
              <div className="text-center animate-pulse">
                <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                <p className="text-lg mb-2">Score: {score}</p>
                <p className="text-lg mb-4">Lines: {lines}</p>
                <button 
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}

          {paused && gameStarted && !gameOver && (
            <div className="absolute inset-0 bg-black opacity-50 rounded-2xl flex items-center justify-center z-20">
              <div className="text-center animate-pulse">
                <h2 className="text-2xl font-bold mb-4">Paused</h2>
                <p className="text-sm">Press 'P' to resume</p>
              </div>
            </div>
          )}

          {gameStarted && (
            <div className="relative w-full h-full flex flex-row items-start justify-center">
              {/* Left Scoreboard */}
              <div className="flex justify-end" style={{ width: "100%", maxWidth: 250, maxHeight: "100%" }}>
                <div className="bg-blue-950 p-2 rounded-l-md w-28 sm:w-36 flex flex-col justify-start transition-all duration-300 hover:bg-blue-900">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm">Score:</span>
                    <span className="text-xs sm:text-sm font-mono">{score}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm">High:</span>
                    <span className="text-xs sm:text-sm font-mono text-yellow-400">{highScore}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm">Lines:</span>
                    <span className="text-xs sm:text-sm font-mono">{lines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm">Level:</span>
                    <span className="text-xs sm:text-sm font-mono text-green-400">{level}</span>
                  </div>
                </div>
              </div>

              {/* Game Grid */}
              <div
                className="grid gap-0.5 p-2 relative touch-none rounded-bl-md aspect-[1/2] transition-all duration-300"
                style={{
                  gridTemplateRows: `repeat(20, 1fr)`,
                  gridTemplateColumns: `repeat(10, 1fr)`,
                  width: "100%",
                  maxHeight: "100%",
                  maxWidth: 250,
                  background: "#30317d",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  animation: isClearing ? 'pulse 0.5s ease-in-out' : undefined
                }}
              >
                {renderGrid()}
              </div>

              {/* Right Side UI */}
              <div className="flex flex-col relative aspect-[1/2]" style={{ width: "100%", maxWidth: 250, maxHeight: "100%" }}>
                {/* Next Block */}
                <div className="bg-blue-950 p-2 rounded-r-sm mb-2 aspect-square w-24 transition-all duration-300 hover:bg-blue-900">
                  <p className="text-xs mb-1 text-center">Next:</p>
                  <div 
                    className="grid gap-0.5 mx-auto"
                    style={{
                      gridTemplateRows: 'repeat(4, 1fr)',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      width: '60px',
                      height: '60px'
                    }}
                  >
                    {renderNextPiece()}
                  </div>
                </div>

                {/* Controls */}
                <div className="bg-blue-950 p-2 rounded-r-sm gap-2 flex flex-col items-center absolute bottom-0 transition-all duration-300 hover:bg-blue-900">
                  <button 
                    onClick={() => setPaused(!paused)}
                    className="text-lg hover:scale-110 transition-transform duration-200 active:scale-95"
                  >
                    {paused ? '▶️' : '⏸️'}
                  </button>
                  <button 
                    onClick={resetGame}
                    className="text-lg hover:scale-110 transition-transform duration-200 active:scale-95"
                  >
                    🔄
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}