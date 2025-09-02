import React, { useState } from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blackjack" },
    { name: "description", content: "A game where you aim to get as close to 21 as possible" },
  ];
}

export default function Blackjack() {
  const [deck, setDeck] = useState(generateDeck());
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [dealerHand, setDealerHand] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [blackjackAnimation, setBlackjackAnimation] = useState(false);
  const [drawnCard, setDrawnCard] = useState<string | null>(null); // Track the last drawn card
  const [bustAnimation, setBustAnimation] = useState<"player" | "dealer" | null>(null);
  const [isDealing, setIsDealing] = useState(false);
  const [dealerCardRevealed, setDealerCardRevealed] = useState(false); // Track if dealer's hole card is revealed
  const [isFlipping, setIsFlipping] = useState(false); // Track if hole card is currently flipping

  function generateDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    return suits.flatMap((suit) => values.map((value) => `${value}${suit}`));
  }

  function calculateScore(hand: string[]) {
    let score = 0;
    let aces = 0;

    hand.forEach((card) => {
      const value = card.slice(0, -1);
      if (value === "A") {
        aces += 1;
        score += 11;
      } else if (["K", "Q", "J"].includes(value)) {
        score += 10;
      } else {
        score += parseInt(value, 10);
      }
    });

    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }

    return score;
  }

  function isBlackjack(hand: string[]) {
    return hand.length === 2 && calculateScore(hand) === 21;
  }

  function getDealerVisibleScore() {
    if (!dealerCardRevealed && dealerHand.length >= 2) {
      // Only calculate score for the first card when hole card is hidden
      return calculateScore([dealerHand[0]]);
    }
    return calculateScore(dealerHand);
  }

  function dealInitialCards() {
    const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);
    const newDeck = [...shuffledDeck];
    const newPlayerHand: string[] = [];
    const newDealerHand: string[] = [];

    setDeck(newDeck);
    setPlayerHand([]);
    setDealerHand([]);
    setMessage("");
    setIsDealing(true);
    setDealerCardRevealed(false); // Reset dealer card visibility
    setIsFlipping(false); // Reset flip animation

    function drawCardForPlayer() {
      if (newPlayerHand.length < 2) {
        const newCard = newDeck.pop()!;
        newPlayerHand.push(newCard);
        setPlayerHand([...newPlayerHand]);
        setDrawnCard(newCard);
        setTimeout(drawCardForPlayer, 500);
      } else {
        drawCardForDealer();
      }
    }

    function drawCardForDealer() {
      if (newDealerHand.length < 2) {
        const newCard = newDeck.pop()!;
        newDealerHand.push(newCard);
        setDealerHand([...newDealerHand]);
        setDrawnCard(newCard);
        setTimeout(drawCardForDealer, 500);
      } else {
        finalizeGameStart();
      }
    }

    function finalizeGameStart() {
      setDeck(newDeck);
      setDrawnCard(null);
      setIsDealing(false);

      // Check for player blackjack first
      if (isBlackjack(newPlayerHand)) {
        // Reveal dealer's hole card to check for dealer blackjack
        setIsFlipping(true);
        setTimeout(() => {
          setDealerCardRevealed(true);
          setIsFlipping(false);
        }, 300);
        setTimeout(() => {
          if (isBlackjack(newDealerHand)) {
            setMessage("Both have blackjack! It's a push (tie).");
          } else {
            setBlackjackAnimation(true);
          }
        }, 800);
      } else {
        // Check for dealer blackjack (peek at hole card)
        if (isBlackjack(newDealerHand)) {
          setIsFlipping(true);
          setTimeout(() => {
            setDealerCardRevealed(true);
            setIsFlipping(false);
          }, 300);
          setTimeout(() => {
            setMessage("Dealer blackjack! You lose.");
          }, 800);
        }
      }
    }

    drawCardForPlayer();
  }

  function hit() {
    if (playerHand.length === 0 || isDealing) return;

    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];

    setDeck(newDeck);
    setPlayerHand(newHand);
    setDrawnCard(newCard);

    if (calculateScore(newHand) > 21) {
      setBustAnimation("player");
      // Reveal dealer's hole card when player busts
      setIsFlipping(true);
      setTimeout(() => {
        setDealerCardRevealed(true);
        setIsFlipping(false);
      }, 300);
      setTimeout(() => {
        setMessage("You busted! Dealer wins.");
        setBustAnimation(null);
      }, 1000);
    }
  }

  function stand() {
    if (playerHand.length === 0 || isDealing) return;

    // Reveal dealer's hole card with animation
    setIsFlipping(true);
    setTimeout(() => {
      setDealerCardRevealed(true);
      setIsFlipping(false);
    }, 300);
    
    setTimeout(() => {
      let dealerScore = calculateScore(dealerHand);
      let newDeck = [...deck];
      let newDealerHand = [...dealerHand];

      function drawDealerCard() {
        if (dealerScore < 17) {
          const newCard = newDeck.pop()!;
          newDealerHand.push(newCard);
          setDealerHand([...newDealerHand]);
          setDrawnCard(newCard);
          dealerScore = calculateScore(newDealerHand);

          setTimeout(drawDealerCard, 500);
        } else {
          setDeck(newDeck);

          const playerScore = calculateScore(playerHand);

          if (dealerScore > 21) {
            setBustAnimation("dealer");
            setTimeout(() => {
              setMessage("Dealer busted! You win!");
              setBustAnimation(null);
            }, 1000);
          } else if (playerScore > dealerScore) {
            setMessage("You win!");
          } else if (playerScore < dealerScore) {
            setMessage("Dealer wins!");
          } else {
            setMessage("It's a tie!");
          }
        }
      }

      drawDealerCard();
    }, 600); // Delay to show the hole card reveal animation
  }

  function resetGame() {
    setDrawnCard(null);
    dealInitialCards();
  }

  function getCardColor(card: string) {
    const suit = card.slice(-1);
    return suit === "♥" || suit === "♦" ? "text-red-500" : "text-black";
  }

  return (
    <div className="flex flex-col items-center px-2 sm:px-0">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes flip {
            0% { transform: rotateY(0deg); }
            50% { transform: rotateY(90deg); }
            100% { transform: rotateY(0deg); }
          }
          .animate-flip {
            animation: flip 0.6s ease-in-out;
            transform-style: preserve-3d;
          }
        `
      }} />
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold p-4 text-center text-blue-500 drop-shadow-lg">Blackjack</h1>
        <div className="w-full sm:w-4/6 aspect-[4/5] sm:aspect-video poker-table flex flex-col justify-between rounded-2xl p-2 sm:p-4 text-white relative overflow-x-auto">
          {playerHand.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <button
                className="bg-blue-500 text-white w-full max-w-48 px-4 py-2 rounded hover:bg-blue-400 hover:scale-105 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setDrawnCard(null);
                  dealInitialCards();
                }}
                disabled={isDealing}
              >
                Start Game
              </button>
            </div>
          ) : (
            <>
              {/* Dealer's Hand */}
              <div className="flex flex-col items-center mb-2 sm:mb-4">
                <h2 className="text-lg font-bold">Dealer's Hand</h2>
                <p className="">Score: {getDealerVisibleScore()}</p>
                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                  {dealerHand.map((card, index) => (
                    <div
                      key={index}
                      className={`w-12 h-16 flex items-center justify-center rounded shadow-md transition-transform duration-300 ${
                        card === drawnCard ? "animate-draw" : ""
                      } ${bustAnimation === "dealer" ? "animate-explode" : ""} ${
                        index === 1 && isFlipping ? "animate-flip" : ""
                      } ${
                        index === 1 && !dealerCardRevealed 
                          ? "bg-blue-900 text-white" 
                          : `bg-white ${getCardColor(card)}`
                      }`}
                    >
                      {index === 1 && !dealerCardRevealed ? "?" : card}
                    </div>
                  ))}
                </div>
              </div>

              {/* Player's Hand */}
              <div className="flex flex-col items-center mt-auto">
                <h2 className="text-lg font-bold">Your Hand</h2>
                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                  {playerHand.map((card, index) => (
                    <div
                      key={index}
                      className={`w-12 h-16 bg-white flex items-center justify-center rounded shadow-md ${
                        card === drawnCard ? "animate-draw" : ""
                      } ${bustAnimation === "player" ? "animate-explode" : ""} ${getCardColor(card)}`}
                    >
                      {card}
                    </div>
                  ))}
                </div>
                <p className="mt-2">Score: {calculateScore(playerHand)}</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 w-full justify-center items-center">
                  <button
                    className="bg-blue-500 w-full sm:w-24 text-white py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={hit}
                    disabled={isDealing}
                  >
                    Hit
                  </button>
                  <button
                    className="bg-slate-400 w-full sm:w-24 text-white py-2 rounded hover:bg-slate-500 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={stand}
                    disabled={isDealing}
                  >
                    Stand
                  </button>
                </div>
              </div>
            </>
          )}
          {message && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-700/80 rounded-2xl p-4">
              <p className="text-lg font-bold mb-4 text-center">{message}</p>
              <button
                className="bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-400 transition duration-300"
                onClick={resetGame}
              >
                New Hand
              </button>
            </div>
          )}
          {blackjackAnimation && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-700/80 rounded-2xl p-4">
              <p className="text-4xl font-bold text-yellow-400 mb-4 animate-bounce text-center">Blackjack!</p>
              <button
                className="bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-400 transition duration-300"
                onClick={() => {
                  setBlackjackAnimation(false);
                  resetGame();
                }}
              >
                New Hand
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}