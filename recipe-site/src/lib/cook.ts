// "What can I cook?": picks the set of dishes that best fits the ingredients you have.
// Pure functions with type-only imports, so the ranking can be checked with plain Node.
import type { Difficulty, RecipeSummary } from "./api";

/** An ingredient you can pick on the page. */
export interface CookIngredient {
  id: number;
  /** Name in the page's language. */
  name: string;
  /** First ingredient type, e.g. "Fruits", to tell similar names apart. */
  typeName: string | null;
  /** Default unit, added after bare-number quantities on the shopping list. */
  unit: string;
  /** How many recipes use it, for the "popular" suggestions. */
  uses: number;
  /** Accent-free, lower-case name in the page's language. */
  searchName: string;
  /** Accent-free, lower-case names in every language. */
  search: string;
}

export interface CookRecipe extends RecipeSummary {
  ingredients: { id: number; quantity: string }[];
}

/**
 * Counted as owned while "I have the basics" is on: salt, sugar, black and white pepper,
 * fish sauce, soy sauce, oyster sauce, vegetable oil, olive oil, water, garlic and shallot.
 */
export const DEFAULT_BASICS: number[] = [276, 293, 263, 434, 330, 304, 342, 282, 280, 300, 223, 335];

export const MAX_DISHES = 5;
export const MAX_MISSING = 5;

export interface CookOptions {
  dishes: number;
  /** Ingredients a dish may need that you don't have. */
  maxMissing: number;
  /** Prep + cook time limit; recipes with unknown times only show without one. */
  maxMinutes: number | null;
  difficulty: Difficulty | null;
}

export interface DishMatch {
  recipe: CookRecipe;
  /** Your ingredients (not the basics) that the dish uses. */
  used: number[];
  /** Ingredients you'd still need. */
  missing: number[];
  /** Share of the dish's ingredients you have, 0–1. */
  coverage: number;
}

export interface Combo {
  dishes: DishMatch[];
  /** Missing ingredients across the dishes, each listed once. */
  toBuy: number[];
  /** How many of your ingredients the dishes use together. */
  usedCount: number;
  coverage: number;
  rating: number;
}

export interface CookResult {
  /** Best first, then alternatives. */
  combos: Combo[];
  /** Dishes that fit on their own; fewer than requested means the combos are short. */
  candidates: number;
}

const MAX_COMBOS = 4;
/** Partial combos kept per step: every set is checked for 1–2 dishes, the best ones beyond. */
const BEAM_WIDTH = 300;

function matchDish(recipe: CookRecipe, mine: Set<number>, have: Set<number>): DishMatch {
  const ids = [...new Set(recipe.ingredients.map((i) => i.id))];
  const missing = ids.filter((id) => !have.has(id));
  return {
    recipe,
    used: ids.filter((id) => mine.has(id)),
    missing,
    coverage: (ids.length - missing.length) / ids.length,
  };
}

function toCombo(dishes: DishMatch[]): Combo {
  const toBuy = new Set(dishes.flatMap((d) => d.missing));
  const used = new Set(dishes.flatMap((d) => d.used));
  const average = (pick: (d: DishMatch) => number) => dishes.reduce((sum, d) => sum + pick(d), 0) / dishes.length;
  return {
    dishes,
    toBuy: [...toBuy],
    usedCount: used.size,
    coverage: average((d) => d.coverage),
    rating: average((d) => d.recipe.rating),
  };
}

/** Fewest things to buy, then most of your ingredients used, then best coverage, then rating. */
function compareCombos(a: Combo, b: Combo): number {
  return (
    a.toBuy.length - b.toBuy.length ||
    b.usedCount - a.usedCount ||
    b.coverage - a.coverage ||
    b.rating - a.rating
  );
}

function fitsFilters(recipe: CookRecipe, options: CookOptions): boolean {
  if (options.maxMinutes !== null && (recipe.minutes === null || recipe.minutes > options.maxMinutes)) return false;
  return !options.difficulty || recipe.difficulty === options.difficulty;
}

/**
 * The best sets of `options.dishes` recipes for what you have. A dish qualifies when it
 * uses at least one of your ingredients and misses at most `maxMissing`; basics count
 * as owned but a dish made only of basics never qualifies.
 */
export function findCombos(
  recipes: CookRecipe[],
  mine: number[],
  basics: number[],
  options: CookOptions,
): CookResult {
  const own = new Set(mine);
  if (own.size === 0) return { combos: [], candidates: 0 };
  const have = new Set([...mine, ...basics]);

  const pool = recipes
    .filter((r) => r.ingredients.length > 0 && fitsFilters(r, options))
    .map((r) => matchDish(r, own, have))
    .filter((d) => d.used.length > 0 && d.missing.length <= options.maxMissing);
  const size = Math.min(Math.max(1, options.dishes), pool.length);
  if (size === 0) return { combos: [], candidates: 0 };

  let beam: { picks: number[]; combo: Combo }[] = [{ picks: [], combo: toCombo([]) }];
  for (let step = 0; step < size; step++) {
    const seen = new Set<string>();
    const next: typeof beam = [];
    for (const { picks } of beam) {
      for (let i = 0; i < pool.length; i++) {
        if (picks.includes(i)) continue;
        const grown = [...picks, i].sort((a, b) => a - b);
        const key = grown.join(",");
        if (seen.has(key)) continue;
        seen.add(key);
        next.push({ picks: grown, combo: toCombo(grown.map((j) => pool[j])) });
      }
    }
    next.sort((a, b) => compareCombos(a.combo, b.combo));
    beam = next.slice(0, BEAM_WIDTH);
  }

  return { combos: beam.slice(0, MAX_COMBOS).map((b) => b.combo), candidates: pool.length };
}
