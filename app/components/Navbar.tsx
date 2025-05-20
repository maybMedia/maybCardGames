import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <nav className="md:fixed md:top-0 md:left-0 w-full h-16 bg-slate-800 text-white p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/maybCardGames/" className="text-lg font-bold" viewTransition>
          maybCardGames
        </Link>
        {/* Desktop links */}
        <ul className="hidden sm:flex space-x-4">
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
        </ul>
        {/* Hamburger for mobile */}
        <div className="sm:hidden relative" ref={menuRef}>
          <button
            className="flex flex-col justify-center items-center w-8 h-8 relative"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {/* Hamburger/X icon */}
            <span
              className={`
                block w-6 h-0.5 bg-white mb-1 transition-all duration-300
                absolute
                ${menuOpen ? "rotate-45 top-3.5" : "rotate-0 top-2"}
              `}
              style={{ left: 4 }}
            ></span>
            <span
              className={`
                block w-6 h-0.5 bg-white mb-1 transition-all duration-300
                absolute
                ${menuOpen ? "opacity-0" : "opacity-100 top-3.5"}
              `}
              style={{ left: 4 }}
            ></span>
            <span
              className={`
                block w-6 h-0.5 bg-white transition-all duration-300
                absolute
                ${menuOpen ? "-rotate-45 top-3.5" : "rotate-0 top-5"}
              `}
              style={{ left: 4 }}
            ></span>
          </button>
          <div
            className={`
              absolute right-0 mt-2 w-40 rounded shadow-lg z-50
              transition-all duration-300 overflow-hidden
              bg-slate-800
              ${menuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
            `}
          >
            <ul className="flex flex-col">
              <li>
                <Link
                  to="/maybCardGames/solitaire"
                  className="block px-4 py-2 hover:bg-slate-700"
                  viewTransition
                  onClick={() => setMenuOpen(false)}
                >
                  Solitaire
                </Link>
              </li>
              <li>
                <Link
                  to="/maybCardGames/blackjack"
                  className="block px-4 py-2 hover:bg-slate-700"
                  viewTransition
                  onClick={() => setMenuOpen(false)}
                >
                  Blackjack
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}