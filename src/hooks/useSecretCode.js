// // import { useState, useEffect } from "react";

// // export const useSecretCode = (secretCode, resetCode = "home") => {
// //   const [isActive, setIsActive] = useState(false);
// //   const [inputSequence, setInputSequence] = useState("");

// //   useEffect(() => {
// //     const handleKeyDown = (e) => {
// //       const key = e.key.toLowerCase();

// //       setInputSequence((prev) => {
// //         const newSequence = (prev + key).slice(-10); // Keep last 10 chars

// //         if (newSequence.endsWith(secretCode.toLowerCase())) {
// //           setIsActive(true);
// //           return ""; // clear
// //         }
// //         if (newSequence.endsWith(resetCode.toLowerCase())) {
// //           setIsActive(false);
// //           return ""; // clear
// //         }
// //         return newSequence;
// //       });
// //     };

// //     window.addEventListener("keydown", handleKeyDown);
// //     return () => window.removeEventListener("keydown", handleKeyDown);
// //   }, [secretCode, resetCode]);

// //   return isActive;
// // };

// import { useState, useEffect, useRef } from "react";

// export const useSecretCode = (
//   secretCode,
//   resetCode = "home",
//   onActivate,
//   onDeactivate,
// ) => {
//   const [isActive, setIsActive] = useState(false);
//   const [inputSequence, setInputSequence] = useState("");

//   // We use a ref so the event listener knows exactly when the state changes
//   const activeRef = useRef(false);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const key = e.key.toLowerCase();

//       setInputSequence((prev) => {
//         const newSequence = (prev + key).slice(-10); // Keep last 10 chars

//         // ENTERING THE VOID
//         if (
//           newSequence.endsWith(secretCode.toLowerCase()) &&
//           !activeRef.current
//         ) {
//           activeRef.current = true;
//           setIsActive(true);
//           if (onActivate) onActivate(); // Play Bong!
//           return "";
//         }

//         // RETURNING HOME
//         if (
//           newSequence.endsWith(resetCode.toLowerCase()) &&
//           activeRef.current
//         ) {
//           activeRef.current = false;
//           setIsActive(false);
//           if (onDeactivate) onDeactivate(); // Play Home!
//           return "";
//         }

//         return newSequence;
//       });
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [secretCode, resetCode, onActivate, onDeactivate]);

//   return isActive;
// };

import { useState, useEffect, useRef } from "react";

export const useSecretCode = (
  secretCode,
  resetCode = "hawkins",
  onActivate,
  onDeactivate,
) => {
  const [isActive, setIsActive] = useState(false);
  const [inputSequence, setInputSequence] = useState("");

  const activeRef = useRef(false);

  // We store the callbacks in refs so they don't trigger constant useEffect re-renders!
  const activateCb = useRef(onActivate);
  const deactivateCb = useRef(onDeactivate);

  // Keep the refs up to date
  useEffect(() => {
    activateCb.current = onActivate;
    deactivateCb.current = onDeactivate;
  }, [onActivate, onDeactivate]);

  // Sync the ref if someone manually closes it via the button
  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      setInputSequence((prev) => {
        const newSequence = (prev + key).slice(-10);

        if (
          newSequence.endsWith(secretCode.toLowerCase()) &&
          !activeRef.current
        ) {
          activeRef.current = true;
          setIsActive(true);
          if (activateCb.current) activateCb.current();
          return "";
        }

        if (
          newSequence.endsWith(resetCode.toLowerCase()) &&
          activeRef.current
        ) {
          activeRef.current = false;
          setIsActive(false);
          if (deactivateCb.current) deactivateCb.current();
          return "";
        }

        return newSequence;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [secretCode, resetCode]); // Notice the callbacks are removed from this array!

  // Return the state AND the setter so we can manually close it
  return [isActive, setIsActive];
};