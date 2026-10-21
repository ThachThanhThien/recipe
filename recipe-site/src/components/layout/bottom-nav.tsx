"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useT } from "@/components/lang-provider";
import { useNavBadges } from "@/hooks/use-nav-badges";
import { NAV_ITEMS, isActive } from "./nav-items";

/** Thumb-reachable tab bar for phones; the desktop header carries the same links. */
export function BottomNav() {
  const t = useT();
  const pathname = usePathname() ?? "/";
  const badges = useNavBadges();

  return (
    <nav
      aria-label={t("nav.main")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
    >
      <ul className="grid h-16 grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const count = item.badge ? badges[item.badge] : 0;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground active:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "relative grid h-7 w-14 place-items-center rounded-full transition-colors",
                    active && "bg-primary-soft",
                  )}
                >
                  <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                  {count > 0 && (
                    <span className="absolute -top-1 right-2 min-w-[18px] rounded-full bg-primary px-1 text-center text-[10px] font-semibold leading-[18px] text-primary-foreground">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </span>
                {t(item.tabLabel)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
