import React, { useEffect, useRef, useState } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Cell = { x: number; y: number };

const SPEED_MAP: Record<string, number> = {
  slow: 220,
  medium: 120,
  fast: 60,
};

function getRandomCell(size: number, exclude: Cell[]): Cell {
  let cell: Cell;
  do {
    cell = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
    };
  } while (exclude.some((c) => c.x === cell.x && c.y === cell.y));
  return cell;
}

function getNextHead(head: Cell, dir: Direction): Cell {
  switch (dir) {
    case "UP":
      return { x: head.x, y: head.y - 1 };
    case "DOWN":
      return { x: head.x, y: head.y + 1 };
    case "LEFT":
      return { x: head.x - 1, y: head.y };
    case "RIGHT":
      return { x: head.x + 1, y: head.y };
  }
}

function isOpposite(a: Direction, b: Direction) {
  return (
    (a === "UP" && b === "DOWN") ||
    (a === "DOWN" && b === "UP") ||
    (a === "LEFT" && b === "RIGHT") ||
    (a === "RIGHT" && b === "LEFT")
  );
}

interface SnakeGameProps {
  size: number;
  speed: string;
  fruit: string;
  onBack: () => void;
}

const BOARD_COLORS = ["bg-slate-700", "bg-slate-600"];

export default function SnakeGame({ size, speed, fruit, onBack }: SnakeGameProps) {
  const [snake, setSnake] = useState<Cell[]>([
    { x: Math.floor(size / 2), y: Math.floor(size / 2) },
  ]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [nextDirection, setNextDirection] = useState<Direction>("RIGHT");
  const [fruitCell, setFruitCell] = useState<Cell>(() =>
    getRandomCell(size, [{ x: Math.floor(size / 2), y: Math.floor(size / 2) }])
  );
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // --- Swipe controls state ---
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // --- Swipe controls effect ---
  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length === 1) {
        touchStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return; // Ignore small swipes

      let newDir: Direction | null = null;
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0) newDir = "RIGHT";
        else newDir = "LEFT";
      } else {
        // Vertical swipe
        if (dy > 0) newDir = "DOWN";
        else newDir = "UP";
      }
      if (newDir && !isOpposite(direction, newDir)) {
        setNextDirection(newDir);
      }
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [direction]);

  // Reset game if size or fruit changes
  useEffect(() => {
    setSnake([{ x: Math.floor(size / 2), y: Math.floor(size / 2) }]);
    setDirection("RIGHT");
    setNextDirection("RIGHT");
    setFruitCell(getRandomCell(size, [{ x: Math.floor(size / 2), y: Math.floor(size / 2) }]));
    setGameOver(false);
    setScore(0);
  }, [size, fruit]);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      let newDir: Direction | null = null;
      if (e.key === "ArrowUp" || e.key === "w") newDir = "UP";
      if (e.key === "ArrowDown" || e.key === "s") newDir = "DOWN";
      if (e.key === "ArrowLeft" || e.key === "a") newDir = "LEFT";
      if (e.key === "ArrowRight" || e.key === "d") newDir = "RIGHT";
      if (newDir && !isOpposite(direction, newDir)) {
        setNextDirection(newDir);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setDirection((dir) => nextDirection);
      setSnake((prev) => {
        const head = getNextHead(prev[0], nextDirection);
        // Check wall collision
        if (
          head.x < 0 ||
          head.x >= size ||
          head.y < 0 ||
          head.y >= size ||
          prev.some((c) => c.x === head.x && c.y === head.y)
        ) {
          setGameOver(true);
          return prev;
        }
        let newSnake;
        if (head.x === fruitCell.x && head.y === fruitCell.y) {
          newSnake = [head, ...prev];
          setScore((s) => s + 1);
          setFruitCell(getRandomCell(size, [head, ...prev]));
        } else {
          newSnake = [head, ...prev.slice(0, -1)];
        }
        return newSnake;
      });
    }, SPEED_MAP[speed]);
    return () => clearInterval(interval);
  }, [nextDirection, fruitCell, gameOver, size, speed]);

  // Board rendering
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex justify-between w-full mb-2">
        <button
          className="text-xs bg-slate-500 px-2 py-1 rounded hover:bg-slate-400"
          onClick={onBack}
        >
          ← Back
        </button>
        <div className="font-bold">Score: {score}</div>
        <div className="font-bold">{gameOver && "Game Over"}</div>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${size}, 1fr)`,
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: "100%",
          aspectRatio: "1/1",
          maxWidth: 400,
          background: "#334155",
          borderRadius: 12,
          boxShadow: "0 2px 8px #0002",
        }}
      >
        {Array.from({ length: size * size }).map((_, idx) => {
          const x = idx % size;
          const y = Math.floor(idx / size);
          const isSnake = snake.some((c) => c.x === x && c.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFruit = fruitCell.x === x && fruitCell.y === y;
          return (
            <div
              key={idx}
              className={`border border-slate-700 flex items-center justify-center transition-all duration-75
                ${isHead ? "bg-green-400" : isSnake ? "bg-green-600" : BOARD_COLORS[(x + y) % 2]}
              `}
              style={{
                width: "100%",
                height: "100%",
                userSelect: "none",
                borderRadius: isHead ? 6 : 2,
                fontSize: "1.1rem",
                lineHeight: 1,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {isFruit ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "70%",
                    height: "70%",
                    fontSize: "0.9em",
                    margin: "auto",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {fruit}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      {gameOver && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600"
          onClick={() => {
            setSnake([{ x: Math.floor(size / 2), y: Math.floor(size / 2) }]);
            setDirection("RIGHT");
            setNextDirection("RIGHT");
            setFruitCell(getRandomCell(size, [{ x: Math.floor(size / 2), y: Math.floor(size / 2) }]));
            setGameOver(false);
            setScore(0);
          }}
        >
          Restart
        </button>
      )}
    </div>
  );
}