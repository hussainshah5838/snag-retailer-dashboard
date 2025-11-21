export function bootTheme() {
  try {
    // Force dark mode for the whole app. Project is single-theme (dark-only).
    document.documentElement.classList.add("dark");
    // No events or storage writes — theme is fixed
  } catch (err) {
    console.error(err);
  }
}

export function toggleTheme() {
  // Theme is fixed to dark in this project. Provide a no-op to avoid runtime errors
  // from code that imports toggleTheme.
  console.warn("toggleTheme called but theme is fixed to dark (no-op)");
}
