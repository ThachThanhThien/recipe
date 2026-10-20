"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useRecipeSession } from "@/components/recipe-session";
import { useT } from "@/components/lang-provider";
import { cn } from "@/lib/utils";

export function InstructionSteps() {
  const t = useT();
  const { steps } = useRecipeSession();
  const [done, setDone] = useState<Set<number>>(new Set());

  if (steps.length === 0) {
    return <p className="text-muted-foreground">{t("detail.noInstructions")}</p>;
  }

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <>
      <p className="mb-3 text-sm text-muted-foreground">{t("detail.stepsHelp")}</p>
      <ol className="space-y-3">
        {steps.map((step, i) => {
          const isDone = done.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                aria-pressed={isDone}
                onClick={() => toggle(i)}
                className={cn(
                  "flex w-full gap-4 rounded-2xl border p-4 text-left transition-colors",
                  isDone ? "border-transparent bg-muted" : "border-border bg-card hover:border-input",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold",
                    isDone ? "bg-success text-white dark:text-background" : "bg-primary-soft text-primary-soft-foreground",
                  )}
                >
                  <span aria-hidden>{isDone ? <Check size={16} strokeWidth={3} /> : i + 1}</span>
                  <span className="sr-only">{t("detail.markStep", { n: i + 1 })}:</span>
                </span>
                <span
                  className={cn(
                    "pt-0.5 text-[17px] leading-relaxed",
                    isDone ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {step}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
}
