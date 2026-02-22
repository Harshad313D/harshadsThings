import React, { useEffect, useRef } from "react";

const Flashlight = ({ isActive }) => {
  const lightRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const updateLight = (e) => {
      if (lightRef.current) {
        // We create a radial gradient that is completely transparent at the mouse (x,y)
        // and pitch black everywhere else!
        lightRef.current.style.background = `radial-gradient(circle 250px at ${e.clientX}px ${e.clientY}px, transparent 0%, rgba(0,0,0,0.95) 80%)`;
      }
    };

    window.addEventListener("mousemove", updateLight);

    // Set an initial position off-screen so it doesn't flash in the corner
    if (lightRef.current) {
      lightRef.current.style.background = `radial-gradient(circle 250px at -500px -500px, transparent 0%, rgba(0,0,0,0.95) 80%)`;
    }

    return () => window.removeEventListener("mousemove", updateLight);
  }, [isActive]);

  // If we aren't in the Upside Down, don't render it at all
  if (!isActive) return null;

  return (
    <div
      ref={lightRef}
      // z-[100] puts it above EVERYTHING, but pointer-events-none lets clicks pass right through it!
      className="fixed inset-0 z-[100] pointer-events-none transition-opacity duration-1000"
    ></div>
  );
};

export default Flashlight;
