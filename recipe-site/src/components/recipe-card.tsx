"use client";

import Link from "next/link";
import { Clock, Star, Flame, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { Recipe } from "@/lib/api";
import { pickLocale } from "@/lib/i18n";
import { RecipeImage } from "@/components/recipe-image";
import { FavoriteButton } from "@/components/favorite-button";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
  priority?: boolean;
}

export function RecipeCard({ recipe, index = 0, priority }: RecipeCardProps) {
  const title = pickLocale(recipe.title, undefined, "Untitled recipe");
  const description = pickLocale(recipe.description);
  const difficulty = recipe.difficulty ?? "Easy";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: Math.min(index, 6) * 0.06, duration: 0.4, ease: "easeOut" }}
      className="group bg-card rounded-3xl overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full focus-within:ring-2 focus-within:ring-primary"
    >
      <Link href={`/recipes/${recipe.id}`} className="block focus:outline-none">
        <div className="relative aspect-[4/3] overflow-hidden">
          <RecipeImage
            src={recipe.image}
            alt={title}
            seed={recipe.id}
            priority={priority}
            className="group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            {recipe.isFeatured && (
              <span className="bg-primary text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shadow-md">
                Featured
              </span>
            )}
            {recipe.isTrending && (
              <span className="bg-accent text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shadow-md">
                Trending
              </span>
            )}
            {recipe.category && (
              <span className="glass text-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                {recipe.category}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <FavoriteButton recipeId={recipe.id} size="sm" />
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-md">
              <Clock size={12} />
              {recipe.prepTime || "—"}
            </div>
            <div className="flex items-center gap-1.5 bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-md">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {recipe.rating ? recipe.rating.toFixed(1) : "New"}
            </div>
          </div>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-3 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
          <span className={cn(
            "px-2 py-0.5 rounded-full",
            difficulty === "Easy" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
            difficulty === "Medium" && "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
            difficulty === "Hard" && "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
          )}>
            {difficulty}
          </span>
          {recipe.calories > 0 && (
            <span className="flex items-center gap-1">
              <Flame size={12} />
              {recipe.calories} kcal
            </span>
          )}
          {recipe.servings > 0 && (
            <span className="flex items-center gap-1">
              <Users size={12} />
              {recipe.servings}
            </span>
          )}
        </div>

        <Link href={`/recipes/${recipe.id}`} className="block mb-2">
          <h3 className="font-outfit text-lg font-bold leading-tight hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-foreground">{recipe.rating ? recipe.rating.toFixed(1) : "—"}</span>
            {recipe.reviews > 0 && <span>({recipe.reviews})</span>}
          </div>
          <Link
            href={`/recipes/${recipe.id}`}
            className="text-primary text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1"
          >
            View Recipe →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
