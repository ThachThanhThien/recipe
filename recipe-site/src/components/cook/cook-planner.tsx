"use client";

import { useMemo, type ReactNode } from "react";
import { ArrowDown, CookingPot, Minus, Plus, SearchX, X } from "lucide-react";
import { ComboCard } from "./combo-card";
import { IngredientPicker } from "./ingredient-picker";
import { PantryBasics } from "./pantry-basics";
import { EmptyState } from "@/components/empty-state";
import { useLang, useT } from "@/components/lang-provider";
import { ChipRow, buttonClass, chipClass } from "@/components/ui";
import { usePantry } from "@/hooks/use-pantry";
import { useShoppingList } from "@/hooks/use-shopping-list";
import type { Difficulty } from "@/lib/api";
import { DEFAULT_BASICS, MAX_DISHES, MAX_MISSING, findCombos, type CookIngredient, type CookRecipe } from "@/lib/cook";
import { formatMinutes } from "@/lib/time";
import { cn } from "@/lib/utils";

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const TIME_LIMITS = [30, 60];
const POPULAR_COUNT = 8;

interface CookPlannerProps {
  ingredients: CookIngredient[];
  recipes: CookRecipe[];
}

/**
 * Pick what's in your kitchen and how many dishes you want; suggestions update as you go.
 * Everything you choose is remembered on this device (see usePantry).
 */
