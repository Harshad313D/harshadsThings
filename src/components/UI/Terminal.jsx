// import React, { useState, useEffect, useRef } from "react";
// import { X } from "lucide-react";

// const Terminal = ({ isOpen, onClose }) => {
//   const bottomRef = useRef(null);
//   const inputRef = useRef(null);
//   const [input, setInput] = useState("");

//   const [history, setHistory] = useState([
//     {
//       type: "response",
//       content: "HAWKINS LAB MAINFRAME v4.1.1 // ROOT ACCESS GRANTED",
//     },
//     { type: "response", content: "SYSTEM ONLINE. TYPE 'help' FOR COMMANDS." },
//   ]);

//   useEffect(() => {
//     if (bottomRef.current)
//       bottomRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [history]);

//   useEffect(() => {
//     if (isOpen && inputRef.current) inputRef.current.focus();
//   }, [isOpen]);

//   const handleCommand = (e) => {
//     if (e.key === "Enter") {
//       const cmd = input.trim().toLowerCase();
//       if (!cmd) return;

//       const newHistory = [
//         ...history,
//         { type: "command", content: `> ${input}` },
//       ];

//       switch (cmd) {
//         case "help":
//           newHistory.push({
//             type: "response",
//             content: (
//               <div className="space-y-4">
//                 <div>
//                   <span className="text-cyan-400 font-bold">
//                     === DEVELOPER DATA ===
//                   </span>
//                   <br />
//                   1.about, 2.education, 3.experience, 4.projects
//                 </div>
//                 <div>
//                   <span className="text-cyan-400 font-bold">
//                     === About this project ===
//                   </span>
//                   <br />
//                   a.features, b.secrets
//                 </div>
//                 <div>
//                   <span className="text-cyan-400 font-bold">
//                     === UTILITY ===
//                   </span>
//                   <br />
//                   cls
//                 </div>
//               </div>
//             ),
//           });
//           break;

//         case "cls":
//           setHistory([{ type: "response", content: "TERMINAL CLEARED." }]);
//           setInput("");
//           return;

//         // --- DEVELOPER DATA ---
//         case ("1"||"about"):
//           newHistory.push({
//             type: "response",
//             content:
//               "NAME: Harshad Dongardive\nROLE: Full Stack Developer\nLOCATION: Chhatrapati Sambhajinagar, Maharashtra",
//           });
//           break;

//         case "2":
//           newHistory.push({
//             type: "response",
//             content:
//               "DEGREE: B-Tech in Computer Science And Engineering \nCOLLEGE: CSMSS Chh Shahu College Of Engineering\nCGPA: ~8.0",
//           });
//           break;

//         case "3":
//           newHistory.push({
//             type: "response",
//             content:
//               "COMPANIES:\n1. Tech Surya IT Solutions (jan 2025 to present)\n2. MHTECHIN (march 2024 to jun 2024)\n3. Exlearn Technologies (dec 2023 to march 2024)",
//           });
//           break;

//         case "4":
//           newHistory.push({
//             type: "response",
//             content: (
//               <div className="flex flex-col space-y-2">
//                 <span>PROJECT ARCHIVES:</span>
//                 <a
//                   href="https://three-js-landing-rho.vercel.app/"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-cyan-400 hover:text-white underline w-fit"
//                 >
//                   - 3D Space Portfolio (React Three Fiber)
//                 </a>
//                 <a
//                   href="https://vercel.com/harshad-s-projects-fb636bf3/nutri-guide"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-cyan-400 hover:text-white underline w-fit"
//                 >
//                   - NutriGuide
//                 </a>
//                 <span>- PMB: Pay My Bills</span>
//                 <span>- AI Trip Planner</span>
//                 <span>- The Otaku Arc</span>
//                 <span>- QR Wizard</span>
//                 <span>- VideoTube</span>
//                 <span>- Smart Home Appliance</span>
//                 <span>- Dummy Website</span>
//               </div>
//             ),
//           });
//           break;

//         // --- SYSTEM DATA ---
//         case "features":
//           newHistory.push({
//             type: "response",
//             content:
//               "WEBSITE MODULES:\n- THE PARTY: Hero Character Cards\n- THE THREATS: Villain Character Cards\n- PSYCH_EVALUATION: Personality Quiz Matcher",
//           });
//           break;

