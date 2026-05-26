"use client";

import { useMemo } from "react";
import { History } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { RecipeCard } from "@/components/recipe-card";
import type { Recipe } from "@/lib/api";

interface RecentlyViewedRailProps {
  allRecipes: Recipe[];
}

export function RecentlyViewedRail({ allRecipes }: RecentlyViewedRailProps) {
  const { ids, hydrated } = useRecentlyViewed();

  const recipes = useMemo(() => {
    if (!hydrated) return [];
    const byId = new Map(allRecipes.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((r): r is Recipe => Boolean(r))
      .slice(0, 4);
  }, [ids, allRecipes, hydrated]);

  if (!hydrated || recipes.length === 0) return null;

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
          <History size={14} />
          Recently viewed
        </div>
        <div className="h-px flex-grow bg-border/40" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.map((recipe, i) => (
          <RecipeCard key={recipe.id} recipe={recipe} index={i} />
        ))}
      </div>
    </section>
  );
}
