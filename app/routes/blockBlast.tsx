import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Block Blast" },
    { name: "description", content: "A puzzle game where you create rows of blocks to clear them" },
    { content: "user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0" },
  ];
}

type Block = {
  row: number;
  col: number;
};

type Shape = {
  id: string;
  color: string;
  blocks: Block[];
};

const SHAPES = [
  {
    id: "2x1-horizontal",
    color: "bg-green-400",
    blocks: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
  },
  {
    id: "2x1-vertical",
    color: "bg-green-500",
    blocks: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
  },
  {
    id: "littleL-topLeft",
    color: "bg-yellow-300",
    blocks: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
  },
  {
    id: "littleL-topRight",
    color: "bg-yellow-400",
    blocks: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }],
  },
  {
    id: "littleL-bottomLeft",
    color: "bg-yellow-500",
    blocks: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 0, col: 0 }],
  },
  {
    id: "littleL-bottomRight",
    color: "bg-yellow-600",
    blocks: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 0, col: 2 }],
  },
  {
    id: "square",
    color: "bg-red-400",
    blocks: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
  },
  {
    id: "T-shape-down",
    color: "bg-purple-300",
    blocks: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 1 },
    ],
  },
  {
    id: "T-shape-up",
    color: "bg-purple-400",
    blocks: [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 0, col: 1 },
    ],
  },
  {
    id: "T-shape-right",
    color: "bg-purple-500",
    blocks: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 1, col: 1 },
    ],
  },
  {
    id: "T-shape-left",
    color: "bg-purple-600",
    blocks: [
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 1, col: 0 },
    ],
  },
  {
    id: "3x1-horizontal",
    color: "bg-blue-400",
    blocks: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
  },
  {
    id: "3x1-vertical",
    color: "bg-blue-500",
    blocks: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
  },
  {
    id: "zigzag-left",
    color: "bg-orange-300",
    blocks: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
  },
  {
    id: "zigzag-right",
    color: "bg-orange-400",
    blocks: [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
  },
  {
    id: "zigzag-up",
    color: "bg-orange-500",
    blocks: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
    ],
  },
  {
    id: "zigzag-down",
    color: "bg-orange-600",
    blocks: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 0 },
    ],
  },
  {
    id: "L-shape-left",
    color: "bg-teal-300",
    blocks: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
    ],
  },
  {
    id: "L-shape-right",
    color: "bg-teal-400",
    blocks: [
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 2, col: 0 },
    ],
  },
  {
    id: "L-shape-up",
    color: "bg-teal-500",
    blocks: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 2 },
    ],
  },
  {
    id: "L-shape-down",
    color: "bg-teal-600",
    blocks: [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 0, col: 2 },
    ],
  },
  {
    id: "3x3-square",
    color: "bg-indigo-400",
    blocks: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  },
  {
    id: "big-L-shape-left",
    color: "bg-rose-300",
    blocks: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ],
  },
  {
    id: "big-L-shape-right",
    color: "bg-rose-400",
    blocks: [
      { row: 0, col: 2 },
      { row: 0, col: 1 },
      { row: 0, col: 0 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
    ],
  },
  {
    id: "big-L-shape-up",
    color: "bg-rose-500",
    blocks: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  },
  {
    id: "big-L-shape-down",
    color: "bg-rose-600",
    blocks: [
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 1, col: 2 },
      { row: 0, col: 2 },
    ],
  },
];

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

