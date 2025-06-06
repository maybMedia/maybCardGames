import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Battleships" },
    { name: "description", content: "A strategic guessing game where you sink your opponent's ships" },
    // { content: "user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0" }, // Uncomment if you want to disable zooming
  ];
}

export default function GameWindow() {
  return (
    <div className="flex flex-col items-center pt-16 px-2 sm:px-0">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 sm:p-5 text-center">Battleships</h1>
        <div className="w-full sm:w-5/6 aspect-[4/5] sm:aspect-video ocean-background flex flex-col items-center justify-center rounded-2xl p-2 sm:p-4 text-white relative overflow-x-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-700 opacity-50 rounded-2xl"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <p className="text-lg sm:text-xl font-semibold mb-4">Coming Soon!</p>
            <p className="text-sm sm:text-base mb-6 text-center">Try to guess the locations of your opponent's ships and sink them before they sink yours!</p>
          </div>
        </div>
      </div>
    </div>
  );
}