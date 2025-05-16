import React from "react";

interface GameSelectButtonProps {
  name: string;
  description: string;
  imageUrl: string;
}

const GameSelectCard: React.FC<GameSelectButtonProps> = ({ name, description, imageUrl }) => {
  return (
    <div className="border-2 border-gray-500 rounded-4xl p-4 m-4 aspect-auto max-w-100 flex flex-col items-center justify-center text-gray-800 bg-gray-100 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out">
      <img src={imageUrl} alt={name} />
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-center">{description}</p>
      <button className="mt-4 bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out">
        Play
      </button>
    </div>
  );
};

export default GameSelectCard;
