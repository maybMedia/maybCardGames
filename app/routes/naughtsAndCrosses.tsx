import React, { useState } from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Naughts and Crosses" },
    { name: "description", content: "Play with a friend or against the computer, try to get three in a row!" },
  ];
}

type Player = "X" | "O";
type Cell = Player | null;

function calculateWinner(board: Cell[]): Player | "draw" | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(cell => cell)) return "draw";
  return null;
}

// Add a helper to get the winning line indices
function getWinningLine(board: Cell[]): number[] | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

function getCellColor(cell: Cell) {
  if (cell === "X") return "text-blue-500";
  if (cell === "O") return "text-yellow-500";
  return "text-gray-400";
}

export default function NaughtsAndCrosses() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState<"pvp" | "cpu" | null>(null);
  const [status, setStatus] = useState<string>("");
  const [animating, setAnimating] = useState(false); // NEW: animation state
  const [boardKey, setBoardKey] = useState(0); // NEW: for remounting board

  const winner = calculateWinner(board);
  const winningLine = getWinningLine(board);

  React.useEffect(() => {
    if (winner === "X" || winner === "O") setStatus(`${winner} wins!`);
    else if (winner === "draw") setStatus("It's a draw!");
    else setStatus(`${xIsNext ? "X" : "O"}'s turn`);
  }, [winner, xIsNext]);

  // Simple CPU: pick first empty cell
  React.useEffect(() => {
    if (mode === "cpu" && !winner && !xIsNext) {
      const empty = board.map((cell, i) => cell ? null : i).filter(i => i !== null) as number[];
      if (empty.length > 0) {
        const move = empty[Math.floor(Math.random() * empty.length)];
        setTimeout(() => {
          setBoard(b => b.map((cell, i) => i === move ? "O" : cell));
          setXIsNext(true);
        }, 500);
      }
    }
  }, [board, mode, winner, xIsNext]);

  function handleClick(i: number) {
    if (winner || board[i] || (mode === "cpu" && !xIsNext) || animating) return;
    setBoard(b => b.map((cell, idx) => idx === i ? (xIsNext ? "X" : "O") : cell));
    setXIsNext(x => !x);
  }

  function startNewGame() {
    setAnimating(true);
    setTimeout(() => {
      setBoard(Array(9).fill(null));
      setXIsNext(true);
      setStatus("");
      setBoardKey(k => k + 1); // force remount for animation
      setAnimating(false);
    }, 350); // match animation duration
  }

  function handleModeSelect(selected: "pvp" | "cpu") {
    setMode(selected);
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setStatus("");
    setBoardKey(k => k + 1);
    setAnimating(false);
  }

  // Always show turn info, even before first move
  const turnInfo = mode
    ? status
    : `Choose a mode to start!`;

  // Helper to highlight winning cells
  function isWinningCell(idx: number) {
    return winningLine ? winningLine.includes(idx) : false;
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-16 px-2 sm:px-0">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 sm:p-5 text-center">Naughts and Crosses</h1>
        <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video bg-slate-600 flex flex-col items-center justify-center rounded-2xl p-2 sm:p-4 text-white relative overflow-x-auto">
          <div className="flex flex-col items-center mt-2 mb-4">
            <div className="text-lg font-bold mb-2 min-h-[1.5em]">{turnInfo}</div>
          </div>
          {!mode ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition duration-300"
                onClick={() => handleModeSelect("pvp")}
              >
                Play vs Friend
              </button>
              <button
                className="bg-blue-300 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-blue-400 transition duration-300"
                onClick={() => handleModeSelect("cpu")}
              >
                Play vs Computer
              </button>
            </div>
          ) : (
            <>
              <div
                key={boardKey}
                className={`flex flex-col items-center relative justify-center transition-all duration-300
                  ${animating ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
                style={{ width: 328, height: 328 }}
              >
                <div className="grid grid-cols-3 gap-2">
                  {board.map((cell, i) => (
                    <button
                      key={i}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-md flex items-center justify-center text-4xl sm:text-5xl font-bold border-2 border-gray-300 hover:border-blue-400 transition-all duration-150 ${getCellColor(cell)} ${winner && board[i] === null ? "opacity-50 cursor-not-allowed" : ""} ${isWinningCell(i) ? "bg-blue-200" : "bg-white"}`}
                      onClick={() => handleClick(i)}
                      disabled={!!board[i] || !!winner || (mode === "cpu" && !xIsNext) || animating}
                      style={{ transition: "background 0.2s, border 0.2s" }}
                      aria-label={`Cell ${i + 1}`}
                    >
                      {cell ? cell : ""}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition duration-300"
                  onClick={startNewGame}
                  disabled={animating}
                >
                  New Game
                </button>
                <button
                  className="bg-slate-400 text-white px-4 py-2 rounded hover:bg-slate-500 transition duration-300"
                  onClick={() => setMode(null)}
                  disabled={animating}
                >
                  Change Mode
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}