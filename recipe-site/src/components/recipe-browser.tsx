"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { RecipeCard } from "@/components/recipe-card";
import { EmptyState } from "@/components/empty-state";
import { pickLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/lib/api";

type SortKey = "newest" | "rating" | "fastest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest rated" },
  { value: "fastest", label: "Quickest" },
];

function parseMinutes(input: string | null | undefined): number {
  if (!input) return Number.POSITIVE_INFINITY;
  const m = input.match(/\d+/);
  return m ? parseInt(m[0], 10) : Number.POSITIVE_INFINITY;
}

interface RecipeBrowserProps {
  recipes: Recipe[];
}

export function RecipeBrowser({ recipes }: RecipeBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "All";
  const initialFeatured = searchParams.get("featured") === "1";
  const initialTrending = searchParams.get("trending") === "1";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [difficulty, setDifficulty] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [featuredOnly, setFeaturedOnly] = useState(initialFeatured);
  const [trendingOnly, setTrendingOnly] = useState(initialTrending);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setCategory(searchParams.get("category") ?? "All");
    setFeaturedOnly(searchParams.get("featured") === "1");
    setTrendingOnly(searchParams.get("trending") === "1");
  }, [searchParams]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [recipes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes
      .filter((r) => {
        const title = pickLocale(r.title).toLowerCase();
        const desc = pickLocale(r.description).toLowerCase();
        const tagMatch = (r.tags ?? []).some((t) => t.toLowerCase().includes(q));
        const matchesQ = !q || title.includes(q) || desc.includes(q) || tagMatch;
        const matchesCat = category === "All" || r.category === category;
        const matchesDiff = difficulty === "All" || r.difficulty === difficulty;
        const matchesFeatured = !featuredOnly || r.isFeatured;
        const matchesTrending = !trendingOnly || r.isTrending;
        return matchesQ && matchesCat && matchesDiff && matchesFeatured && matchesTrending;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
        if (sortBy === "fastest") return parseMinutes(a.prepTime) - parseMinutes(b.prepTime);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [recipes, query, category, difficulty, sortBy, featuredOnly, trendingOnly]);

  const updateUrl = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setDifficulty("All");
    setFeaturedOnly(false);
    setTrendingOnly(false);
    router.replace(pathname, { scroll: false });
  };

  const activeFilterCount = [
    query ? 1 : 0,
    category !== "All" ? 1 : 0,
    difficulty !== "All" ? 1 : 0,
    featuredOnly ? 1 : 0,
    trendingOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="bg-card/70 backdrop-blur-md border border-border/40 p-4 rounded-3xl mb-8 flex flex-col md:flex-row gap-3 items-stretch shadow-sm sticky top-20 z-30">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="search"
            placeholder="Search by name, description, or tag..."
            aria-label="Search recipes"
            className="w-full bg-secondary/40 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              updateUrl({ q: e.target.value || null });
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Sort recipes"
            className="bg-secondary/40 rounded-2xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by difficulty"
            className="bg-secondary/40 rounded-2xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="All">Any difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="bg-secondary/40 hover:bg-secondary text-foreground/80 hover:text-foreground px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <SlidersHorizontal size={14} /> Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground mr-2">
          Categories:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              updateUrl({ category: cat === "All" ? null : cat });
            }}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
              category === cat
                ? "bg-primary border-primary text-white shadow-sm"
                : "bg-card border-border/60 hover:border-primary/40 text-foreground/80",
            )}
          >
            {cat}
          </button>
        ))}

        <div className="ml-auto flex gap-2 flex-wrap">
          <FilterChip
            active={featuredOnly}
            onClick={() => {
              const next = !featuredOnly;
              setFeaturedOnly(next);
              updateUrl({ featured: next ? "1" : null });
            }}
          >
            ★ Featured
          </FilterChip>
          <FilterChip
            active={trendingOnly}
            onClick={() => {
              const next = !trendingOnly;
              setTrendingOnly(next);
              updateUrl({ trending: next ? "1" : null });
            }}
          >
            🔥 Trending
          </FilterChip>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6" aria-live="polite">
        Showing <strong className="text-foreground">{filtered.length}</strong> of{" "}
        <strong className="text-foreground">{recipes.length}</strong> recipes
      </p>

      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="No recipes found"
            description="Try adjusting your search or clearing the filters."
            action={
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                Clear filters
              </button>
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
        active
          ? "bg-primary border-primary text-white shadow-sm"
          : "bg-card border-border/60 hover:border-primary/40 text-foreground/80",
      )}
    >
      {children}
    </button>
  );
}
