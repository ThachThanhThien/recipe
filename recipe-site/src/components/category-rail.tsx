"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CATEGORY_VISUALS: Record<string, { icon: string; bg: string }> = {
  breakfast: { icon: "🍳", bg: "bg-orange-100 dark:bg-orange-950/60" },
  brunch: { icon: "🥐", bg: "bg-amber-100 dark:bg-amber-950/60" },
  lunch: { icon: "🥗", bg: "bg-green-100 dark:bg-green-950/60" },
  dinner: { icon: "🍝", bg: "bg-red-100 dark:bg-red-950/60" },
  snack: { icon: "🥨", bg: "bg-yellow-100 dark:bg-yellow-950/60" },
  dessert: { icon: "🍰", bg: "bg-pink-100 dark:bg-pink-950/60" },
  drink: { icon: "🥤", bg: "bg-cyan-100 dark:bg-cyan-950/60" },
  vegan: { icon: "🌱", bg: "bg-emerald-100 dark:bg-emerald-950/60" },
  vegetarian: { icon: "🥦", bg: "bg-lime-100 dark:bg-lime-950/60" },
  seafood: { icon: "🐟", bg: "bg-sky-100 dark:bg-sky-950/60" },
  meat: { icon: "🥩", bg: "bg-rose-100 dark:bg-rose-950/60" },
  quick: { icon: "⚡", bg: "bg-yellow-100 dark:bg-yellow-950/60" },
};

const DEFAULT_VISUAL = { icon: "🍽️", bg: "bg-secondary" };

interface CategoryRailProps {
  categories: string[];
}

export function CategoryRail({ categories }: CategoryRailProps) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((cat, i) => {
        const visual = CATEGORY_VISUALS[cat.toLowerCase()] ?? DEFAULT_VISUAL;
        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -6 }}
          >
            <Link
              href={`/recipes?category=${encodeURIComponent(cat)}`}
              className={cn(
                "block p-6 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-shadow hover:shadow-lg border border-border/40",
                visual.bg,
              )}
            >
              <div className="text-4xl" aria-hidden>{visual.icon}</div>
              <span className="font-bold text-base tracking-tight">{cat}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
