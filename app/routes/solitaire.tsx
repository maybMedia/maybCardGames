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

export default function Solitaire() {
  // State
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [tableau, setTableau] = useState<Pile[]>([]);
  const [foundation, setFoundation] = useState<Pile[]>([[], [], [], []]);
  const [selected, setSelected] = useState<{ pile: "waste" | "tableau"; index: number; cardIndex: number } | null>(null);

  // Initial deal
  React.useEffect(() => {
    startNewGame();
    // eslint-disable-next-line
  }, []);

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
    setStock(stock.slice(0, -1));
    setWaste([...waste, { ...drawn, faceUp: true }]);
  }

  function handleCardClick(pileType: "waste" | "tableau", pileIndex: number, cardIndex: number) {
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
      // Try to move selected card(s) to this pile
      if (pileType === "tableau") {
        const from = selected;
        if (from.pile === "tableau" && from.index === pileIndex) {
          setSelected(null);
          return;
        }
        const movingCards =
          from.pile === "waste"
            ? [waste[waste.length - 1]]
            : tableau[from.index].slice(from.cardIndex);
        if (canMoveToTableau(movingCards[0], tableau[pileIndex])) {
          // Move cards
          if (from.pile === "waste") {
            setWaste(waste.slice(0, -1));
          } else {
            // Flip the card underneath if needed
            setTableau(prevTableau => {
              const newTableau = prevTableau.map((p, i) =>
                i === from.index ? p.slice(0, from.cardIndex) : p
              );
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
    } else {
      setSelected({ pile: pileType, index: pileIndex, cardIndex });
    }
  }

  function handleFoundationClick(foundationIndex: number) {
    if (!selected) return;
    let movingCard: Card | null = null;
    if (selected.pile === "waste") {
      movingCard = waste[waste.length - 1];
    } else if (selected.pile === "tableau") {
      const pile = tableau[selected.index];
      if (pile.length - 1 !== selected.cardIndex) return; // Only top card can move to foundation
      movingCard = pile[selected.cardIndex];
    }
    if (movingCard && canMoveToFoundation(movingCard, foundation[foundationIndex])) {
      if (selected.pile === "waste") {
        setWaste(waste.slice(0, -1));
      } else if (selected.pile === "tableau") {
        setTableau(tableau.map((p, i) =>
          i === selected.index ? p.slice(0, -1) : p
        ));
      }
      setFoundation(f =>
        f.map((pile, i) =>
          i === foundationIndex ? [...pile, { ...movingCard!, faceUp: true }] : pile
        )
      );
      setSelected(null);
    }
  }

  // UI
  return (
    <div className="flex flex-col items-center min-h-screen pt-16 px-2 sm:px-0">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 sm:p-5 text-center">Solitaire</h1>
        <h1 className="text-3xl font-bold p-2 text-red-500 text-center">Work In Progress</h1>
        <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video bg-slate-600 flex flex-col justify-between rounded-2xl p-2 sm:p-4 text-white relative overflow-x-auto">
          {/* Top Row: Stock, Waste, Foundations */}
          <div className="flex justify-between mb-4">
            {/* Stock and Waste */}
            <div className="flex gap-2">
              <button
                className={`w-12 h-16 rounded shadow-md flex items-center justify-center ${
                  stock.length > 0
                    ? "bg-blue-400 bg-[repeating-linear-gradient(135deg,#3b82f6_0_8px,#2563eb_8px_16px)]"
                    : "bg-blue-200"
                }`}
                onClick={drawFromStock}
                disabled={stock.length === 0 && waste.length === 0}
                title="Draw from stock"
              >
                {stock.length > 0 ? "🂠" : "↺"}
              </button>
              <div
                className={`w-12 h-16 bg-white rounded shadow-md flex items-center justify-center ${
                  selected?.pile === "waste" ? "ring-4 ring-blue-400" : ""
                }`}
                onClick={() =>
                  waste.length > 0 && handleCardClick("waste", 0, waste.length - 1)
                }
                title="Waste"
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
              {foundation.map((pile, i) => (
                <div
                  key={i}
                  className={`w-12 h-16 bg-white rounded shadow-md flex items-center justify-center cursor-pointer ${
                    selected ? "hover:ring-2 hover:ring-yellow-400" : ""
                  }`}
                  onClick={() => handleFoundationClick(i)}
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
              ))}
            </div>
          </div>
          {/* Tableau */}
          <div className="flex gap-2 justify-center items-start">
            {tableau.map((pile, pileIdx) => (
              <div key={pileIdx} className="flex flex-col items-center min-w-[3rem]">
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
                  pile.map((card, cardIdx) => (
                    <div
                      key={cardIdx}
                      className={`w-12 h-16 rounded shadow-md flex items-center justify-center mb-[-2.2rem] relative z-[${cardIdx}] ${
                        card.faceUp
                          ? `bg-white cursor-pointer ${getCardColor(card)} ${
                              selected &&
                              selected.pile === "tableau" &&
                              selected.index === pileIdx &&
                              selected.cardIndex === cardIdx
                                ? "ring-4 ring-blue-400"
                                : ""
                            }`
                          : "bg-blue-400 bg-[repeating-linear-gradient(135deg,#3b82f6_0_8px,#2563eb_8px_16px)]"
                      }`}
                      style={{ marginTop: cardIdx === 0 ? 0 : -48 }}
                      onClick={() =>
                        card.faceUp && handleCardClick("tableau", pileIdx, cardIdx)
                      }
                    >
                      {card.faceUp ? (
                        <>
                          {card.value}
                          {card.suit}
                        </>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
          {/* Controls */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition duration-300"
              onClick={startNewGame}
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}