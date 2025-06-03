import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Block Blast" },
    { name: "description", content: "A puzzle game where you create rows of blocks to clear them" },
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

  useEffect(() => {
    if (availableShapes.every((shape) => shape === null)) {
      const newShapes = SHAPES
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const timeout = setTimeout(() => {
        setAvailableShapes(newShapes);
      }, 400); // wait for exit animation
      return () => clearTimeout(timeout);
    }
  }, [availableShapes]);

  const [grid, setGrid] = useState(
    Array.from({ length: 64 }, (_, i) => ({
      id: i,
      row: Math.floor(i / 8),
      col: i % 8,
      filled: false,
      color: "", // ← add this
    }))
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSlot: any) => {
    const shapeId = e.dataTransfer.getData("text/plain");
    const shape = availableShapes.find((s) => s && s.id === shapeId);
    if (!shape) return;

    const newGrid = [...grid];
    const baseRow = targetSlot.row;
    const baseCol = targetSlot.col;

    const canPlace = shape.blocks.every(({ row, col }) => {
      const r = baseRow + row;
      const c = baseCol + col;
      return r < 8 && c < 8 && !newGrid.find((s) => s.row === r && s.col === c)?.filled;
    });

    if (!canPlace) return;

    shape.blocks.forEach(({ row, col }) => {
      const r = baseRow + row;
      const c = baseCol + col;
      const idx = r * 8 + c;
      newGrid[idx] = { ...newGrid[idx], filled: true, color: shape.color };
    });

    setGrid(newGrid);

    setAvailableShapes((prev) =>
      prev.map((shape) => (shape?.id === shapeId ? null : shape))
    );

  };


  const handleDragStart = (e: React.DragEvent, shapeId: string) => {
    e.dataTransfer.setData("text/plain", shapeId);
  };

  return (
    <div className="flex flex-col items-center px-2 sm:px-0">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 sm:p-5 text-center">Block Blast</h1>

        <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video rainbow-bg flex flex-col items-center justify-start rounded-2xl p-2 sm:p-4 text-white relative overflow-x-auto">
          
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
              boxShadow: "0 2px 8px #0002",
            }}
          >
            {grid.map((slot) => (
              <div
                key={slot.id}
                onDrop={(e) => handleDrop(e, slot)}
                onDragOver={(e) => e.preventDefault()}
                className={`
                  aspect-square rounded-sm border transition-colors duration-200
                  ${slot.filled ? slot.color : "bg-slate-600 border-slate-500"}
                `}
                style={{ minHeight: "20px" }}
              />
            ))}
          </div>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-4 justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[96px] h-[96px] bg-slate-700 rounded-lg flex items-center justify-center">
                <AnimatePresence>
                  {availableShapes[i] && (
                    <motion.div
                      key={availableShapes[i].id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, availableShapes[i].id)}
                      className="cursor-grab p-1"
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {(() => {
                        const shape = availableShapes[i];
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
                          <div
                            className="relative"
                            style={{
                              width: `${containerSize}px`,
                              height: `${containerSize}px`,
                            }}
                          >
                            {shape.blocks.map(({ row, col }, index) => (
                              <div
                                key={index}
                                className={`absolute ${shape.color} rounded-sm`}
                                style={{
                                  width: `${blockSize - 2}px`,
                                  height: `${blockSize - 2}px`,
                                  top: `${row * blockSize + offsetY}px`,
                                  left: `${col * blockSize + offsetX}px`,
                                }}
                              />
                            ))}
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
