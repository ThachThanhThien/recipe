"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/lang-provider";

interface SearchFieldProps {
  variant?: "compact" | "large";
  className?: string;
  placeholder?: string;
  /** Controlled mode: filter in place. Without it, submitting opens /recipes?q=… */
  value?: string;
  onValueChange?: (value: string) => void;
}

export function SearchField({ variant = "large", className, placeholder, value, onValueChange }: SearchFieldProps) {
  const t = useT();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const controlled = value !== undefined;
  const current = controlled ? value : draft;

  const change = (next: string) => (controlled ? onValueChange?.(next) : setDraft(next));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (controlled) {
      inputRef.current?.blur(); // closes the on-screen keyboard
      return;
    }
    const q = draft.trim();
    router.push(q ? `/recipes?q=${encodeURIComponent(q)}` : "/recipes");
  };

  const large = variant === "large";

  return (
    <form role="search" onSubmit={onSubmit} className={cn("relative", className)}>
      <Search
        aria-hidden
        size={large ? 20 : 16}
        className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground", large ? "left-4" : "left-3")}
      />
      <input
        ref={inputRef}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        value={current}
        onChange={(e) => change(e.target.value)}
        placeholder={placeholder ?? t("nav.searchPlaceholder")}
        aria-label={t("nav.searchAria")}
        className={cn(
          "w-full text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none",
          large
            ? "h-12 rounded-xl border border-border bg-card pl-12 pr-12 text-base shadow-card focus:border-primary focus:ring-4 focus:ring-primary/15"
            : "h-10 rounded-lg border border-transparent bg-muted pl-9 pr-9 text-sm focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/15",
        )}
      />
      {current && (
        <button
          type="button"
          onClick={() => {
            change("");
            inputRef.current?.focus();
          }}
          aria-label={t("nav.clearSearch")}
          className={cn(
            "absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground",
            large ? "right-1.5 size-10" : "right-1 size-8",
          )}
        >
          <X size={large ? 18 : 14} />
        </button>
      )}
    </form>
  );
}
