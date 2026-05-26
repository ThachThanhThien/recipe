"use client";

import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";

const KEY = "tastyfresh.recently-viewed";
const LIMIT = 12;

export function useRecentlyViewed() {
  const [ids, setIds, hydrated] = useLocalStorage<number[]>(KEY, []);

  const track = useCallback(
    (id: number) => {
      setIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, LIMIT));
    },
    [setIds],
  );

  const clear = useCallback(() => setIds([]), [setIds]);

  return { ids, track, clear, hydrated };
}

export function useTrackRecentlyViewed(id: number | null | undefined) {
  const { track, hydrated } = useRecentlyViewed();
  useEffect(() => {
    if (hydrated && typeof id === "number" && Number.isFinite(id)) {
      track(id);
    }
  }, [id, hydrated, track]);
}
