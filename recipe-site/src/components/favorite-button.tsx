"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  recipeId: number;
  size?: "sm" | "md" | "lg";
  variant?: "floating" | "inline";
  className?: string;
}

const SIZE_MAP = {
  sm: { btn: "p-2", icon: 14 },
  md: { btn: "p-2.5", icon: 16 },
  lg: { btn: "p-3", icon: 20 },
};

export function FavoriteButton({ recipeId, size = "md", variant = "floating", className }: FavoriteButtonProps) {
  const { isFavorite, toggle, hydrated } = useFavorites();
  const active = hydrated && isFavorite(recipeId);
  const { btn, icon } = SIZE_MAP[size];

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Save to favorites"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(recipeId);
      }}
      className={cn(
        btn,
        "rounded-full transition-all shadow-md",
        variant === "floating"
          ? active
            ? "bg-primary text-white"
            : "bg-white/25 backdrop-blur-md text-white hover:bg-primary"
          : active
            ? "bg-primary text-white"
            : "bg-card border border-border text-foreground hover:border-primary",
        className,
      )}
    >
      <Heart size={icon} className={cn(active && "fill-current")} />
    </button>
  );
}
