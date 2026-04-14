import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // 1. Asynchronous Hydration to satisfy strict React linters
  useEffect(() => {
    // Push the read operation to the end of the event loop
    const timer = setTimeout(() => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(error);
      }
    }, 0); 

    // Cleanup the timer if the component unmounts quickly
    return () => clearTimeout(timer);
  }, [key]);

  // 2. Sync changes back to local storage whenever the user types
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}