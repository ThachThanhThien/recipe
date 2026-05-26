import type { Recipe } from "./api";
import { pickLocale, splitInstructions } from "./i18n";
import { resolveImageUrl } from "./image";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";

function isoDuration(input: string | null | undefined): string | undefined {
  if (!input) return undefined;
  const m = input.match(/(\d+)/);
  if (!m) return undefined;
  return `PT${m[1]}M`;
}

export function recipeJsonLd(recipe: Recipe) {
  const title = pickLocale(recipe.title, undefined, "Recipe");
  const description = pickLocale(recipe.description);
  const steps = splitInstructions(recipe.instructions);
  const image = resolveImageUrl(recipe.image);

  const ingredients = (recipe.recipeIngredients ?? []).map((ri) => {
    const name = pickLocale(ri.ingredient?.name, undefined, "ingredient");
    const unit = ri.ingredient?.unit ? ` ${ri.ingredient.unit}` : "";
    return `${ri.quantity ?? ""}${unit} ${name}`.trim();
  });

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: title,
    description: description || undefined,
    image: image || undefined,
    url: `${SITE_URL}/recipes/${recipe.id}`,
    recipeCategory: recipe.category || undefined,
    recipeCuisine: undefined,
    keywords: (recipe.tags ?? []).join(", ") || undefined,
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
    prepTime: isoDuration(recipe.prepTime),
    cookTime: isoDuration(recipe.cookTime),
    recipeIngredient: ingredients.length ? ingredients : undefined,
    recipeInstructions: steps.length
      ? steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text }))
      : undefined,
    nutrition: recipe.calories
      ? { "@type": "NutritionInformation", calories: `${recipe.calories} kcal` }
      : undefined,
    aggregateRating:
      recipe.reviews > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: recipe.rating,
            reviewCount: recipe.reviews,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    datePublished: recipe.createdAt,
  };

  // Strip keys with undefined values for a cleaner payload
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
}
