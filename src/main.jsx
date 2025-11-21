import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./routes/router.jsx";
import "./index.css";
import { bootTheme } from "./theme/theme.client";

// Ensure theme bootstrapped before mount (defaults to dark when unset)
bootTheme();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