export function CookPlanner({ ingredients, recipes }: CookPlannerProps) {
  const t = useT();
  const lang = useLang();
  const pantry = usePantry();
  // One shopping-list instance for the whole page, so adds from different cards don't overwrite each other.
  const shopping = useShoppingList();
  // A dish can show up in several suggestions; don't list its items twice.
  const addMissing = (recipeId: number, recipeTitle: string, lines: { name: string; quantity: string; unit: string }[]) => {
    const listed = new Set(shopping.items.filter((i) => i.recipeId === recipeId).map((i) => i.name));
    const fresh = lines.filter((line) => !listed.has(line.name));
    if (fresh.length > 0) shopping.addMany(recipeId, recipeTitle, fresh);
  };
  const { dishes, maxMissing, maxMinutes, difficulty, useBasics } = pantry;

  const byId = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);
  // Ids from an older save may point at ingredients that have since been removed.
  const mine = useMemo(() => pantry.mine.filter((id) => byId.has(id)), [pantry.mine, byId]);
  const basics = useMemo(() => pantry.basics.filter((id) => byId.has(id)), [pantry.basics, byId]);
  const mineSet = useMemo(() => new Set(mine), [mine]);

  const result = useMemo(
    () => findCombos(recipes, mine, useBasics ? basics : [], { dishes, maxMissing, maxMinutes, difficulty }),
    [recipes, mine, basics, useBasics, dishes, maxMissing, maxMinutes, difficulty],
  );

  const popular = useMemo(() => {
    const skip = new Set([...DEFAULT_BASICS, ...basics, ...mine]);
    return [...ingredients]
      .filter((i) => !skip.has(i.id))
      .sort((a, b) => b.uses - a.uses)
      .slice(0, POPULAR_COUNT);
  }, [ingredients, basics, mine]);

  const filtered = maxMinutes !== null || difficulty !== null;

  let results: ReactNode;
  if (!pantry.hydrated) {
    results = <div className="h-96 animate-pulse rounded-2xl bg-muted" aria-hidden />;
  } else if (mine.length === 0) {
    results = <EmptyState icon={CookingPot} title={t("planner.startTitle")} description={t("planner.startDesc")} />;
  } else if (result.combos.length === 0) {
    results = (
      <EmptyState
        icon={SearchX}
        title={t("planner.noneTitle")}
        description={t("planner.noneDesc")}
        action={
          filtered && (
            <button
              type="button"
              onClick={() => pantry.set({ maxMinutes: null, difficulty: null })}
              className={buttonClass("secondary")}
            >
              {t("recipes.clear")}
            </button>
          )
        }
      />
    );
  } else {
    const [best, ...others] = result.combos;
    const card = (combo: (typeof result.combos)[number], title: string, isBest = false) => (
      <ComboCard
        key={combo.dishes.map((d) => d.recipe.id).join("-")}
        combo={combo}
        title={title}
        mineCount={mine.length}
        byId={byId}
        onAddMissing={addMissing}
        best={isBest}
      />
    );
    results = (
      <div className="space-y-6">
        {result.candidates < dishes && (
          <p className="rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary-soft-foreground">
            {t("planner.short", { n: result.candidates, want: dishes })}
          </p>
        )}
        {card(best, t("planner.best"), true)}
        {others.length > 0 && (
          <div>
            <h3 className="mb-3 text-base font-semibold tracking-tight">{t("planner.others")}</h3>
            <div className="space-y-4">{others.map((combo, i) => card(combo, t("planner.option", { n: i + 2 })))}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 pb-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div className="space-y-6">
        <section aria-labelledby="planner-mine">
          <h2 id="planner-mine" className="mb-3 text-lg font-semibold tracking-tight">
            {t("planner.mine")}
          </h2>
          <IngredientPicker
            ingredients={ingredients}
            exclude={mineSet}
            onPick={pantry.addMine}
            onRemoveLast={() => mine.length > 0 && pantry.removeMine(mine[mine.length - 1])}
            placeholder={t("planner.addPlaceholder")}
            label={t("planner.addAria")}
          />
          {mine.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {mine.map((id) => {
                const name = byId.get(id)?.name ?? "";
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => pantry.removeMine(id)}
                    aria-label={t("planner.remove", { name })}
                    className={cn(chipClass(true), "pr-3")}
                  >
                    {name}
                    <X size={14} aria-hidden />
                  </button>
                );
              })}
              <button type="button" onClick={() => pantry.set({ mine: [] })} className={cn(buttonClass("ghost"), "h-10 px-3")}>
                {t("planner.clearAll")}
              </button>
            </div>
          )}
          {popular.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">{t("planner.quickAdd")}</p>
              <ChipRow label={t("planner.quickAdd")}>
                {popular.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => pantry.addMine(i.id)}
                    aria-label={t("planner.add", { name: i.name })}
                    className={chipClass(false)}
                  >
                    <Plus size={14} aria-hidden />
                    {i.name}
                  </button>
                ))}
              </ChipRow>
            </div>
          )}
          {mine.length > 0 && (
            <a href="#planner-results" className={cn(buttonClass("primary"), "mt-4 w-full lg:hidden")}>
              <ArrowDown size={18} aria-hidden />
              {t("planner.seeSuggestions")}
            </a>
          )}
        </section>

        <PantryBasics
          ingredients={ingredients}
          byId={byId}
          basics={basics}
          useBasics={useBasics}
          onUseBasics={(on) => pantry.set({ useBasics: on })}
          onToggle={pantry.toggleBasic}
          onReset={pantry.resetBasics}
        />

        <section aria-labelledby="planner-options" className="space-y-5">
          <h2 id="planner-options" className="text-lg font-semibold tracking-tight">
            {t("planner.options")}
          </h2>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted p-2 pl-4">
            <span className="text-sm font-medium">{t("planner.dishes")}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => pantry.set({ dishes: dishes - 1 })}
                disabled={dishes <= 1}
                aria-label={t("planner.fewerDishes")}
                className="grid size-10 place-items-center rounded-xl bg-card shadow-card disabled:opacity-40"
              >
                <Minus size={18} />
              </button>
              <output className="w-9 text-center text-lg font-semibold tabular-nums" aria-live="polite">
                {dishes}
              </output>
              <button
                type="button"
                onClick={() => pantry.set({ dishes: dishes + 1 })}
                disabled={dishes >= MAX_DISHES}
                aria-label={t("planner.moreDishes")}
                className="grid size-10 place-items-center rounded-xl bg-card shadow-card disabled:opacity-40"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <Field label={t("planner.maxMissing")}>
            {Array.from({ length: MAX_MISSING + 1 }, (_, n) => (
              <button
                key={n}
                type="button"
                aria-pressed={maxMissing === n}
                onClick={() => pantry.set({ maxMissing: n })}
                className={cn(chipClass(maxMissing === n), "min-w-11 justify-center px-3")}
              >
                {n === 0 ? t("planner.missingNone") : n}
              </button>
            ))}
          </Field>

          <Field label={t("planner.time")}>
            {[null, ...TIME_LIMITS].map((limit) => (
              <button
                key={limit ?? "any"}
                type="button"
                aria-pressed={maxMinutes === limit}
                onClick={() => pantry.set({ maxMinutes: limit })}
                className={chipClass(maxMinutes === limit)}
              >
                {limit === null ? t("planner.anyTime") : `≤ ${formatMinutes(limit, lang)}`}
              </button>
            ))}
          </Field>

          <Field label={t("recipes.difficulty")}>
            {[null, ...DIFFICULTIES].map((level) => (
              <button
                key={level ?? "any"}
                type="button"
                aria-pressed={difficulty === level}
                onClick={() => pantry.set({ difficulty: level })}
                className={chipClass(difficulty === level)}
              >
                {level === null ? t("recipes.anyLevel") : t(`difficulty.${level}`)}
              </button>
            ))}
          </Field>
        </section>
      </div>

      <section id="planner-results" aria-labelledby="planner-results-title" className="min-w-0 scroll-mt-20">
        <h2 id="planner-results-title" className="sr-only">
          {t("planner.results")}
        </h2>
        {results}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <ChipRow label={label}>{children}</ChipRow>
    </div>
  );
}
