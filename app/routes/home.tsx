import GameSelectButton from "~/components/GameSelectButton";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "maybGames" },
    { name: "description", content: "Welcome to the app!" },
  ];
}

export default function Home() {
  return (
    <div className="w-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex flex-col items-center">
      {/* The Navbar is already rendered globally in root.tsx */}
      <main className="flex flex-col items-center w-full flex-1 pt-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-2 mt-4 drop-shadow-lg text-center">
          Select your game!
        </h1>
        <p className="text-lg text-blue-700 mb-6 text-center opacity-80">
          Fun, classic, and new games for everyone.
        </p>
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
            justify-items-center
            w-full
            max-w-4xl
            px-2
            mt-2
          "
        >
          <GameSelectButton
            name="Block Blast"
            description="A puzzle game where you create rows of blocks to clear them"
            imageUrl="./gameIcons/blockBlast.png"
            navigateTo="/maybCardGames/blockBlast"
          />
          <GameSelectButton
            name="Solitaire"
            description="A strategy card game played by one player"
            imageUrl="./gameIcons/solitaire.png"
            navigateTo="/maybCardGames/solitaire"
          />
          <GameSelectButton
            name="Blackjack"
            description="A game where you aim to get as close to 21 as possible"
            imageUrl="./gameIcons/blackjack.png"
            navigateTo="/maybCardGames/blackjack"
          />
          <GameSelectButton
            name="Tetris"
            description="A classic block game. Fit the blocks in the grid and clear rows!"
            imageUrl="./gameIcons/tetris.png"
            navigateTo="/maybCardGames/tetris"
            banner="Fan Favourite"
          />
          <GameSelectButton
            name="Battleships"
            description="A strategic guessing game where you sink your opponent's ships"
            imageUrl="./gameIcons/battleships.png"
            navigateTo="/maybCardGames/battleships"
            banner="Newest Release"
          />
          <GameSelectButton
            name="Naughts and Crosses"
            description="Play with a friend or against the computer, try to get three in a row!"
            imageUrl="./gameIcons/naughtsAndCrosses.png"
            navigateTo="/maybCardGames/naughtsAndCrosses"
          />
          <GameSelectButton
            name="Snake"
            description="A classic game where you control a snake to eat food and grow"
            imageUrl="./gameIcons/snake.png"
            navigateTo="/maybCardGames/snake"
          />
        </div>
      </main>
    </div>
  );
}