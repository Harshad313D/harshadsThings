import React from "react";
import { Zap, VolumeX } from "lucide-react";
import { useSound } from "../../context/SoundContext";
// 1. Import the hook

const AudioVisualizer = ({ playing }) => (
  <div className="flex items-end gap-[2px] h-4 w-4">
    {[1, 2, 3].map((bar) => (
      <div
        key={bar}
        className={`w-1 bg-red-600 rounded-t-sm origin-bottom transition-all duration-150 ${playing ? "animate-pulse" : "h-[2px]"}`}
        style={
          playing
            ? {
                height: `${Math.random() * 100 + 40}%`,
                animationDelay: `${bar * 0.15}s`,
              }
            : {}
        }
      />
    ))}
  </div>
);

const Navbar = ({
  audioState,
  setActiveTab,
  currentView,
  setCurrentView,
  initialized,
}) => {
  // 2. Extract the playSfx function
  const { playSfx } = useSound();

  const getDelay = (delay) =>
    `transition-all duration-1000 ease-out transform ${initialized ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${delay}`;

  // Helper function to handle view changes with sound
  const handleNavClick = (view) => {
    playSfx("click");
    setCurrentView(view);
  };

  return (
    <nav
      className={`flex justify-between items-center pointer-events-auto ${getDelay("delay-[500ms]")}`}
    >
      <div
        className="text-xl font-black tracking-tighter uppercase flex items-center gap-3 cursor-pointer"
        onClick={() => handleNavClick("PORTAL")}
      >
        <Zap className="fill-red-600 w-5 h-5 animate-pulse drop-shadow-[0_0_10px_rgba(220,38,38,1)]" />
        <span className="font-serif tracking-widest text-red-600">HD Things</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-8 text-[10px] font-bold tracking-[0.4em] uppercase text-white/50">
          {/* 3. Add onMouseEnter and onClick to your buttons */}
          <button
            onMouseEnter={() => playSfx("hover")}
            onClick={() => handleNavClick("PORTAL")}
            className={`${currentView === "PORTAL" ? "text-red-500" : "hover:text-red-500"} transition-colors relative group uppercase`}
          >
            Portal
          </button>

          <button
            onMouseEnter={() => playSfx("hover")}
            onClick={() => handleNavClick("HEROES")}
            className={`${currentView === "HEROES" ? "text-red-500" : "hover:text-red-500"} transition-colors relative group uppercase`}
          >
            Heroes
          </button>

          <button
            onMouseEnter={() => playSfx("hover")}
            onClick={() => handleNavClick("VILLAINS")}
            className={`${currentView === "VILLAINS" ? "text-red-500" : "hover:text-red-500"} transition-colors relative group uppercase`}
          >
            Villains
          </button>

          <button
            onMouseEnter={() => playSfx("hover")}
            onClick={() => handleNavClick("QUIZ")}
            className={`${currentView === "QUIZ" ? "text-red-500" : "hover:text-red-500"} transition-colors relative group uppercase`}
          >
            Quiz
          </button>
        </div>

        {/* Mute Button (Doesn't need SFX since it toggles the audio itself) */}
        <button
          onClick={audioState.toggle}
          className="flex items-center justify-center w-10 h-10 bg-red-950/20 border border-red-900/30 rounded-full hover:border-red-500 transition-all pointer-events-auto"
        >
          {audioState.playing ? (
            <AudioVisualizer playing={audioState.playing} />
          ) : (
            <VolumeX className="w-4 h-4 text-red-600" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

// import React from "react";
// import { Zap, VolumeX, Menu } from "lucide-react";

// const AudioVisualizer = ({ playing }) => (
//   <div className="flex items-end gap-[2px] h-4 w-4">
//     {[1, 2, 3].map((bar) => (
//       <div
//         key={bar}
//         className={`w-1 bg-red-600 rounded-t-sm origin-bottom transition-all duration-150 ${playing ? "animate-pulse" : "h-[2px]"}`}
//         style={
//           playing
//             ? {
//                 height: `${Math.random() * 100 + 40}%`,
//                 animationDelay: `${bar * 0.15}s`,
//               }
//             : {}
//         }
//       />
//     ))}
//   </div>
// );

// const Navbar = ({
//   audioState,
//   setActiveTab,
//   currentView,
//   setCurrentView,
//   initialized,
// }) => {
//   const getDelay = (delay) =>
//     `transition-all duration-1000 ease-out transform ${initialized ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${delay}`;

//   return (
//     <nav
//       className={`flex justify-between items-center pointer-events-auto ${getDelay("delay-[500ms]")}`}
//     >
//       <div
//         className="text-xl font-black tracking-tighter uppercase flex items-center gap-3 cursor-pointer"
//         onClick={() => setCurrentView("PORTAL")}
//       >
//         <Zap className="fill-red-600 w-5 h-5 animate-pulse drop-shadow-[0_0_10px_rgba(220,38,38,1)]" />
//         <span className="font-serif tracking-widest text-red-600">ST // V</span>
//       </div>

//       <div className="flex items-center gap-6">
//         <div className="hidden md:flex gap-8 text-[10px] font-bold tracking-[0.4em] uppercase text-white/50">
//           <button
//             onClick={() => setCurrentView("PORTAL")}
//             className={`${currentView === "PORTAL" ? "text-red-500" : "hover:text-red-500"} transition-colors relative group uppercase`}
//           >
//             Portal
//           </button>
//           <button
//             onClick={() => setCurrentView("HEROES")}
//             className={`${currentView === "HEROES" ? "text-red-500" : "hover:text-red-500"} transition-colors relative group uppercase`}
//           >
//             Heroes
//           </button>
//           <button
//             onClick={() => setCurrentView("VILLAINS")}
//             className={`${currentView === "VILLAINS" ? "text-red-500" : "hover:text-red-500"} transition-colors relative group uppercase`}
//           >
//             Villains
//           </button>
//           <button
//             onClick={() => setCurrentView("QUIZ")}
//             className={`${currentView === "QUIZ" ? "text-red-500" : "hover:text-red-500"} transition-colors relative group uppercase`}
//           >
//             Quiz
//           </button>
//         </div>
//         <button
//           onClick={audioState.toggle}
//           className="flex items-center justify-center w-10 h-10 bg-red-950/20 border border-red-900/30 rounded-full hover:border-red-500 transition-all pointer-events-auto"
//         >
//           {audioState.playing ? (
//             <AudioVisualizer playing={audioState.playing} />
//           ) : (
//             <VolumeX className="w-4 h-4 text-red-600" />
//           )}
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
