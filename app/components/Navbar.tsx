import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";

const CATEGORIES = [
  {
    label: "Single Player Games",
    games: [
      { label: "O's & X's", to: "/maybCardGames/naughtsAndCrosses" },
      { label: "Snake", to: "/maybCardGames/snake" },
      { label: "Solitaire", to: "/maybCardGames/solitaire" },
      { label: "Blackjack", to: "/maybCardGames/blackjack" },
      { label: "Block Blast", to: "/maybCardGames/blockBlast" },
      { label: "Tetris", to: "/maybCardGames/tetris" },
      { label: "Battleships", to: "/maybCardGames/battleships" },
      { label: "Marty Crush", to: "/maybCardGames/martyCrush" },
    ],
  },
  {
    label: "Two Player Games",
    games: [
      { label: "O's & X's", to: "/maybCardGames/naughtsAndCrosses" },
      { label: "Battleships", to: "/maybCardGames/battleships" },
    ],
  },
  {
    label: "Card Games",
    games: [
      { label: "Solitaire", to: "/maybCardGames/solitaire" },
      { label: "Blackjack", to: "/maybCardGames/blackjack" },
    ],
  },
];

// Helper to sort games alphabetically by label
function getSortedGames(games: { label: string; to: string }[]) {
  return [...games].sort((a, b) => a.label.localeCompare(b.label));
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Track which category is open (for desktop hover or mobile tap)
  const [openCategory, setOpenCategory] = useState<string | null>(null);

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
        setOpenCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Helper: handle tap on mobile for category
  function handleCategoryClick(label: string) {
    if (window.innerWidth < 640) {
      setOpenCategory((prev) => (prev === label ? null : label));
    }
  }

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full h-16 bg-slate-800 text-white p-4 z-50
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
        {/* Desktop categories */}
        <ul className="hidden sm:flex space-x-6">
          {CATEGORIES.map((cat) => (
            <li
              key={cat.label}
              className="relative"
              onMouseEnter={() => setOpenCategory(cat.label)}
            >
              <button
                className="px-2 py-1 font-semibold hover:text-blue-300 transition-colors"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={openCategory === cat.label}
              >
                {cat.label}
              </button>
              {/* Dropdown */}
              <div
                className={`
                  absolute left-0 mt-2 w-40 rounded shadow-lg z-50
                  bg-slate-800 transition-all duration-200
                  ${openCategory === cat.label ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
                onMouseEnter={() => setOpenCategory(cat.label)}
                onMouseLeave={() => setOpenCategory(null)}
              >
                <ul className="flex flex-col">
                  {getSortedGames(cat.games).map((game) => (
                    <li key={game.label}>
                      <Link
                        to={game.to}
                        className="block px-4 py-2 hover:bg-slate-700"
                        viewTransition
                        onClick={() => setOpenCategory(null)}
                      >
                        {game.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        {/* Hamburger for mobile */}
        <div className="sm:hidden relative" ref={menuRef}>
          <button
            className="flex flex-col justify-center items-center w-8 h-8 relative"
            onClick={() => {
              setMenuOpen((open) => !open);
              setOpenCategory(null);
            }}
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
              absolute right-0 mt-2 w-48 rounded shadow-lg z-50
              transition-all duration-300 overflow-hidden
              bg-slate-800
              ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
            `}
          >
            <ul className="flex flex-col">
              {CATEGORIES.map((cat) => (
                <li key={cat.label} className="border-b border-slate-700 last:border-0">
                  <button
                    className="w-full text-left px-4 py-2 font-semibold hover:bg-slate-700"
                    onClick={() => handleCategoryClick(cat.label)}
                  >
                    {cat.label}
                  </button>
                  {/* Show games if this category is open */}
                  <div
                    className={`
                      transition-all duration-200
                      ${openCategory === cat.label ? "max-h-60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
                    `}
                  >
                    <ul>
                      {getSortedGames(cat.games).map((game) => (
                        <li key={game.label}>
                          <Link
                            to={game.to}
                            className="block px-6 py-2 text-sm hover:bg-slate-700"
                            viewTransition
                            onClick={() => {
                              setMenuOpen(false);
                              setOpenCategory(null);
                            }}
                          >
                            {game.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}