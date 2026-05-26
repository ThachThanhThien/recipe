import type { Multilingual } from "./i18n";

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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

interface FetchOptions {
  lang?: string;
  revalidate?: number;
}

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { lang, revalidate = 60 } = opts;
  const res = await fetch(`${API_BASE}${path}`, {
    headers: lang ? { "x-lang": lang } : undefined,
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getRecipes(opts?: FetchOptions): Promise<Recipe[]> {
  // API now returns a paginated envelope { items, total, page, limit, totalPages }.
  // We unwrap items here so callers continue to receive Recipe[].
  // Tolerant of the old shape (raw array) for forward/backward compatibility.
  const res = await apiFetch<Paginated<Recipe> | Recipe[]>("/recipe?limit=100", opts);
  const items = Array.isArray(res) ? res : res.items ?? [];
  return items.filter((r) => r.isActive !== false);
}

export async function getRecipe(id: number | string, opts?: FetchOptions): Promise<Recipe | null> {
  try {
    return await apiFetch<Recipe>(`/recipe/${id}`, opts);
  } catch {
    return null;
  }
}

export interface Review {
  id: number;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export async function getReviews(recipeId: number | string, opts?: FetchOptions): Promise<Review[]> {
  try {
    return await apiFetch<Review[]>(`/recipe/${recipeId}/review`, { revalidate: 30, ...opts });
  } catch {
    return [];
  }
}

const API_BASE_PUBLIC = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export async function submitReview(
  recipeId: number | string,
  payload: { reviewerName: string; rating: number; comment?: string },
): Promise<Review> {
  const res = await fetch(`${API_BASE_PUBLIC}/recipe/${recipeId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to submit review (${res.status})`);
  }
  return res.json() as Promise<Review>;
}
