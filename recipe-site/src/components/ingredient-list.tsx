"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus, RotateCcw } from "lucide-react";
import { pickLocale } from "@/lib/i18n";
import { scaleQuantity } from "@/lib/scale";
import { AddToShoppingList } from "@/components/add-to-shopping-list";
import type { Recipe } from "@/lib/api";
import { cn } from "@/lib/utils";

interface IngredientListProps {
  recipe: Recipe;
}

export function IngredientList({ recipe }: IngredientListProps) {
  const baseServings = Math.max(1, recipe.servings || 1);
  const [servings, setServings] = useState(baseServings);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const factor = servings / baseServings;

  const items = useMemo(
    () =>
      (recipe.recipeIngredients ?? []).map((ri) => ({
        id: ri.id,
        name: pickLocale(ri.ingredient?.name, undefined, "Ingredient"),
        quantity: scaleQuantity(ri.quantity ?? "", factor),
        unit: ri.ingredient?.unit ?? "",
      })),
    [recipe, factor],
  );

  const toggle = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allChecked = items.length > 0 && checked.size === items.length;

  return (
    <div className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-outfit text-2xl font-black">Ingredients</h3>
        {items.length > 0 && (
          <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
            {checked.size}/{items.length}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-secondary/40">
        <span className="text-sm font-semibold">Servings</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            aria-label="Decrease servings"
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="font-black text-xl w-8 text-center tabular-nums">{servings}</span>
          <button
            type="button"
            onClick={() => setServings((s) => Math.min(99, s + 1))}
            aria-label="Increase servings"
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
          >
            <Plus size={14} />
          </button>
          {servings !== baseServings && (
            <button
              type="button"
              onClick={() => setServings(baseServings)}
              aria-label="Reset servings"
              className="ml-1 text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No ingredients listed for this recipe yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((ing) => {
            const isChecked = checked.has(ing.id);
            return (
              <li key={ing.id}>
                <button
                  type="button"
                  onClick={() => toggle(ing.id)}
                  aria-pressed={isChecked}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 p-3 rounded-2xl border border-transparent text-left transition-all",
                    isChecked
                      ? "bg-primary/5 border-primary/15 opacity-70"
                      : "hover:bg-secondary/50 hover:border-border",
                  )}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span
                      className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                        isChecked ? "bg-primary border-primary" : "border-muted-foreground/40",
                      )}
                    >
                      {isChecked && <Check size={14} className="text-white" />}
                    </span>
                    <span className={cn("font-semibold truncate", isChecked && "line-through text-muted-foreground")}>
                      {ing.name}
                    </span>
                  </span>
                  <span className="text-primary font-bold text-sm shrink-0 tabular-nums">
                    {ing.quantity}
                    {ing.unit ? ` ${ing.unit}` : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {items.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border/40">
          <AddToShoppingList recipe={recipe} scaledIngredients={items} />
        </div>
      )}

      {allChecked && items.length > 0 && (
        <div className="mt-4 p-4 rounded-2xl bg-accent/10 border border-accent/20 text-accent-foreground text-sm text-center">
          ✅ You&apos;re ready to start cooking!
        </div>
      )}
    </div>
  );
}
