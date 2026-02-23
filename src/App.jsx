import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, StatsGl, useTexture } from "@react-three/drei";

// Make sure these paths match your folder structure exactly!
import SplashGate from "./components/UI/SplashGate";
import LorePopup from "./components/UI/LorePopup";
import Navbar from "./components/UI/Navbar";
import { CONFIG, ST_TABS } from "./components/data/siteConstants";
import CardGrid from "./components/Cards/CardGrid";
import { useAudio } from "./hooks/useAudio";
import QuizEngine from "./components/Quiz/QuizEngine";
import PortalEffect from "./components/3D/PortalEffect";
import { HEROES, VILLAINS } from "./components/data/characters";
import { useSecretCode } from "./hooks/useSecretCode";
import { useSound } from "./context/SoundContext";
import CreatorFile from "./components/UI/CreatorFile";
import Terminal from "./components/UI/Terminal";
import BriefingPopup from "./components/UI/Notice";

const App = () => {
  const wasPlayingRef = useRef(false);
  const wasBgmPlayingForTab = useRef(false);
  const audioState = useAudio(CONFIG.audioSrc);
  const [activeTab, setActiveTab] = useState(null);
  const [currentView, setCurrentView] = useState("PORTAL");
  const [featuredTab, setFeaturedTab] = useState(ST_TABS[0]);

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInputActive, setTerminalInputActive] = useState(false);
  const [terminalCode, setTerminalCode] = useState("");

  const [hasClosedBriefing, setHasClosedBriefing] = useState(false);

  const { playSfx, stopSfx, setGlobalSound } = useSound();
  useEffect(() => {
    setGlobalSound(audioState.playing);
  }, [audioState.playing, setGlobalSound]);

  // Secret Code Hook: Type "vecna" to flip reality, "home" to revert.
  // Add brackets to destructure the array!
  // src/App.jsx

  // Update the Vecna Hook
  const [isUpsideDown] = useSecretCode(
    "vecna",
    "hawkins",
    () => {
      if (audioState.playing) {
        audioState.setVolume(0); // Mute it instead of pausing
        playSfx("vecna");
      }
    },
    () => {
      if (audioState.playing) {
        playSfx("hawkins");
        setTimeout(() => {
          audioState.setVolume(1.0); // Bring it back to HIGH
        }, 4000);
      }
    },
  );

  // 1. CODE RED: Emergency Lockdown
  const [isCodeRed, setIsCodeRed] = useSecretCode(
    "codered",
    "calm",
    () => playSfx("vecna"), // Reusing the dramatic bong sound
    () => playSfx("click"),
  );

  // Auto-reset Code Red after 5 seconds
  useEffect(() => {
    if (isCodeRed) {
      const timer = setTimeout(() => setIsCodeRed(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isCodeRed, setIsCodeRed]);

  // 2. ELEVEN: Telekinetic Surge
  const [isEleven, setIsEleven] = useSecretCode(
    "eleven",
    "calm",
    () => playSfx("vecna"),
    () => playSfx("click"),
  );

  // Auto-reset Eleven after 5 seconds
  useEffect(() => {
    if (isEleven) {
      const timer = setTimeout(() => setIsEleven(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isEleven, setIsEleven]);
  // Update the Dustin Tab useEffect
  useEffect(() => {
    if (activeTab?.id === "dustin") {
      if (audioState.playing) {
        audioState.setVolume(0); // Fade out BGM
      }
      playSfx("neverending");
    } else {
      stopSfx("neverending");
      if (audioState.playing) {
        audioState.setVolume(1.0); // Bring BGM back to HIGH
      }
    }
  }, [activeTab, audioState.playing]); // Only watch these

  // Add the setter here so we can use it!
  const [isCreatorMode, setIsCreatorMode] = useSecretCode(
    "eleven",
    "close",
    () => playSfx("click"),
    () => playSfx("click"),
  );

  // useEffect(() => {
  //   // If we opened the Dustin/Suzie tab...
  //   if (activeTab?.id === "dustin") {
  //     // Remember if BGM was playing so we can restore it later
  //     wasBgmPlayingForTab.current = audioState.playing;

  //     if (audioState.playing) {
  //       audioState.pause(); // Stop the creepy music
  //     }
  //     playSfx("neverending"); // Blast the masterpiece
  //   } else {
  //     // If we closed the tab or switched to a different one...
  //     stopSfx("neverending"); // Cut the song

  //     // If the creepy music was playing before we opened the tab, resume it!
  //     if (wasBgmPlayingForTab.current) {
  //       audioState.play();
  //       wasBgmPlayingForTab.current = false;
  //     }
  //   }
  // }, [activeTab, audioState, playSfx, stopSfx]);

  const handleRandomTabClick = () => {
    // Open the current popup
    setActiveTab(featuredTab);
    playSfx("click");

    // Pick a new random tab that is DIFFERENT from the current one
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * ST_TABS.length);
    } while (ST_TABS[newIndex].id === featuredTab.id);

    // Set it for the next time the user looks at the button
    setFeaturedTab(ST_TABS[newIndex]);
  };
  return (
    // <SoundProvider isSoundOn={audioState.playing}>
    <div
      className={`w-full h-screen   bg-black relative overflow-hidden transition-all duration-700 ease-in-out
        ${isUpsideDown ? "shadow-[inset_0_0_200px_rgba(150,0,0,0.8)] rotate-180 scale-105" : "scale-100"} 
        ${isCodeRed ? "animate-pulse shadow-[inset_0_0_300px_rgba(255,0,0,1)] saturate-200" : ""}
${isEleven ? "saturate-50 contrast-125 brightness-75 shadow-[inset_0_0_400px_rgba(0,0,0,1)] scale-[0.95] blur-[1px]" : ""}
      `}
    >
      {/* =======================================================
          1. 3D WEBGL BACKGROUND
          Set to fixed inset-0 to cover the ENTIRE screen 
      ======================================================= */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          dpr={[1, 1.5]}
          style={{ width: "100vw", height: "100vh" }}
        >
          <React.Suspense fallback={null}>
            <PortalEffect
              isActive={audioState.initialized}
              isPortalView={currentView === "PORTAL"}
              isUpsideDown={isUpsideDown}
              isCodeRed={isCodeRed} // Pass it down!
              isEleven={isEleven}
            />
          </React.Suspense>
        </Canvas>
      </div>

      {/* =======================================================
          2. GLOBAL OVERLAYS (SPORES & GRAIN) 
          Must be pointer-events-none so they don't block the mouse
      ======================================================= */}
      <div
        className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-[2000ms] ${
          isUpsideDown ? "opacity-40" : "opacity-0"
        } bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] animate-pulse`}
      ></div>

      <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      {/* =======================================================
          3. MAIN UI OVERLAY
          The container is pointer-events-none so the portal 
          underneath gets all mouse movement.
      ======================================================= */}
      <div
        className={`absolute inset-0 flex flex-col p-6 md:p-12 z-10 font-mono pointer-events-none transition-colors duration-1000 ${
          isUpsideDown ? "text-red-600" : "text-white"
        }`}
      >
        {/* Navbar (Internal elements have pointer-events-auto) */}
        <Navbar
          audioState={audioState}
          setActiveTab={setActiveTab}
          currentView={currentView}
          setCurrentView={setCurrentView}
          initialized={audioState.initialized}
        />

        {/* Secret Code Warning */}
        {isUpsideDown && (
          <div className="absolute top-24 left-0 w-full text-center text-[10px] tracking-[1em] text-red-500 animate-bounce uppercase">
            Reality Compromised // The Void is Active
          </div>
        )}

        {/* Dynamic Content Router */}
        <div className="flex-1 w-full relative mt-8 overflow-hidden min-h-0">
          {/* VIEW: PORTAL (Landing Page) */}
          {currentView === "PORTAL" && (
            <div className="absolute inset-0 flex flex-col md:flex-row items-end md:items-center justify-between w-full h-full pb-8">
              {/* Left Side: Title & Description (pointer-events-none so portal works behind it) */}

              <div className="flex flex-col gap-2 max-w-2xl pointer-events-none animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="flex items-center gap-3 text-red-600 font-bold tracking-widest uppercase text-[10px]">
                  <span className="h-[1px] w-8 bg-red-600 shadow-[0_0_8px_red]"></span>
                  THREAT LEVEL: MIDNIGHT // INCIDENT_005
                </div>
                <h1 className="text-6xl md:text-[8rem] font-black leading-none tracking-tighter font-serif mt-2">
                  <span className="text-white drop-shadow-2xl">HAWKINS</span>
                  <br />
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r transition-all duration-1000 ${
                      isUpsideDown
                        ? "from-red-900 to-black"
                        : "from-red-700 to-red-950"
                    }`}
                  >
                    HAS FALLEN
                  </span>
                </h1>
                {/* <p className="text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase text-white/60 mt-6 max-w-md leading-relaxed border-l-2 border-red-600 pl-6">
                  The barrier between worlds has collapsed. Spores are spreading
                  through the atmosphere.
                  <span className="text-red-500 block mt-2 animate-pulse">
                    {isUpsideDown
                      ? "THE VOID CONSUMES ALL. TYPE 'HOME' TO ESCAPE."
                      : "DON'T LOOK AT THE CLOCK. ACCESS CLASSIFIED FILES TO THE RIGHT. "}
                   
                    
                  </span>
                </p> */}
                <div className="mt-6 max-w-md border-l-2 border-red-600 pl-6 space-y-4">
                  <p className="text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase text-white/60 leading-relaxed">
                    {isUpsideDown ? (
                      <>
                        Dimensional breach confirmed. Physics engine status:{" "}
                        <span className="text-red-500">INVERTED</span>. Type{" "}
                        <span className="text-white font-black px-1 underline decoration-red-600 underline-offset-4 tracking-[0.4em]">
                          HAWKINS
                        </span>{" "}
                        to recalibrate reality.
                      </>
                    ) : (
                      <>
                        The barrier between worlds is thinning. Scan the
                        <span className="text-white font-black mx-1">
                          [{featuredTab.label}]
                        </span>
                        to the right for encrypted data. Unauthorized users: Do
                        not attempt to access the
                        <span className="text-red-600/80 font-black hover:text-red-500 transition-colors cursor-default ml-1 tracking-[0.3em]">
                          VECNA
                        </span>
                        protocol.Dont even try to type it.If everything fail,
                        initiate
                        <span className="text-red-600/80 font-black hover:text-red-500 transition-colors cursor-default ml-1 tracking-[0.3em]">
                         CODERED 
                        </span>
                        {/* <span className="text-white font-black tracking-[0.2em] hover:text-red-500 transition-colors cursor-default">
                          CODERED
                        </span> */}
                        .
                        {/* <span className="hint-glitch">

                          Dont even try to type it

                        </span> */}
                      </>
                    )}
                  </p>

                  {/* Add a fake "System Active" line to make it look like a terminal */}

                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>

                    <span className="text-[9px] text-red-900 tracking-[0.3em] font-bold uppercase">
                      {isUpsideDown
                        ? "FRIENDS DON'T LIE, ELEVEN"
                        : "FRIENDS DON'T LIE, ELEVEN"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Shifting Classified File */}
              <div className="hidden md:flex flex-col items-center gap-6 pointer-events-auto animate-in fade-in duration-700 delay-500">
                <span className="h-32 w-[1px] bg-gradient-to-b from-transparent via-red-800 to-transparent"></span>

                <div className="flex flex-col items-center gap-8 py-4">
                  <button
                    onClick={handleRandomTabClick}
                    // Using vertical-rl keeps it perfectly spaced no matter how long the random word is
                    className="hover:text-red-500 hover:drop-shadow-[0_0_8px_red] transition-all uppercase text-[10px] tracking-[0.5em] font-bold whitespace-nowrap [writing-mode:vertical-rl] rotate-180 text-red-600/60"
                  >
                    {featuredTab.label}
                  </button>
                </div>

                <span className="h-32 w-[1px] bg-gradient-to-t from-transparent via-red-800 to-transparent"></span>
              </div>
            </div>
          )}

          {/* VIEW: HEROES */}
          {currentView === "HEROES" && (
            <CardGrid items={HEROES} isVillain={false} title="THE PARTY" />
          )}

          {/* VIEW: VILLAINS */}
          {currentView === "VILLAINS" && (
            <CardGrid items={VILLAINS} isVillain={true} title="THE THREATS" />
          )}

          {/* VIEW: QUIZ */}
          {/* {currentView === "QUIZ" && <QuizEngine />} */}
          {currentView === "QUIZ" && (
            <QuizEngine onClose={() => setCurrentView("PORTAL")} />
          )}
        </div>
        {/* THE INLINE TERMINAL TRIGGER */}
        <div className="absolute bottom-4 right-6 md:right-12 flex items-center pointer-events-auto z-50 text-[8px] tracking-[0.5em] uppercase font-mono text-white/20">
          {!terminalInputActive ? (
            // State 1: Just innocent looking text.
            // Removed 'cursor-crosshair' and added 'cursor-default'
            <span
              className="cursor-default hover:text-cyan-500/70 transition-colors py-2"
              onClick={() => {
                playSfx("click");
                setTerminalInputActive(true);
              }}
            >
              SYS_REF: HARSHAD DONGARDIVE //11 ..
            </span>
          ) : (
            // State 2: Text turns into a tiny command line
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (terminalCode.toLowerCase() === "codered") {
                  playSfx("click");
                  setIsTerminalOpen(true); // Open the terminal!
                }
                // Instantly reset the text back to normal
                setTerminalInputActive(false);
                setTerminalCode("");
              }}
              className="flex items-center text-cyan-500/70 bg-black/50 px-2 py-1 border border-cyan-900/50"
            >
              <span>SYS_REF: enter the code // </span>
              <input
                autoFocus
                type="text"
                value={terminalCode}
                onChange={(e) => setTerminalCode(e.target.value)}
                onBlur={() => {
                  // If they click away, hide the input and reset
                  setTerminalInputActive(false);
                  setTerminalCode("");
                }}
                className="bg-transparent border-none outline-none w-16 text-[8px] tracking-[0.5em] text-cyan-400 uppercase caret-cyan-400 ml-2"
                spellCheck="false"
                autoComplete="off"
              />
            </form>
          )}
        </div>
      </div>

      {/* =======================================================
          4. LOGIC / POPUP GATES
      ======================================================= */}
      <SplashGate
        onEnter={audioState.startExperience}
        isHidden={audioState.initialized}
      />
      {audioState.initialized && !hasClosedBriefing && (
        <BriefingPopup onClose={() => setHasClosedBriefing(true)} />
      )}
      <LorePopup data={activeTab} onClose={() => setActiveTab(null)} />
      <CreatorFile
        isActive={isCreatorMode}
        onClose={() => setIsCreatorMode(false)}
      />
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </div>
    // </SoundProvider>
  );
};;

