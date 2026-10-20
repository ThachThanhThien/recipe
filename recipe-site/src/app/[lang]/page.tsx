import Link from "next/link";
import { CookingPot } from "lucide-react";
import { RecipeGrid } from "@/components/recipe-card";
import { EmptyState } from "@/components/empty-state";
import { SearchField } from "@/components/search-field";
import { RecentlyViewedRail, SavedRail } from "@/components/recently-viewed-rail";
import { ChipRow, Container, SectionHeader, chipClass } from "@/components/ui";
import { categoriesOf, getRecipeSummaries } from "@/lib/api";
import { toLang, type LangParams } from "@/lib/lang";
import { t } from "@/lib/translations";

export default async function Home({ params }: LangParams) {
  const lang = toLang((await params).lang);
  const recipes = await getRecipeSummaries({ lang });
  const categories = categoriesOf(recipes);
  const newest = recipes.slice(0, 8);
  const featured = recipes.filter((r) => r.isFeatured).slice(0, 8);

  return (
    <Container className="pt-6 sm:pt-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(lang, "home.greeting")}</h1>
      <p className="mt-1 text-muted-foreground">{t(lang, "home.count", { n: recipes.length })}</p>

      <SearchField className="mt-5 max-w-2xl" />

      {categories.length > 0 && (
        <ChipRow className="mt-4" label={t(lang, "recipes.categories")}>
          {categories.map((category) => (
            <Link key={category} href={`/recipes?category=${encodeURIComponent(category)}`} className={chipClass(false)}>
              {category}
            </Link>
          ))}
        </ChipRow>
      )}

      {recipes.length === 0 ? (
        <EmptyState icon={CookingPot} title={t(lang, "home.noRecipesTitle")} description={t(lang, "home.noRecipesDesc")} />
      ) : (
        <>
          <RecentlyViewedRail allRecipes={recipes} />
          <SavedRail allRecipes={recipes} />

          <section className="mt-10">
            <SectionHeader title={t(lang, "home.latest")} href="/recipes" linkLabel={t(lang, "home.seeAll")} />
            <RecipeGrid recipes={newest} priorityCount={2} />
          </section>

          {featured.length > 0 && (
            <section className="mt-10">
              <SectionHeader
                title={t(lang, "home.featured")}
                href="/recipes?featured=1"
                linkLabel={t(lang, "home.seeAll")}
              />
              <RecipeGrid recipes={featured} />
            </section>
          )}
        </>
      )}
    </Container>
  );
}
