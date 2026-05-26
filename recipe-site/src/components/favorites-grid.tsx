"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeGridSkeleton } from "@/components/recipe-card-skeleton";
import { EmptyState } from "@/components/empty-state";
import type { Recipe } from "@/lib/api";

interface FavoritesGridProps {
  allRecipes: Recipe[];
}

export function FavoritesGrid({ allRecipes }: FavoritesGridProps) {
  const { favorites, hydrated, clear } = useFavorites();

  const recipes = useMemo(() => {
    if (!hydrated) return [];
    const byId = new Map(allRecipes.map((r) => [r.id, r]));
    return favorites.map((id) => byId.get(id)).filter((r): r is Recipe => Boolean(r));
  }, [allRecipes, favorites, hydrated]);

  if (!hydrated) {
    return <RecipeGridSkeleton count={3} />;
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon={<Heart size={48} className="text-primary" strokeWidth={1.5} />}
        title="No favorites yet"
        description="Tap the heart on any recipe to save it here for later."
        action={
          <Link
            href="/recipes"
            className="mt-4 inline-block bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            Browse recipes
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <p className="text-muted-foreground">
          <strong className="text-foreground">{recipes.length}</strong>{" "}
          {recipes.length === 1 ? "recipe" : "recipes"} saved
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear all favorites?")) clear();
          }}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors font-semibold"
        >
          Clear all
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe, i) => (
          <RecipeCard key={recipe.id} recipe={recipe} index={i} />
        ))}
      </div>
    </>
  );
}
