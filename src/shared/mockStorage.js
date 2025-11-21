// Simple helper for persisting mock data to localStorage so it survives page refreshes.
// Provides load/save/reset helpers that swallow errors (safe for older browsers/test envs).
export function loadMock(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    // initialize
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch (err) {
    console.warn("mockStorage: load failed for", key, err);
    return defaultValue;
  }
}

export function saveMock(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("mockStorage: save failed for", key, err);
  }
}

export function resetMock(key, defaultValue = []) {
  try {
    localStorage.setItem(key, JSON.stringify(defaultValue));
  } catch (err) {
    console.warn("mockStorage: reset failed for", key, err);
  }
}

export default { loadMock, saveMock, resetMock };
