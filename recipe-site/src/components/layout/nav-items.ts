import { Heart, House, Search, ShoppingBasket, type LucideIcon } from "lucide-react";
import { SUPPORTED_LANGS } from "@/lib/lang";
import type { TKey } from "@/lib/translations";

export interface NavItem {
  href: string;
  /** Label in the desktop header. */
  label: TKey;
  /** Shorter label under the icon in the mobile tab bar. */
  tabLabel: TKey;
  icon: LucideIcon;
  badge?: "saved" | "shopping";
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "nav.home", tabLabel: "nav.home", icon: House },
  { href: "/recipes", label: "nav.recipes", tabLabel: "nav.search", icon: Search },
  { href: "/favorites", label: "nav.saved", tabLabel: "nav.saved", icon: Heart, badge: "saved" },
  { href: "/shopping-list", label: "nav.shoppingList", tabLabel: "nav.shopping", icon: ShoppingBasket, badge: "shopping" },
];

const LANG_PREFIX = new RegExp(`^/(${SUPPORTED_LANGS.join("|")})(?=/|$)`);

/** Whether `href` is the current section. Pages can also be opened as /en/... or /vi/... */
export function isActive(pathname: string, href: string): boolean {
  const path = pathname.replace(LANG_PREFIX, "") || "/";
  return href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
}
