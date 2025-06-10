import React, { useState } from "react";
import SlidingSelector from "~/components/SlidingSelector";
import SnakeGame from "~/components/SnakeGame";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Snake" },
    { name: "description", content: "A classic game where you control a snake to eat food and grow" },
  ];
}

export default function Snake() {
  const [speed, setSpeed] = useState("medium");
  const [size, setSize] = useState(18);
  const [fruit, setFruit] = useState("🍎");
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="flex flex-col items-center px-2 sm:px-0 overflow-hidden">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 text-center text-blue-500 drop-shadow-lg">Snake</h1>
        <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video bg-slate-600 flex flex-col items-center justify-center rounded-2xl p-2 sm:p-4 text-white relative overflow-x-hidden">
          {!showGame ? (
            <>
              <div className="flex flex-col items-center mt-2 mb-4">
                <div className="text-xl font-bold mb-2 min-h-[1.5em]">Game Settings</div>
              </div>

              <h1 className="text-lg mb-2">Select Speed</h1>
              <SlidingSelector
                options={[
                  { value: "slow", label: "Slow" },
                  { value: "medium", label: "Medium" },
                  { value: "fast", label: "Fast" },
                ]}
                value={speed}
                onChange={(v: string) => setSpeed(v)}
              />

              <br />
              <h1 className="text-lg mb-2">Select Size</h1>
              <SlidingSelector
                options={[
                  { value: "10", label: "10x10" },
                  { value: "18", label: "18x18" },
                  { value: "24", label: "24x24" },
                ]}
                value={String(size)}
                onChange={(v: string) => setSize(Number(v))}
              />

              <br />
              <h1 className="text-lg mb-2">Select Fruit</h1>
              <SlidingSelector
                options={[
                  { value: "🍎", label: "🍎" },
                  { value: "🍌", label: "🍌" },
                  { value: "🍇", label: "🍇" },
                  { value: "🍉", label: "🍉" },
                  { value: "🍓", label: "🍓" },
                  { value: "🍊", label: "🍊" },
                ]}
                value={fruit}
                onChange={(v: string) => setFruit(v)}
              />

              <div className="flex flex-col items-center justify-end h-full gap-4 mb-4">
                <button
                  className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition duration-300"
                  onClick={() => setShowGame(true)}
                >
                  Start Game
                </button>
              </div>
            </>
          ) : (
            <SnakeGame
              size={size}
              speed={speed}
              fruit={fruit}
              onBack={() => setShowGame(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}