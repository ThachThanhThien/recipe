"use client";

import { useState } from "react";
import { ShoppingBasket, Check } from "lucide-react";
import Link from "next/link";
import { useShoppingList } from "@/hooks/use-shopping-list";
import { pickLocale } from "@/lib/i18n";
import type { Recipe } from "@/lib/api";

interface AddToShoppingListProps {
  recipe: Recipe;
  scaledIngredients: { name: string; quantity: string; unit: string }[];
}

export function AddToShoppingList({ recipe, scaledIngredients }: AddToShoppingListProps) {
  const { addMany } = useShoppingList();
  const [justAdded, setJustAdded] = useState(false);

  const onAdd = () => {
    if (scaledIngredients.length === 0) return;
    addMany(recipe.id, pickLocale(recipe.title, undefined, "Recipe"), scaledIngredients);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2500);
  };

  if (justAdded) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          disabled
          className="w-full bg-accent text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <Check size={18} /> Added to shopping list
        </button>
        <Link
          href="/shopping-list"
          className="block text-center text-sm font-semibold text-primary hover:underline"
        >
          View shopping list →
        </Link>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={scaledIngredients.length === 0}
      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      <ShoppingBasket size={18} /> Add to shopping list
    </button>
  );
}
