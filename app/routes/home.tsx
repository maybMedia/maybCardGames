import GameSelectButton from "~/components/GameSelectButton";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the app!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen pt-26">
      <h1 className="text-2xl font-bold">Select your game!</h1>
      <div className="flex flex-row gap-1">
        <GameSelectButton 
          name="Solitaire" 
          description="A strategy card game played by one player" 
          imageUrl="/solitaire.png"
          navigateTo="/solitaire"/>
        <GameSelectButton 
          name="Blackjack" 
          description="A game where you aim to get as close to 21 as possible" 
          imageUrl="/blackjack.png"
          navigateTo="/blackjack"/>
      </div>
    </div>
  );
}
