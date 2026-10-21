"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingBasket } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
import { useT } from "@/components/lang-provider";
import { buttonClass } from "@/components/ui";
import type { Combo, CookIngredient } from "@/lib/cook";
import { cn } from "@/lib/utils";

interface ComboCardProps {
  combo: Combo;
  title: string;
  /** How many ingredients you entered, for "uses 3 of 5". */
  mineCount: number;
  byId: Map<number, CookIngredient>;
  /** Adds one dish's missing ingredients to the shopping list. */
  onAddMissing: (recipeId: number, recipeTitle: string, items: { name: string; quantity: string; unit: string }[]) => void;
  best?: boolean;
}

/** One suggested set of dishes: what each still needs, and everything to buy in one list. */
export function ComboCard({ combo, title, mineCount, byId, onAddMissing, best }: ComboCardProps) {
  const t = useT();
  const [added, setAdded] = useState(false);
  const nameOf = (id: number) => byId.get(id)?.name ?? "";
  const toBuy = combo.toBuy.length;

  const addMissing = () => {
    if (added) return;
    for (const { recipe, missing } of combo.dishes) {
      if (missing.length === 0) continue;
      onAddMissing(
        recipe.id,
        recipe.title,
        missing.map((id) => ({
          name: nameOf(id),
          quantity: recipe.ingredients.find((i) => i.id === id)?.quantity ?? "",
          unit: byId.get(id)?.unit ?? "",
        })),
      );
    }
    setAdded(true);
  };

  return (
    <article className={cn("rounded-2xl border bg-card p-4 sm:p-5", best ? "border-primary/40 shadow-card" : "border-border")}>
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
        <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
          <span className={cn("font-semibold", toBuy === 0 ? "text-success" : "text-foreground")}>
            {toBuy === 0 ? t("planner.cookNow") : toBuy === 1 ? t("planner.buy.one") : t("planner.buy.other", { n: toBuy })}
          </span>
          <span aria-hidden>·</span>
          <span>{t("planner.uses", { used: combo.usedCount, total: mineCount })}</span>
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5">
        {combo.dishes.map(({ recipe, missing }) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} />
            {missing.length > 0 ? (
              <p className="mt-1.5 px-0.5 text-xs leading-snug text-muted-foreground">
                <span className="font-medium text-foreground">{t("planner.missing")}</span> {missing.map(nameOf).join(", ")}
              </p>
            ) : (
              <p className="mt-1.5 flex items-center gap-1 px-0.5 text-xs font-medium text-success">
                <Check size={13} aria-hidden className="shrink-0" />
                {t("planner.haveAll")}
              </p>
            )}
          </li>
        ))}
      </ul>

      {toBuy > 0 && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl bg-muted p-3 sm:flex-row sm:items-center sm:justify-between sm:pl-4">
          <p className="text-sm">
            <span className="font-semibold">{t("planner.toBuy")}</span> {combo.toBuy.map(nameOf).join(", ")}
          </p>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={addMissing}
              className={cn(buttonClass("secondary"), "flex-1", added && "border-success text-success")}
            >
              {added ? <Check size={18} /> : <ShoppingBasket size={18} />}
              <span aria-live="polite">{added ? t("detail.addedToList") : t("planner.addMissing")}</span>
            </button>
            {added && (
              <Link href="/shopping-list" className={buttonClass("ghost")}>
                {t("detail.viewList")}
              </Link>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
