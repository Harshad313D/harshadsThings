import { useState, useEffect } from "react";

// Default is set to 15 seconds (15000ms) so you don't have to wait forever to test it!
export const useIdle = (delay = 15000) => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timeoutId;

    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(timeoutId);
      // Set the timer to trigger the creepy idle state
      timeoutId = setTimeout(() => setIsIdle(true), delay);
    };

    // Listen for any sign of life from the user
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    window.addEventListener("click", resetIdle);
    window.addEventListener("touchstart", resetIdle);

    resetIdle(); // Start the timer on mount

    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("click", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
      clearTimeout(timeoutId);
    };
  }, [delay]);

  return isIdle;
};
