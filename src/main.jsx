import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SoundProvider } from "./context/SoundContext.jsx";
import store from "./Redux/store.js";
import { Provider } from "react-redux";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SoundProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </SoundProvider>
  </Provider>,
);

// --- HAWKINS MAINFRAME CONSOLE ---
console.clear();
console.log(
  "%c ⚠ WARNING: SYSTEM CRITICAL %c BREACH DETECTED ",
  "color: white; background: #991b1b; padding: 6px; font-weight: bold; border-radius: 2px 0 0 2px;",
  "color: #ef4444; background: #450a0a; padding: 6px; font-weight: bold; border-radius: 0 2px 2px 0;",
);

console.log(
  "%c>> STATUS: %cUNAUTHORIZED ACCESS",
  "color: #71717a; font-family: monospace;",
  "color: #ef4444; font-family: monospace; font-weight: bold;",
);

console.log(
  "%c>> CREATOR OVERRIDE REQUIRED: %c e l e v e n",
  "color: #22d3ee; font-family: monospace;",
  "color: #ffffff; background: #083344; padding: 2px 6px; font-family: monospace; font-weight: bold;",
);

console.log(
  "%c>> CLASSIFIED LOGS INDICATE A CONNECTION TO THE CLOCK. THEY CALL HIM %cV E C N A",
  "color: #71717a; font-family: monospace; font-style: italic;",
  "color: #991b1b; font-family: monospace; font-weight: bold; text-decoration: underline;",
);
console.log(
  "%c>> DO NOT TYPE 'vecna'. REPEAT. DO NOT TYPE 'vecna'.",
  "color: #71717a; font-size: 12px; font-family: monospace; font-style: italic;",
);

console.log(
  "%c>> IF NOTHING WORKS,TYPE AND ENTER %cC O D E R E D ",
  "color: #71717a; font-family: monospace; font-style: italic;",
  "color: #991b1b; font-family: monospace; font-weight: bold; text-decoration: underline;",
);

// console.log(
//   "%c⚠️ WARNING: HAWKINS LAB MAINFRAME BREACHED",
//   "color: red; font-size: 18px; font-weight: bold; font-family: sans-serif;",
// );
// console.log(
//   "%c>> INITIATE SYSTEM OVERRIDE.",
//   "color: #22d3ee; font-size: 14px; font-family: monospace;",
// );
// console.log(
//   "%c>> CREATOR DESIGNATION REQUIRED: [ e l e v e n]",
//   "color: #22d3ee; font-size: 14px; font-family: monospace;",
// );