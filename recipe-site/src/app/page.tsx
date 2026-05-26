import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RecipeCard } from "@/components/recipe-card";
import { EmptyState } from "@/components/empty-state";
import { Hero } from "@/components/hero";
import { CategoryRail } from "@/components/category-rail";
import { RecentlyViewedRail } from "@/components/recently-viewed-rail";
import { getRecipes } from "@/lib/api";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/translations";

export default async function Home() {
  const lang = await getLang();
  let recipes = [] as Awaited<ReturnType<typeof getRecipes>>;
  let apiError = false;

  try {
    recipes = await getRecipes({ lang });
  } catch {
    apiError = true;
  }

  const featured = recipes.filter((r) => r.isFeatured).slice(0, 6);
  const trending = recipes.filter((r) => r.isTrending).slice(0, 6);
  const latest = [...recipes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  const categories = Array.from(
    new Set(recipes.map((r) => r.category).filter((c): c is string => !!c)),
  ).slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} />

      <main className="flex-grow">
        <Hero recipeCount={recipes.length} categoryCount={categories.length} />

        {apiError && (
          <section className="max-w-3xl mx-auto px-6 -mt-10 mb-12">
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-2xl px-5 py-4 text-sm">
              {t(lang, "home.apiUnavailableLine1")}{" "}
              <code className="font-mono">recipe-api</code> {t(lang, "home.apiUnavailableLine2")}{" "}
              <code className="font-mono">http://localhost:3000</code>.
            </div>
          </section>
        )}

        <RecentlyViewedRail allRecipes={recipes} />

        {categories.length > 0 && (
          <section className="py-16 px-6 max-w-7xl mx-auto">
            <SectionHeader
              eyebrow={t(lang, "home.browseEyebrow")}
              title={t(lang, "home.byCategory")}
              description={t(lang, "home.byCategoryDesc")}
            />
            <CategoryRail categories={categories} />
          </section>
        )}

        {featured.length > 0 && (
          <section className="py-16 px-6 bg-secondary/30">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                eyebrow={t(lang, "home.editorsChoice")}
                title={t(lang, "home.featured")}
                description={t(lang, "home.featuredDesc")}
                cta={{ href: "/recipes?featured=1", label: t(lang, "home.seeAll") }}
              />
              <RecipeGrid recipes={featured} />
            </div>
          </section>
        )}

        {trending.length > 0 && (
          <section className="py-16 px-6 max-w-7xl mx-auto">
            <SectionHeader
              eyebrow={t(lang, "home.hotNow")}
              title={t(lang, "home.trending")}
              description={t(lang, "home.trendingDesc")}
              cta={{ href: "/recipes?trending=1", label: t(lang, "home.seeAll") }}
            />
            <RecipeGrid recipes={trending} />
          </section>
        )}

        {latest.length > 0 ? (
          <section className="py-16 px-6 bg-secondary/30">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                eyebrow={t(lang, "home.fresh")}
                title={t(lang, "home.latest")}
                description={t(lang, "home.latestDesc")}
                cta={{ href: "/recipes", label: t(lang, "home.browseAll") }}
              />
              <RecipeGrid recipes={latest} />
            </div>
          </section>
        ) : (
          !apiError && (
            <section className="py-20 max-w-3xl mx-auto px-6">
              <EmptyState
                icon="🍳"
                title={t(lang, "home.noRecipesTitle")}
                description={t(lang, "home.noRecipesDesc")}
              />
            </section>
          )
        )}

        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-10 md:p-16 relative overflow-hidden text-white">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

            <div className="relative max-w-2xl">
              <h2 className="font-outfit text-4xl md:text-5xl font-black mb-4 leading-tight">
                {t(lang, "home.ctaHeadline")}
              </h2>
              <p className="text-white/85 text-lg mb-8">{t(lang, "home.ctaDesc")}</p>
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
              >
                {t(lang, "home.browseAllLong")} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  cta,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
      <div>
        {eyebrow && (
          <div className="flex items-center gap-2 mb-3 text-primary font-bold uppercase tracking-widest text-xs">
            <div className="w-8 h-px bg-primary" />
            {eyebrow}
          </div>
        )}
        <h2 className="font-outfit text-3xl md:text-4xl font-black">{title}</h2>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="flex items-center gap-2 text-primary font-bold hover:underline self-start md:self-auto"
        >
          {cta.label} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

function RecipeGrid({ recipes }: { recipes: Awaited<ReturnType<typeof getRecipes>> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes.map((recipe, i) => (
        <RecipeCard key={recipe.id} recipe={recipe} index={i} priority={i < 3} />
      ))}
    </div>
  );
}
