"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { scaleQuantity } from "@/lib/scale";

export interface IngredientLine {
  id: number;
  name: string;
  quantity: string;
  unit: string;
}

interface RecipeSessionValue {
  recipeId: number;
  title: string;
  baseServings: number;
  servings: number;
  setServings: (servings: number) => void;
  /** Ingredients scaled to the chosen servings. */
  ingredients: IngredientLine[];
  steps: string[];
}

const RecipeSessionContext = createContext<RecipeSessionValue | null>(null);

/**
 * State shared by the parts of a recipe page you cook with: the chosen servings drive
 * the ingredient list, the shopping-list button and cooking mode alike.
 */
export function RecipeSession({
  recipeId,
  title,
  baseServings,
  ingredients,
  steps,
  children,
}: {
  recipeId: number;
  title: string;
  baseServings: number;
  ingredients: IngredientLine[];
  steps: string[];
  children: ReactNode;
}) {
  const base = Math.max(1, baseServings || 1);
  const [servings, setServings] = useState(base);
  const scaled = useMemo(
    () => ingredients.map((i) => ({ ...i, quantity: scaleQuantity(i.quantity, servings / base) })),
    [ingredients, servings, base],
  );

  return (
    <RecipeSessionContext
      value={{ recipeId, title, baseServings: base, servings, setServings, ingredients: scaled, steps }}
    >
      {children}
    </RecipeSessionContext>
  );
}

export function useRecipeSession(): RecipeSessionValue {
  const value = useContext(RecipeSessionContext);
  if (!value) throw new Error("useRecipeSession must be used inside <RecipeSession>");
  return value;
}
