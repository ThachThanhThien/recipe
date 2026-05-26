"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

const KEY = "tastyfresh.favorites";

export function useFavorites() {
  const [ids, setIds, hydrated] = useLocalStorage<number[]>(KEY, []);

  const isFavorite = useCallback((id: number) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: number) => {
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
    },
    [setIds],
  );

  const clear = useCallback(() => setIds([]), [setIds]);

  return { favorites: ids, isFavorite, toggle, clear, hydrated, count: ids.length };
}
