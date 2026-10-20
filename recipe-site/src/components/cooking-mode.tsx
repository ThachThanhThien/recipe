"use client";

import { useCallback, useEffect, useId, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ChefHat, ChevronLeft, ChevronRight, ListChecks, Sun, X } from "lucide-react";
import { useRecipeSession } from "@/components/recipe-session";
import { useT } from "@/components/lang-provider";
import { buttonClass } from "@/components/ui";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { formatAmount } from "@/lib/scale";
import { cn } from "@/lib/utils";

export function StartCookingButton({ className }: { className?: string }) {
  const t = useT();
  const { steps } = useRecipeSession();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setSession((s) => s + 1); // a fresh session starts at step 1
          setOpen(true);
        }}
        disabled={steps.length === 0}
        className={cn(buttonClass("primary", "lg"), "w-full", className)}
      >
        <ChefHat size={20} aria-hidden />
        {t("detail.startCooking")}
      </button>
      {open && (
        <CookingMode
          key={session}
          onClose={() => {
            setOpen(false);
            buttonRef.current?.focus();
          }}
        />
      )}
    </>
  );
}

/** Full-screen, one step at a time, big text, screen kept awake. */
function CookingMode({ onClose }: { onClose: () => void }) {
  const t = useT();
  const titleId = useId();
  const { title, steps, ingredients, servings } = useRecipeSession();
  const [index, setIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const awake = useWakeLock(true);

  const total = steps.length;
  const isLast = index >= total - 1;
  const next = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [next, prev, onClose]);

  const onTouchStart = (e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return; // a scroll, not a swipe
    if (dx < 0) next();
    else prev();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex flex-col bg-background text-foreground"
    >
      <header className="flex items-center gap-2 border-b border-border px-4 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {t("cook.mode")}
            {awake && (
              <>
                <span aria-hidden>·</span>
                <Sun size={12} aria-hidden />
                {t("cook.awake")}
              </>
            )}
          </p>
          <h2 id={titleId} className="truncate font-semibold">
            {title}
          </h2>
        </div>
        {ingredients.length > 0 && (
          <button
            type="button"
            onClick={() => setShowIngredients((v) => !v)}
            aria-expanded={showIngredients}
            aria-label={showIngredients ? t("cook.hideIngredients") : t("cook.showIngredients")}
            className={cn(buttonClass("secondary"), "px-3", showIngredients && "bg-muted")}
          >
            <ListChecks size={18} aria-hidden />
            <span className="hidden sm:inline">{t("cook.showIngredients")}</span>
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label={t("cook.exit")}
          className="grid size-11 shrink-0 place-items-center rounded-xl hover:bg-muted"
        >
          <X size={22} />
        </button>
      </header>

      <div className="h-1 bg-muted" aria-hidden>
        <div
          className="h-full bg-primary transition-[width] duration-300"
          style={{ width: `${total ? ((index + 1) / total) * 100 : 0}%` }}
        />
      </div>

      {showIngredients && (
        <div className="max-h-[40dvh] overflow-y-auto border-b border-border bg-card px-4 py-2">
          <p className="py-1 text-xs font-medium text-muted-foreground">
            {t("detail.servings")}: {servings}
          </p>
          <ul className="divide-y divide-border">
            {ingredients.map((ing) => (
              <li key={ing.id} className="flex justify-between gap-3 py-2">
                <span>{ing.name}</span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {formatAmount(ing.quantity, ing.unit)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <main
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-8"
      >
        {total === 0 ? (
          <p className="text-muted-foreground">{t("cook.empty")}</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-primary" aria-live="polite">
              {t("cook.step", { n: index + 1, total })}
            </p>
            <p
              key={index}
              className="mt-4 max-w-2xl animate-step-in text-center text-2xl font-semibold leading-snug sm:text-3xl"
            >
              {steps[index]}
            </p>
            <p className="mt-10 text-xs text-muted-foreground">{t("cook.hint")}</p>
          </>
        )}
      </main>

      <footer className="flex items-center gap-3 border-t border-border px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          className={cn(buttonClass("secondary", "lg"), "flex-1 sm:flex-none")}
        >
          <ChevronLeft size={20} aria-hidden />
          {t("cook.prev")}
        </button>
        <div className="hidden flex-1 flex-wrap justify-center gap-1 sm:flex">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t("cook.jump", { n: i + 1 })}
              aria-current={i === index ? "step" : undefined}
              className="grid size-6 place-items-center"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-all",
                  i === index ? "w-5 bg-primary" : i < index ? "w-2 bg-primary/40" : "w-2 bg-input",
                )}
              />
            </button>
          ))}
        </div>
        {isLast ? (
          <button type="button" onClick={onClose} className={cn(buttonClass("primary", "lg"), "flex-1 sm:flex-none")}>
            <Check size={20} aria-hidden />
            {t("cook.done")}
          </button>
        ) : (
          <button type="button" onClick={next} className={cn(buttonClass("primary", "lg"), "flex-1 sm:flex-none")}>
            {t("cook.next")}
            <ChevronRight size={20} aria-hidden />
          </button>
        )}
      </footer>
    </div>,
    document.body,
  );
}
