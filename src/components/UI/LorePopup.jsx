import React from "react";
import { X } from "lucide-react";
import { useSound } from "../../context/SoundContext";

const LorePopup = ({ data, onClose }) => {
    const { playSfx, stopSfx, setGlobalSound } = useSound();
  
  if (!data) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-[90%] max-w-lg bg-black border-2 border-red-900 p-8 shadow-[0_0_30px_rgba(220,20,20,0.3)] animate-in fade-in zoom-in duration-300">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(255,0,0,0.2)_50%)] bg-[length:100%_4px]"></div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 hover:text-red-400"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-black text-red-500 font-serif tracking-widest mb-4 border-b border-red-900/50 pb-2">
          {data.title}
        </h2>
        <p className="text-red-100/80 leading-relaxed font-mono text-sm tracking-wide">
          {data.desc}
        </p>
        <div className="mt-8 flex justify-end">
          <button
            onMouseEnter={() => playSfx("hover")} // Adds the hover sound!
            onClick={() => {
              playSfx("click"); // 1. Play the click sound
              onClose(); // 2. Fire the close function
            }}
            className="px-6 py-2 bg-red-950/40 text-red-500 text-xs tracking-widest hover:bg-red-900/60 border border-red-900/50"
          >
            ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
};

export default LorePopup;
