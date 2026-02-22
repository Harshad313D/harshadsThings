// import React, { useState } from "react";
// import { ChevronRight, RotateCcw } from "lucide-react";
// import { HEROES, VILLAINS } from "../data/characters";
// import { QUIZ_QUESTIONS } from "../data/quiz";
// import FlipCard from "../Cards/FlipCard";
// import { useSound } from "../../context/SoundContext";

// const QuizEngine = () => {
//   const [currentQ, setCurrentQ] = useState(0);
//   const [scores, setScores] = useState({});
//   const [result, setResult] = useState(null);
//   const { playSfx } = useSound();

//   const handleAnswer = (match) => {
//     playSfx("click");
//     const newScores = { ...scores, [match]: (scores[match] || 0) + 1 };
//     setScores(newScores);

//     if (currentQ < QUIZ_QUESTIONS.length - 1) {
//       setCurrentQ(currentQ + 1);
//     } else {
//       const winnerId = Object.keys(newScores).reduce((a, b) =>
//         newScores[a] > newScores[b] ? a : b,
//       );
//       const character = [...HEROES, ...VILLAINS].find((c) => c.id === winnerId);
//       const isVillain = VILLAINS.some((v) => v.id === winnerId);
//       setResult({ character, isVillain });
//     }
//   };

//   const reset = () => {
//     setCurrentQ(0);
//     setScores({});
//     setResult(null);
//   };

//   if (result) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500 pointer-events-auto">
//         <h2 className="text-3xl font-serif text-red-500 mb-2 drop-shadow-[0_0_10px_red]">
//           TEST COMPLETE
//         </h2>
//         <p className="text-white/60 text-xs tracking-[0.2em] mb-8">
//           SUBJECT PROFILE MATCH FOUND
//         </p>
//         <FlipCard data={result.character} isVillain={result.isVillain} />
//         <button
//           onClick={reset}
//           className="mt-8 flex items-center gap-2 text-white/50 hover:text-red-500 transition-colors text-xs tracking-widest"
//         >
//           <RotateCcw className="w-4 h-4" /> RETAKE TEST
//         </button>
//       </div>
//     );
//   }

//   const q = QUIZ_QUESTIONS[currentQ];

//   return (
//     <div className="w-full h-full flex items-center justify-center pointer-events-auto">
//       <div className="w-full max-w-xl mx-auto border border-red-900/40 bg-black/80 backdrop-blur-md p-8 shadow-[0_0_30px_rgba(255,0,0,0.1)]">
//         <div className="text-red-600 text-[10px] tracking-[0.4em] mb-6 flex justify-between">
//           <span>PSYCH_EVALUATION</span>
//           <span>
//             QUESTION {currentQ + 1} // {QUIZ_QUESTIONS.length}
//           </span>
//         </div>
//         <h2 className="text-2xl font-serif text-white mb-8 border-b border-red-900/30 pb-4">
//           {q.question}
//         </h2>
//         <div className="flex flex-col gap-4">
//           {q.answers.map((ans, i) => (
//             <button
//               key={i}
//               onClick={() => handleAnswer(ans.match)}
//               className="text-left px-6 py-4 bg-red-950/20 hover:bg-red-900/50 border border-red-900/30 text-white/80 hover:text-white font-mono text-sm transition-all group flex justify-between items-center"
//             >
//               {ans.text}
//               <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-red-500" />
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizEngine;
import React, { useState } from "react";
import { ChevronRight, RotateCcw, X } from "lucide-react";
import { HEROES, VILLAINS } from "../data/characters";
import { QUIZ_QUESTIONS } from "../data/quiz";
import FlipCard from "../Cards/FlipCard";
import { useSound } from "../../context/SoundContext";

// 1. Accept onClose prop
const QuizEngine = ({ onClose }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);
  const { playSfx } = useSound();

  const handleAnswer = (match) => {
    playSfx("click");
    const newScores = { ...scores, [match]: (scores[match] || 0) + 1 };
    setScores(newScores);

    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const winnerId = Object.keys(newScores).reduce((a, b) =>
        newScores[a] > newScores[b] ? a : b,
      );
      const character = [...HEROES, ...VILLAINS].find((c) => c.id === winnerId);
      const isVillain = VILLAINS.some((v) => v.id === winnerId);
      setResult({ character, isVillain });
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setScores({});
    setResult(null);
  };

  // 2. Add the function to close when clicking the empty sides
  const handleBackdropClick = (e) => {
    // Only close if they clicked the wrapper itself, not the content inside it
    if (e.target === e.currentTarget) {
      playSfx("click");
      if (onClose) onClose();
    }
  };

  if (result) {
    return (
      // 3. Attach the click handler to your original wrapper
      <div
        className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500 pointer-events-auto cursor-pointer"
        onClick={handleBackdropClick}
      >
        <div className="relative flex flex-col items-center cursor-default">
          <h2 className="text-3xl font-serif text-red-500 mb-2 drop-shadow-[0_0_10px_red]">
            TEST COMPLETE
          </h2>
          <p className="text-white/60 text-xs tracking-[0.2em] mb-8">
            SUBJECT PROFILE MATCH FOUND
          </p>
          <FlipCard data={result.character} isVillain={result.isVillain} />
          <button
            onClick={reset}
            className="mt-8 flex items-center gap-2 text-white/50 hover:text-red-500 transition-colors text-xs tracking-widest"
          >
            <RotateCcw className="w-4 h-4" /> RETAKE TEST
          </button>
        </div>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQ];

  return (
    // 3. Attach the click handler to your original wrapper
    <div
      className="w-full h-full flex items-center justify-center pointer-events-auto cursor-pointer"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-xl mx-auto border border-red-900/40 bg-black/80 backdrop-blur-md p-8 shadow-[0_0_30px_rgba(255,0,0,0.1)] relative cursor-default">
        {/* Optional: A subtle close button just to make it obvious */}
        <button
          onClick={() => {
            playSfx("click");
            if (onClose) onClose();
          }}
          className="absolute top-4 right-4 text-white/50 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-red-600 text-[10px] tracking-[0.4em] mb-6 flex justify-between">
          <span>PSYCH_EVALUATION</span>
          <span>
            QUESTION {currentQ + 1} // {QUIZ_QUESTIONS.length}
          </span>
        </div>
        <h2 className="text-2xl font-serif text-white mb-8 border-b border-red-900/30 pb-4">
          {q.question}
        </h2>
        <div className="flex flex-col gap-4">
          {q.answers.map((ans, i) => (
            <button
              key={i}
              onMouseEnter={() => playSfx("hover")}
              onClick={() => handleAnswer(ans.match)}
              className="text-left px-6 py-4 bg-red-950/20 hover:bg-red-900/50 border border-red-900/30 text-white/80 hover:text-white font-mono text-sm transition-all group flex justify-between items-center"
            >
              {ans.text}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-red-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;