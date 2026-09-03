const SAVE_KEY = "avrupa-kralligi-save-v1";

export const loadGame = (fallback) => {
  try {
    const saved = window.localStorage.getItem(SAVE_KEY);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
};

export const saveGame = (state) => {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable in private or embedded browser contexts.
  }
};

export const resetGame = () => {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore unavailable storage during a local reset.
  }
};
