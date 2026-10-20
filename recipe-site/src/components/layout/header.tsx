"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/lang";
import { useT } from "@/components/lang-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchField } from "@/components/search-field";
import { useNavBadges } from "@/hooks/use-nav-badges";
import { NAV_ITEMS, isActive } from "./nav-items";

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = useT();
  const pathname = usePathname() ?? "/";
  const badges = useNavBadges();
  // The recipes page has its own, bigger search box.
  const showSearch = !isActive(pathname, "/recipes");

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:px-6 md:h-16 md:gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 rounded-lg pr-1 font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ChefHat size={18} strokeWidth={2.25} />
          </span>
          <span className="text-[17px]">TastyFresh</span>
        </Link>

        <nav aria-label={t("nav.main")} className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const count = item.badge ? badges[item.badge] : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {t(item.label)}
                {count > 0 && (
                  <span className="min-w-5 rounded-full bg-primary px-1.5 text-center text-[11px] font-semibold leading-5 text-primary-foreground">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {showSearch && (
            <SearchField variant="compact" placeholder={t("nav.searchAria")} className="hidden w-60 lg:block" />
          )}
          <LanguageSwitcher current={lang} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
