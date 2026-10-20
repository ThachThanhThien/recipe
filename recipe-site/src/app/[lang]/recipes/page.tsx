import type { Metadata } from "next";
import { CookingPot } from "lucide-react";
import { RecipeBrowser } from "@/components/recipe-browser";
import { EmptyState } from "@/components/empty-state";
import { Container, PageHeader } from "@/components/ui";
import { categoriesOf, getRecipeSummaries } from "@/lib/api";
import { toLang, type LangParams } from "@/lib/lang";
import { t } from "@/lib/translations";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = toLang((await params).lang);
  return { title: `${t(lang, "recipes.title")} | TastyFresh` };
}

export default async function RecipesPage({ params }: LangParams) {
  const lang = toLang((await params).lang);
  const recipes = await getRecipeSummaries({ lang });

  return (
    <Container>
      <PageHeader title={t(lang, "recipes.title")} />
      {recipes.length === 0 ? (
        <EmptyState icon={CookingPot} title={t(lang, "home.noRecipesTitle")} description={t(lang, "recipes.emptyDesc")} />
      ) : (
        <RecipeBrowser recipes={recipes} categories={categoriesOf(recipes)} />
      )}
    </Container>
  );
}
