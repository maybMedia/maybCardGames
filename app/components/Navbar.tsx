import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-slate-800 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <Link to="/maybCardGames/" className="text-lg font-bold mb-2 sm:mb-0" viewTransition>
          maybCardGames
        </Link>
        <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
          <li>
            <Link to="/maybCardGames/solitaire" className="hover:underline" viewTransition>
              Solitaire
            </Link>
          </li>
          <li>
            <Link to="/maybCardGames/blackjack" className="hover:underline" viewTransition>
              Blackjack
            </Link>
          </li>
          <li>
            <Link to="/maybCardGames/" className="hover:underline" viewTransition>
              More...
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}