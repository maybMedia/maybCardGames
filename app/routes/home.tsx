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
    <div className="flex flex-col items-center min-h-full pt-6 pb-8 px-4">
      <h1 className="text-2xl font-bold">Select your game!</h1>
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-4
          justify-items-center
          w-full
          max-w-3xl
          mt-4
        "
      >
        <GameSelectButton 
          name="Block Blast"
          description="A puzzle game where you create rows of blocks to clear them" 
          imageUrl="./gameIcons/blockBlast.png"
          navigateTo="/maybCardGames/blockBlast"
          banner="Fan Favourite"/>
        <GameSelectButton 
          name="Solitaire" 
          description="A strategy card game played by one player" 
          imageUrl="./gameIcons/solitaire.png"
          navigateTo="/maybCardGames/solitaire"/>
        <GameSelectButton 
          name="Blackjack" 
          description="A game where you aim to get as close to 21 as possible" 
          imageUrl="./gameIcons/blackjack.png"
          navigateTo="/maybCardGames/blackjack"/>
        <GameSelectButton 
          name="Tetris" 
          description="A classic block game. Fit the blocks in the grid and clear rows!" 
          imageUrl="./gameIcons/tetris.png"
          navigateTo="/maybCardGames/tetris"
          banner="Newest Release"/>
        <GameSelectButton 
          name="Naughts and Crosses" 
          description="Play with a friend or against the computer, try to get three in a row!" 
          imageUrl="./gameIcons/naughtsAndCrosses.png"
          navigateTo="/maybCardGames/naughtsAndCrosses"/>
        <GameSelectButton 
          name="Snake" 
          description="A classic game where you control a snake to eat food and grow" 
          imageUrl="./gameIcons/snake.png"
          navigateTo="/maybCardGames/snake"/>
      </div>
    </div>
  );
}