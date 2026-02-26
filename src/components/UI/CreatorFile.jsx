import React from "react";
import { X, Terminal, Code, Cpu } from "lucide-react";

const CreatorFile = ({ isActive, onClose }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-auto bg-black/40 backdrop-blur-sm animate-in zoom-in duration-500">
      {/* High-tech glowing border */}
      <div className="relative w-full max-w-3xl bg-black border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] p-1">
        {/* Inner container with scanline effect */}
        <div className="bg-black/90 p-8 border border-cyan-900/50 relative overflow-hidden">
          {/* Animated scanline */}
          <div className="absolute inset-0 w-full h-2 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-[scan_3s_ease-in-out_infinite]"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-cyan-500/50 hover:text-cyan-400 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 text-cyan-400 mb-8 border-b border-cyan-900/50 pb-4">
            <Terminal className="w-5 h-5" />
            <span className="font-mono text-xs tracking-[0.4em]">
              SYSTEM_OVERRIDE // CLASSIFIED_DOSSIER
            </span>
          </div>

          {/* Glitchy Title */}
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">
            Harshad{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Dongardive
            </span>
          </h2>

          <p className="text-cyan-300 font-mono text-sm tracking-widest mb-8">
            CREATIVE DEVELOPER // CSE GRADUATE
          </p>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm text-white/80">
            <div className="bg-cyan-950/20 p-4 border border-cyan-900/30">
              <div className="flex items-center gap-2 text-cyan-400 mb-3">
                <Cpu className="w-4 h-4" />
                <span className="tracking-widest">SPECIALIZATION</span>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed">
                <li>&gt; Three.js 3D Environments</li>
                <li>&gt; React Three Fiber (R3F)</li>
                <li>&gt; Immersive Web Experiences</li>
              </ul>
            </div>

            <div className="bg-cyan-950/20 p-4 border border-cyan-900/30">
              <div className="flex items-center gap-2 text-cyan-400 mb-3">
                <Code className="w-4 h-4" />
                <span className="tracking-widest">SYSTEM_LOG</span>
              </div>
              <p className="text-xs leading-relaxed text-white/60">
                Bridging the gap between standard UI and the 3D world. Currently
                building highly interactive, physics-driven web applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorFile;
