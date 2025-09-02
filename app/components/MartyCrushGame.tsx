import React, { useEffect, useState } from "react";

const BOARD_SIZE = 8;
const CANDY_TYPES = [
  { color: "bg-pink-400", emoji: "🍬" },
  { color: "bg-yellow-300", emoji: "🍋" },
  { color: "bg-blue-400", emoji: "🫐" },
  { color: "bg-green-400", emoji: "🍏" },
  { color: "bg-purple-400", emoji: "🍇" },
  { color: "bg-orange-400", emoji: "🍊" },
];

const MARTY_CANDY = {
  color: "bg-gradient-to-br from-yellow-400 to-red-500",
  emoji: "⭐", // Placeholder
  isSpecial: true
};

type Candy = {
  type: number; // index in CANDY_TYPES, or -2 for Marty
  id: number;
};

function getRandomCandy(): Candy {
  // 5% chance for special Marty candy
  if (Math.random() < 0.05) {
    return {
      type: -2, // Special identifier for Marty candy
      id: Math.random(),
    };
  }
  
  return {
    type: Math.floor(Math.random() * CANDY_TYPES.length),
    id: Math.random(),
  };
}

function createBoard(): Candy[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, getRandomCandy)
  );
}

function cloneBoard(board: Candy[][]): Candy[][] {
  return board.map((row) => row.map((candy) => ({ ...candy })));
}

function checkMatches(board: Candy[][]): { toClear: Set<string>; score: number } {
  const toClear = new Set<string>();
  let score = 0;

  // Check for Marty candies that should trigger powerup
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x].type === -2) {
        // Check if Marty is part of a match
        let isInMatch = false;
        
        // Check horizontal matches involving Marty
        let leftCount = 0, rightCount = 0;
        for (let i = x - 1; i >= 0 && board[y][i].type === board[y][x + 1]?.type && board[y][x + 1]?.type >= 0; i--) leftCount++;
        for (let i = x + 1; i < BOARD_SIZE && board[y][i].type === board[y][x - 1]?.type && board[y][x - 1]?.type >= 0; i++) rightCount++;
        
        // Check vertical matches involving Marty
        let upCount = 0, downCount = 0;
        for (let i = y - 1; i >= 0 && board[i][x].type === board[y + 1]?.[x]?.type && board[y + 1]?.[x]?.type >= 0; i--) upCount++;
        for (let i = y + 1; i < BOARD_SIZE && board[i][x].type === board[y - 1]?.[x]?.type && board[y - 1]?.[x]?.type >= 0; i++) downCount++;
        
        // If Marty connects matching candies, trigger powerup
        if ((leftCount > 0 && rightCount > 0) || (upCount > 0 && downCount > 0)) {
          isInMatch = true;
        }
        
        // Also check if Marty is swapped with a matching candy
        if (isInMatch) {
          // Clear entire row and column
          for (let i = 0; i < BOARD_SIZE; i++) {
            toClear.add(`${y},${i}`); // Row
            toClear.add(`${i},${x}`); // Column
          }
          score += 20; // Bonus points for powerup
        }
      }
    }
  }

  // Regular horizontal matches
  for (let y = 0; y < BOARD_SIZE; y++) {
    let streak = 1;
    let currentType = board[y][0].type;
    
    for (let x = 1; x < BOARD_SIZE; x++) {
      if (board[y][x].type === currentType && currentType >= 0) {
        streak++;
      } else {
        if (streak >= 3) {
          for (let k = 0; k < streak; k++) toClear.add(`${y},${x - 1 - k}`);
          score += streak;
        }
        streak = 1;
        currentType = board[y][x].type;
      }
    }
    if (streak >= 3) {
      for (let k = 0; k < streak; k++) toClear.add(`${y},${BOARD_SIZE - 1 - k}`);
      score += streak;
    }
  }

  // Regular vertical matches
  for (let x = 0; x < BOARD_SIZE; x++) {
    let streak = 1;
    let currentType = board[0][x].type;
    
    for (let y = 1; y < BOARD_SIZE; y++) {
      if (board[y][x].type === currentType && currentType >= 0) {
        streak++;
      } else {
        if (streak >= 3) {
          for (let k = 0; k < streak; k++) toClear.add(`${y - 1 - k},${x}`);
          score += streak;
        }
        streak = 1;
        currentType = board[y][x].type;
      }
    }
    if (streak >= 3) {
      for (let k = 0; k < streak; k++) toClear.add(`${BOARD_SIZE - 1 - k},${x}`);
      score += streak;
    }
  }

  return { toClear, score };
}

function dropCandies(board: Candy[][]): Candy[][] {
  const newBoard = cloneBoard(board);
  for (let x = 0; x < BOARD_SIZE; x++) {
    let pointer = BOARD_SIZE - 1;
    for (let y = BOARD_SIZE - 1; y >= 0; y--) {
      if (newBoard[y][x].type !== -1) {
        newBoard[pointer][x] = { ...newBoard[y][x] };
        pointer--;
      }
    }
    for (let y = pointer; y >= 0; y--) {
      newBoard[y][x] = getRandomCandy();
    }
  }
  return newBoard;
}

