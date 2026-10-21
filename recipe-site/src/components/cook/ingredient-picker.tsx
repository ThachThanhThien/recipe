"use client";

import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { Plus, Search } from "lucide-react";
import { useT } from "@/components/lang-provider";
import type { CookIngredient } from "@/lib/cook";
import { searchScore } from "@/lib/search";
import { cn } from "@/lib/utils";

const MAX_OPTIONS = 8;

interface IngredientPickerProps {
  ingredients: CookIngredient[];
  /** Already picked, so left out of the suggestions. */
  exclude: Set<number>;
  onPick: (id: number) => void;
  /** Backspace in the empty box, to take off the last chip. */
  onRemoveLast?: () => void;
  placeholder: string;
  label: string;
}

/**
 * Type-ahead over the known ingredients, in either language and without tone marks
 * ("ca chua" finds "Cà chua"). The box stays open after a pick so you can keep adding.
 */
export function IngredientPicker({ ingredients, exclude, onPick, onRemoveLast, placeholder, label }: IngredientPickerProps) {
  const t = useT();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const options = useMemo(() => {
    if (!query.trim()) return [];
    return ingredients
      .filter((i) => !exclude.has(i.id))
      .map((ingredient) => ({ ingredient, score: searchScore(ingredient.searchName, ingredient.search, query) }))
      .filter((o) => o.score > 0)
      .sort((a, b) => b.score - a.score || b.ingredient.uses - a.ingredient.uses)
      .slice(0, MAX_OPTIONS)
      .map((o) => o.ingredient);
  }, [ingredients, exclude, query]);

  const current = Math.min(active, options.length - 1);
  const showList = open && query.trim() !== "";

  const pick = (id: number) => {
    onPick(id);
    setQuery("");
    setActive(0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive(Math.max(0, Math.min(options.length - 1, current + step)));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (options[current]) pick(options[current].id);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && !query) {
      onRemoveLast?.();
    }
  };

  return (
    <div className="relative">
      <Search
        aria-hidden
        size={20}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        role="combobox"
        aria-label={label}
        aria-expanded={showList && options.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && options[current] ? `${listId}-${options[current].id}` : undefined}
        autoComplete="off"
        enterKeyHint="done"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-base text-foreground shadow-card placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
      />
      {showList &&
        (options.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            className="absolute inset-x-0 top-full z-20 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-raised"
          >
            {options.map((o, i) => (
              <li
                key={o.id}
                id={`${listId}-${o.id}`}
                role="option"
                aria-selected={i === current}
                // Keep focus in the box so the list stays open for the next pick.
                onMouseDown={(e) => e.preventDefault()}
                onMouseMove={() => setActive(i)}
                onClick={() => pick(o.id)}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2",
                  i === current && "bg-muted",
                )}
              >
                <Plus size={16} aria-hidden className="shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{o.name}</span>
                {o.typeName && <span className="shrink-0 text-xs text-muted-foreground">{o.typeName}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="absolute inset-x-0 top-full z-20 mt-1.5 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-raised">
            {t("planner.noMatch", { q: query.trim() })}
          </p>
        ))}
    </div>
  );
}
