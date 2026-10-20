"use client";

import { useFavorites } from "./use-favorites";
import { useShoppingList } from "./use-shopping-list";

/** Counts shown on the Saved and Shopping nav items (0 until localStorage is read). */
export function useNavBadges(): Record<"saved" | "shopping", number> {
  const favorites = useFavorites();
  const shopping = useShoppingList();
  return {
    saved: favorites.hydrated ? favorites.count : 0,
    shopping: shopping.hydrated ? shopping.uncheckedCount : 0,
  };
}
