"use client";

import { useMemo } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { useFavorites } from "@/hooks/use-favorites";
import { RecipeGrid } from "@/components/recipe-card";
import { SectionHeader } from "@/components/ui";
import { useT } from "@/components/lang-provider";
import type { RecipeSummary } from "@/lib/api";

const LIMIT = 4;

function pick(ids: number[], all: RecipeSummary[]): RecipeSummary[] {
  const byId = new Map(all.map((r) => [r.id, r]));
  return ids
    .map((id) => byId.get(id))
    .filter((r): r is RecipeSummary => Boolean(r))
    .slice(0, LIMIT);
}

/** Last few recipes opened on this device. Hidden until there is something to show. */
export function RecentlyViewedRail({ allRecipes }: { allRecipes: RecipeSummary[] }) {
  const t = useT();
  const { ids, hydrated } = useRecentlyViewed();
  const recipes = useMemo(() => (hydrated ? pick(ids, allRecipes) : []), [ids, allRecipes, hydrated]);
  if (recipes.length === 0) return null;

  return (
    <section className="mt-10">
      <SectionHeader title={t("home.recent")} />
      <RecipeGrid recipes={recipes} />
    </section>
  );
}

/** A peek at saved recipes, linking to the full Saved page. */
export function SavedRail({ allRecipes }: { allRecipes: RecipeSummary[] }) {
  const t = useT();
  const { favorites, hydrated } = useFavorites();
  const recipes = useMemo(() => (hydrated ? pick(favorites, allRecipes) : []), [favorites, allRecipes, hydrated]);
  if (recipes.length === 0) return null;

  return (
    <section className="mt-10">
      <SectionHeader title={t("home.saved")} href="/favorites" linkLabel={t("home.seeAll")} />
      <RecipeGrid recipes={recipes} />
    </section>
  );
}
