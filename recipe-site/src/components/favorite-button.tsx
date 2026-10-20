"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { useT } from "@/components/lang-provider";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  recipeId: number;
  /** `overlay` sits on a card photo; `pill` is a labelled button on the recipe page. */
  variant?: "overlay" | "pill";
  className?: string;
}

export function FavoriteButton({ recipeId, variant = "overlay", className }: FavoriteButtonProps) {
  const t = useT();
  const { isFavorite, toggle, hydrated } = useFavorites();
  const active = hydrated && isFavorite(recipeId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? t("detail.unsaveAria") : t("detail.saveAria")}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(recipeId);
      }}
      className={cn(
        "transition-colors active:scale-95",
        variant === "overlay"
          ? [
              // 36px circle with an invisible 48px tap area.
              "relative grid size-9 place-items-center rounded-full backdrop-blur-md after:absolute after:-inset-1.5 after:content-['']",
              active ? "bg-primary text-primary-foreground" : "bg-black/35 text-white hover:bg-black/50",
            ]
          : [
              "flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold",
              active
                ? "border-primary bg-primary-soft text-primary-soft-foreground"
                : "border-border bg-card text-foreground hover:bg-muted",
            ],
        className,
      )}
    >
      <Heart size={variant === "overlay" ? 16 : 18} className={cn(active && "fill-current")} aria-hidden />
      {variant === "pill" && (active ? t("detail.saved") : t("detail.save"))}
    </button>
  );
}
