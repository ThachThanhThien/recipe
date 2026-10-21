"use client";

import { useId } from "react";
import { Check, ChevronDown } from "lucide-react";
import { IngredientPicker } from "./ingredient-picker";
import { useT } from "@/components/lang-provider";
import { buttonClass, chipClass } from "@/components/ui";
import { DEFAULT_BASICS, type CookIngredient } from "@/lib/cook";
import { cn } from "@/lib/utils";

interface PantryBasicsProps {
  ingredients: CookIngredient[];
  byId: Map<number, CookIngredient>;
  basics: number[];
  useBasics: boolean;
  onUseBasics: (on: boolean) => void;
  onToggle: (id: number) => void;
  onReset: () => void;
}

/** Salt, oil, fish sauce… counted as owned, so recipes aren't "missing" them. Collapsed by default. */
export function PantryBasics({ ingredients, byId, basics, useBasics, onUseBasics, onToggle, onReset }: PantryBasicsProps) {
  const t = useT();
  const helpId = useId();
  const selected = new Set(basics);
  // Defaults stay listed when switched off, so they can be switched back on.
  const shown = [...new Set([...DEFAULT_BASICS, ...basics])].filter((id) => byId.has(id));

  return (
    <details className="group rounded-2xl border border-border bg-card">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="flex-1">
          <span className="block font-semibold">{t("planner.basics")}</span>
          <span className="block text-sm text-muted-foreground">
            {useBasics ? t("planner.basicsOn", { n: basics.length }) : t("planner.basicsOff")}
          </span>
        </span>
        <ChevronDown size={18} aria-hidden className="text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>

      <div className="space-y-4 border-t border-border px-4 pb-4 pt-3">
        <button
          type="button"
          role="switch"
          aria-checked={useBasics}
          aria-label={t("planner.useBasics")}
          aria-describedby={helpId}
          onClick={() => onUseBasics(!useBasics)}
          className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
        >
          <span>
            <span className="block text-sm font-medium">{t("planner.useBasics")}</span>
            <span id={helpId} className="block text-sm text-muted-foreground">
              {t("planner.basicsHelp")}
            </span>
          </span>
          <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", useBasics ? "bg-primary" : "bg-input")}>
            <span
              className={cn(
                "absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
                useBasics && "translate-x-5",
              )}
            />
          </span>
        </button>

        <div className={cn("flex flex-wrap gap-2", !useBasics && "opacity-50")}>
          {shown.map((id) => {
            const on = selected.has(id);
            return (
              <button key={id} type="button" aria-pressed={on} onClick={() => onToggle(id)} className={chipClass(on)}>
                {on && <Check size={14} aria-hidden />}
                {byId.get(id)?.name}
              </button>
            );
          })}
        </div>

        <IngredientPicker
          ingredients={ingredients}
          exclude={new Set(shown)}
          onPick={onToggle}
          placeholder={t("planner.addBasic")}
          label={t("planner.addBasic")}
        />

        <button type="button" onClick={onReset} className={cn(buttonClass("ghost"), "-ml-3 h-10 px-3")}>
          {t("planner.resetBasics")}
        </button>
      </div>
    </details>
  );
}
