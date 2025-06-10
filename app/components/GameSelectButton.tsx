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
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(30,64,175,0.12)" }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full max-w-xs"
    >
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
          <div className="bg-gradient-to-r from-red-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 whitespace-nowrap rounded-br-lg shadow-md drop-shadow">
            {banner}
          </div>
        </motion.div>
      )}

      {/* Main Card */}
      <div className="relative z-10 border border-blue-200 rounded-3xl p-5 m-2 flex flex-col items-center justify-center text-blue-900 bg-white/80 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 shadow-lg backdrop-blur-md min-h-64">
        <div className="w-24 h-24 flex items-center justify-center mb-2 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner">
          <img src={imageUrl} alt={name} className="w-16 h-16 object-contain drop-shadow" />
        </div>
        <h2 className="text-lg font-extrabold text-center mb-1 tracking-tight">{name}</h2>
        <p className="text-center text-sm flex-1 sm:min-h-[60px] opacity-80 mb-2">{description}</p>
        <button
          className="mt-3 bg-blue-600 text-white rounded-full px-5 py-2 w-full font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-200"
          onClick={() => navigate(navigateTo, { viewTransition: true })}
        >
          Play
        </button>
      </div>
    </motion.div>
  );
};

export default GameSelectCard;
