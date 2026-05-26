"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Check, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CookingModeProps {
  open: boolean;
  onClose: () => void;
  title: string;
  steps: string[];
}

export function CookingMode({ open, onClose, title, steps }: CookingModeProps) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const total = steps.length;

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  const next = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev, onClose]);

  if (!mounted) return null;

  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;
  const isLast = index === total - 1;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cooking-mode-title"
        >
          <header className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b border-border/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-primary p-2 rounded-xl text-white shrink-0">
                <ChefHat size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Cooking mode
                </p>
                <h2 id="cooking-mode-title" className="font-outfit font-bold text-base sm:text-lg truncate">
                  {title}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Exit cooking mode"
              className="p-2.5 rounded-full hover:bg-secondary transition-colors shrink-0"
            >
              <X size={20} />
            </button>
          </header>

          <div className="h-1.5 bg-secondary/50">
            <motion.div
              className="h-full bg-primary"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {total === 0 ? (
            <div className="flex-grow flex items-center justify-center text-muted-foreground px-6 text-center">
              No instructions to display.
            </div>
          ) : (
            <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-12 py-8 overflow-y-auto">
              <div className="max-w-3xl w-full text-center">
                <div className="flex items-center justify-center gap-2 mb-6 text-primary uppercase tracking-widest text-xs font-bold">
                  <span>Step {index + 1}</span>
                  <span className="text-muted-foreground">/ {total}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.25 }}
                    className="font-outfit text-2xl sm:text-4xl md:text-5xl font-black leading-tight"
                  >
                    {steps[index]}
                  </motion.p>
                </AnimatePresence>
                <p className="mt-8 text-xs text-muted-foreground">
                  Use <kbd className="px-2 py-0.5 bg-secondary rounded text-foreground">←</kbd>{" "}
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-foreground">→</kbd> to navigate,{" "}
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-foreground">Esc</kbd> to exit.
                </p>
              </div>
            </main>
          )}

          <footer className="border-t border-border/40 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className={cn(
                "flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full font-bold transition-colors",
                index === 0
                  ? "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                  : "bg-secondary hover:bg-secondary/70 text-foreground",
              )}
            >
              <ChevronLeft size={18} /> <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Jump to step ${i + 1}`}
                  className={cn(
                    "rounded-full transition-all",
                    i === index ? "bg-primary w-6 h-2" : "bg-secondary w-2 h-2 hover:bg-primary/40",
                  )}
                />
              ))}
            </div>

            {isLast ? (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 sm:px-6 py-3 rounded-full font-bold transition-colors"
              >
                <Check size={18} /> Done
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 sm:px-6 py-3 rounded-full font-bold transition-colors"
              >
                <span className="hidden sm:inline">Next</span> <ChevronRight size={18} />
              </button>
            )}
          </footer>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

interface StartCookingButtonProps {
  title: string;
  steps: string[];
  className?: string;
}

export function StartCookingButton({ title, steps, className }: StartCookingButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={steps.length === 0}
        className={cn(
          "w-full bg-charcoal text-white py-4 rounded-2xl font-bold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
          className,
        )}
      >
        <ChefHat size={18} /> Start cooking mode
      </button>
      <CookingMode open={open} onClose={() => setOpen(false)} title={title} steps={steps} />
    </>
  );
}
