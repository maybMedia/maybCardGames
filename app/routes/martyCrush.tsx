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
        <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video rainbow-bg flex flex-col items-center justify-center rounded-2xl p-2 sm:p-4 text-white relative overflow-hidden">
          <h1 className="text-2xl font-bold mb-4 text-center">Coming Soon!</h1>
          <p className="text-lg text-center mb-4">
            Line up Marty and his friends to clear the screen!<br />
            Stay tuned for updates!
          </p>
          <div className="w-full h-28 relative overflow-x-visible">
            <img
              src="./icon.png"
              alt="Icon"
              className="w-24 mb-4 bg-blue-100 rounded-full shadow-lg animate-roll"
              style={{ position: "absolute", bottom: 0 }}
            />
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes roll-across {
            0% {
              left: -6rem;
              transform: rotate(0deg);
            }
            80% {
              left: calc(100% + 2rem);
              transform: rotate(720deg);
            }
            100% {
              left: calc(100% + 2rem);
              transform: rotate(720deg);
            }
          }
          .animate-roll {
            animation: roll-across 4s linear infinite;
          }
        `}
      </style>
    </div>
  );
}