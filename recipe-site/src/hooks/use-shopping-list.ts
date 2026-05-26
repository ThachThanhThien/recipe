"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

export interface ShoppingItem {
  id: string;
  recipeId: number;
  recipeTitle: string;
  name: string;
  quantity: string;
  unit: string;
  checked: boolean;
  addedAt: number;
}

const KEY = "tastyfresh.shopping-list";

export function useShoppingList() {
  const [items, setItems, hydrated] = useLocalStorage<ShoppingItem[]>(KEY, []);

  const addMany = useCallback(
    (recipeId: number, recipeTitle: string, ingredients: { name: string; quantity: string; unit: string }[]) => {
      setItems((prev) => {
        const stamp = Date.now();
        const additions: ShoppingItem[] = ingredients.map((ing, i) => ({
          id: `${recipeId}-${stamp}-${i}`,
          recipeId,
          recipeTitle,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          checked: false,
          addedAt: stamp,
        }));
        return [...prev, ...additions];
      });
    },
    [setItems],
  );

  const toggle = useCallback(
    (id: string) =>
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, checked: !x.checked } : x))),
    [setItems],
  );

  const remove = useCallback(
    (id: string) => setItems((prev) => prev.filter((x) => x.id !== id)),
    [setItems],
  );

  const clearRecipe = useCallback(
    (recipeId: number) => setItems((prev) => prev.filter((x) => x.recipeId !== recipeId)),
    [setItems],
  );

  const clearChecked = useCallback(
    () => setItems((prev) => prev.filter((x) => !x.checked)),
    [setItems],
  );

  const clearAll = useCallback(() => setItems([]), [setItems]);

  return {
    items,
    hydrated,
    count: items.length,
    uncheckedCount: items.filter((x) => !x.checked).length,
    addMany,
    toggle,
    remove,
    clearRecipe,
    clearChecked,
    clearAll,
  };
}
