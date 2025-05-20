import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Animate navbar on mount
  useEffect(() => {
    setMounted(true);
  }, []);

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
    <nav
      className={`
        md:fixed md:top-0 md:left-0 w-full h-16 bg-slate-800 text-white p-4 z-50
        transition-all duration-500 ease-out
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}
      `}
      style={{ willChange: "opacity, transform" }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/maybCardGames/"
          className="text-lg font-bold hover:animate-wiggle"
          viewTransition
        >
          maybGames
        </Link>
        {/* Desktop links */}
        <ul className="hidden sm:flex space-x-4">
          <li>
            <Link
              to="/maybCardGames/solitaire"
              className="relative px-2 py-1 font-medium text-white transition-colors duration-300
                hover:text-blue-300
                after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-500 after:rounded-full
                hover:after:w-full after:transition-all after:duration-300
                hover:animate-bounce-short"
              viewTransition
            >
              Solitaire
            </Link>
          </li>
          <li>
            <Link
              to="/maybCardGames/blackjack"
              className="relative px-2 py-1 font-medium text-white transition-colors duration-300
                hover:text-blue-300
                after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-500 after:rounded-full
                hover:after:w-full after:transition-all after:duration-300
                hover:animate-bounce-short"
              viewTransition
            >
              Blackjack
            </Link>
          </li>
          <li>
            <Link
              to="/maybCardGames/naughtsAndCrosses"
              className="relative px-2 py-1 font-medium text-white transition-colors duration-300
                hover:text-blue-300
                after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-500 after:rounded-full
                hover:after:w-full after:transition-all after:duration-300
                hover:animate-bounce-short"
              viewTransition
            >
              O's & X's
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

              <li>
                <Link
                  to="/maybCardGames/naughtsAndCrosses"
                  className="block px-4 py-2 hover:bg-slate-700"
                  viewTransition
                  onClick={() => setMenuOpen(false)}
                >
                  O's & X's
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}