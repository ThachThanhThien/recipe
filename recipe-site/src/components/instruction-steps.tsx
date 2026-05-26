"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstructionStepsProps {
  steps: string[];
  /** Localized "no instructions" message. */
  emptyText?: string;
  /** Localized aria-label prefix, e.g. "Mark step". A step number is appended. */
  markStepAriaPrefix?: string;
}

export function InstructionSteps({
  steps,
  emptyText = "No instructions provided.",
  markStepAriaPrefix = "Mark step",
}: InstructionStepsProps) {
  const [done, setDone] = useState<Set<number>>(new Set());

  if (steps.length === 0) {
    return <p className="text-muted-foreground">{emptyText}</p>;
  }

  const toggle = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <ol className="flex flex-col gap-6">
      {steps.map((step, i) => {
        const isDone = done.has(i);
        return (
          <li
            key={i}
            className={cn(
              "group relative flex gap-5 p-5 rounded-2xl border transition-all cursor-pointer",
              isDone
                ? "bg-accent/5 border-accent/20"
                : "bg-card border-border/50 hover:border-primary/30 hover:shadow-md",
            )}
            onClick={() => toggle(i)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(i);
              }}
              aria-pressed={isDone}
              aria-label={`${markStepAriaPrefix} ${i + 1}`}
              className={cn(
                "shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-outfit font-black transition-all border-2",
                isDone
                  ? "bg-accent border-accent text-white"
                  : "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary",
              )}
            >
              {isDone ? <Check size={20} /> : i + 1}
            </button>
            <p
              className={cn(
                "text-base sm:text-lg leading-relaxed pt-2 transition-all",
                isDone ? "text-muted-foreground line-through" : "text-foreground",
              )}
            >
              {step}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
