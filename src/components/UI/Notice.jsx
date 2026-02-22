import React from "react";
import { X } from "lucide-react";
import { useSound } from "../../context/SoundContext";

const BriefingPopup = ({ onClose }) => {
  const { playSfx } = useSound();

  const handleClose = () => {
    playSfx("click");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto animate-in fade-in zoom-in duration-500">
      <div className="relative w-[85%] max-w-md border border-red-900/50 bg-[#0a0000] p-6 shadow-[0_0_40px_rgba(220,20,20,0.2)] font-mono">
        {/* Close Button (X) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-red-600 hover:text-red-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-red-500 font-bold tracking-widest uppercase mb-6 text-sm border-b border-red-900/50 pb-2">
          Classified Briefing
        </h2>

        <div className="space-y-4 text-red-200/70 text-xs md:text-sm leading-relaxed">
          <p>
            &gt; Explore the{" "}
            <span className="text-white font-bold">Heroes</span> &{" "}
            <span className="text-white font-bold">Villains</span> dossiers.
          </p>
          <p>
            &gt; Take the{" "}
            <span className="text-white font-bold">Psych Evaluation Quiz</span>{" "}
            to find your match.
          </p>
        </div>

        <div className="border-t border-red-900/50 pt-4 mt-6">
          <p className="text-red-400 leading-relaxed text-xs md:text-sm">
            WARNING:{" "}
            <span className="text-white font-bold">
              4+ secret override codes
            </span>{" "}
            are hidden across this terminal. Find them to break the system.
          </p>
        </div>

        {/* Acknowledge Button */}
        <div className="mt-8 flex justify-end">
          <button
            onMouseEnter={() => playSfx("hover")}
            onClick={handleClose}
            className="px-6 py-2 bg-red-950/40 text-red-500 text-xs tracking-[0.2em] font-bold hover:bg-red-900/60 border border-red-900/50 transition-all"
          >
            ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
};

export default BriefingPopup;
