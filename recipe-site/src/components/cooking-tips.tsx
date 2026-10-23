"use client";

import { useId } from "react";
import { Lightbulb } from "lucide-react";
import { useRecipeSession } from "@/components/recipe-session";
import { useT } from "@/components/lang-provider";
import { cn } from "@/lib/utils";

/** The cook's notes — what makes the dish work and what to avoid. Hidden when a recipe has none. */
export function CookingTips({ className }: { className?: string }) {
  const t = useT();
  const headingId = useId();
  const { tips } = useRecipeSession();

  if (tips.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className={cn("rounded-2xl bg-primary-soft p-5", className)}>
      <h3 id={headingId} className="flex items-center gap-2 font-semibold text-primary-soft-foreground">
        <Lightbulb size={20} aria-hidden />
        {t("detail.tips")}
      </h3>
      <ul className="mt-3 space-y-3">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-3 leading-relaxed">
            <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
