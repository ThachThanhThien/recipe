"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  className?: string;
}

export function StarRating({ value, onChange, readOnly, size = 20, className }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`${value} out of 5 stars`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        const Component = readOnly ? "span" : "button";
        return (
          <Component
            key={star}
            type={readOnly ? undefined : "button"}
            role={readOnly ? undefined : "radio"}
            aria-checked={!readOnly && star === value ? true : undefined}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            onMouseEnter={readOnly ? undefined : () => setHover(star)}
            onMouseLeave={readOnly ? undefined : () => setHover(null)}
            onFocus={readOnly ? undefined : () => setHover(star)}
            onBlur={readOnly ? undefined : () => setHover(null)}
            onClick={readOnly ? undefined : () => onChange?.(star)}
            className={cn(
              "transition-transform",
              !readOnly && "cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded",
            )}
          >
            <Star
              size={size}
              className={cn("transition-colors", filled ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30")}
              strokeWidth={1.5}
            />
          </Component>
        );
      })}
    </div>
  );
}
