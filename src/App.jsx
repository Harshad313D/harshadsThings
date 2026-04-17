import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, StatsGl, useTexture } from "@react-three/drei";
import ReactGA from "react-ga4";
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
import { useAddReviewMutation, useGetStatsQuery, useRecordViewMutation, useToggleLikeMutation } from "./Redux/API/UsersAPI";
import { log } from "three";
import { Eye, Heart, MessageSquare, X } from "lucide-react";

const App = () => {
  const TRACKING_ID = import.meta.env.VITE_G_ID; // Replace with your actual ID
  ReactGA.initialize(TRACKING_ID);

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

  const { data } = useGetStatsQuery();

  const [hasLiked] = useToggleLikeMutation();
  const [recordView] = useRecordViewMutation();
  const [submitReview, { isLoading: isSubmitting }] = useAddReviewMutation();
  useEffect(() => {
    recordView();
  }, []);
  // Track whenever the user switches views
  useEffect(() => {
    // Send a pageview event to Google Analytics
    ReactGA.send({
      hitType: "pageview",
      page: `/${currentView.toLowerCase()}`, // e.g., /portal, /heroes
      title: `View: ${currentView}`,
    });
  }, [currentView]);

  const likes = data?.data?.likes || [];
  const views = data?.data?.views || [];

  const status = data || [];
  const likeHandler = async () => {
    try {
      await hasLiked().unwrap();
      // alert("you liked thiss");
    } catch (e) {
      console.log(e);
    }
  };

  // Update the Vecna Hook
  const [isUpsideDown] = useSecretCode(
    "vecna",
    "hawkins",
    () => {
      if (audioState.playing) {
        audioState.setVolume(0); // Mute it instead of pausing
        playSfx("vecna");
      }
      ReactGA.event({
        category: "Secret Code",
        action: "Triggered Vecna Protocol",
        label: "Code: vecna",
      });
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
    ReactGA.event({
      category: "Secret Code",
      action: "Triggered Codered Protocol",
      label: "Code: CODERED",
    });
  }, [isCodeRed, setIsCodeRed]);

  // 2. ELEVEN: Telekinetic Surge
  const [isEleven, setIsEleven] = useSecretCode(
    "11",
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
    "11",
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

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the payload to your backend
      await submitReview({
        name: reviewName,
        message: reviewMsg,
      }).unwrap();

      // If successful, clear the form, play the sound, and close the window
      playSfx("click");
      setReviewName("");
      setReviewMsg("");
      setIsReviewOpen(false);

      // Optional: Log a success message in the console for flavor
      console.log("SYS_MSG: Transmission successful.");
    } catch (error) {
      console.error("SYS_ERR: Transmission failed.", error);
      // You could also add a temporary red error message in the UI here if it fails
    }
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
              <div className="flex flex-col items-center gap-4 md:gap-6 mt-8 md:mt-0 pointer-events-auto animate-in fade-in duration-700 delay-500">
                {" "}
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
        <div className="absolute bottom-4 left-6 md:left-12 flex items-center gap-6 pointer-events-auto z-50 font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-red-500/80">
          <div className="flex items-center gap-2 opacity-70 border-r border-red-900/50 pr-6">
            <Eye className="w-4 h-4" />
            <span className="font-bold">VIEWS: {views}</span>
          </div>

          <button
            onClick={likeHandler}
            className="flex items-center gap-2 hover:text-white transition-all group"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                hasLiked
                  ? "fill-red-600 text-red-600 scale-110 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                  : "group-hover:scale-110 group-hover:text-red-500"
              }`}
            />
            <span className={hasLiked ? "text-red-500 font-bold" : ""}>
              LIKES: {likes}
            </span>
          </button>
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setIsReviewOpen(!isReviewOpen);
                playSfx("click");
              }}
              className="flex items-center gap-2 hover:text-white transition-all group relative"
            >
              <MessageSquare className="w-4 h-4 group-hover:text-red-500 group-hover:scale-110 transition-all" />
              <span>Add Review</span>
            </button>

            {/* NEW: REVIEW POPUP WINDOW */}
            {isReviewOpen && (
              <div className="absolute bottom-10 left-0 w-64 md:w-72 bg-black/95 border border-red-900/50 shadow-[0_0_15px_rgba(150,0,0,0.3)] backdrop-blur-md p-4 cursor-default animate-in fade-in slide-in-from-bottom-2 duration-300 z-50">
                <div className="flex justify-between items-center mb-4 border-b border-red-900/50 pb-2">
                  <span className="text-red-600 font-bold tracking-[0.3em]">
                    TRANSMIT_DATA
                  </span>
                  <X
                    className="w-4 h-4 hover:text-white cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsReviewOpen(false);
                    }}
                  />
                </div>

                <form
                  onSubmit={handleReviewSubmit}
                  className="flex flex-col gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    required
                    placeholder="NAME"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="bg-transparent border-b border-red-900/50 text-red-100 placeholder:text-red-900/50 outline-none focus:border-red-500 py-1 text-[10px] tracking-[0.2em]"
                  />
                  <textarea
                    required
                    placeholder="ENTER MESSAGE..."
                    value={reviewMsg}
                    onChange={(e) => setReviewMsg(e.target.value)}
                    rows={3}
                    className="bg-black/50 border border-red-900/50 p-2 text-red-100 placeholder:text-red-900/50 outline-none focus:border-red-500 text-[10px] tracking-[0.1em] resize-none mt-1"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-2 py-2 transition-all tracking-[0.4em] font-bold border ${
                      isSubmitting
                        ? "bg-red-900/20 border-red-900/50 text-red-700 cursor-not-allowed"
                        : "bg-red-950/30 hover:bg-red-900/50 border-red-900 hover:border-red-500 text-red-500 hover:text-white"
                    }`}
                  >
                    {isSubmitting ? "TRANSMITTING..." : "SEND"}
                  </button>
                </form>
              </div>
            )}
          </div>
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
};;;

// Preload textures globally to prevent lag on initial render
useTexture.preload([
  CONFIG.textures.front,
  CONFIG.textures.back,
  CONFIG.textures.displacement,
]);

export default App;
