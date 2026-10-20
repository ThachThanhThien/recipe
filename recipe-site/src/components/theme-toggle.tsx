"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useT } from "@/components/lang-provider";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle() {
  const t = useT();
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("nav.lightTheme") : t("nav.darkTheme")}
      className="grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {/* Same size icon before mount, so the header doesn't shift. */}
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
