import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  }
];

export default function BlockBlast() {
  const getRandomShapes = () => {
    const shuffled = [...SHAPES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  type ShapeSlot = Shape | null;

  const [availableShapes, setAvailableShapes] = useState<ShapeSlot[]>(() =>
    SHAPES.sort(() => 0.5 - Math.random()).slice(0, 3)
  );
  
  const [dragState, setDragState] = useState<{
    shapeId: string | null;
    hoverRow: number | null;
    hoverCol: number | null;
    grabOffset: { row: number; col: number } | null;
  }>({
    shapeId: null,
    hoverRow: null,
    hoverCol: null,
    grabOffset: null,
  });

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
    });
  };

  const handleDragEnd = () => {
    setDragState({ shapeId: null, hoverRow: null, hoverCol: null, grabOffset: null });
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
      setDragState(prev => ({ ...prev, hoverRow: null, hoverCol: null }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSlot: any) => {
    e.preventDefault();
    const shapeId = e.dataTransfer.getData("text/plain");
    const shape = availableShapes.find((s) => s && s.id === shapeId);
    if (!shape) return;

    const newGrid = [...grid];
    const baseRow = targetSlot.row;
    const baseCol = targetSlot.col;

    const canPlace = canPlaceShape(shape, baseRow, baseCol, dragState.grabOffset!);

    if (!canPlace) {
      setDragState({ shapeId: null, hoverRow: null, hoverCol: null, grabOffset: null });
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
    setDragState({ shapeId: null, hoverRow: null, hoverCol: null, grabOffset: null });
  }

  const renderShape = (shape: Shape, index: number) => {
    const blockSize = 24;

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

    return (
      <motion.div
        key={`${shape.id}-${index}`}
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: -20 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          delay: index * 0.1 // Stagger the animations
        }}
        onDragEnd={handleDragEnd}
        className="cursor-grab p-1 hover:scale-105 transition-transform duration-200 active:cursor-grabbing"
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
                delay: index * 0.1 + blockIndex * 0.02 // Individual block animation delay
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, shape.id, { row, col })}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center px-2 sm:px-0 min-h-screen">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 sm:p-5 text-center text-white">Block Blast</h1>

        <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video rainbow-bg flex flex-col items-center justify-start rounded-2xl p-2 sm:p-4 text-white relative overflow-x-auto shadow-2xl">
          
          {/* Grid */}
          <div
            className="grid gap-1 p-2"
            style={{
              gridTemplateRows: `repeat(8, 1fr)`,
              gridTemplateColumns: `repeat(8, 1fr)`,
              width: "100%",
              aspectRatio: "1/1",
              maxWidth: 400,
              background: "#334155",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
            onDragLeave={handleDragLeave}
          >
            {grid.map((slot) => {
              const preview = getSlotPreview(slot);

              if (slot.filled) {
                return (
                  <motion.div
                    key={slot.id}
                    layoutId={`slot-${slot.id}`}
                    className={`aspect-square rounded-sm border ${slot.color}`}
                    style={{ minHeight: "20px" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                  onDrop={(e) => handleDrop(e, slot)}
                  onDragOver={(e) => handleDragOver(e, slot)}
                  className={className}
                  style={{ minHeight: "20px" }}
                />
              );
            })}
          </div>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-4 justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div 
                key={i} 
                className="w-[96px] h-[96px] bg-slate-700/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-slate-600"
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
    </div>
  );
}