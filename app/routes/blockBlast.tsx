import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Block Blast" },
    { name: "description", content: "A puzzle game where you create rows of blocks to clear them" },
  ];
}

export default function BlockBlast() {
  return (
    <div className="flex flex-col items-center px-2 sm:px-0">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 sm:p-5 text-center">Block Blast</h1>
        <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video bg-slate-600 flex flex-col items-center justify-center rounded-2xl p-2 sm:p-4 text-white relative overflow-x-auto">
            <h1 className="text-8xl font-bold text-red-600">Coming Soon!</h1>
        </div>
      </div>
    </div>
  );
}