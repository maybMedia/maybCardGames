import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-slate-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">
          maybCardGames
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/solitaire" className="hover:underline">
              Solitaire
            </Link>
          </li>
          <li>
            <Link to="/blackjack" className="hover:underline">
              Blackjack
            </Link>
          </li>
          <li>
            <Link to="/" className="hover:underline">
              More...
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}