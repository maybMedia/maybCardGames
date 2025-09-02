import MartyCrushGame from "~/components/MartyCrushGame";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Marty Crush" },
    { name: "description", content: "Line up Marty and his friends to clear the screen!" },
    { content: "user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0" },
  ];
}

export default function GameWindow() {
  return (
    <div className="flex flex-col items-center px-2 sm:px-0">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 text-center text-blue-500 drop-shadow-lg">Marty Crush</h1>
        <MartyCrushGame />
      </div>
    </div>
  );
}