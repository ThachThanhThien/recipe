"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { AddToShoppingList } from "@/components/add-to-shopping-list";
import { useRecipeSession } from "@/components/recipe-session";
import { useT } from "@/components/lang-provider";
import { formatAmount } from "@/lib/scale";
import { cn } from "@/lib/utils";

export function IngredientList() {
  const t = useT();
  const { ingredients, servings, setServings, baseServings } = useRecipeSession();
  const [have, setHave] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setHave((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div>
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted p-2 pl-4">
        <span className="text-sm font-medium">{t("detail.servings")}</span>
        <div className="flex items-center gap-1">
          {servings !== baseServings && (
            <button
              type="button"
              onClick={() => setServings(baseServings)}
              className="h-10 rounded-lg px-2 text-sm font-medium text-primary hover:bg-card"
            >
              {t("detail.reset")}
            </button>
          )}
          <button
            type="button"
            onClick={() => setServings(Math.max(1, servings - 1))}
            disabled={servings <= 1}
            aria-label={t("detail.fewer")}
            className="grid size-10 place-items-center rounded-xl bg-card shadow-card disabled:opacity-40"
          >
            <Minus size={18} />
          </button>
          <output className="w-9 text-center text-lg font-semibold tabular-nums" aria-live="polite">
            {servings}
          </output>
          <button
            type="button"
            onClick={() => setServings(Math.min(99, servings + 1))}
            aria-label={t("detail.more")}
            className="grid size-10 place-items-center rounded-xl bg-card shadow-card"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {ingredients.length === 0 ? (
        <p className="mt-4 text-muted-foreground">{t("detail.noIngredients")}</p>
      ) : (
        <>
          <ul className="mt-2 divide-y divide-border">
            {ingredients.map((ing) => {
              const checked = have.has(ing.id);
              return (
                <li key={ing.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggle(ing.id)}
                    className="flex min-h-12 w-full items-center gap-3 py-2.5 text-left"
                  >
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-md border-2 transition-colors",
                        checked ? "border-success bg-success text-white dark:text-background" : "border-input",
                      )}
                    >
                      {checked && <Check size={14} strokeWidth={3} />}
                    </span>
                    <span className={cn("flex-1 leading-snug", checked && "text-muted-foreground line-through")}>
                      {ing.name}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-right font-semibold tabular-nums",
                        checked ? "text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {formatAmount(ing.quantity, ing.unit)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mb-4 mt-1 text-sm text-muted-foreground" aria-live="polite">
            {have.size === ingredients.length
              ? t("detail.allReady")
              : t("detail.haveCount", { done: have.size, total: ingredients.length })}
          </p>
          <AddToShoppingList />
        </>
      )}
    </div>
  );
}
