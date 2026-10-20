"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Check, ShoppingBasket, X } from "lucide-react";
import { useShoppingList, type ShoppingItem } from "@/hooks/use-shopping-list";
import { EmptyState } from "@/components/empty-state";
import { buttonClass } from "@/components/ui";
import { useT } from "@/components/lang-provider";
import { formatAmount } from "@/lib/scale";
import { cn } from "@/lib/utils";

export function ShoppingListView() {
  const t = useT();
  const { items, hydrated, toggle, remove, clearRecipe, clearChecked, clearAll, count, uncheckedCount } =
    useShoppingList();

  const groups = useMemo(() => {
    const map = new Map<number, { recipeId: number; recipeTitle: string; items: ShoppingItem[] }>();
    for (const item of items) {
      const group = map.get(item.recipeId);
      if (group) group.items.push(item);
      else map.set(item.recipeId, { recipeId: item.recipeId, recipeTitle: item.recipeTitle, items: [item] });
    }
    return [...map.values()];
  }, [items]);

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-hidden>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (count === 0) {
    return (
      <EmptyState
        icon={ShoppingBasket}
        title={t("shop.emptyTitle")}
        description={t("shop.emptyDesc")}
        action={
          <Link href="/recipes" className={buttonClass("primary")}>
            {t("shop.findRecipe")}
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {t("shop.remaining", { left: uncheckedCount, total: count })}
        </p>
        <div className="flex gap-1">
          {count > uncheckedCount && (
            <button type="button" onClick={clearChecked} className={buttonClass("ghost")}>
              {t("shop.clearChecked")}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t("shop.clearConfirm"))) clearAll();
            }}
            className={buttonClass("ghost")}
          >
            {t("shop.clearAll")}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <section key={group.recipeId} className="rounded-2xl border border-border bg-card">
            <header className="flex items-center justify-between gap-2 border-b border-border py-1 pl-4 pr-1">
              <Link href={`/recipes/${group.recipeId}`} className="min-w-0 py-2 font-semibold hover:text-primary">
                {group.recipeTitle}
              </Link>
              <button
                type="button"
                onClick={() => clearRecipe(group.recipeId)}
                aria-label={t("shop.removeRecipe", { name: group.recipeTitle })}
                className="grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-destructive"
              >
                <X size={18} />
              </button>
            </header>
            <ul className="divide-y divide-border">
              {group.items.map((item) => (
                <li key={item.id} className="flex items-center">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.checked}
                    aria-label={t("shop.markBought", { name: item.name })}
                    onClick={() => toggle(item.id)}
                    className="flex min-h-12 flex-1 items-center gap-3 py-2 pl-4 text-left"
                  >
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-md border-2 transition-colors",
                        item.checked ? "border-success bg-success text-white dark:text-background" : "border-input",
                      )}
                    >
                      {item.checked && <Check size={14} strokeWidth={3} />}
                    </span>
                    <span className={cn("flex-1", item.checked && "text-muted-foreground line-through")}>
                      {item.name}
                    </span>
                    <span
                      className={cn("shrink-0 text-sm font-medium tabular-nums", item.checked && "text-muted-foreground")}
                    >
                      {formatAmount(item.quantity, item.unit)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={t("shop.removeItem", { name: item.name })}
                    className="mx-1 grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-destructive"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
