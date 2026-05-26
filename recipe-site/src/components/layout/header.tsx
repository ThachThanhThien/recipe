"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChefHat, Moon, Sun, Heart, ShoppingBasket } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/hooks/use-favorites";
import { useShoppingList } from "@/hooks/use-shopping-list";
import { HeaderCountLink } from "@/components/header-count-link";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Lang } from "@/lib/lang";
import { translator } from "@/lib/translations";

interface HeaderProps {
  lang: Lang;
}

export function Header({ lang }: HeaderProps) {
  const t = translator(lang);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { count: favoritesCount, hydrated: favoritesHydrated } = useFavorites();
  const { uncheckedCount: cartCount, hydrated: cartHydrated } = useShoppingList();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.recipes"), href: "/recipes" },
  ];

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    router.push(q ? `/recipes?q=${encodeURIComponent(q)}` : "/recipes");
  };

  const activeTheme = resolvedTheme ?? theme;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6",
        isScrolled ? "glass py-2 shadow-sm" : "bg-transparent py-4",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-primary p-1.5 rounded-lg text-white group-hover:rotate-6 transition-transform">
            <ChefHat size={22} />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight">
            Tasty<span className="text-primary italic">Fresh</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-semibold text-sm transition-colors",
                  active ? "text-primary" : "text-foreground/80 hover:text-primary",
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <form onSubmit={onSearchSubmit} className="relative w-full" role="search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              aria-label={t("nav.searchAria")}
              className="bg-secondary/50 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full transition-all"
            />
          </form>
        </div>

        <div className="hidden md:flex items-center gap-1 shrink-0">
          <LanguageSwitcher current={lang} variant="compact" />
          <HeaderCountLink
            href="/favorites"
            count={favoritesHydrated ? favoritesCount : 0}
            label={t("nav.favorites")}
            icon={<Heart size={18} />}
          />
          <HeaderCountLink
            href="/shopping-list"
            count={cartHydrated ? cartCount : 0}
            label={t("nav.shoppingList")}
            icon={<ShoppingBasket size={18} />}
          />
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(activeTheme === "dark" ? "light" : "dark")}
              aria-label={t("nav.toggleTheme")}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              {activeTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1">
          <HeaderCountLink
            href="/favorites"
            count={favoritesHydrated ? favoritesCount : 0}
            label={t("nav.favorites")}
            icon={<Heart size={18} />}
          />
          <HeaderCountLink
            href="/shopping-list"
            count={cartHydrated ? cartCount : 0}
            label={t("nav.shoppingList")}
            icon={<ShoppingBasket size={18} />}
          />
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(activeTheme === "dark" ? "light" : "dark")}
              aria-label={t("nav.toggleTheme")}
              className="p-2"
            >
              {activeTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t("nav.toggleMenu")}
            aria-expanded={isMobileMenuOpen}
            className="p-2"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b p-5 flex flex-col gap-4 md:hidden shadow-xl"
          >
            <form onSubmit={onSearchSubmit} className="relative" role="search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t("nav.searchPlaceholder")}
                aria-label={t("nav.searchAria")}
                className="bg-secondary/50 rounded-xl pl-10 pr-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </form>
            <nav className="grid grid-cols-2 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-4 bg-secondary/40 rounded-xl text-center font-semibold hover:bg-primary/10 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">
                {t("nav.language")}
              </div>
              <LanguageSwitcher current={lang} variant="wide" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
