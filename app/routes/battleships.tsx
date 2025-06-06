import React, { useState, useEffect, useCallback } from 'react';
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Battleships" },
    { name: "description", content: "A strategic guessing game where you sink your opponent's ships" },
    // { content: "user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0" }, // Uncomment if you want to disable zooming
  ];
}

// Define a type for a ship
type Ship = { name: string; size: number; count: number };

const GRID_SIZE = 10;
const SHIPS: Ship[] = [
  { name: 'Carrier', size: 5, count: 1 },
  { name: 'Battleship', size: 4, count: 1 },
  { name: 'Cruiser', size: 3, count: 1 },
  { name: 'Submarine', size: 3, count: 1 },
  { name: 'Destroyer', size: 2, count: 1 }
];

// Cell states
const EMPTY = 0;
const SHIP = 1;
const HIT = 2;
const MISS = 3;

export default function GameWindow() {
  const [gameMode, setGameMode] = useState('menu'); // 'menu', 'setup', 'game'
  const [playerMode, setPlayerMode] = useState('computer'); // 'computer' or 'local'
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [phase, setPhase] = useState('placement'); // 'placement', 'battle'
  
  // Game boards - [player1, player2]
  const [boards, setBoards] = useState([
    Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(EMPTY)),
    Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(EMPTY))
  ]);
  
  // Attack boards - what each player sees of opponent's board
  const [attackBoards, setAttackBoards] = useState([
    Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(EMPTY)),
    Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(EMPTY))
  ]);
  
  const [placingShip, setPlacingShip] = useState<Ship | null>(null);
  const [shipDirection, setShipDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [shipsToPlace, setShipsToPlace] = useState<Ship[]>([...SHIPS]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  // Add state to track hovered cell during placement
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);

  // Initialize new game
  const initializeGame = (mode: string) => {
    setPlayerMode(mode);
    setGameMode('setup');
    setCurrentPlayer(1);
    setPhase('placement');
    setBoards([
      Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(EMPTY)),
      Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(EMPTY))
    ]);
    setAttackBoards([
      Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(EMPTY)),
      Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(EMPTY))
    ]);
    setShipsToPlace([...SHIPS]);
    setPlacingShip(null);
    setGameOver(false);
    setWinner(null);
    setMessage(mode === 'computer' ? 'Place your ships!' : 'Player 1: Place your ships!');
  };

  // Check if ship placement is valid
  const isValidPlacement = (
    board: number[][],
    row: number,
    col: number,
    size: number,
    direction: string
  ): boolean => {
    for (let i = 0; i < size; i++) {
      const newRow = direction === 'horizontal' ? row : row + i;
      const newCol = direction === 'horizontal' ? col + i : col;
      
      if (newRow >= GRID_SIZE || newCol >= GRID_SIZE || newRow < 0 || newCol < 0) {
        return false;
      }
      
      if (board[newRow][newCol] !== EMPTY) {
        return false;
      }
      
      // Check adjacent cells for other ships
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const checkRow = newRow + dr;
          const checkCol = newCol + dc;
          if (checkRow >= 0 && checkRow < GRID_SIZE && checkCol >= 0 && checkCol < GRID_SIZE) {
            if (board[checkRow][checkCol] === SHIP) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  // Place ship on board
  const placeShip = (
    playerIndex: number,
    row: number,
    col: number,
    size: number,
    direction: string
  ) => {
    const newBoards = [...boards];
    for (let i = 0; i < size; i++) {
      const newRow = direction === 'horizontal' ? row : row + i;
      const newCol = direction === 'horizontal' ? col + i : col;
      newBoards[playerIndex][newRow][newCol] = SHIP;
    }
    setBoards(newBoards);
  };

  // Auto-place ships for computer
  const autoPlaceShips = (playerIndex: number) => {
    const newBoard = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(EMPTY));

    // Expand ships according to their count
    const shipsToPlace: Ship[] = [];
    for (const ship of SHIPS) {
      for (let i = 0; i < ship.count; i++) {
        shipsToPlace.push(ship);
      }
    }

    for (const ship of shipsToPlace) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 1000) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

        if (isValidPlacement(newBoard, row, col, ship.size, direction)) {
          for (let i = 0; i < ship.size; i++) {
            const newRow = direction === 'horizontal' ? row : row + i;
            const newCol = direction === 'horizontal' ? col + i : col;
            newBoard[newRow][newCol] = SHIP;
          }
          placed = true;
        }
        attempts++;
      }
    }

    const newBoards = [...boards];
    newBoards[playerIndex] = newBoard;
    setBoards(newBoards);
  };

  // Handle cell click during placement
  const handlePlacementClick = (row: number, col: number) => {
    if (!placingShip) return;

    const playerIndex = currentPlayer - 1;

    if (isValidPlacement(boards[playerIndex], row, col, placingShip.size, shipDirection)) {
      placeShip(playerIndex, row, col, placingShip.size, shipDirection);

      // Remove the placed ship from shipsToPlace by reference, not just the first
      const remainingShips = shipsToPlace.filter((ship) => ship !== placingShip);
      setShipsToPlace(remainingShips);
      setPlacingShip(null);

      if (remainingShips.length === 0) {
        if (playerMode === 'computer') {
          // Auto-place computer ships and start battle
          autoPlaceShips(1);
          setPhase('battle');
          setMessage('Battle begins! Click on the computer\'s grid to attack!');
          setGameMode('game');
        } else if (currentPlayer === 1) {
          // Switch to player 2
          setCurrentPlayer(2);
          setShipsToPlace([...SHIPS]);
          setMessage('Player 2: Place your ships!');
        } else {
          // Both players placed ships, start battle
          setPhase('battle');
          setCurrentPlayer(1);
          setMessage('Player 1\'s turn - Attack!');
          setGameMode('game');
        }
      }
    }
  };

  // Check if a ship is sunk at a given cell
  const isShipSunk = (
    board: number[][],
    row: number,
    col: number
  ): boolean => {
    // Check all directions from the hit cell to see if any part of the ship remains
    // Ships are always placed in straight lines, so check both horizontal and vertical
    // Find the full ship by expanding in both directions

    // Horizontal
    let c = col;
    while (c > 0 && board[row][c - 1] === HIT) c--;
    while (c < GRID_SIZE && board[row][c] === HIT) c++;
    // If we find a SHIP cell in the ship's span, it's not sunk
    for (let i = col; i >= 0 && board[row][i] === HIT; i--) {
      if (board[row][i] === SHIP) return false;
    }
    for (let i = col; i < GRID_SIZE && board[row][i] === HIT; i++) {
      if (board[row][i] === SHIP) return false;
    }
    // Check if there is any SHIP cell horizontally
    let left = col;
    while (left > 0 && (board[row][left - 1] === HIT || board[row][left - 1] === SHIP)) left--;
    let right = col;
    while (right < GRID_SIZE - 1 && (board[row][right + 1] === HIT || board[row][right + 1] === SHIP)) right++;
    for (let i = left; i <= right; i++) {
      if (board[row][i] === SHIP) return false;
    }

    // Vertical
    let r = row;
    while (r > 0 && board[r - 1][col] === HIT) r--;
    while (r < GRID_SIZE && board[r][col] === HIT) r++;
    for (let i = row; i >= 0 && board[i][col] === HIT; i--) {
      if (board[i][col] === SHIP) return false;
    }
    for (let i = row; i < GRID_SIZE && board[i][col] === HIT; i++) {
      if (board[i][col] === SHIP) return false;
    }
    let top = row;
    while (top > 0 && (board[top - 1][col] === HIT || board[top - 1][col] === SHIP)) top--;
    let bottom = row;
    while (bottom < GRID_SIZE - 1 && (board[bottom + 1][col] === HIT || board[bottom + 1][col] === SHIP)) bottom++;
    for (let i = top; i <= bottom; i++) {
      if (board[i][col] === SHIP) return false;
    }

    return true;
  };

  // Handle attack
  const handleAttack = (row: number, col: number) => {
    if (phase !== 'battle' || gameOver) return;

    const attackerIndex = currentPlayer - 1;
    const defenderIndex = 1 - attackerIndex;

    // Check if already attacked this cell
    if (attackBoards[attackerIndex][row][col] !== EMPTY) return;

    const newAttackBoards = [...attackBoards];
    const newBoards = [...boards];
    const isHit = boards[defenderIndex][row][col] === SHIP;

    newAttackBoards[attackerIndex][row][col] = isHit ? HIT : MISS;

    // Mark hit on defender's board
    if (isHit) {
      newBoards[defenderIndex][row][col] = HIT;
    }

    setAttackBoards(newAttackBoards);
    setBoards(newBoards);

    let sunkMessage = '';
    if (isHit && isShipSunk(newBoards[defenderIndex], row, col)) {
      // Try to find the ship size for message
      const shipCells: { row: number; col: number }[] = [];
      // Check horizontal
      let left = col;
      while (left > 0 && newBoards[defenderIndex][row][left - 1] === HIT) left--;
      let right = col;
      while (right < GRID_SIZE - 1 && newBoards[defenderIndex][row][right + 1] === HIT) right++;
      if (right - left >= 1) {
        for (let i = left; i <= right; i++) shipCells.push({ row, col: i });
      } else {
        // Check vertical
        let top = row;
        while (top > 0 && newBoards[defenderIndex][top - 1][col] === HIT) top--;
        let bottom = row;
        while (bottom < GRID_SIZE - 1 && newBoards[defenderIndex][bottom + 1][col] === HIT) bottom++;
        for (let i = top; i <= bottom; i++) shipCells.push({ row: i, col });
      }
      const shipSize = shipCells.length;
      const shipType = SHIPS.find(s => s.size === shipSize)?.name || `${shipSize}-cell ship`;
      sunkMessage = ` Sunk the ${shipType}!`;
    }

    if (isHit) {
      setMessage(
        (playerMode === 'computer' && currentPlayer === 1
          ? 'Hit!'
          : playerMode === 'local'
          ? `Player ${currentPlayer} hit!`
          : 'Computer hit!') + sunkMessage + (sunkMessage ? ' ' : '') + (sunkMessage && 'Go again!')
      );

      // Check for win
      const remainingShips = newBoards[defenderIndex].flat().filter(cell => cell === SHIP).length;

      if (remainingShips === 0) {
        setGameOver(true);
        setWinner(currentPlayer);
        setMessage(
          (playerMode === 'computer' && currentPlayer === 1
            ? 'You won!'
            : playerMode === 'computer'
            ? 'Computer won!'
            : `Player ${currentPlayer} wins!`)
        );
        return;
      }
    } else {
      // Switch turns on miss
      if (playerMode === 'local') {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        setMessage(`Player ${currentPlayer === 1 ? 2 : 1}'s turn - Attack!`);
      } else {
        setCurrentPlayer(2);
        setMessage('Computer\'s turn...');
        // Computer attack after delay
        setTimeout(computerAttack, 1000);
      }
    }
  };

  // Computer AI attack
  const computerAttack = (): void => {
    const availableCells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (attackBoards[1][row][col] === EMPTY) {
          availableCells.push([row, col]);
        }
      }
    }

    if (availableCells.length === 0) return;

    const [row, col] = availableCells[Math.floor(Math.random() * availableCells.length)];
    const newAttackBoards = [...attackBoards];
    const newBoards = [...boards];
    const isHit = boards[0][row][col] === SHIP;

    newAttackBoards[1][row][col] = isHit ? HIT : MISS;

    // Mark hit on player's board
    if (isHit) {
      newBoards[0][row][col] = HIT;
    }

    setAttackBoards(newAttackBoards);
    setBoards(newBoards);

    let sunkMessage = '';
    if (isHit && isShipSunk(newBoards[0], row, col)) {
      // Try to find the ship size for message
      const shipCells: { row: number; col: number }[] = [];
      // Check horizontal
      let left = col;
      while (left > 0 && newBoards[0][row][left - 1] === HIT) left--;
      let right = col;
      while (right < GRID_SIZE - 1 && newBoards[0][row][right + 1] === HIT) right++;
      if (right - left >= 1) {
        for (let i = left; i <= right; i++) shipCells.push({ row, col: i });
      } else {
        // Check vertical
        let top = row;
        while (top > 0 && newBoards[0][top - 1][col] === HIT) top--;
        let bottom = row;
        while (bottom < GRID_SIZE - 1 && newBoards[0][bottom + 1][col] === HIT) bottom++;
        for (let i = top; i <= bottom; i++) shipCells.push({ row: i, col });
      }
      const shipSize = shipCells.length;
      const shipType = SHIPS.find(s => s.size === shipSize)?.name || `${shipSize}-cell ship`;
      sunkMessage = ` Computer sunk your ${shipType}!`;
    }

    if (isHit) {
      setMessage(
        'Computer hit!' +
          sunkMessage +
          (sunkMessage ? ' ' : '') +
          (sunkMessage && 'Computer goes again...')
      );

      const remainingShips = newBoards[0].flat().filter(cell => cell === SHIP).length;

      if (remainingShips === 0) {
        setGameOver(true);
        setWinner(2);
        setMessage('Computer won!');
        return;
      }

      setTimeout(computerAttack, 1000);
    } else {
      setCurrentPlayer(1);
      setMessage('Computer missed! Your turn!');
    }
  };

  // Start placing next ship
  const startPlacing = (ship: Ship) => {
    setPlacingShip(ship);
  };

  // Helper to get all cells a ship would occupy for a given start cell and direction
  const getPlacementCells = (
    row: number,
    col: number,
    size: number,
    direction: 'horizontal' | 'vertical'
  ): { row: number; col: number }[] => {
    const cells = [];
    for (let i = 0; i < size; i++) {
      const newRow = direction === 'horizontal' ? row : row + i;
      const newCol = direction === 'horizontal' ? col + i : col;
      cells.push({ row: newRow, col: newCol });
    }
    return cells;
  };

  // Render cell
  const renderCell = (
    row: number,
    col: number,
    isOwnBoard: boolean,
    playerIndex: number
  ) => {
    const board = isOwnBoard ? boards[playerIndex] : attackBoards[playerIndex];
    const cell = board[row][col];

    // Determine if this cell is part of the hovered placement preview
    let isPlacementPreview = false;
    if (
      placingShip &&
      isOwnBoard &&
      hoverCell &&
      isValidPlacement(
        boards[playerIndex],
        hoverCell.row,
        hoverCell.col,
        placingShip.size,
        shipDirection
      )
    ) {
      const previewCells = getPlacementCells(
        hoverCell.row,
        hoverCell.col,
        placingShip.size,
        shipDirection as 'horizontal' | 'vertical'
      );
      isPlacementPreview = previewCells.some(
        (c) => c.row === row && c.col === col
      );
    }

    let cellClass =
      'w-6 h-6 sm:w-8 sm:h-8 border border-blue-300 cursor-pointer flex items-center justify-center text-xs font-bold ';

    if (isPlacementPreview) {
      cellClass += 'bg-green-400 hover:bg-green-300';
    } else if (cell === EMPTY) {
      cellClass += 'bg-blue-100 hover:bg-blue-200';
    } else if (cell === SHIP && isOwnBoard) {
      cellClass += 'bg-gray-600';
    } else if (cell === HIT) {
      cellClass += 'bg-red-500 text-white';
    } else if (cell === MISS) {
      cellClass += 'bg-blue-300';
    } else {
      cellClass += 'bg-blue-100 hover:bg-blue-200';
    }

    return (
      <div
        key={`${row}-${col}`}
        className={cellClass}
        onClick={() => {
          if (phase === 'placement' && isOwnBoard) {
            handlePlacementClick(row, col);
          } else if (
            phase === 'battle' &&
            !isOwnBoard &&
            currentPlayer === playerIndex + 1
          ) {
            handleAttack(row, col);
          }
        }}
        onMouseEnter={() => {
          if (phase === 'placement' && isOwnBoard && placingShip) {
            setHoverCell({ row, col });
          }
        }}
        onMouseLeave={() => {
          if (phase === 'placement' && isOwnBoard && placingShip) {
            setHoverCell(null);
          }
        }}
      >
        {cell === HIT && '💥'}
        {cell === MISS && '💧'}
      </div>
    );
  };

  // Render grid
  const renderGrid = (playerIndex: number, isOwnBoard: boolean = true) => (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">
        {isOwnBoard ? 
          (playerMode === 'computer' ? 'Your Ships' : `Player ${playerIndex + 1} Ships`) :
          (playerMode === 'computer' ? 'Enemy Waters' : `Player ${playerIndex === 0 ? 2 : 1} Waters`)
        }
      </h3>
      <div className="grid grid-cols-10 gap-0 border-2 border-blue-400 bg-white">
        {Array(GRID_SIZE).fill(0).map((_, row) =>
          Array(GRID_SIZE).fill(0).map((_, col) =>
            renderCell(row, col, isOwnBoard, playerIndex)
          )
        )}
      </div>
    </div>
  );

  if (gameMode === 'menu') {
    return (
      <div className="flex flex-col items-center px-2 sm:px-0">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold p-4 text-center">Battleships</h1>
          <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center justify-center rounded-2xl p-4 text-white">
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Choose Game Mode</h2>
              <button
                onClick={() => initializeGame('computer')}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Play vs Computer
              </button>
              <button
                onClick={() => initializeGame('local')}
                className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Local Multiplayer
              </button>
              <div className="text-sm text-center mt-4 opacity-80">
                <p>Sink all enemy ships before they sink yours!</p>
                <p>Ships: Carrier(5), Battleship(4), Cruiser(3), Submarine(3), Destroyer(2)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-2 sm:px-0">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 text-center">Battleships</h1>
        <div className="w-4/6 aspect-video bg-gradient-to-b from-blue-900 to-blue-700 rounded-2xl p-4 text-white">
          
          {/* Game Status */}
          <div className="text-center mb-4">
            <p className="text-lg font-semibold">{message}</p>
            {gameOver && (
              <button
                onClick={() => setGameMode('menu')}
                className="mt-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                New Game
              </button>
            )}
          </div>

          {/* Ship Placement Phase */}
          {phase === 'placement' && (
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {shipsToPlace.map((ship, index) => (
                    <button
                      key={index}
                      onClick={() => startPlacing(ship)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                        placingShip === ship ? 'bg-yellow-500' : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                    >
                      {ship.name} ({ship.size})
                    </button>
                  ))}
                </div>
                {placingShip && (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => setShipDirection(shipDirection === 'horizontal' ? 'vertical' : 'horizontal')}
                      className="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-sm font-semibold transition-colors"
                      title="Rotate Ship"
                    >
                      Rotate {shipDirection === 'horizontal' ? '→' : '↓'}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {renderGrid(currentPlayer - 1)}
              </div>
            </div>
          )}

          {/* Battle Phase */}
          {phase === 'battle' && (
            <div className="space-y-4">
              {playerMode === 'computer' ? (
                <div className="flex flex-col lg:flex-row gap-4 justify-center items-start">
                  {renderGrid(0, true)}
                  {renderGrid(0, false)}
                </div>
              ) : (
                <div className="flex justify-center">
                  {currentPlayer === 1 ? renderGrid(1, false) : renderGrid(0, false)}
                </div>
              )}
            </div>
          )}

          {/* Back to Menu */}
          <div className="text-center mt-4">
            <button
              onClick={() => setGameMode('menu')}
              className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}