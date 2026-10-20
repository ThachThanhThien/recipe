import { ChefHat } from "lucide-react";
import type { Lang } from "@/lib/lang";
import { t } from "@/lib/translations";

/** Quiet desktop footer; on phones the tab bar takes this space. */
export function SiteFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="mt-16 hidden border-t border-border/70 md:block">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-8 text-sm text-muted-foreground">
        <ChefHat size={16} aria-hidden />
        <span className="font-semibold text-foreground">TastyFresh</span>
        <span aria-hidden>·</span>
        <span>{t(lang, "brand.tagline")}</span>
      </div>
    </footer>
  );
}