// Preload textures globally to prevent lag on initial render
useTexture.preload([
  CONFIG.textures.front,
  CONFIG.textures.back,
  CONFIG.textures.displacement,
]);

export default App;

// import React, {
//   useRef,
//   useState,
//   useEffect,
//   useMemo,
//   useCallback,
// } from "react";
// import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
// import { useTexture, shaderMaterial } from "@react-three/drei";
// import * as THREE from "three";
// import { Menu, Zap, VolumeX, X } from "lucide-react";

// // --- 1. CONFIGURATION ---
// const CONFIG = {
//   particleCount: 300,
//   hoverSpeed: 4.0,
//   textureAspect: 16 / 9,
//   audioSrc: "/bgm.mp3",
//   textures: {
//     front: "/front.webp",
//     back: "/back.jpg",
//     displacement:
//       "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/disturb.jpg",
//   },
// };

// // --- 2. Funny Stranger Things Lore Data ---
// const ST_TABS = [
//   {
//     id: "scoops",
//     label: "Scoops_Ahoy",
//     title: "TOP SECRET: SCOOPS AHOY",
//     desc: "U.S.S. Butterscotch is permanently out of stock. Erica has seized the remaining supply. Do NOT ask Steve about his hat. He is sensitive about it.",
//   },
//   {
//     id: "eddie",
//     label: "Hellfire_Club",
//     title: "EDDIE'S DM NOTES",
//     desc: 'Rule #1: No backing down. Rule #2: "Master of Puppets" is the only acceptable battle anthem. Rule #3: Chrissy wake up... 🎸',
//   },
//   {
//     id: "dustin",
//     label: "Cerebro_Log",
//     title: "RADIO FREQ: 10.743",
//     desc: "Suzie, do you copy? ... *NeverEnding Story theme song starts playing aggressively in the background* ... Turn it off! Turn it off!",
//   },
//   {
//     id: "demo",
//     label: "Demo_Diet",
//     title: "SUBJECT: DEMOGORGON",
//     desc: "Diet consists mostly of nougat (3 Musketeers) and sometimes cats (Sorry, Mews). Extremely allergic to fire and teenagers with spiked baseball bats.",
//   },
// ];

