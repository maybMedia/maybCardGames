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
        <h1 className="text-2xl font-bold p-4 sm:p-5 text-center">Marty Crush</h1>
        <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video rainbow-bg flex flex-col items-center justify-center rounded-2xl p-2 sm:p-4 text-white relative overflow-x-auto">
        </div>
      </div>
    </div>
  );
}