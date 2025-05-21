import React, { useState } from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Solitaire" },
    { name: "description", content: "A strategy card game played by one player" },
  ];
}

type Card = {
  suit: "♠" | "♥" | "♦" | "♣";
  value: string;
  faceUp: boolean;
};

type Pile = Card[];

function generateDeck(): Card[] {
  const suits: Card["suit"][] = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value, faceUp: false });
    }
  }
  return deck;
}

function shuffle(deck: Card[]): Card[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getCardColor(card: Card) {
  return card.suit === "♥" || card.suit === "♦" ? "text-red-500" : "text-black";
}

function canMoveToFoundation(card: Card, foundation: Pile) {
  if (foundation.length === 0) return card.value === "A";
  const top = foundation[foundation.length - 1];
  const order = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  return card.suit === top.suit && order.indexOf(card.value) === order.indexOf(top.value) + 1;
}

function canMoveToTableau(card: Card, pile: Pile) {
  if (pile.length === 0) {
    // Only allow Kings to be moved to empty tableau slots
    return card.value === "K";
  }
  const top = pile[pile.length - 1];
  const order = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const isOppositeColor =
    (card.suit === "♠" || card.suit === "♣") !== (top.suit === "♠" || top.suit === "♣");
  return (
    isOppositeColor &&
    order.indexOf(card.value) === order.indexOf(top.value) - 1 &&
    top.faceUp
  );
}

function getPilePosition(type: "tableau" | "foundation" | "waste", pile: number): { left: number; top: number } {
  const el = document.getElementById(`${type}-pile-${pile}`);
  console.log(el);
  if (!el) return { left: 0, top: 0 };
  const rect = el.getBoundingClientRect();
  const parentRect = document.getElementById("game-board")!.getBoundingClientRect();
  return {
    left: rect.left - parentRect.left,
    top: rect.top - parentRect.top,
  };
}

function getDestinationOffset(type: "tableau" | "foundation", pile: number, tableau: Pile[], foundation: Pile[]): number {
  if (type === "tableau") {
    return tableau[pile].length * 24;
  }
  // For foundation, cards are stacked with no offset
  return 0;
}

function MovingStackAnimation({
  cards,
  from,
  to,
  offset,
  destOffset,
}: {
  cards: Card[];
  from: { left: number; top: number };
  to: { left: number; top: number };
  offset: number;
  destOffset: number;
}) {
  const [pos, setPos] = React.useState<{ left: number; top: number }>({
    left: from.left,
    top: from.top + offset,
  });

  React.useEffect(() => {
    requestAnimationFrame(() => {
      setPos({
        left: to.left,
        top: to.top + destOffset,
      });
    });
  }, [to.left, to.top, destOffset]);

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: pos.left,
        top: pos.top,
        width: "3rem",
        height: `${(cards.length - 1) * 42 + 64}px`, // 64px is the card height (h-16)
        transition: "left 0.4s, top 0.4s",
        willChange: "left, top",
      }}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          className="w-12 h-16 rounded shadow-2xl absolute left-0"
          style={{ top: `${i * 24}px` }}
        >
          <div className={`w-12 h-16 rounded flex items-center justify-center ${card.faceUp
            ? `bg-white ${getCardColor(card)}`
            : "bg-blue-400 bg-[repeating-linear-gradient(135deg,#3b82f6_0_8px,#2563eb_8px_16px)]"
            }`}>
            {card.faceUp ? (
              <span className="font-bold text-lg flex items-center gap-0.5 select-none">
                {card.value}
                {card.suit}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Solitaire() {
  // State
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [tableau, setTableau] = useState<Pile[]>([]);
  const [foundation, setFoundation] = useState<Pile[]>([[], [], [], []]);
  const [selected, setSelected] = useState<{ pile: "waste" | "tableau" | "foundation"; index: number; cardIndex: number } | null>(null);

  // Animation state
  const [isFlipping, setIsFlipping] = useState(false);
  const [flippingCard, setFlippingCard] = useState<Card | null>(null);

  // Movement state
  const [isMoving, setIsMoving] = useState(false);
  const [movingCards, setMovingCards] = useState<Card[] | null>(null);
  const [moveFrom, setMoveFrom] = useState<{ type: "tableau" | "waste" | "foundation"; pile: number; cardIndex: number } | null>(null);
  const [moveTo, setMoveTo] = useState<{ type: "tableau" | "foundation"; pile: number } | null>(null);

  // Animation state for win
  const [isWin, setIsWin] = useState(false);
  const [waterfallCards, setWaterfallCards] = useState<Card[]>([]);
  const [waterfallIndex, setWaterfallIndex] = useState(0);

  // Info Window
  const [showInfo, setShowInfo] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  React.useEffect(() => {
    if (showInfo) {
      // Animate in after mount
      setTimeout(() => setInfoVisible(true), 10);
    } else {
      setInfoVisible(false);
    }
  }, [showInfo]);

  // Initial deal
  React.useEffect(() => {
    startNewGame();
    // eslint-disable-next-line
  }, []);

  // Detect win
  React.useEffect(() => {
    if (
      foundation.every(pile => pile.length === 13) &&
      tableau.every(pile => pile.length === 0) &&
      !isWin
    ) {
      // Gather all cards for waterfall
      const allCards: Card[] = [];
      foundation.forEach(pile => pile.forEach(card => allCards.push(card)));
      setIsWin(true);
      setWaterfallCards(allCards);
      setWaterfallIndex(0);
    }
  }, [foundation, tableau, isWin]);

  // Waterfall animation effect
  React.useEffect(() => {
    if (!isWin || waterfallIndex >= waterfallCards.length) return;
    const timeout = setTimeout(() => {
      setWaterfallIndex(i => i + 1);
    }, 80);
    return () => clearTimeout(timeout);
  }, [isWin, waterfallIndex, waterfallCards.length]);

  function startNewGame() {
    const deck = shuffle(generateDeck());
    const tableauInit: Pile[] = [];
    let deckIndex = 0;
    for (let i = 0; i < 7; i++) {
      const pile: Pile = [];
      for (let j = 0; j <= i; j++) {
        pile.push({ ...deck[deckIndex++], faceUp: j === i });
      }
      tableauInit.push(pile);
    }
    setStock(deck.slice(deckIndex));
    setWaste([]);
    setTableau(tableauInit);
    setFoundation([[], [], [], []]);
    setSelected(null);
  }

  function drawFromStock() {
    if (stock.length === 0) {
      setStock(waste.map(card => ({ ...card, faceUp: false })).reverse());
      setWaste([]);
      return;
    }
    const drawn = stock[stock.length - 1];
    setFlippingCard({ ...drawn, faceUp: false });
    setIsFlipping(true);
    // Delay moving the card to waste until after animation
    setTimeout(() => {
      setStock(prev => prev.slice(0, -1));
      setWaste(prev => [...prev, { ...drawn, faceUp: true }]);
      setIsFlipping(false);
      setFlippingCard(null);
    }, 400); // Animation duration (ms)
  }

  function handleCardClick(pileType: "waste" | "tableau", pileIndex: number, cardIndex: number) {
    if (pileType === "waste") {
      // If already selected, deselect
      if (
        selected &&
        selected.pile === "waste" &&
        selected.index === pileIndex &&
        selected.cardIndex === cardIndex
      ) {
        setSelected(null);
        return;
      }
      setSelected({ pile: "waste", index: pileIndex, cardIndex });
      return;
    }
    if (pileType === "tableau") {
      const card = tableau[pileIndex]?.[cardIndex];
      // If the pile is empty, card will be undefined
      if (!card) {
        // Only allow moving a King to an empty tableau slot
        if (
          selected &&
          (
            (selected.pile === "waste" && waste.length > 0 && waste[waste.length - 1].value === "K") ||
            (selected.pile === "tableau" && tableau[selected.index][selected.cardIndex]?.value === "K")
          )
        ) {
          // Move the King
          const from = selected;
          const movingCards =
            from.pile === "waste"
              ? [waste[waste.length - 1]]
              : tableau[from.index].slice(from.cardIndex);
          if (movingCards[0].value === "K") {
            if (from.pile === "waste") {
              setWaste(waste.slice(0, -1));
            } else {
              // Flip the card underneath if needed
              setTableau(prevTableau => {
                const newTableau = prevTableau.map((p, i) =>
                  i === from.index ? p.slice(0, from.cardIndex) : p
                );
                // Check if we need to flip the new top card
                if (from.pile === "tableau" && newTableau[from.index].length > 0) {
                  const lastIdx = newTableau[from.index].length - 1;
                  if (!newTableau[from.index][lastIdx].faceUp) {
                    newTableau[from.index][lastIdx] = {
                      ...newTableau[from.index][lastIdx],
                      faceUp: true,
                    };
                  }
                }
                return newTableau;
              });
            }
            setTableau(t =>
              t.map((p, i) => (i === pileIndex ? [...p, ...movingCards] : p))
            );
            setSelected(null);
          }
        }
        return;
      }
      if (!card.faceUp) {
        // Flip card if it's the top face-down card
        if (cardIndex === tableau[pileIndex].length - 1) {
          const newTableau = tableau.map((p, i) =>
            i === pileIndex
              ? p.map((c, j) => (j === cardIndex ? { ...c, faceUp: true } : c))
              : p
          );
          setTableau(newTableau);
        }
        return;
      }
    }
    if (selected) {
      if (pileType === "tableau") {
        const from = selected;
        if (from.pile === "tableau" && from.index === pileIndex) {
          setSelected(null);
          return;
        }
        let movingCards: Card[] = [];
        if (from.pile === "waste") {
          movingCards = [waste[waste.length - 1]];
        } else if (from.pile === "tableau") {
          movingCards = tableau[from.index].slice(from.cardIndex);
        } else if (from.pile === "foundation") {
          movingCards = [foundation[from.index][foundation[from.index].length - 1]];
        }
        if (canMoveToTableau(movingCards[0], tableau[pileIndex])) {
          // Remove moving cards from the source pile immediately
          if (from.pile === "tableau") {
            setTableau(prevTableau => {
              const newTableau = prevTableau.map((p, i) =>
                i === from.index ? p.slice(0, from.cardIndex) : p
              );
              // Flip the new top card if needed
              if (newTableau[from.index].length > 0) {
                const lastIdx = newTableau[from.index].length - 1;
                if (!newTableau[from.index][lastIdx].faceUp) {
                  newTableau[from.index][lastIdx] = {
                    ...newTableau[from.index][lastIdx],
                    faceUp: true,
                  };
                }
              }
              return newTableau;
            });
          } else if (from.pile === "waste") {
            setWaste(waste.slice(0, -1));
          } else if (from.pile === "foundation") {
            setFoundation(prevFoundation =>
              prevFoundation.map((p, i) =>
                i === from.index ? p.slice(0, -1) : p
              )
            );
          }

          // Start animation
          setIsMoving(true);
          setMovingCards(movingCards);
          setMoveFrom({
            type: from.pile,
            pile: from.index,
            cardIndex:
              from.pile === "tableau"
                ? from.cardIndex
                : from.pile === "waste"
                ? waste.length - 1
                : foundation[from.index].length - 1,
          });
          setMoveTo({ type: "tableau", pile: pileIndex });

          setTimeout(() => {
            setTableau(t =>
              t.map((p, i) => (i === pileIndex ? [...p, ...movingCards] : p))
            );
            setSelected(null);
            setIsMoving(false);
            setMovingCards(null);
            setMoveFrom(null);
            setMoveTo(null);
          }, 400);
          return;
        }
      }
    } else {
      setSelected({ pile: pileType, index: pileIndex, cardIndex });
    }
  }

  function handleFoundationClick(foundationIndex: number) {
    if (!selected) return;
    let movingCard: Card | null = null;
    let fromTableauIndex: number | null = null;
    if (selected.pile === "waste") {
      movingCard = waste[waste.length - 1];
    } else if (selected.pile === "tableau") {
      const pile = tableau[selected.index];
      if (pile.length - 1 !== selected.cardIndex) return; // Only top card can move to foundation
      movingCard = pile[selected.cardIndex];
      fromTableauIndex = selected.index;
    }
    if (movingCard && canMoveToFoundation(movingCard, foundation[foundationIndex])) {
      // Remove from source immediately
      if (selected.pile === "waste") {
        setWaste(waste.slice(0, -1));
      } else if (selected.pile === "tableau") {
        setTableau(prevTableau => {
          const newTableau = prevTableau.map((p, i) =>
            i === selected.index ? p.slice(0, -1) : p
          );
          const pile = newTableau[selected.index];
          if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
            pile[pile.length - 1] = {
              ...pile[pile.length - 1],
              faceUp: true,
            };
          }
          return newTableau;
        });
      }

      // Start animation
      setIsMoving(true);
      setMovingCards([movingCard]);
      setMoveFrom({
        type: selected.pile,
        pile: selected.pile === "tableau" ? selected.index : 0,
        cardIndex: selected.pile === "tableau" ? selected.cardIndex : waste.length - 1,
      });
      setMoveTo({ type: "foundation", pile: foundationIndex });

      setTimeout(() => {
        setFoundation(f =>
          f.map((pile, i) =>
            i === foundationIndex ? [...pile, { ...movingCard!, faceUp: true }] : pile
          )
        );
        setSelected(null);
        setIsMoving(false);
        setMovingCards(null);
        setMoveFrom(null);
        setMoveTo(null);
      }, 400);
    }
  }

  // Waterfall animation component
  function Waterfall() {
    if (!isWin) return null;

    // Calculate starting positions for each foundation pile
    const foundationPositions = [0, 1, 2, 3].map(i => {
      const el = typeof window !== "undefined" ? document.getElementById(`foundation-pile-${i}`) : null;
      if (!el) return { left: window.innerWidth / 2, top: window.innerHeight / 2 };
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2,
      };
    });

    // Get the parent board position for absolute offset
    const boardEl = typeof window !== "undefined" ? document.getElementById("game-board") : null;
    const boardRect = boardEl ? boardEl.getBoundingClientRect() : { left: 0, top: 0 };

    // Group cards by foundation pile
    let pileIdx = 0;
    const pileCards = [[], [], [], []] as Card[][];
    for (let i = 0; i < waterfallCards.length; ++i) {
      pileCards[pileIdx].push(waterfallCards[i]);
      pileIdx = (pileIdx + 1) % 4;
    }

    // Flatten for animation order, but keep track of which pile and which card in pile
    const animCards: { card: Card; pile: number; idx: number }[] = [];
    for (let p = 0; p < 4; ++p) {
      for (let i = 0; i < pileCards[p].length; ++i) {
        animCards.push({ card: pileCards[p][i], pile: p, idx: i });
      }
    }

    return (
      <div className="pointer-events-none fixed inset-0 z-50">
        {animCards.slice(0, waterfallIndex).map(({ card, pile, idx }, i) => {
          const pos = foundationPositions[pile];
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: pos.left - boardRect.left - 24, // 24 = half card width
                top: pos.top - boardRect.top - 32 + idx * 12, // 32 = half card height, stagger down
                transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (5 + (i % 4))}deg)`,
                zIndex: 1000 + i,
                transition: "transform 0.3s, top 0.3s, left 0.3s",
              }}
            >
              <div className={`w-12 h-16 rounded shadow-2xl flex items-center justify-center bg-white ${getCardColor(card)}`}>
                <span className="font-bold text-lg flex items-center gap-0.5 select-none">
                  {card.value}
                  {card.suit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // UI
  return (
    <div className="flex flex-col items-center min-h-screen pt-16 px-2 sm:px-0">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 sm:p-5 text-center">Solitaire</h1>
        <div id="game-board" className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video bg-slate-600 flex flex-col justify-between rounded-2xl p-2 sm:p-4 text-white relative overflow-x-auto">
          {/* Top Row: Stock, Waste, Foundations */}
          <div className="flex justify-between mb-4 relative">
            {/* Flipping Card Animation */}
            {isFlipping && flippingCard && (
              <div
                className="absolute z-50"
                style={{
                  width: "3rem",
                  height: "4rem",
                  left: "0rem", // Stock position
                  top: "0rem",
                  pointerEvents: "none",
                  // Slide to the right (adjust 56px if your gap/width changes)
                  transform: "translateX(56px)", // 56px = 3rem (stock) + 0.5rem (gap)
                  animation: "slide-flip 0.4s forwards",
                }}
              >
                <div className="flip-card w-12 h-16">
                  <div className="flip-card-inner animate-flip">
                    <div className="flip-card-front w-12 h-16 rounded bg-blue-400 bg-[repeating-linear-gradient(135deg,#3b82f6_0_8px,#2563eb_8px_16px)] shadow-md flex items-center justify-center" />
                    <div className="flip-card-back w-12 h-16 rounded bg-white shadow-md flex items-center justify-center">
                      <span className={getCardColor(flippingCard)}>
                        {flippingCard.value}
                        {flippingCard.suit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Stock and Waste */}
            <div className="flex gap-2">
              <button
                className={`w-12 h-16 rounded shadow-md flex items-center justify-center ${
                  stock.length > 0
                    ? "bg-blue-400 bg-[repeating-linear-gradient(135deg,#3b82f6_0_8px,#2563eb_8px_16px)]"
                    : "bg-blue-200"
                }`}
                onClick={drawFromStock}
                disabled={stock.length === 0 && waste.length === 0 || isFlipping}
                title="Draw from stock"
              >
                {stock.length > 0 ? "🂠" : "↺"}
              </button>
              {/* Waste: show nothing if no card has been drawn yet, but keep the space */}
              <div
                className={`w-12 h-16 rounded flex items-center justify-center select-none transition-all duration-150 ${
                  waste.length > 0
                    ? `bg-white shadow-md ${selected?.pile === "waste" ? "ring-4 ring-blue-400 transition-all duration-150" : ""}`
                    : "bg-gradient-to-br from-slate-300 to-blue-200 shadow-inner border-2 border-dashed border-blue-400"
                }`}
                onClick={() =>
                  waste.length > 0 && handleCardClick("waste", 0, waste.length - 1)
                }
                title="Waste"
                style={{ minWidth: "3rem" }}
                id="waste-pile-0"
              >
                {waste.length > 0 ? (
                  <span className={getCardColor(waste[waste.length - 1])}>
                    {waste[waste.length - 1].value}
                    {waste[waste.length - 1].suit}
                  </span>
                ) : null}
              </div>
            </div>
            {/* Foundations */}
            <div className="flex gap-2">
              {foundation.map((pile, i) => {
                const isSelected =
                  selected &&
                  selected.pile === "foundation" &&
                  selected.index === i &&
                  selected.cardIndex === pile.length - 1;
                return (
                  <div
                    key={i}
                    id={`foundation-pile-${i}`}
                    className={`w-12 h-16 bg-white rounded shadow-md flex items-center justify-center cursor-pointer select-none ${
                      isSelected ? "ring-4 ring-blue-400 transition-all duration-150" : ""
                    } ${selected ? "hover:ring-2 hover:ring-yellow-400" : ""}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelected(null);
                      } else if (selected) {
                        handleFoundationClick(i);
                      } else if (pile.length > 0) {
                        setSelected({ pile: "foundation", index: i, cardIndex: pile.length - 1 });
                      }
                    }}
                    title="Foundation"
                  >
                    {pile.length > 0 ? (
                      <span className={getCardColor(pile[pile.length - 1])}>
                        {pile[pile.length - 1].value}
                        {pile[pile.length - 1].suit}
                      </span>
                    ) : (
                      <span className="text-gray-400">A</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Tableau */}
          <div className="flex gap-2 justify-center items-start">
            {tableau.map((pile, pileIdx) => (
              <div key={pileIdx} id={`tableau-pile-${pileIdx}`} className="flex flex-col items-center min-w-[3rem]">
                {pile.length === 0 ? (
                  <div
                    className={`w-12 h-16 bg-slate-400 rounded mb-1 cursor-pointer border-2 border-dashed border-blue-400 hover:border-blue-600 transition`}
                    onClick={() => {
                      // Only allow moving if a selection exists and it's a King
                      if (
                        selected &&
                        (
                          (selected.pile === "waste" && waste.length > 0 && waste[waste.length - 1].value === "K") ||
                          (selected.pile === "tableau" && tableau[selected.index][selected.cardIndex]?.value === "K")
                        )
                      ) {
                        handleCardClick("tableau", pileIdx, 0);
                      }
                    }}
                    title="Move King here"
                  />
                ) : (
                  // Render the pile so the first card is at the top and the last (topmost) card is at the bottom
                  [...pile].map((card, cardIdx) => {
                    const isTopCard = cardIdx === pile.length - 1;
                    // Highlight cards above the selected card in the same tableau pile
                    const isHighlighted =
                      selected &&
                      selected.pile === "tableau" &&
                      selected.index === pileIdx &&
                      cardIdx > selected.cardIndex;
                    return (
                      <div
                        key={cardIdx}
                        className={`w-12 h-16 rounded shadow-2xl border-1 flex items-center justify-center ${cardIdx !== 0 ? "mt-[-42px]" : ""} relative z-[${cardIdx}] ${
                          card.faceUp
                            ? `bg-white cursor-pointer ${getCardColor(card)} ${
                                selected &&
                                selected.pile === "tableau" &&
                                selected.index === pileIdx &&
                                selected.cardIndex === cardIdx
                                  ? "ring-4 ring-blue-400 transition-all duration-150"
                                  : ""
                              } ${isHighlighted ? "ring-4 ring-yellow-400 transition-all duration-200" : ""}`
                            : "bg-blue-400 bg-[repeating-linear-gradient(135deg,#3b82f6_0_8px,#2563eb_8px_16px)]"
                        }`}
                        onClick={() =>
                          card.faceUp && handleCardClick("tableau", pileIdx, cardIdx)
                        }
                      >
                        {card.faceUp ? (
                          isTopCard ? (
                            <span className="font-bold text-lg flex items-center gap-0.5 select-none">
                              {card.value}
                              {card.suit}
                            </span>
                          ) : (
                            <span className="absolute top-1 left-1 text-xs font-bold flex items-center gap-0.5 pointer-events-none select-none">
                              {card.value}
                              {card.suit}
                            </span>
                          )
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            ))}
          </div>
          {isMoving && movingCards && moveFrom && moveTo && (
            <MovingStackAnimation
              cards={movingCards}
              from={
                moveFrom.type === "tableau"
                  ? getPilePosition("tableau", moveFrom.pile)
                  : moveFrom.type === "waste"
                  ? getPilePosition("waste", 0)
                  : getPilePosition("foundation", moveFrom.pile)
              }
              to={getPilePosition(moveTo.type, moveTo.pile)}
              offset={moveFrom.type === "tableau" ? moveFrom.cardIndex * 42 : 0}
              destOffset={getDestinationOffset(moveTo.type, moveTo.pile, tableau, foundation)}
            />
          )}
          {/* Controls */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition duration-300"
              onClick={() => {
                setIsWin(false);
                setWaterfallCards([]);
                setWaterfallIndex(0);
                startNewGame();
              }}
            >
              New Game
            </button>
          </div>
          {/* Waterfall animation overlay */}
          {isWin && <Waterfall />}
        </div>
      </div>
      {/* Info Button */}
      <button
        className="fixed sm:absolute bottom-6 right-6 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-blue-600 transition z-50"
        style={{ lineHeight: 1 }}
        aria-label="How to play"
        onClick={() => setShowInfo(true)}
      >
        ?
      </button>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300">
          <div
            className={`
              bg-white text-black rounded-xl shadow-2xl p-6 max-w-md w-full relative
              transform transition-all duration-300
              ${infoVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}
            `}
            style={{ transitionProperty: "transform, opacity" }}
          >
            <button
              className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700"
              aria-label="Close"
              onClick={() => {
                setInfoVisible(false);
                setTimeout(() => setShowInfo(false), 300); // match duration-300
              }}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">How to Play Solitaire</h2>
            <ul className="list-disc pl-5 space-y-1 text-base">
              <li>Move cards to build up four foundation piles by suit from Ace to King.</li>
              <li>Cards in the tableau must be placed in descending order and alternating colors.</li>
              <li>Only Kings can be moved to empty tableau spaces.</li>
              <li>Click the stock to draw cards to the waste pile.</li>
              <li>You can move cards from the waste, tableau, or foundation if the move is valid.</li>
              <li>To win, move all cards to the foundation piles.</li>
            </ul>
            <div className="mt-4 text-right">
              <button
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                onClick={() => {
                  setInfoVisible(false);
                  setTimeout(() => setShowInfo(false), 300); // match duration-300
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}