// // --- 3. Audio Hook ---
// const useAudio = (url) => {
//   const audioRef = useRef(null);
//   const [playing, setPlaying] = useState(false);
//   const [initialized, setInitialized] = useState(false);

//   useEffect(() => {
//     audioRef.current = new Audio(url);
//     audioRef.current.loop = true;
//     audioRef.current.volume = 0;
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.src = "";
//       }
//     };
//   }, [url]);

//   const startExperience = useCallback(() => {
//     if (!audioRef.current) return;
//     audioRef.current
//       .play()
//       .then(() => {
//         setPlaying(true);
//         setInitialized(true);
//         let vol = 0;
//         const fadeInterval = setInterval(() => {
//           if (vol < 0.4) {
//             vol += 0.05;
//             audioRef.current.volume = Math.min(vol, 0.4);
//           } else {
//             clearInterval(fadeInterval);
//           }
//         }, 150);
//       })
//       .catch((e) => {
//         console.warn("Audio blocked by browser:", e);
//         setInitialized(true);
//       });
//   }, []);

//   const toggle = useCallback(() => {
//     if (!audioRef.current) return;
//     if (playing) audioRef.current.pause();
//     else audioRef.current.play().catch((e) => console.warn(e));
//     setPlaying(!playing);
//   }, [playing]);

