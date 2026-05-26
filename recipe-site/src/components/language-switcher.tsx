"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { setLangAction } from "@/lib/lang-actions";
import { LANG_LABELS, SUPPORTED_LANGS, type Lang } from "@/lib/lang";

interface LanguageSwitcherProps {
  current: Lang;
  /** Visual variant. `compact` for the desktop header bar; `wide` for the mobile menu. */
  variant?: "compact" | "wide";
}

export function LanguageSwitcher({ current, variant = "compact" }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const switchTo = (next: Lang) => {
    if (next === current || pending) return;
    startTransition(async () => {
      await setLangAction(next, pathname ?? "/");
      router.refresh();
    });
  };

  if (variant === "wide") {
    return (
      <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/40 rounded-xl">
        {SUPPORTED_LANGS.map((code) => {
          const active = code === current;
          return (
            <button
              key={code}
              type="button"
              onClick={() => switchTo(code)}
              disabled={pending}
              aria-pressed={active}
              className={cn(
                "px-4 py-3 rounded-lg text-sm font-bold transition-colors",
                active
                  ? "bg-primary text-white shadow"
                  : "text-foreground/70 hover:text-primary",
                pending && !active && "opacity-50",
              )}
            >
              {LANG_LABELS[code].native}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-0.5 p-0.5 bg-secondary/40 rounded-full"
      role="group"
      aria-label="Language"
    >
      <Globe size={14} className="ml-2 mr-1 text-muted-foreground" aria-hidden />
      {SUPPORTED_LANGS.map((code) => {
        const active = code === current;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            disabled={pending}
            aria-pressed={active}
            aria-label={LANG_LABELS[code].native}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-bold transition-colors",
              active
                ? "bg-primary text-white shadow-sm"
                : "text-foreground/70 hover:text-primary",
              pending && !active && "opacity-50",
            )}
          >
            {LANG_LABELS[code].short}
          </button>
        );
      })}
    </div>
  );
}
