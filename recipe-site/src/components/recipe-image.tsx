"use client";

import Image from "next/image";
import { useState } from "react";
import { ChefHat } from "lucide-react";
import { fallbackGradient, hasImage, resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

interface RecipeImageProps {
  src: string | null | undefined;
  alt: string;
  seed: string | number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function RecipeImage({ src, alt, seed, fill = true, className, priority, sizes }: RecipeImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageUrl(src);
  const showFallback = !hasImage(resolved) || failed;

  if (showFallback) {
    return (
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden",
          fill ? "absolute inset-0" : "relative h-full w-full",
          className,
        )}
        style={{ background: fallbackGradient(seed) }}
        {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
      >
        <ChefHat className="size-1/4 max-h-16 max-w-16 text-white/70" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      src={resolved as string}
      alt={alt}
      fill={fill}
      sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
      className={cn("object-cover", className)}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
