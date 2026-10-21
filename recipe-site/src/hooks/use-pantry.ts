"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import { DEFAULT_BASICS, MAX_DISHES, MAX_MISSING } from "@/lib/cook";
import type { Difficulty } from "@/lib/api";

/** What "What can I cook?" remembers between visits. Ingredients are kept by id, so any language works. */
export interface PantryState {
  mine: number[];
  basics: number[];
  useBasics: boolean;
  dishes: number;
  maxMissing: number;
  maxMinutes: number | null;
  difficulty: Difficulty | null;
}

const KEY = "tastyfresh.pantry";

const DEFAULT_PANTRY: PantryState = {
  mine: [],
  basics: DEFAULT_BASICS,
  useBasics: true,
  dishes: 2,
  maxMissing: 3,
  maxMinutes: null,
  difficulty: null,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(value) || min));

export function usePantry() {
  const [stored, setStored, hydrated] = useLocalStorage<PantryState>(KEY, DEFAULT_PANTRY);
  // Older or hand-edited saves may miss fields or hold out-of-range numbers.
  const state: PantryState = {
    ...DEFAULT_PANTRY,
    ...stored,
    dishes: clamp(stored.dishes ?? DEFAULT_PANTRY.dishes, 1, MAX_DISHES),
    maxMissing: clamp(stored.maxMissing ?? DEFAULT_PANTRY.maxMissing, 0, MAX_MISSING),
  };

  const update = useCallback(
    (patch: (prev: PantryState) => Partial<PantryState>) =>
      setStored((prev) => {
        const current = { ...DEFAULT_PANTRY, ...prev };
        return { ...current, ...patch(current) };
      }),
    [setStored],
  );

  const set = useCallback((patch: Partial<PantryState>) => update(() => patch), [update]);

  const addMine = useCallback(
    (id: number) => update((prev) => ({ mine: prev.mine.includes(id) ? prev.mine : [...prev.mine, id] })),
    [update],
  );

  const removeMine = useCallback(
    (id: number) => update((prev) => ({ mine: prev.mine.filter((x) => x !== id) })),
    [update],
  );

  const toggleBasic = useCallback(
    (id: number) =>
      update((prev) => ({
        basics: prev.basics.includes(id) ? prev.basics.filter((x) => x !== id) : [...prev.basics, id],
      })),
    [update],
  );

  const resetBasics = useCallback(() => set({ basics: DEFAULT_BASICS, useBasics: true }), [set]);

  return { ...state, hydrated, set, addMine, removeMine, toggleBasic, resetBasics };
}