//   return { playing, toggle, startExperience, initialized };
// };

// // --- 4. Shaders & 3D Environment ---
// const ImageFadeMaterial = shaderMaterial(
//   {
//     uTexture1: null,
//     uTexture2: null,
//     uDisp: null,
//     uMouse: new THREE.Vector2(0.5, 0.5),
//     uAspect: 1.0,
//     uTextureAspect: 1.0,
//     uHover: 0.0,
//     uTime: 0.0,
//   },
//   `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
//   `
//     uniform float uHover; uniform float uTime; uniform vec2 uMouse;
//     uniform float uAspect; uniform float uTextureAspect;
//     uniform sampler2D uTexture1; uniform sampler2D uTexture2; uniform sampler2D uDisp;
//     varying vec2 vUv;

//     void main() {
//       vec2 ratio = vec2(min(uAspect / uTextureAspect, 1.0), min(uTextureAspect / uAspect, 1.0));
//       vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
//       vec2 aspect = vec2(uAspect, 1.0); vec2 mousePos = uMouse * aspect; vec2 uvPos = vUv * aspect;

//       float noise = texture2D(uDisp, uv * 0.5 + uTime * 0.02).r;
//       float detailNoise = texture2D(uDisp, uv * 2.0 - uTime * 0.05).g;

//       float radius = 0.14 + sin(uTime * 1.5) * 0.01;
//       float softness = 0.25; float dist = distance(uvPos, mousePos);
//       float distort = (noise * 0.1) + (detailNoise * 0.05);

//       float mask = 1.0 - smoothstep(radius, radius + softness, dist - distort);
//       float finalMask = clamp(mask * uHover, 0.0, 1.0);

//       vec4 t1 = texture2D(uTexture1, uv);
//       vec2 portalUV = uv + (noise * 0.02 * finalMask);
//       float r = texture2D(uTexture2, portalUV + vec2(0.005 * finalMask, 0.0)).r;
//       float g = texture2D(uTexture2, portalUV).g;
//       float b = texture2D(uTexture2, portalUV - vec2(0.005 * finalMask, 0.0)).b;
//       vec4 t2 = vec4(r, g, b, 1.0);

//       float edge = smoothstep(0.4, 0.5, finalMask) * (1.0 - smoothstep(0.5, 0.6, finalMask));
//       vec3 edgeColor = vec3(0.8, 0.1, 0.0) * edge * (noise + 0.5);

//       gl_FragColor = mix(t1, t2, finalMask) + vec4(edgeColor, 0.0);
//     }
//   `,
// );
// extend({ ImageFadeMaterial });

// const Particles = () => {
//   const mesh = useRef();
//   const dummy = useMemo(() => new THREE.Object3D(), []);
//   const particles = useMemo(
//     () =>
//       Array.from({ length: CONFIG.particleCount }, () => ({
//         t: Math.random() * 100,
//         factor: 20 + Math.random() * 100,
//         speed: 0.01 + Math.random() / 200,
//         xFactor: -5 + Math.random() * 10,
//         yFactor: -5 + Math.random() * 10,
//         zFactor: -5 + Math.random() * 10,
//         mx: 0,
//         my: 0,
//       })),
//     [],
//   );

//   useFrame(() => {
//     if (!mesh.current) return;
//     particles.forEach((particle, i) => {
//       particle.t += particle.speed / 2;
//       const { t, factor, xFactor, yFactor, zFactor } = particle;
//       const a = Math.cos(t) + Math.sin(t * 1) / 10;
//       const b = Math.sin(t) + Math.cos(t * 2) / 10;
//       const s = Math.cos(t);
//       dummy.position.set(
//         (particle.mx / 10) * a +
//           xFactor +
//           Math.cos((t / 10) * factor) +
//           (Math.sin(t * 1) * factor) / 10,
//         (particle.my / 10) * b +
//           yFactor +
//           Math.sin((t / 10) * factor) +
//           (Math.cos(t * 2) * factor) / 10,
//         (particle.my / 10) * b +
//           zFactor +
//           Math.cos((t / 10) * factor) +
//           (Math.sin(t * 3) * factor) / 10,
//       );
//       dummy.scale.set(s * 0.02, s * 0.02, s * 0.02);
//       dummy.rotation.set(s * 5, s * 5, s * 5);
//       dummy.updateMatrix();
//       mesh.current.setMatrixAt(i, dummy.matrix);
//     });
//     mesh.current.instanceMatrix.needsUpdate = true;
//   });

//   return (
//     <instancedMesh ref={mesh} args={[null, null, CONFIG.particleCount]}>
//       <sphereGeometry args={[1, 8, 8]} />
//       <meshBasicMaterial color="#ff2200" transparent opacity={0.6} />
//     </instancedMesh>
//   );
// };

// const RevealImage = ({ isActive }) => {
//   const meshRef = useRef();
//   const materialRef = useRef();
//   const { viewport } = useThree();
//   const textures = useTexture([
//     CONFIG.textures.front,
//     CONFIG.textures.back,
//     CONFIG.textures.displacement,
//   ]);

//   // Smoother global mouse tracking
//   useFrame((state, delta) => {
//     if (!materialRef.current) return;

//     // Convert Global Screen Pointer (-1 to 1) to UV coordinates (0 to 1)
//     const targetMouseX = (state.pointer.x + 1) / 2;
//     const targetMouseY = (state.pointer.y + 1) / 2;

