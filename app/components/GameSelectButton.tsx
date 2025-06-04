import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

interface GameSelectButtonProps {
  name: string;
  description: string;
  imageUrl: string;
  navigateTo: string;
  banner?: string;
}

const GameSelectCard: React.FC<GameSelectButtonProps> = ({
  name,
  description,
  imageUrl,
  navigateTo,
  banner,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-xs">
      {/* Shadow Ribbon Tail - behind all content */}
      {banner && (
        <div
          className="absolute top-[36px] left-0 z-0 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-red-700"
          style={{ transform: "rotate(-135deg) translateX(-4px)" }}
        />
      )}

      {/* Animated Banner */}
      {banner && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-4 left-0 z-20 overflow-visible"
        >
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 whitespace-nowrap rounded-br-lg shadow-md">
            {banner}
          </div>
        </motion.div>
      )}

      {/* Main Card */}
      <div className="relative z-10 border-2 border-gray-500 rounded-3xl p-4 m-2 flex flex-col items-center justify-center text-gray-800 bg-gray-100 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out sm:max-w-sm min-h-64">
        <img src={imageUrl} alt={name} className="w-24 h-24 object-contain mb-2" />
        <h2 className="text-lg font-bold text-center">{name}</h2>
        <p className="text-center text-sm flex-1">{description}</p>
        <button
          className="mt-4 bg-blue-500 text-white rounded-full px-4 py-2 w-full hover:bg-blue-600 transition duration-300 ease-in-out"
          onClick={() => navigate(navigateTo, { viewTransition: true })}
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default GameSelectCard;
