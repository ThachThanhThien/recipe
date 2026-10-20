"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import type { RecipeSummary } from "@/lib/api";
import { formatMinutes } from "@/lib/time";
import { RecipeImage } from "@/components/recipe-image";
import { FavoriteButton } from "@/components/favorite-button";
import { useLang, useT } from "@/components/lang-provider";

interface RecipeCardProps {
  recipe: RecipeSummary;
  priority?: boolean;
}

export function RecipeCard({ recipe, priority }: RecipeCardProps) {
  const lang = useLang();
  const t = useT();
  const time = formatMinutes(recipe.minutes, lang);
  const title = recipe.title || t("detail.fallbackTitle");

  return (
    <article className="group relative">
      <Link href={`/recipes/${recipe.id}`} className="block rounded-2xl">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <RecipeImage
            src={recipe.image}
            alt=""
            seed={recipe.id}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            className="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <div className="px-0.5 pt-2.5">
          {recipe.category && (
            <p className="truncate text-xs font-medium text-muted-foreground">{recipe.category}</p>
          )}
          <h3 className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-snug sm:text-base">{title}</h3>
          {(time || recipe.difficulty) && (
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
              {time && (
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} aria-hidden />
                  {time}
                </span>
              )}
              {time && recipe.difficulty && <span aria-hidden>·</span>}
              {recipe.difficulty && <span>{t(`difficulty.${recipe.difficulty}`)}</span>}
            </p>
          )}
        </div>
      </Link>
      <FavoriteButton recipeId={recipe.id} className="absolute right-2 top-2" />
    </article>
  );
}

export function RecipeGrid({ recipes, priorityCount = 0 }: { recipes: RecipeSummary[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
      {recipes.map((recipe, i) => (
        <li key={recipe.id}>
          <RecipeCard recipe={recipe} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
