// Recipe data lives as JSON in `recipe-site/data/` (edited through recipe-portal,
// which commits to GitHub). It is bundled at build time, so every page is
// pre-rendered to static HTML — there is no API server to wait on.
import type { Multilingual } from "./i18n";
import { DEFAULT_LANG } from "./lang";
import { normalizeText } from "./search";
import { totalMinutes } from "./time";
import recipesJson from "../../data/recipes.json";
import ingredientsJson from "../../data/ingredients.json";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface IngredientRef {
  id: number;
  name: Multilingual | string;
  description?: Multilingual | string;
  unit?: string;
  isActive?: boolean;
}

export interface RecipeIngredient {
  id: number;
  quantity: string;
  ingredient: IngredientRef;
}

export interface Recipe {
  id: number;
  title: Multilingual | string;
  description: Multilingual | string;
  instructions: Multilingual | string;
  image: string | null;
  prepTime: string | null;
  cookTime: string | null;
  servings: number;
  calories: number;
  difficulty: Difficulty | null;
  category: string | null;
  tags: string[] | null;
  rating: number;
  reviews: number;
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  recipeIngredients: RecipeIngredient[];
}

/** Shape of an entry in data/ingredients.json. */
interface StoredIngredient {
  id: number;
  name: Multilingual | null;
  description: Multilingual | null;
  unit: string | null;
  typeIds: number[];
  isActive: boolean;
}

/** Shape of an entry in data/recipes.json. */
interface StoredRecipe extends Omit<Recipe, "title" | "description" | "instructions" | "recipeIngredients"> {
  title: Multilingual | null;
  description: Multilingual | null;
  instructions: Multilingual | null;
  ingredients: { ingredientId: number; quantity: string }[];
}

const storedRecipes = recipesJson as unknown as StoredRecipe[];
const ingredientsById = new Map(
  (ingredientsJson as unknown as StoredIngredient[]).map((i) => [i.id, i]),
);

interface FetchOptions {
  lang?: string;
}

/** Same rule the old API's x-lang interceptor applied: requested language, then English, then any. */
function localize(value: Multilingual | null | undefined, lang: string): string {
  if (!value) return "";
  return value[lang] || value[DEFAULT_LANG] || Object.values(value)[0] || "";
}

function toRecipe(stored: StoredRecipe, lang: string): Recipe {
  const { ingredients, ...rest } = stored;
  return {
    ...rest,
    title: localize(stored.title, lang),
    description: localize(stored.description, lang),
    instructions: localize(stored.instructions, lang),
    recipeIngredients: ingredients.flatMap((item, index) => {
      const ingredient = ingredientsById.get(item.ingredientId);
      if (!ingredient) return [];
      return [
        {
          id: index + 1,
          quantity: item.quantity,
          ingredient: {
            id: ingredient.id,
            name: localize(ingredient.name, lang),
            description: localize(ingredient.description, lang),
            unit: ingredient.unit ?? undefined,
            isActive: ingredient.isActive,
          },
        },
      ];
    }),
  };
}

export async function getRecipes(opts: FetchOptions = {}): Promise<Recipe[]> {
  const lang = opts.lang ?? DEFAULT_LANG;
  return storedRecipes
    .filter((r) => r.isActive !== false)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((r) => toRecipe(r, lang));
}

/**
 * What a recipe card (and search) needs — passed to client components instead of
 * the full recipe so pages don't ship every recipe's instructions to the browser.
 */
export interface RecipeSummary {
  id: number;
  title: string;
  category: string | null;
  image: string | null;
  difficulty: Difficulty | null;
  /** Prep + cook time, when it can be read from the free-text times. */
  minutes: number | null;
  rating: number;
  isFeatured: boolean;
  createdAt: string;
  /** Accent-free, lower-case title, for ranking title matches first. */
  searchTitle: string;
  /** Accent-free, lower-case text to search: title, description, category, tags, ingredients. */
  search: string;
}

export function toSummary(recipe: Recipe): RecipeSummary {
  const text = (value: Multilingual | string | undefined) => (typeof value === "string" ? value : "");
  return {
    id: recipe.id,
    title: text(recipe.title),
    category: recipe.category,
    image: recipe.image,
    difficulty: recipe.difficulty,
    minutes: totalMinutes(recipe.prepTime, recipe.cookTime),
    rating: recipe.rating,
    isFeatured: recipe.isFeatured,
    createdAt: recipe.createdAt,
    searchTitle: normalizeText(text(recipe.title)),
    search: normalizeText(
      [
        text(recipe.title),
        text(recipe.description),
        recipe.category ?? "",
        ...(recipe.tags ?? []),
        ...recipe.recipeIngredients.map((ri) => text(ri.ingredient.name)),
      ].join(" "),
    ),
  };
}

export async function getRecipeSummaries(opts: FetchOptions = {}): Promise<RecipeSummary[]> {
  return (await getRecipes(opts)).map(toSummary);
}

/** Categories in use, most common first. */
export function categoriesOf(recipes: { category: string | null }[]): string[] {
  const counts = new Map<string, number>();
  for (const r of recipes) if (r.category) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([c]) => c);
}

export async function getRecipe(id: number | string, opts: FetchOptions = {}): Promise<Recipe | null> {
  const stored = storedRecipes.find((r) => String(r.id) === String(id) && r.isActive !== false);
  return stored ? toRecipe(stored, opts.lang ?? DEFAULT_LANG) : null;
}
