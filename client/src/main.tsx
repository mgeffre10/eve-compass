import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"

// This is boilerplate you'll rarely touch: find the <div id="root">
// from index.html and render your React component tree into it.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