export default function BlockBlast() {
  const getRandomShapes = () => {
    const shuffled = [...SHAPES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  type ShapeSlot = Shape | null;

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem("highScore");
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("highScore", String(highScore));
    }
  }, [highScore]);

  const [availableShapes, setAvailableShapes] = useState<ShapeSlot[]>(() =>
    SHAPES.sort(() => 0.5 - Math.random()).slice(0, 3)
  );
  
  const [dragState, setDragState] = useState<{
    shapeId: string | null;
    hoverRow: number | null;
    hoverCol: number | null;
    grabOffset: { row: number; col: number } | null;
    isDragging: boolean;
    dragPosition: { x: number; y: number } | null;
  }>({
    shapeId: null,
    hoverRow: null,
    hoverCol: null,
    grabOffset: null,
    isDragging: false,
    dragPosition: null,
  });

  const [clearingLines, setClearingLines] = useState<{
    rows: number[];
    cols: number[];
  }>({ rows: [], cols: [] });

  const [gridRef, setGridRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (availableShapes.every((shape) => shape === null)) {
      const newShapes = SHAPES
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const timeout = setTimeout(() => {
        setAvailableShapes(newShapes);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [availableShapes]);

  const [grid, setGrid] = useState(
    Array.from({ length: 64 }, (_, i) => ({
      id: i,
      row: Math.floor(i / 8),
      col: i % 8,
      filled: false,
      color: "",
    }))
  );

  const [isCompactHeight, setIsCompactHeight] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCompactHeight(window.innerHeight < 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const preventTouchMove = (e: TouchEvent) => {
      if (isMobile()) e.preventDefault();
    };

    document.body.addEventListener("touchmove", preventTouchMove, { passive: false });

    return () => {
      document.body.removeEventListener("touchmove", preventTouchMove);
    };
  }, []);

  const animateLineClear = async (fullRows: number[], fullCols: number[], newGrid: any[]) => {
    setClearingLines({ rows: fullRows, cols: fullCols });
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const updatedGrid = newGrid.map(cell => {
      if (fullRows.includes(cell.row) || fullCols.includes(cell.col)) {
        return { ...cell, filled: false, color: "" };
      }
      return cell;
    });
    
    setGrid(updatedGrid);
    setClearingLines({ rows: [], cols: [] });
  };

  const canPlaceShape = (
    shape: Shape,
    targetRow: number,
    targetCol: number,
    grabOffset: { row: number; col: number }
  ) => {
    return shape.blocks.every(({ row, col }) => {
      const r = targetRow - grabOffset.row + row;
      const c = targetCol - grabOffset.col + col;
      return (
        r >= 0 &&
        r < 8 &&
        c >= 0 &&
        c < 8 &&
        !grid.find((s) => s.row === r && s.col === c)?.filled
      );
    });
  };

  const getCurrentShape = () => {
    if (!dragState.shapeId) return null;
    return availableShapes.find((s) => s && s.id === dragState.shapeId) || null;
  };

  const getSlotPreview = (slot: any) => {
    const shape = getCurrentShape();
    if (!shape || dragState.hoverRow === null || dragState.hoverCol === null) return null;

    const isPreviewSlot = shape.blocks.some(({ row, col }) => {
      const r = dragState.hoverRow! - dragState.grabOffset!.row + row;
      const c = dragState.hoverCol! - dragState.grabOffset!.col + col;
      return r === slot.row && c === slot.col;
    });

    if (!isPreviewSlot) return null;

    const canPlace = canPlaceShape(shape, dragState.hoverRow!, dragState.hoverCol!, dragState.grabOffset!);
    return {
      color: shape.color,
      canPlace
    };
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent, shapeId: string, grabOffset: { row: number; col: number }) => {
    e.preventDefault();
    const touch = e.touches[0];
    setDragState({
      shapeId,
      hoverRow: null,
      hoverCol: null,
      grabOffset,
      isDragging: true,
      dragPosition: { x: touch.clientX, y: touch.clientY }
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragState.isDragging || !gridRef) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    
    setDragState(prev => ({
      ...prev,
      dragPosition: { x: touch.clientX, y: touch.clientY }
    }));

    // Get grid position under touch
    const gridRect = gridRef.getBoundingClientRect();
    const relativeX = touch.clientX - gridRect.left;
    const relativeY = touch.clientY - gridRect.top;
    
    if (relativeX >= 0 && relativeX <= gridRect.width && 
        relativeY >= 0 && relativeY <= gridRect.height) {
      const cellWidth = gridRect.width / 8;
      const cellHeight = gridRect.height / 8;
      const col = Math.floor(relativeX / cellWidth);
      const row = Math.floor(relativeY / cellHeight);
      
      if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        setDragState(prev => ({
          ...prev,
          hoverRow: row,
          hoverCol: col
        }));
      } else {
        setDragState(prev => ({
          ...prev,
          hoverRow: null,
          hoverCol: null
        }));
      }
    } else {
      setDragState(prev => ({
        ...prev,
        hoverRow: null,
        hoverCol: null
      }));
    }
  };

  const handleTouchEnd = async (e: React.TouchEvent) => {
    if (!dragState.isDragging) return;
    
    e.preventDefault();
    
    const { shapeId, hoverRow, hoverCol, grabOffset } = dragState;
    const shape = availableShapes.find((s) => s && s.id === shapeId);
    
    if (shape && hoverRow !== null && hoverCol !== null && grabOffset) {
      const canPlace = canPlaceShape(shape, hoverRow, hoverCol, grabOffset);
      
      if (canPlace) {
        const newGrid = [...grid];
        
        shape.blocks.forEach(({ row, col }) => {
          const r = hoverRow - grabOffset.row + row;
          const c = hoverCol - grabOffset.col + col;
          const idx = r * 8 + c;
          newGrid[idx] = { ...newGrid[idx], filled: true, color: shape.color };
        });

        setGrid(newGrid);
        setAvailableShapes((prev) => prev.map((s) => (s?.id === shapeId ? null : s)));
        
        const baseScorePerLine = 100;
        let comboMultiplier = 1.5;

        const { fullRows, fullCols } = findFullLines(newGrid);
        const totalLinesCleared = fullRows.length + fullCols.length;

        if (totalLinesCleared > 0) {
          await animateLineClear(fullRows, fullCols, newGrid);
          
          const pointsGained = (totalLinesCleared > 1) ? 
            totalLinesCleared * baseScorePerLine * comboMultiplier : baseScorePerLine;
          const newScore = score + pointsGained;
          setScore(newScore);
          
          if (newScore > highScore) {
            setHighScore(newScore);
          }
        }
      }
    }
    
    // Reset drag state
    setDragState({
      shapeId: null,
      hoverRow: null,
      hoverCol: null,
      grabOffset: null,
      isDragging: false,
      dragPosition: null
    });
  };

  // Desktop drag handlers (keeping existing functionality)
  const handleDragStart = (
    e: React.DragEvent,
    shapeId: string,
    grabOffset: { row: number; col: number }
  ) => {
    e.dataTransfer.setData("text/plain", shapeId);
    setDragState({
      shapeId,
      hoverRow: null,
      hoverCol: null,
      grabOffset,
      isDragging: false,
      dragPosition: null
    });
  };

  const handleDragEnd = () => {
    setDragState({ 
      shapeId: null, 
      hoverRow: null, 
      hoverCol: null, 
      grabOffset: null,
      isDragging: false,
      dragPosition: null
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetSlot: any) => {
    e.preventDefault();
    setDragState(prev => ({
      ...prev,
      hoverRow: targetSlot.row,
      hoverCol: targetSlot.col
    }));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragState(prev => ({ 
        ...prev, 
        hoverRow: null, 
        hoverCol: null 
      }));
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetSlot: any) => {
    e.preventDefault();
    const shapeId = e.dataTransfer.getData("text/plain");
    const shape = availableShapes.find((s) => s && s.id === shapeId);
    if (!shape) return;

    const newGrid = [...grid];
    const baseRow = targetSlot.row;
    const baseCol = targetSlot.col;

    const canPlace = canPlaceShape(shape, baseRow, baseCol, dragState.grabOffset!);

    if (!canPlace) {
      setDragState({ 
        shapeId: null, 
        hoverRow: null, 
        hoverCol: null, 
        grabOffset: null,
        isDragging: false,
        dragPosition: null
      });
      return;
    }

    shape.blocks.forEach(({ row, col }) => {
      const r = baseRow - dragState.grabOffset!.row + row;
      const c = baseCol - dragState.grabOffset!.col + col;
      const idx = r * 8 + c;
      newGrid[idx] = { ...newGrid[idx], filled: true, color: shape.color };
    });

    setGrid(newGrid);
    setAvailableShapes((prev) => prev.map((s) => (s?.id === shapeId ? null : s)));
    setDragState({ 
      shapeId: null, 
      hoverRow: null, 
      hoverCol: null, 
      grabOffset: null,
      isDragging: false,
      dragPosition: null
    });

    const baseScorePerLine = 100;
    let comboMultiplier = 1.5;

    const { fullRows, fullCols } = findFullLines(newGrid);
    const totalLinesCleared = fullRows.length + fullCols.length;

    if (totalLinesCleared > 0) {
      await animateLineClear(fullRows, fullCols, newGrid);
      
      const pointsGained = (totalLinesCleared > 1) ? 
        totalLinesCleared * baseScorePerLine * comboMultiplier : baseScorePerLine;
      const newScore = score + pointsGained;
      setScore(newScore);
      
      if (newScore > highScore) {
        setHighScore(newScore);
      }
    }
  }

  const findFullLines = (grid: any) => {
    const fullRows: number[] = [];
    const fullCols: number[] = [];

    for (let r = 0; r < 8; r++) {
      if (grid.filter((cell: { row: number; filled: boolean; }) => cell.row === r && cell.filled).length === 8) {
        fullRows.push(r);
      }
    }

    for (let c = 0; c < 8; c++) {
      if (grid.filter((cell: { col: number; filled: boolean; }) => cell.col === c && cell.filled).length === 8) {
        fullCols.push(c);
      }
    }

    return { fullRows, fullCols };
  };

  const renderShape = (shape: Shape, index: number) => {
    const blockSize = isMobile() ? 20 : 24;

    const rows = shape.blocks.map((b) => b.row);
    const cols = shape.blocks.map((b) => b.col);
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);

    const shapeWidth = (maxCol - minCol + 1) * blockSize;
    const shapeHeight = (maxRow - minRow + 1) * blockSize;

    const containerSize = 3 * blockSize;
    const offsetX = (containerSize - shapeWidth) / 2 - minCol * blockSize;
    const offsetY = (containerSize - shapeHeight) / 2 - minRow * blockSize;

    const isDragging = dragState.isDragging && dragState.shapeId === shape.id;

    return (
      <motion.div
        key={`${shape.id}-${index}`}
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ 
          scale: isDragging ? 1.1 : 1, 
          opacity: isDragging ? 0.8 : 1, 
          y: 0,
          x: isDragging && dragState.dragPosition ? dragState.dragPosition.x - window.innerWidth/2 : 0,
          zIndex: isDragging ? 1000 : 1
        }}
        exit={{ scale: 0, opacity: 0, y: -20 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          delay: isDragging ? 0 : index * 0.1
        }}
        onDragEnd={handleDragEnd}
        className="cursor-grab p-1 hover:scale-105 transition-transform duration-200 active:cursor-grabbing select-none"
        style={{
          position: isDragging ? 'fixed' : 'relative',
          top: isDragging && dragState.dragPosition ? dragState.dragPosition.y - 50 : 'auto',
          left: isDragging && dragState.dragPosition ? dragState.dragPosition.x - 50 : 'auto',
          pointerEvents: isDragging ? 'none' : 'auto'
        }}
      >
        <div
          className="relative"
          style={{
            width: `${containerSize}px`,
            height: `${containerSize}px`,
          }}
        >
          {shape.blocks.map(({ row, col }, blockIndex) => (
            <motion.div
              key={blockIndex}
              className={`absolute ${shape.color} rounded-sm shadow-sm`}
              style={{
                width: `${blockSize - 2}px`,
                height: `${blockSize - 2}px`,
                top: `${row * blockSize + offsetY}px`,
                left: `${col * blockSize + offsetX}px`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 20,
                delay: index * 0.1 + blockIndex * 0.02
              }}
              draggable={!isMobile()}
              // @ts-ignore
              onDragStart={(e) => !isMobile() && handleDragStart(e, shape.id, { row, col })}
              //@ts-check
              onDragEnd={!isMobile() ? handleDragEnd : undefined}
              onTouchStart={(e) => isMobile() && handleTouchStart(e, shape.id, { row, col })}
              onTouchMove={isMobile() ? handleTouchMove : undefined}
              onTouchEnd={isMobile() ? handleTouchEnd : undefined}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center px-2 sm:px-0 overflow-hidden touch-none">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 sm:p-5 text-center text-white">Block Blast</h1>

        <div className={`w-full sm:w-4/6 rainbow-bg sm:aspect-video aspect-[5/7] flex ${isCompactHeight ? "flex-row gap-4 justify-center" : "flex-col"} items-center rounded-2xl p-2 sm:p-4 text-white relative overflow-hidden shadow-2xl`}>
          {/* Score */}
          <div className="w-full max-w-96 flex justify-between items-center mb-4">
            <h1 className="text-base sm:text-lg font-bold bg-[rgba(0,20,60,0.7)] p-1 rounded-lg">Score: {score}</h1>
            <button 
              className="text-lg font-bold bg-slate-600 aspect-square w-8 rounded-lg flex items-center justify-center touch-manipulation" 
              onClick={() => {
                setGrid(Array.from({ length: 64 }, (_, i) => ({
                  id: i,
                  row: Math.floor(i / 8),
                  col: i % 8,
                  filled: false,
                  color: "",
                })));
                setScore(0);
                setAvailableShapes(getRandomShapes());
              }}
            >
              ⟳
            </button>
            <h1 className="text-base sm:text-lg font-bold bg-[rgba(0,20,60,0.5)] p-1 rounded-lg">High: {highScore}</h1>
          </div>

          {/* Grid */}
          <div
            ref={setGridRef}
            className="grid gap-1 p-2 relative touch-none"
            style={{
              gridTemplateRows: `repeat(8, 1fr)`,
              gridTemplateColumns: `repeat(8, 1fr)`,
              width: "100%",
              aspectRatio: "1/1",
              maxWidth: isMobile() ? 320 : 400,
              background: "#334155",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
            onDragLeave={!isMobile() ? handleDragLeave : undefined}
          >
            {grid.map((slot) => {
              const preview = getSlotPreview(slot);

              const isInClearingRow = clearingLines.rows.includes(slot.row);
              const isInClearingCol = clearingLines.cols.includes(slot.col);
              const isClearing = isInClearingRow || isInClearingCol;

              if (slot.filled) {
                return (
                  <motion.div
                    key={slot.id}
                    className={`aspect-square rounded-sm border ${slot.color}`}
                    animate={{ 
                      scale: isClearing ? [1, 1.2, 0] : 1,
                      rotate: isClearing ? [0, 10, -10, 0] : 0,
                      opacity: isClearing ? [1, 0.8, 0] : 1
                    }}
                    transition={{ 
                      duration: isClearing ? 0.6 : 0.3
                    }}
                  />
                );
              }

              let className = "aspect-square rounded-sm border transition-all duration-200 ";
              if (preview) {
                if (preview.canPlace) {
                  className += `${preview.color} opacity-70 border-white border-2 animate-pulse`;
                } else {
                  className += "bg-red-500 opacity-70 border-red-300 border-2 animate-pulse";
                }
              } else {
                className += "bg-slate-600 border-slate-500 hover:bg-slate-500";
              }

              return (
                <div
                  key={slot.id}
                  onDrop={!isMobile() ? (e) => handleDrop(e, slot) : undefined}
                  onDragOver={!isMobile() ? (e) => handleDragOver(e, slot) : undefined}
                  className={className}
                  style={{ minHeight: "20px" }}
                />
              );
            })}

            {/* Line clearing overlays */}
            {clearingLines.rows.map(row => (
              <motion.div
                key={`row-${row}`}
                className="absolute bg-white pointer-events-none"
                style={{
                  top: `${(row * 100 / 8) + 1}%`,
                  left: "1%",
                  right: "1%",
                  height: `${100 / 8 - 2}%`,
                  borderRadius: "4px"
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  scaleX: [0, 1, 1]
                }}
                transition={{ duration: 0.6 }}
              />
            ))}

            {clearingLines.cols.map(col => (
              <motion.div
                key={`col-${col}`}
                className="absolute bg-white pointer-events-none"
                style={{
                  left: `${(col * 100 / 8) + 1}%`,
                  top: "1%",
                  bottom: "1%",
                  width: `${100 / 8 - 2}%`,
                  borderRadius: "4px"
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  scaleY: [0, 1, 1]
                }}
                transition={{ duration: 0.6 }}
              />
            ))}
          </div>

          <div className={`${isCompactHeight ? "flex-col ml-2" : "absolute bottom-2 left-1/2 transform -translate-x-1/2"} flex ${isCompactHeight ? "gap-2" : "gap-4"} justify-center`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div 
                key={i} 
                className={`${isMobile() ? 'w-[80px] h-[80px]' : 'w-[96px] h-[96px]'} bg-slate-700/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-slate-600`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <AnimatePresence mode="wait">
                  {availableShapes[i] && renderShape(availableShapes[i], i)}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile instructions */}
      {isMobile() && window.innerHeight > 700 && (
        <div className="mt-4 p-3 bg-slate-800/80 rounded-lg text-white text-sm text-center max-w-sm">
          <p>Touch and drag shapes to place them on the grid!</p>
        </div>
      )}
    </div>
  );
}