//     // Smoothly follow the mouse everywhere
//     materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
//       materialRef.current.uniforms.uMouse.value.x,
//       targetMouseX,
//       0.1,
//     );
//     materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
//       materialRef.current.uniforms.uMouse.value.y,
//       targetMouseY,
//       0.1,
//     );

//     materialRef.current.uniforms.uTime.value += delta;
//     materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
//       materialRef.current.uniforms.uHover.value,
//       isActive ? 1 : 0,
//       delta * CONFIG.hoverSpeed,
//     );
//     materialRef.current.uniforms.uAspect.value =
//       viewport.width / viewport.height;
//     materialRef.current.uniforms.uTextureAspect.value = CONFIG.textureAspect;

//     // Subtle parallax effect
//     if (meshRef.current) {
//       meshRef.current.rotation.y = THREE.MathUtils.lerp(
//         meshRef.current.rotation.y,
//         state.pointer.x * 0.08,
//         0.05,
//       );
//       meshRef.current.rotation.x = THREE.MathUtils.lerp(
//         meshRef.current.rotation.x,
//         -state.pointer.y * 0.08,
//         0.05,
//       );
//     }
//   });

//   return (
//     <group>
//       <mesh ref={meshRef}>
//         <planeGeometry args={[viewport.width, viewport.height, 32, 32]} />
//         <imageFadeMaterial
//           ref={materialRef}
//           uTexture1={textures[0]}
//           uTexture2={textures[1]}
//           uDisp={textures[2]}
//           toneMapped={false}
//         />
//       </mesh>
//       <Particles />
//     </group>
//   );
// };

// // --- 5. UI Components ---
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

// const SplashGate = ({ onEnter, isHidden }) => (
//   <div
//     className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${isHidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
//   >
//     <div className="text-center">
//       <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-red-950 font-serif tracking-widest mb-8 drop-shadow-[0_0_15px_rgba(220,20,20,0.8)]">
//         HAWKINS LAB
//       </h1>
//       <button
//         onClick={onEnter}
//         className="pointer-events-auto px-8 py-3 border border-red-900/50 text-red-500 uppercase tracking-[0.4em] text-xs font-bold hover:bg-red-900/20 hover:text-white transition-all duration-300"
//       >
//         Enter Experience
//       </button>
//     </div>
//   </div>
// );

// // Popup Modal Component
// const LorePopup = ({ data, onClose }) => {
//   if (!data) return null;
//   return (
//     <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
//       <div className="relative w-[90%] max-w-lg bg-black/90 border-2 border-red-900 p-8 shadow-[0_0_30px_rgba(220,20,20,0.3)] animate-in fade-in zoom-in duration-300">
//         {/* CRT Scanline effect for popup */}
//         <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(255,0,0,0.2)_50%)] bg-[length:100%_4px]"></div>

//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-red-600 hover:text-red-400"
//         >
//           <X className="w-6 h-6" />
//         </button>

//         <h2 className="text-2xl font-black text-red-500 font-serif tracking-widest mb-4 border-b border-red-900/50 pb-2">
//           {data.title}
//         </h2>
//         <p className="text-red-100/80 leading-relaxed font-mono text-sm tracking-wide">
//           {data.desc}
//         </p>

