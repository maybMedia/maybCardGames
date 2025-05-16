import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Solitaire" },
    { name: "description", content: "A strategy card game played by one player" },
  ];
}

export default function Solitaire() {
  return (
    <div className="flex flex-col items-center h-screen pt-26">
      <div className="container mx-auto flex flex-col items-center justify-center p-10">
        <div className="w-4/6 aspect-video bg-slate-600 flex flex-col items-center justify-center rounded-2xl">
            <h1 className="text-2xl font-bold">Solitaire</h1>
            <p className="text-lg">A strategy card game played by one player</p>
            <h2 className="text-blue-500 text-2xl font-bold">Coming Soon!</h2>  
        </div>
      </div>
    </div>
  );
}