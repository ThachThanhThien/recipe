import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Shared building blocks so every page uses the same sizes, radii and states.
// Interactive elements are at least 40–48px tall for comfortable tapping.

type ButtonVariant = "primary" | "secondary" | "ghost";

export function buttonClass(variant: ButtonVariant = "primary", size: "md" | "lg" = "md"): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    size === "lg" ? "h-12 px-6 text-base" : "h-11 px-5 text-sm",
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary-hover",
    variant === "secondary" && "border border-border bg-card text-foreground hover:bg-muted",
    variant === "ghost" && "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

export function chipClass(active: boolean): string {
  return cn(
    "inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border bg-card text-foreground hover:bg-muted",
  );
}

export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...rest} />;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pb-5 pt-6 sm:pt-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function SectionHeader({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="-mr-2 inline-flex h-10 items-center gap-0.5 rounded-lg px-2 text-sm font-medium text-primary hover:bg-primary-soft"
        >
          {linkLabel}
          <ChevronRight size={16} aria-hidden />
        </Link>
      )}
    </div>
  );
}

/** A horizontally scrolling row on phones (edge to edge), wrapping on wider screens. */
export function ChipRow({ children, label, className }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0", className)}
    >
      {children}
    </div>
  );
}
