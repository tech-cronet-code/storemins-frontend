// src/hooks/useDebounce.ts
import { useEffect, useState } from "react";

// useDebounce.ts
export function useDebounce<T>(value: T, delay = 1000): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
