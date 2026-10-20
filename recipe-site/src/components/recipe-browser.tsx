"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, SearchX, Star } from "lucide-react";
import { RecipeGrid } from "@/components/recipe-card";
import { EmptyState } from "@/components/empty-state";
import { SearchField } from "@/components/search-field";
import { ChipRow, buttonClass, chipClass } from "@/components/ui";
import { useLang, useT } from "@/components/lang-provider";
import { searchScore } from "@/lib/search";
import type { Difficulty, RecipeSummary } from "@/lib/api";

const SORTS = ["newest", "quickest", "rating", "name"] as const;
type SortKey = (typeof SORTS)[number];
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

interface Filters {
  query: string;
  category: string | null;
  featured: boolean;
  difficulty: Difficulty | null;
  sort: SortKey;
}

const DEFAULT_FILTERS: Filters = { query: "", category: null, featured: false, difficulty: null, sort: "newest" };

interface RecipeBrowserProps {
  recipes: RecipeSummary[];
  categories: string[];
}

/**
 * Filters live in the URL (?q=&category=&featured=1&difficulty=&sort=) so they can be
 * shared and survive Back. While the page loads, the full unfiltered grid is rendered
 * as static HTML, so recipes show up before any JavaScript runs.
 */
export function RecipeBrowser(props: RecipeBrowserProps) {
  return (
    <Suspense fallback={<BrowserView {...props} filters={DEFAULT_FILTERS} />}>
      <LiveBrowser {...props} />
    </Suspense>
  );
}

function LiveBrowser(props: RecipeBrowserProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  // The input keeps its own copy so typing never lags behind the URL; it follows the
  // URL when that changes from elsewhere (Back button, a link with ?q=).
  const [query, setQuery] = useState(urlQuery);
  const [seenUrlQuery, setSeenUrlQuery] = useState(urlQuery);
  if (urlQuery !== seenUrlQuery) {
    setSeenUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const difficulty = searchParams.get("difficulty");
  const sort = searchParams.get("sort");
  const filters: Filters = {
    query,
    category: searchParams.get("category"),
    featured: searchParams.get("featured") === "1",
    difficulty: DIFFICULTIES.includes(difficulty as Difficulty) ? (difficulty as Difficulty) : null,
    sort: SORTS.includes(sort as SortKey) ? (sort as SortKey) : "newest",
  };

  const setParams = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    // Next.js keeps useSearchParams in sync with history.replaceState — no navigation needed.
    window.history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  };

  return (
    <BrowserView
      {...props}
      filters={filters}
      onQuery={(value) => {
        setQuery(value);
        setParams({ q: value.trim() ? value : null });
      }}
      onChange={setParams}
      onClear={() => {
        setQuery("");
        window.history.replaceState(null, "", window.location.pathname);
      }}
    />
  );
}

interface BrowserViewProps extends RecipeBrowserProps {
  filters: Filters;
  onQuery?: (value: string) => void;
  onChange?: (patch: Record<string, string | null>) => void;
  onClear?: () => void;
}

function BrowserView({ recipes, categories, filters, onQuery, onChange, onClear }: BrowserViewProps) {
  const t = useT();
  const lang = useLang();
  const { query, category, featured, difficulty, sort } = filters;
  const change = (patch: Record<string, string | null>) => onChange?.(patch);

  const results = useMemo(() => {
    const list = recipes
      .filter(
        (r) =>
          (!category || r.category === category) &&
          (!featured || r.isFeatured) &&
          (!difficulty || r.difficulty === difficulty),
      )
      .map((recipe) => ({ recipe, score: searchScore(recipe.searchTitle, recipe.search, query) }))
      .filter((r) => r.score > 0);
    if (sort === "quickest") list.sort((a, b) => (a.recipe.minutes ?? Infinity) - (b.recipe.minutes ?? Infinity));
    if (sort === "rating") list.sort((a, b) => b.recipe.rating - a.recipe.rating);
    if (sort === "name") list.sort((a, b) => a.recipe.title.localeCompare(b.recipe.title, lang));
    // "newest" is the order recipes arrive in. Best matches first; the sort orders ties.
    list.sort((a, b) => b.score - a.score);
    return list.map((r) => r.recipe);
  }, [recipes, category, featured, difficulty, query, sort, lang]);

  const filtered = Boolean(query.trim() || category || featured || difficulty);

  return (
    <>
      <div className="sticky top-14 z-30 -mx-4 bg-background/90 px-4 pb-3 pt-1 backdrop-blur-lg sm:-mx-6 sm:px-6 md:top-16">
        <SearchField
          value={query}
          onValueChange={(value) => onQuery?.(value)}
          placeholder={t("recipes.searchPlaceholder")}
        />
        <ChipRow className="mt-3" label={t("recipes.categories")}>
          <button
            type="button"
            aria-pressed={!category && !featured}
            onClick={() => change({ category: null, featured: null })}
            className={chipClass(!category && !featured)}
          >
            {t("recipes.all")}
          </button>
          <button
            type="button"
            aria-pressed={featured}
            onClick={() => change({ featured: featured ? null : "1" })}
            className={chipClass(featured)}
          >
            <Star size={14} className={featured ? "fill-current" : undefined} aria-hidden />
            {t("recipes.featured")}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => change({ category: category === c ? null : c })}
              className={chipClass(category === c)}
            >
              {c}
            </button>
          ))}
        </ChipRow>
      </div>

      <div className="mb-5 mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {results.length === 1 ? t("recipes.count.one") : t("recipes.count.other", { n: results.length })}
        </p>
        <div className="flex items-center gap-2">
          <Select
            label={t("recipes.difficulty")}
            value={difficulty ?? ""}
            onChange={(value) => change({ difficulty: value || null })}
            options={[
              { value: "", label: t("recipes.anyLevel") },
              ...DIFFICULTIES.map((d) => ({ value: d, label: t(`difficulty.${d}`) })),
            ]}
          />
          <Select
            label={t("recipes.sort")}
            value={sort}
            onChange={(value) => change({ sort: value === "newest" ? null : value })}
            options={SORTS.map((s) => ({ value: s, label: t(`recipes.sort.${s}`) }))}
          />
        </div>
      </div>

      {results.length > 0 ? (
        <RecipeGrid recipes={results} priorityCount={4} />
      ) : (
        <EmptyState
          icon={SearchX}
          title={t("recipes.noResultsTitle")}
          description={t("recipes.noResultsDesc")}
          action={
            filtered && (
              <button type="button" onClick={() => onClear?.()} className={buttonClass("secondary")}>
                {t("recipes.clear")}
              </button>
            )
          }
        />
      )}
    </>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 cursor-pointer appearance-none rounded-lg border border-border bg-card pl-3 pr-8 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </label>
  );
}
