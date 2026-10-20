"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { RecipeGrid } from "@/components/recipe-card";
import { RecipeGridSkeleton } from "@/components/recipe-card-skeleton";
import { EmptyState } from "@/components/empty-state";
import { buttonClass } from "@/components/ui";
import { useT } from "@/components/lang-provider";
import type { RecipeSummary } from "@/lib/api";

export function FavoritesGrid({ allRecipes }: { allRecipes: RecipeSummary[] }) {
  const t = useT();
  const { favorites, hydrated, clear } = useFavorites();

  const recipes = useMemo(() => {
    if (!hydrated) return [];
    const byId = new Map(allRecipes.map((r) => [r.id, r]));
    return favorites.map((id) => byId.get(id)).filter((r): r is RecipeSummary => Boolean(r));
  }, [allRecipes, favorites, hydrated]);

  if (!hydrated) return <RecipeGridSkeleton count={4} />;

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={t("saved.emptyTitle")}
        description={t("saved.emptyDesc")}
        action={
          <Link href="/recipes" className={buttonClass("primary")}>
            {t("common.browse")}
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {recipes.length === 1 ? t("recipes.count.one") : t("recipes.count.other", { n: recipes.length })}
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t("saved.clearConfirm"))) clear();
          }}
          className={buttonClass("ghost")}
        >
          {t("saved.clearAll")}
        </button>
      </div>
      <RecipeGrid recipes={recipes} />
    </>
  );
}
