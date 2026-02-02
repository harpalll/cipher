export const storeData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error);
    if (
      error instanceof DOMException &&
      (error.code === 22 || error.name === "QuotaExceededError")
    ) {
      console.warn("Storage quota exceeded. Consider clearing some space.");
    } else if (
      error instanceof DOMException &&
      (error.code === 18 || error.name === "SecurityError")
    ) {
      console.warn(
        "Local storage access denied (e.g., in private browsing mode).",
      );
    } else {
      console.error("An unexpected error occurred with localStorage:", error);
    }
  }
};

export const getData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return defaultValue;
    return JSON.parse(stored) as T;
  } catch (_) {
    return defaultValue;
  }
};

export const removeData = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage item "${key}":`, error);
  }
};
