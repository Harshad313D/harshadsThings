import { useRef, useState, useEffect, useCallback } from "react";

export const useAudio = (url) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(url);
    audioRef.current.loop = true;
    audioRef.current.volume = 0;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [url]);

  const startExperience = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => {
        setPlaying(true);
        setInitialized(true);
        let vol = 0;
        const fadeInterval = setInterval(() => {
          if (vol < 0.4) {
            vol += 0.05;
            audioRef.current.volume = Math.min(vol, 0.4);
          } else clearInterval(fadeInterval);
        }, 150);
      })
      .catch((e) => {
        console.warn("Audio blocked:", e);
        setInitialized(true);
      });
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch((e) => console.warn(e));
    setPlaying(!playing);
  }, [playing]);

  // NEW: Explicit Pause and Play functions!
  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) audioRef.current.play().catch((e) => console.warn(e));
    setPlaying(true);
  }, []);

  // Make sure to return them here at the bottom:
  return { playing, toggle, startExperience, initialized, pause, play };
};