//         case "secrets":
//           newHistory.push({
//             type: "response",
//             content:
//               "SYSTEM OVERRIDE CODES:\n- 'vecna' : Triggers the Upside Down inversion.\n- 'hawkins'  : Restores baseline reality.\n- '11'  : Reveals the Creator UI Dossier.",
//           });
//           break;

//         default:
//           newHistory.push({
//             type: "response",
//             content: `COMMAND NOT RECOGNIZED: '${cmd}'. TYPE 'help' FOR LIST.`,
//           });
//       }

//       setHistory(newHistory);
//       setInput("");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 z-[100] bg-black p-4 md:p-8 flex items-center justify-center font-mono pointer-events-auto overflow-hidden animate-in fade-in duration-300"
//       onClick={() => inputRef.current?.focus()}
//     >
//       <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
//       <div className="w-full max-w-4xl h-[80vh] border border-green-500/40 bg-[#050505] relative shadow-[0_0_30px_rgba(34,197,94,0.15)] flex flex-col">
//         <div className="flex justify-between items-center p-3 bg-green-950/30 border-b border-green-500/40">
//           <span className="text-green-500 text-[10px] tracking-[0.3em] uppercase">
//             SYS_ADMIN // TERMINAL
//           </span>
//           <button
//             onClick={onClose}
//             className="text-green-500 hover:bg-green-500 hover:text-black transition-all p-1 z-20"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//         <div className="flex-1 p-6 overflow-y-auto text-green-500 text-sm md:text-base leading-relaxed whitespace-pre-wrap [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
//           {history.map((line, i) => (
//             <div
//               key={i}
//               className={`mb-4 ${line.type === "command" ? "opacity-60" : "opacity-100"}`}
//             >
//               {line.content}
//             </div>
//           ))}
//           <div className="flex items-center gap-2 mt-2">
//             <span className="text-green-500">{">"}</span>
//             <input
//               ref={inputRef}
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleCommand}
//               className="flex-1 bg-transparent outline-none border-none text-green-500 caret-transparent uppercase"
//               autoComplete="off"
//               spellCheck="false"
//             />
//             <span
//               className={`w-2 h-5 bg-green-500 animate-pulse ${input ? "ml-[-" + input.length * 2 + "px]" : ""}`}
//               style={{
//                 transform: `translateX(-${(inputRef.current?.offsetWidth || 0) - input.length * 9.5}px)`,
//               }}
//             ></span>
//           </div>
//           <div ref={bottomRef} className="h-4" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Terminal;

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const Terminal = ({ isOpen, onClose }) => {
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const [input, setInput] = useState("");

  const [history, setHistory] = useState([
    {
      type: "response",
      content: "HAWKINS LAB MAINFRAME v4.1.1 // ROOT ACCESS GRANTED",
    },
    { type: "response", content: "SYSTEM ONLINE. TYPE 'help' FOR COMMANDS." },
  ]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      if (!cmd) return;

      const newHistory = [
        ...history,
        { type: "command", content: `> ${input}` },
      ];

      switch (cmd) {
        case "help":
          newHistory.push({
            type: "response",
            content: (
              <div className="space-y-4">
                <div>
                  <span className="text-cyan-400 font-bold">
                    === DEVELOPER DATA ===
                  </span>
                  <br />
                  1.about, 2.education, 3.experience, 4.projects, 5.socials
                </div>
                <div>
                  <span className="text-cyan-400 font-bold">
                    === About this project ===
                  </span>
                  <br />
                  a.features, b.secrets
                </div>
                <div>
                  <span className="text-cyan-400 font-bold">
                    === UTILITY ===
                  </span>
                  <br />
                  cls
                </div>
              </div>
            ),
          });
          break;

        case "cls":
          setHistory([{ type: "response", content: "TERMINAL CLEARED." }]);
          setInput("");
          return;

        // --- DEVELOPER DATA ---
        case "1":
        case "about":
          newHistory.push({
            type: "response",
            content:
              "NAME: Harshad Dongardive\nROLE: Full Stack Developer\nLOCATION: Chhatrapati Sambhajinagar, Maharashtra",
          });
          break;

        case "2":
        case "education":
          newHistory.push({
            type: "response",
            content:
              "DEGREE: B-Tech in Computer Science And Engineering \nCOLLEGE: CSMSS Chh Shahu College Of Engineering\nCGPA: ~8.0",
          });
          break;

        case "3":
        case "experience":
          newHistory.push({
            type: "response",
            content:
              "COMPANIES:\n1. Tech Surya IT Solutions (jan 2025 to present)\n2. MHTECHIN (march 2024 to jun 2024)\n3. Exlearn Technologies (dec 2023 to march 2024)",
          });
          break;

        case "4":
        case "projects":
          newHistory.push({
            type: "response",
            content: (
              <div className="flex flex-col space-y-2">
                <span>PROJECT ARCHIVES:</span>
                <a
                  href="https://three-js-landing-rho.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-white underline w-fit"
                >
                  - 3D Space Portfolio (React Three Fiber)
                </a>
                <a
                  href="https://vercel.com/harshad-s-projects-fb636bf3/nutri-guide"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-white underline w-fit"
                >
                  - NutriGuide
                </a>
                <span>- PMB: Pay My Bills</span>
                <span>- AI Trip Planner</span>
                <span>- The Otaku Arc</span>
                <span>- QR Wizard</span>
                <span>- VideoTube</span>
                <span>- Smart Home Appliance</span>
                <span>- Dummy Website</span>
              </div>
            ),
          });
          break;

        case "5":
        case "socials":
          newHistory.push({
            type: "response",
            content: (
              <div className="flex flex-col space-y-2 mt-1">
                <span className="text-green-500">COMMUNICATION CHANNELS:</span>
                <a
                  href="https://www.linkedin.com/in/harshad-dongardive-054643204/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-white underline w-fit"
                >
                  - LINKEDIN
                </a>
                <a
                  href="https://github.com/Harshad313D"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-white underline w-fit"
                >
                  - GITLAB
                </a>
                <a
                  href="https://instagram.com/hunky_harsh_3"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-white underline w-fit"
                >
                  - INSTAGRAM
                </a>
                <a
                  href="mailto:hdexamples@gmail.com "
                  className="text-cyan-400 hover:text-white underline w-fit"
                >
                  - EMAIL: [ click to connect]
                </a>
              </div>
            ),
          });
          break;
        // --- SYSTEM DATA ---
        case "a":
        case "features":
          newHistory.push({
            type: "response",
            content:
              "WEBSITE MODULES:\n- THE PARTY: Hero Character Cards\n- THE THREATS: Villain Character Cards\n- PSYCH_EVALUATION: Personality Quiz Matcher",
          });
          break;

        case "b":
        case "secrets":
          newHistory.push({
            type: "response",
            content:
              "SYSTEM OVERRIDE CODES:\n- 'vecna' : Triggers the Upside Down inversion.\n- 'hawkins'  : Restores baseline reality.\n- '11'  : Reveals the Creator UI Dossier.",
          });
          break;

        default:
          newHistory.push({
            type: "response",
            content: `COMMAND NOT RECOGNIZED: '${cmd}'. TYPE 'help' FOR LIST.`,
          });
      }

      setHistory(newHistory);
      setInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black p-4 md:p-8 flex items-center justify-center font-mono pointer-events-auto overflow-hidden animate-in fade-in duration-300"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
      <div className="w-full max-w-4xl h-[80vh] border border-green-500/40 bg-[#050505] relative shadow-[0_0_30px_rgba(34,197,94,0.15)] flex flex-col">
        <div className="flex justify-between items-center p-3 bg-green-950/30 border-b border-green-500/40">
          <span className="text-green-500 text-[10px] tracking-[0.3em] uppercase">
            SYS_ADMIN // TERMINAL
          </span>
          <button
            onClick={onClose}
            className="text-green-500 hover:bg-green-500 hover:text-black transition-all p-1 z-20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto text-green-500 text-sm md:text-base leading-relaxed whitespace-pre-wrap [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {history.map((line, i) => (
            <div
              key={i}
              className={`mb-4 ${line.type === "command" ? "opacity-60" : "opacity-100"}`}
            >
              {line.content}
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-500">{">"}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="flex-1 bg-transparent outline-none border-none text-green-500 caret-transparent uppercase"
              autoComplete="off"
              spellCheck="false"
            />
            <span
              className={`w-2 h-5 bg-green-500 animate-pulse ${input ? "ml-[-" + input.length * 2 + "px]" : ""}`}
              style={{
                transform: `translateX(-${(inputRef.current?.offsetWidth || 0) - input.length * 9.5}px)`,
              }}
            ></span>
          </div>
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default Terminal;