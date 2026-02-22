import React, { createContext, useContext, useRef, useCallback, useState } from "react";

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  // Preload sound effects so there is no lag
  const sfxRefs = useRef({
    click: new Audio("/Sound/click.mp3"), 
    hover: new Audio("/Sound/hover.mp3"),
    vecna: new Audio("/Sound/bong.mp3"),
    hawkins: new Audio("/Sound/home.mp3"),
    // ADDED: The NeverEnding Story song!
    neverending: new Audio("/Sound/neverending.mp3"), 
  });

  if (sfxRefs.current.hover) sfxRefs.current.hover.volume = 0.2;

  const setGlobalSound = (status) => setIsSoundEnabled(status);

  // Function to PLAY sounds
  const playSfx = useCallback((type) => {
    if (!isSoundEnabled) return;

    const audio = sfxRefs.current[type];
    if (audio) {
      audio.currentTime = 0; 
      audio.play().catch((e) => console.warn("SFX blocked:", e));
    }
  }, [isSoundEnabled]);

  // ADDED: Function to STOP long sounds like the song
  const stopSfx = useCallback((type) => {
    const audio = sfxRefs.current[type];
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Rewind for next time
    }
  }, []);

  return (
    // Make sure playSfx, stopSfx, and setGlobalSound are all exported here!
    <SoundContext.Provider value={{ playSfx, stopSfx, setGlobalSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);