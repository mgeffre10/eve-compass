import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// Fonts: each import loads one weight of the font, bundled with the app.
import "@fontsource/ibm-plex-sans/400.css"; // regular text
import "@fontsource/ibm-plex-sans/500.css"; // medium (labels, buttons)
import "@fontsource/ibm-plex-sans/600.css"; // semi-bold (headings, names)
import "@fontsource/ibm-plex-mono/400.css"; // numbers, IDs, durations
import "@fontsource/ibm-plex-mono/500.css"; // bold numbers (wallet balance, SP)
import "./index.css"

// This is boilerplate you'll rarely touch: find the <div id="root">
// from index.html and render your React component tree into it.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