//         <div className="mt-8 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 bg-red-950/40 text-red-500 text-xs tracking-widest hover:bg-red-900/60 transition-colors border border-red-900/50"
//           >
//             ACKNOWLEDGE
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Overlay = ({ audioState }) => {
//   const { playing, toggle, initialized } = audioState;
//   const [activeTab, setActiveTab] = useState(null);

//   const getDelay = (delay) =>
//     `transition-all duration-1000 ease-out transform ${initialized ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${delay}`;

//   return (
//     <>
//       {/* Lore Popup Modal */}
//       <LorePopup data={activeTab} onClose={() => setActiveTab(null)} />

//       {/* Main UI wrapper - MUST BE pointer-events-none so mouse hits canvas */}
//       <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-10 text-white font-mono">
//         <nav
//           className={`flex justify-between items-center pointer-events-auto ${getDelay("delay-[500ms]")}`}
//         >
//           <div className="text-xl font-black tracking-tighter uppercase flex items-center gap-3">
//             <Zap className="fill-red-600 w-5 h-5 animate-pulse drop-shadow-[0_0_10px_rgba(220,38,38,1)]" />
//             <span className="font-serif tracking-widest text-red-600">
//               ST // V
//             </span>
//           </div>

//           <div className="flex items-center gap-6">
//             <div className="hidden md:flex gap-8 text-[10px] font-bold tracking-[0.4em] uppercase text-white/50">
//               {/* Top Tabs */}
//               {ST_TABS.slice(0, 2).map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab)}
//                   className="hover:text-red-500 transition-colors relative group uppercase"
//                 >
//                   {tab.label}{" "}
//                   <span className="absolute -bottom-2 left-0 w-0 h-px bg-red-600 group-hover:w-full transition-all"></span>
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={toggle}
//               className="flex items-center justify-center w-10 h-10 bg-red-950/20 border border-red-900/30 rounded-full hover:border-red-500 transition-all pointer-events-auto"
//             >
//               {playing ? (
//                 <AudioVisualizer playing={playing} />
//               ) : (
//                 <VolumeX className="w-4 h-4 text-red-600" />
//               )}
//             </button>
//           </div>
//         </nav>

//         <div className="flex flex-col md:flex-row items-end md:items-center justify-between w-full h-full pb-8 md:pb-12">
//           {/* THE FIX: Changed from pointer-events-auto to pointer-events-none so it doesn't block the canvas */}
//           <div
//             className={`flex flex-col gap-2 max-w-2xl pointer-events-none ${getDelay("delay-[700ms]")}`}
//           >
//             <div
//               className={`flex items-center gap-3 text-red-600 font-bold tracking-widest uppercase text-[10px]`}
//             >
//               <span className="h-[1px] w-8 bg-red-600 shadow-[0_0_8px_red]"></span>{" "}
//               THREAT LEVEL: MIDNIGHT
//             </div>

//             <h1
//               className={`text-6xl md:text-[8rem] font-black leading-none tracking-tighter font-serif mt-2`}
//             >
//               <span className="text-white drop-shadow-2xl">HAWKINS</span>
//               <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-950">
//                 HAS FALLEN
//               </span>
//             </h1>

//             <p
//               className={`text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase text-white/60 mt-6 max-w-md leading-relaxed border-l-2 border-red-600 pl-6`}
//             >
//               The barrier between worlds has collapsed. Spores are spreading
//               through the atmosphere.
//               <span className="text-red-500 block mt-2 animate-pulse">
//                 Don't look at the clock.
//               </span>
//             </p>
//           </div>

//           <div
//             className={`hidden md:flex flex-col gap-8 pointer-events-auto ${getDelay("delay-[1300ms]")}`}
//           >
//             <div className="flex flex-col gap-2 items-center text-red-500/60">
//               <span className="h-24 w-[1px] bg-gradient-to-b from-transparent via-red-800 to-transparent mb-4"></span>
//               {/* Side Tabs */}
//               {ST_TABS.slice(2, 4).map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab)}
//                   className="hover:text-red-500 hover:drop-shadow-[0_0_5px_red] -rotate-90 transition-all uppercase text-[9px] tracking-[0.5em] font-bold mb-8"
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // --- 6. Main Application ---
// const App = () => {
//   const audioState = useAudio(CONFIG.audioSrc);

//   return (
//     <div className="w-full h-screen bg-black relative overflow-hidden selection:bg-red-900 selection:text-white">
//       {/* Global Filters */}
//       <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

//       {/* Intro Gate */}
//       <SplashGate
//         onEnter={audioState.startExperience}
//         isHidden={audioState.initialized}
//       />

//       {/* UI Elements overlaying the WebGL */}
//       <Overlay audioState={audioState} />

//       {/* 3D Shader Scene - Takes up entire background */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]}>
//           <React.Suspense fallback={null}>
//             <RevealImage isActive={audioState.initialized} />
//           </React.Suspense>
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// useTexture.preload([
//   CONFIG.textures.front,
//   CONFIG.textures.back,
//   CONFIG.textures.displacement,
// ]);
// export default App;

// // import React, { useRef, useState, useEffect, useMemo } from "react";
// // import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
// // import { useTexture, shaderMaterial } from "@react-three/drei";
// // import * as THREE from "three";
// // import {
// //   ArrowRight,
// //   Menu,
// //   Github,
// //   Twitter,
// //   Instagram,
// //   MousePointer2,
// //   Zap,
// // } from "lucide-react";

// // // --- 1. Shader Definition (Cinematic Void Transition with Aspect Correction) ---

// // const ImageFadeMaterial = shaderMaterial(
// //   {
// //     uTexture1: null,
// //     uTexture2: null,
// //     uDisp: null,
// //     uMouse: new THREE.Vector2(0.5, 0.5),
// //     uAspect: 1.0,
// //     uTextureAspect: 1.0, // Aspect ratio of the images
// //     uHover: 0.0,
// //     uTime: 0.0,
// //   },
// //   `
// //     varying vec2 vUv;
// //     void main() {
// //       vUv = uv;
// //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// //     }
// //   `,
// //   `
// //     uniform float uHover;
// //     uniform float uTime;
// //     uniform vec2 uMouse;
// //     uniform float uAspect;
// //     uniform float uTextureAspect;
// //     uniform sampler2D uTexture1;
// //     uniform sampler2D uTexture2;
// //     uniform sampler2D uDisp;
// //     varying vec2 vUv;

// //     float flicker(float t) {
// //         return sin(t * 10.0) * sin(t * 7.0) * sin(t * 5.0);
// //     }

// //     void main() {
// //       // ASPECT RATIO CORRECTION (Object-Fit: Cover logic)
// //       vec2 ratio = vec2(
// //         min(uAspect / uTextureAspect, 1.0),
// //         min(uTextureAspect / uAspect, 1.0)
// //       );
// //       vec2 uv = vec2(
// //         vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
// //         vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
// //       );

// //       vec2 aspect = vec2(uAspect, 1.0);
// //       vec2 mousePos = uMouse * aspect;
// //       vec2 uvPos = vUv * aspect;

// //       // Organic Noise & Distortion
// //       float noise = texture2D(uDisp, uv * 0.5 + uTime * 0.02).r;
// //       float detailNoise = texture2D(uDisp, uv * 2.0 - uTime * 0.05).g;

// //       // Animated Radius
// //       float radius = 0.14 + sin(uTime * 1.5) * 0.01;
// //       float softness = 0.25;

// //       // Distance with "Vine" Distortion
// //       float dist = distance(uvPos, mousePos);
// //       float distort = (noise * 0.1) + (detailNoise * 0.05);

// //       // Reveal Mask
// //       float mask = 1.0 - smoothstep(radius, radius + softness, dist - distort);
// //       float finalMask = clamp(mask * uHover, 0.0, 1.0);

// //       // Texture Sampling with corrected UVs
// //       vec4 t1 = texture2D(uTexture1, uv);

// //       // Back Image with portal effect
// //       vec2 portalUV = uv + (noise * 0.02 * finalMask);
// //       float r = texture2D(uTexture2, portalUV + vec2(0.005 * finalMask, 0.0)).r;
// //       float g = texture2D(uTexture2, portalUV).g;
// //       float b = texture2D(uTexture2, portalUV - vec2(0.005 * finalMask, 0.0)).b;
// //       vec4 t2 = vec4(r, g, b, 1.0);

// //       // Red edge glow
// //       float edge = smoothstep(0.4, 0.5, finalMask) * (1.0 - smoothstep(0.5, 0.6, finalMask));
// //       vec3 edgeColor = vec3(0.8, 0.1, 0.0) * edge * (noise + 0.5);

// //       gl_FragColor = mix(t1, t2, finalMask) + vec4(edgeColor, 0.0);
// //     }
// //   `
// // );

// // extend({ ImageFadeMaterial });

// // // --- 2. Floating Particles Component ---

// // const Particles = ({ count = 550 }) => {
// //   const mesh = useRef();

// //   const dummy = useMemo(() => new THREE.Object3D(), []);
// //   const particles = useMemo(() => {
// //     const temp = [];
// //     for (let i = 0; i < count; i++) {
// //       const t = Math.random() * 100;
// //       const factor = 20 + Math.random() * 100;
// //       const speed = 0.01 + Math.random() / 200;
// //       const xFactor = -5 + Math.random() * 10;
// //       const yFactor = -5 + Math.random() * 10;
// //       const zFactor = -5 + Math.random() * 10;
// //       temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
// //     }
// //     return temp;
// //   }, [count]);

// //   useFrame((state) => {
// //     particles.forEach((particle, i) => {
// //       let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
// //       t = particle.t += speed / 2;
// //       const a = Math.cos(t) + Math.sin(t * 1) / 10;
// //       const b = Math.sin(t) + Math.cos(t * 2) / 10;
// //       const s = Math.cos(t);

// //       dummy.position.set(
// //         (particle.mx / 10) * a +
// //           xFactor +
// //           Math.cos((t / 10) * factor) +
// //           (Math.sin(t * 1) * factor) / 10,
// //         (particle.my / 10) * b +
// //           yFactor +
// //           Math.sin((t / 10) * factor) +
// //           (Math.cos(t * 2) * factor) / 10,
// //         (particle.my / 10) * b +
// //           zFactor +
// //           Math.cos((t / 10) * factor) +
// //           (Math.sin(t * 3) * factor) / 10
// //       );
// //       dummy.scale.set(s * 0.02, s * 0.02, s * 0.02);
// //       dummy.rotation.set(s * 5, s * 5, s * 5);
// //       dummy.updateMatrix();
// //       mesh.current.setMatrixAt(i, dummy.matrix);
// //     });
// //     mesh.current.instanceMatrix.needsUpdate = true;
// //   });

// //   return (
// //     <instancedMesh ref={mesh} args={[null, null, count]}>
// //       <sphereGeometry args={[1, 8, 8]} />
// //       <meshBasicMaterial color="#ff2200" transparent opacity={0.8} />
// //     </instancedMesh>
// //   );
// // };

// // // --- 3. 3D Scene Component ---
// // const RevealImage = () => {
// //   const meshRef = useRef();
// //   const materialRef = useRef();
// //   const [hovered, setHovered] = useState(false);
// //   const { viewport } = useThree();

// //   const textures = useTexture([
// //     "/henry.webp",
// //     "/vecna.jpg",
// //     "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/disturb.jpg",
// //   ]);

// //   const [texture1, texture2, dispTexture] = textures;

// //   // Assume textures have same aspect ratio for this logic (16:9 approx)
// //   const textureAspect = 16 / 9;

// //   const onPointerMove = (e) => {
// //     if (materialRef.current && e.uv) {
// //       materialRef.current.uniforms.uMouse.value.x = e.uv.x;
// //       materialRef.current.uniforms.uMouse.value.y = e.uv.y;
// //     }
// //   };

// //   useFrame((state, delta) => {
// //     if (!materialRef.current) return;

// //     materialRef.current.uniforms.uTime.value += delta;

// //     // Increased interpolation speed slightly for snappier reveal
// //     const targetHover = hovered ? 1 : 0;
// //     materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
// //       materialRef.current.uniforms.uHover.value,
// //       targetHover,
// //       delta * 4.0
// //     );

// //     materialRef.current.uniforms.uAspect.value =
// //       viewport.width / viewport.height;
// //     materialRef.current.uniforms.uTextureAspect.value = textureAspect;

// //     if (meshRef.current) {
// //       const mX = materialRef.current.uniforms.uMouse.value.x - 0.5;
// //       const mY = materialRef.current.uniforms.uMouse.value.y - 0.5;

// //       // Slight parallax movement
// //       meshRef.current.rotation.y = THREE.MathUtils.lerp(
// //         meshRef.current.rotation.y,
// //         mX * 0.08,
// //         0.05
// //       );
// //       meshRef.current.rotation.x = THREE.MathUtils.lerp(
// //         meshRef.current.rotation.x,
// //         -mY * 0.08,
// //         0.05
// //       );
// //     }
// //   });

// //   return (
// //     <group>
// //       <mesh
// //         ref={meshRef}
// //         onPointerEnter={() => setHovered(true)}
// //         onPointerLeave={() => setHovered(false)}
// //         onPointerMove={onPointerMove}
// //       >
// //         <planeGeometry args={[viewport.width, viewport.height, 32, 32]} />
// //         <imageFadeMaterial
// //           ref={materialRef}
// //           uTexture1={texture1}
// //           uTexture2={texture2}
// //           uDisp={dispTexture}
// //           uMouse={new THREE.Vector2(0.5, 0.5)}
// //           uAspect={viewport.width / viewport.height}
// //           uTextureAspect={textureAspect}
// //           uHover={0}
// //           uTime={0}
// //           toneMapped={false}
// //         />
// //       </mesh>
// //       {/* Increased particle count for more "Spores" atmosphere */}
// //       <Particles count={300} />
// //     </group>
// //   );
// // };

// // // --- 4. UI Overlay Component ---

// // const Overlay = () => {
// //   const [loaded, setLoaded] = useState(false);

// //   useEffect(() => {
// //     const timer = setTimeout(() => setLoaded(true), 100);
// //     return () => clearTimeout(timer);
// //   }, []);

// //   const getTransitionClass = (delayClass) =>
// //     `transition-all duration-1000 ease-out transform ${
// //       loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
// //     } ${delayClass}`;

// //   return (
// //     <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10 text-white font-mono">
// //       <nav
// //         className={`flex justify-between items-center pointer-events-auto ${getTransitionClass(
// //           "delay-0"
// //         )}`}
// //       >
// //         {/* LOGO AREA */}
// //         <div className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
// //           <div className="relative">
// //             <Zap className="fill-red-600 text-red-600 w-6 h-6 animate-pulse" />
// //             <div className="absolute inset-0 blur-md bg-red-600/50 scale-150 rounded-full animate-pulse"></div>
// //           </div>
// //           <span className="relative font-serif tracking-widest text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
// //             STRANGER_THINGS // V
// //           </span>
// //         </div>

// //         {/* NAV LINKS */}
// //         <div className="hidden md:flex gap-10 text-[9px] font-bold tracking-[0.4em] uppercase text-red-50/70">
// //           <a
// //             href="#"
// //             className="hover:text-red-500 transition-colors relative group"
// //           >
// //             The_Crawl
// //             <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-600 group-hover:w-full transition-all"></span>
// //           </a>
// //           <a
// //             href="#"
// //             className="hover:text-red-500 transition-colors relative group"
// //           >
// //             Hellfire_Club
// //             <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-600 group-hover:w-full transition-all"></span>
// //           </a>
// //           <a href="#" className="text-red-600 animate-pulse drop-shadow-md">
// //             Radio_Free_Hawkins
// //           </a>
// //         </div>
// //         <button className="md:hidden">
// //           <Menu className="w-6 h-6 text-red-600" />
// //         </button>
// //       </nav>

// //       <div className="flex flex-col md:flex-row items-end md:items-center justify-between w-full h-full pb-12">
// //         <div className="flex flex-col gap-1 max-w-2xl">
// //           {/* TOP TAGLINE */}
// //           <div
// //             className={`flex items-center gap-3 text-red-600 font-bold tracking-widest uppercase text-[10px] ${getTransitionClass(
// //               "delay-200"
// //             )}`}
// //           >
// //             <span className="h-[1px] w-8 bg-red-600 box-shadow-[0_0_8px_red]"></span>
// //             {/* THREAT LEVEL: MIDNIGHT // INCIDENT_005 */}
// //           </div>

// //           {/* MAIN TITLE */}
// //           <h1
// //             className={`text-6xl md:text-9xl font-black leading-none tracking-tighter font-serif ${getTransitionClass(
// //               "delay-300"
// //             )}`}
// //           >
// //             <span className="text-white  md:text-8xl drop-shadow-2xl">
// //               HAWKINS
// //             </span>{" "}
// //             <br />
// //             <span className="text-transparent font-medium bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-black drop-shadow-[0_0_25px_rgba(200,0,0,0.6)]">
// //               HAS FALLEN
// //             </span>
// //           </h1>

// //           {/* DESCRIPTION */}
// //           <p
// //             className={`text-[11px] font-medium tracking-[0.2em] uppercase opacity-70 mt-8 max-w-md leading-relaxed border-l-2 border-red-600 pl-6 ${getTransitionClass(
// //               "delay-500"
// //             )}`}
// //           >
// //             The barrier between worlds has collapsed. Spores are spreading
// //             through the atmosphere. Visualize the network to see the hive mind
// //             taking over.
// //             <span className="text-red-500 block mt-2">
// //               {" "}
// //               Don't look at the clock.
// //             </span>
// //           </p>

// //           {/* ACTION BUTTON */}
// //           <div
// //             className={`pointer-events-auto mt-12 ${getTransitionClass(
// //               "delay-700"
// //             )}`}
// //           >
// //             <button className="group relative flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.5em] px-12 py-6 overflow-hidden bg-red-950/20 hover:bg-red-900/40 transition-all border border-red-900/50">
// //               <span className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
// //               <span className="relative z-10 text-red-100">Enter The Void</span>
// //               <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-3 transition-transform text-red-500" />
// //             </button>
// //           </div>
// //         </div>

// //         {/* SIDE BAR LINKS */}
// //         <div
// //           className={`hidden md:flex flex-col gap-12 pointer-events-auto ${getTransitionClass(
// //             "delay-1000"
// //           )}`}
// //         >
// //           <div className="flex flex-col gap-2 items-center text-red-500/60">
// //             <span className="h-20 w-[1px] bg-gradient-to-b from-transparent via-red-800 to-transparent"></span>
// //             <a
// //               href="#"
// //               className="hover:text-red-500 hover:drop-shadow-[0_0_5px_red] -rotate-90 transition-all uppercase text-[8px] tracking-[0.5em] font-bold mb-4"
// //             >
// //               Project_Nina
// //             </a>
// //             <a
// //               href="#"
// //               className="hover:text-red-500 hover:drop-shadow-[0_0_5px_red] -rotate-90 transition-all uppercase text-[8px] tracking-[0.5em] font-bold mb-4"
// //             >
// //               Creel_House
// //             </a>
// //             <a
// //               href="#"
// //               className="hover:text-red-500 hover:drop-shadow-[0_0_5px_red] -rotate-90 transition-all uppercase text-[8px] tracking-[0.5em] font-bold"
// //             >
// //               Classified
// //             </a>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // --- 5. Main App Component ---

// // const App = () => {
// //   return (
// //     <div className="w-full h-screen bg-black relative overflow-hidden">
// //       {/* Background scanline effect */}
// //       <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

// //       <Overlay />

// //       <div className="absolute inset-0 z-0 overflow-hidden">
// //         <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
// //           <React.Suspense fallback={null}>
// //             <RevealImage />
// //           </React.Suspense>
// //         </Canvas>
// //       </div>

// //       {/* Decorative HUD elements */}
// //       <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-4 pointer-events-none z-10">
// //         {[...Array(8)].map((_, i) => (
// //           <div
// //             key={i}
// //             className={`w-1 h-1 bg-red-900/40 rounded-full ${
// //               i % 3 === 0 ? "animate-pulse bg-red-600" : ""
// //             }`}
// //           ></div>
// //         ))}
// //       </div>

// //       <div className="absolute bottom-6 left-12 flex items-center gap-4 text-[8px] text-white/20 pointer-events-none uppercase tracking-[0.6em] font-bold z-10">
// //         <div className="w-2 h-2 bg-red-600/40 rounded-full"></div>
// //         System Status: Nominal // Hawkins_Grid_Active
// //       </div>
// //     </div>
// //   );
// // };

// // export default App;