export default function MartyCrushGame() {
  const [board, setBoard] = useState<Candy[][]>(createBoard());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(null);
  const [animating, setAnimating] = useState(false);
  const [clearing, setClearing] = useState<Set<string>>(new Set());

  // Handle matches and drops
  useEffect(() => {
  let timeout: NodeJS.Timeout;
  const { toClear, score: gained } = checkMatches(board);
  if (toClear.size > 0) {
    setAnimating(true);
    setClearing(toClear); // start animation

    timeout = setTimeout(() => {
      // Actually clear candies after animation
      const newBoard = cloneBoard(board);
      toClear.forEach((key) => {
        const [y, x] = key.split(",").map(Number);
        newBoard[y][x].type = -1;
      });
      setScore((s) => s + gained);
      setBoard(dropCandies(newBoard));
      setClearing(new Set()); // reset
      setAnimating(false);
      }, 500); // match animation duration
    }
    return () => clearTimeout(timeout);
  }, [board]);


  function isAdjacent(a: { x: number; y: number }, b: { x: number; y: number }) {
    return (
      (Math.abs(a.x - b.x) === 1 && a.y === b.y) ||
      (Math.abs(a.y - b.y) === 1 && a.x === b.x)
    );
  }

  function handleCellClick(x: number, y: number) {
    if (animating) return;
    if (!selected) {
      setSelected({ x, y });
      return;
    }
    if (selected.x === x && selected.y === y) {
      setSelected(null);
      return;
    }
    if (isAdjacent(selected, { x, y })) {
      // Swap and check for match
      const newBoard = cloneBoard(board);
      [newBoard[selected.y][selected.x], newBoard[y][x]] = [
        newBoard[y][x],
        newBoard[selected.y][selected.x],
      ];
      
      // Special handling for Marty candy swaps
      const selectedCandy = newBoard[selected.y][selected.x];
      const targetCandy = newBoard[y][x];
      
      const { toClear } = checkMatches(newBoard);
      if (toClear.size > 0) {
        setBoard(newBoard);
      } else {
        // No match, swap back after short delay
        setAnimating(true);
        setBoard(newBoard);
        setTimeout(() => {
          const reverted = cloneBoard(newBoard);
          [reverted[selected.y][selected.x], reverted[y][x]] = [
            reverted[y][x],
            reverted[selected.y][selected.x],
          ];
          setBoard(reverted);
          setAnimating(false);
        }, 300);
      }
      setSelected(null);
    } else {
      setSelected({ x, y });
    }
  }

  function handleRestart() {
    setBoard(createBoard());
    setScore(0);
    setSelected(null);
  }

  function getCandyDisplay(candy: Candy) {
    if (candy.type === -2) {
      // Marty special candy
      return {
        color: MARTY_CANDY.color,
        content: (
          <div className="relative w-full h-full flex items-center justify-center">
            <img src=".\assets\martyCrush\marty.svg" alt="Marty" className="w-full h-full object-contain" />
          </div>
        )
      };
    } else if (candy.type >= 0) {
      return {
        color: CANDY_TYPES[candy.type].color,
        content: CANDY_TYPES[candy.type].emoji
      };
    }
    return { color: "", content: "" };
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex justify-between items-center w-full mb-2" style={{ maxWidth: 400 }}>
        <button
          className="text-xs bg-slate-500 px-2 py-1 rounded hover:bg-slate-400"
          onClick={handleRestart}
        >
          Restart
        </button>
        <div className="font-bold">Score: {score}</div>
      </div>
      
      <div className="text-xs text-center mb-2 text-slate-600" style={{ maxWidth: 400 }}>
        ⭐ Special Marty candy clears entire rows and columns when matched! (5% spawn rate)
      </div>
      
      <div
        className="grid gap-1 p-3"
        style={{
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          width: "100%",
          maxWidth: 400,
          aspectRatio: "1/1",
          background: "#334155",
          borderRadius: 12,
          boxShadow: "0 2px 8px #0002",
        }}
      >
        {board.flat().map((candy, idx) => {
          const x = idx % BOARD_SIZE;
          const y = Math.floor(idx / BOARD_SIZE);
          const isSelected = selected && selected.x === x && selected.y === y;
          const candyDisplay = getCandyDisplay(candy);
          const isClearing = clearing.has(`${y},${x}`);

          return (
            <button
              key={candy.id}
              className={`flex items-center justify-center border border-slate-700 font-bold text-2xl sm:text-3xl rounded-lg
                transition-all duration-500
                ${candy.type === -1 ? "opacity-0" : ""}
                ${isClearing ? "scale-0 opacity-0" : "scale-100 opacity-100"}
                ${isSelected ? "ring-4 ring-blue-400" : ""}
                ${candy.type === -2 ? "ring-2 ring-yellow-400 shadow-lg" : ""}
                ${candyDisplay.color}
              `}
              style={{
                width: "100%",
                height: "100%",
                userSelect: "none",
                aspectRatio: "1/1",
                pointerEvents: animating ? "none" : "auto",
              }}
              onClick={() => handleCellClick(x, y)}
              disabled={animating}
            >
              {candyDisplay.content}
            </button>
          );
        })}
      </div>
    </div>
  );
}