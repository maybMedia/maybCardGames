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
	const hideTimeout = useRef<NodeJS.Timeout | null>(null);

	// Animate navbar on mount
	useEffect(() => {
		setMounted(true);
	}, []);

	// Close menu when clicking outside
	useEffect(() => {
		if (!menuOpen) return;
		function handleClick(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

	// Helper: handle mouse enter/leave with delay for dropdowns
	function handleMouseEnter(label: string) {
		if (hideTimeout.current) {
			clearTimeout(hideTimeout.current);
			hideTimeout.current = null;
		}
		setOpenCategory(label);
	}

	function handleMouseLeave() {
		if (hideTimeout.current) clearTimeout(hideTimeout.current);
		hideTimeout.current = setTimeout(() => {
			setOpenCategory(null);
		}, 200); // 200ms delay before hiding
	}

	return (
		<nav
			className={`
        fixed top-0 left-1/2 z-50
        transition-all duration-500 ease-out
        bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-200
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}
        rounded-b-2xl
        w-[98vw] max-w-3xl
        -translate-x-1/2
        h-16
      `}
			style={{ willChange: "opacity, transform" }}
		>
			<div className="flex justify-between items-center h-full px-2 sm:px-6 w-full">
				<Link
					to="/maybCardGames/"
					className="flex items-center gap-2 text-xl font-extrabold text-blue-800 tracking-tight hover:animate-wiggle"
					viewTransition
				>
					<img
						src="./icon.png"
						alt="maybGames logo"
						className="w-8 h-8 rounded-full shadow"
					/>
					<span>maybGames</span>
				</Link>
				{/* Desktop categories */}
				<ul className="hidden sm:flex space-x-6">
					{CATEGORIES.map((cat) => (
						<li
							key={cat.label}
							className="relative"
							onMouseEnter={() => handleMouseEnter(cat.label)}
							onMouseLeave={handleMouseLeave}
						>
							<button
								className="px-3 py-1 font-semibold rounded-lg hover:bg-blue-100 hover:text-blue-700 text-blue-800 transition-colors"
								tabIndex={0}
								aria-haspopup="true"
								aria-expanded={openCategory === cat.label}
							>
								{cat.label}
							</button>
							{/* Dropdown */}
							<div
								className={`
                  absolute left-0 mt-2 w-48 rounded-xl shadow-xl z-50
                  bg-white/95 border border-blue-200 transition-all duration-200
                  ${
                  	openCategory === cat.label
                  		? "opacity-100 pointer-events-auto scale-100"
                  		: "opacity-0 pointer-events-none scale-95"
                  }
                `}
								style={{ minWidth: 180 }}
								onMouseEnter={() => handleMouseEnter(cat.label)}
								onMouseLeave={handleMouseLeave}
							>
								<ul className="flex flex-col py-2 items-center">
									{getSortedGames(cat.games).map((game) => (
										<li key={game.label}>
											<Link
												to={game.to}
												className="block px-4 py-2 rounded-lg text-blue-800 hover:bg-blue-100 hover:text-blue-700 transition-colors"
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
				<div className="sm:hidden relative flex items-center" ref={menuRef}>
					<button
						className="flex justify-center items-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 transition relative"
						onClick={() => {
							setMenuOpen((open) => !open);
							setOpenCategory(null);
						}}
						aria-label="Toggle menu"
						style={{ padding: 0 }}
					>
						{/* Hamburger/X icon */}
						<span
							className={`
                absolute left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-800 transition-all duration-300
                ${menuOpen ? "rotate-45 top-5" : "rotate-0 top-3"}
              `}
						></span>
						<span
							className={`
                absolute left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-800 transition-all duration-300
                ${menuOpen ? "opacity-0" : "opacity-100 top-5"}
              `}
						></span>
						<span
							className={`
                absolute left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-800 transition-all duration-300
                ${menuOpen ? "-rotate-45 top-5" : "rotate-0 top-7"}
              `}
						></span>
					</button>
					<div
						className={`
              absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl z-50
              transition-all duration-300 overflow-hidden
              bg-white/95 border border-blue-200
              ${
              	menuOpen
              		? "max-h-96 opacity-100 scale-100"
              		: "max-h-0 opacity-0 scale-95 pointer-events-none"
              }
            `}
					>
						<ul className="flex flex-col py-2">
							{CATEGORIES.map((cat) => (
								<li
									key={cat.label}
									className="border-b border-blue-100 last:border-0"
								>
									<button
										className="w-full text-left px-4 py-2 font-semibold rounded-lg hover:bg-blue-100 hover:text-blue-700 text-blue-800 transition-colors"
										onClick={() => handleCategoryClick(cat.label)}
									>
										{cat.label}
									</button>
									{/* Show games if this category is open */}
									<div
										className={`
                      transition-all duration-200
                      ${
                      	openCategory === cat.label
                      		? "max-h-60 opacity-100"
                      		: "max-h-0 opacity-0 overflow-hidden"
                      }
                    `}
									>
										<ul>
											{getSortedGames(cat.games).map((game) => (
												<li key={game.label}>
													<Link
														to={game.to}
														className="block px-6 py-2 text-sm rounded-lg text-blue-800 hover:bg-blue-100 hover:text-blue-700 transition-colors"
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