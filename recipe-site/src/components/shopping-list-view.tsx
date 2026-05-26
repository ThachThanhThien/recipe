"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Check, Trash2, ShoppingBasket } from "lucide-react";
import { useShoppingList, type ShoppingItem } from "@/hooks/use-shopping-list";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

export function ShoppingListView() {
  const { items, hydrated, toggle, remove, clearRecipe, clearChecked, clearAll, count, uncheckedCount } =
    useShoppingList();

  const grouped = useMemo(() => {
    const map = new Map<number, { recipeId: number; recipeTitle: string; items: ShoppingItem[] }>();
    for (const item of items) {
      const existing = map.get(item.recipeId);
      if (existing) existing.items.push(item);
      else map.set(item.recipeId, { recipeId: item.recipeId, recipeTitle: item.recipeTitle, items: [item] });
    }
    return Array.from(map.values());
  }, [items]);

  if (!hydrated) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-secondary/40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (count === 0) {
    return (
      <EmptyState
        icon={<ShoppingBasket size={48} className="text-primary" strokeWidth={1.5} />}
        title="Your shopping list is empty"
        description="Open a recipe and tap 'Add to shopping list' — items land here, grouped by recipe."
        action={
          <Link
            href="/recipes"
            className="mt-4 inline-block bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            Find a recipe
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <p className="text-muted-foreground">
          <strong className="text-foreground">{uncheckedCount}</strong> of{" "}
          <strong className="text-foreground">{count}</strong> still to buy
        </p>
        <div className="flex gap-3">
          {count - uncheckedCount > 0 && (
            <button
              type="button"
              onClick={clearChecked}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear checked
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear the whole list?")) clearAll();
            }}
            className="text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {grouped.map((group) => (
          <section key={group.recipeId} className="bg-card rounded-3xl border border-border/60 p-5 sm:p-6">
            <header className="flex items-center justify-between mb-4">
              <Link
                href={`/recipes/${group.recipeId}`}
                className="font-outfit text-xl font-black hover:text-primary transition-colors"
              >
                {group.recipeTitle}
              </Link>
              <button
                type="button"
                onClick={() => clearRecipe(group.recipeId)}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors font-semibold flex items-center gap-1"
              >
                <Trash2 size={12} /> Remove
              </button>
            </header>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-pressed={item.checked}
                    aria-label={`Mark ${item.name} as ${item.checked ? "not bought" : "bought"}`}
                    className={cn(
                      "w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                      item.checked ? "bg-primary border-primary" : "border-muted-foreground/40 hover:border-primary",
                    )}
                  >
                    {item.checked && <Check size={14} className="text-white" />}
                  </button>
                  <span
                    className={cn(
                      "flex-grow font-semibold",
                      item.checked && "line-through text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </span>
                  <span className={cn("text-sm text-primary font-bold tabular-nums", item.checked && "opacity-50")}>
                    {item.quantity}
                    {item.unit ? ` ${item.unit}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <Trash2 size={14} />
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
