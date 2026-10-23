"use client";

import { useId, useRef, useState } from "react";
import { CookingTips } from "@/components/cooking-tips";
import { IngredientList } from "@/components/ingredient-list";
import { InstructionSteps } from "@/components/instruction-steps";
import { useRecipeSession } from "@/components/recipe-session";
import { useT } from "@/components/lang-provider";
import { cn } from "@/lib/utils";

type Tab = "ingredients" | "steps";

/**
 * Phones: a sticky Ingredients | Steps switch, so the list you shop and prep from is
 * one tap away. Large screens: both side by side, ingredients pinned while you scroll.
 */
export function RecipeBody() {
  const t = useT();
  const id = useId();
  const { ingredients, steps } = useRecipeSession();
  const [tab, setTab] = useState<Tab>("ingredients");
  const topRef = useRef<HTMLDivElement>(null);

  const select = (next: Tab) => {
    setTab(next);
    // If the switch is stuck to the top, jump to the start of the new list.
    const top = topRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) topRef.current?.scrollIntoView({ block: "start" });
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "ingredients", label: t("detail.ingredients"), count: ingredients.length },
    { key: "steps", label: t("detail.steps"), count: steps.length },
  ];

  return (
    <div ref={topRef} className="mt-8 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
      <div className="sticky top-14 z-20 -mx-4 mb-4 md:top-16 bg-background/90 px-4 py-2 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:hidden">
        <div role="tablist" className="grid grid-cols-2 rounded-xl bg-muted p-1">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`${id}-${key}-tab`}
              aria-selected={tab === key}
              aria-controls={`${id}-${key}`}
              onClick={() => select(key)}
              className={cn(
                "h-10 rounded-lg text-sm font-semibold transition-colors",
                tab === key ? "bg-card text-foreground shadow-card" : "text-muted-foreground",
              )}
            >
              {label} <span className="font-normal text-muted-foreground">({count})</span>
            </button>
          ))}
        </div>
      </div>

      <section
        id={`${id}-ingredients`}
        role="tabpanel"
        aria-labelledby={`${id}-ingredients-tab`}
        className={cn(tab === "ingredients" ? "block" : "hidden", "lg:sticky lg:top-24 lg:block lg:self-start")}
      >
        <h2 className="mb-4 hidden text-xl font-semibold tracking-tight lg:block">{t("detail.ingredients")}</h2>
        <IngredientList />
      </section>

      <section
        id={`${id}-steps`}
        role="tabpanel"
        aria-labelledby={`${id}-steps-tab`}
        className={cn(tab === "steps" ? "block" : "hidden", "lg:block")}
      >
        <h2 className="mb-1 hidden text-xl font-semibold tracking-tight lg:block">{t("detail.steps")}</h2>
        <InstructionSteps />
        <CookingTips className="mt-6" />
      </section>
    </div>
  );
}
