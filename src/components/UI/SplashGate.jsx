import React from "react";

const SplashGate = ({ onEnter, isHidden }) => (
  <div
    className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${isHidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
  >
    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-red-950 font-serif tracking-widest mb-8 drop-shadow-[0_0_15px_rgba(220,20,20,0.8)]">
      HAWKINS LAB
    </h1>
    <button
      onClick={onEnter}
      className="pointer-events-auto px-8 py-3 border border-red-900/50 text-red-500 uppercase tracking-[0.4em] text-xs font-bold hover:bg-red-900/20 hover:text-white transition-all"
    >
      Enter Experience
    </button>
  </div>
);

export default SplashGate;
