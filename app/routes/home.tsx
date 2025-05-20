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
    <div className="flex flex-col items-center h-screen sm:pt-26 pt-6">
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
          name="Solitaire" 
          description="A strategy card game played by one player" 
          imageUrl="./solitaire.png"
          navigateTo="/maybCardGames/solitaire"/>
        <GameSelectButton 
          name="Blackjack" 
          description="A game where you aim to get as close to 21 as possible" 
          imageUrl="./blackjack.png"
          navigateTo="/maybCardGames/blackjack"/>
        <GameSelectButton 
          name="Naughts and Crosses" 
          description="Play with a friend or against the computer, try to get three in a row!" 
          imageUrl="./naughtsAndCrosses.png"
          navigateTo="/maybCardGames/naughtsAndCrosses"/>
      </div>
    </div>
  );
}
