import type { Metadata } from "next";
import { FavoritesGrid } from "@/components/favorites-grid";
import { Container, PageHeader } from "@/components/ui";
import { getRecipeSummaries } from "@/lib/api";
import { toLang, type LangParams } from "@/lib/lang";
import { t } from "@/lib/translations";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = toLang((await params).lang);
  return { title: `${t(lang, "saved.title")} | TastyFresh` };
}

export default async function FavoritesPage({ params }: LangParams) {
  const lang = toLang((await params).lang);
  const recipes = await getRecipeSummaries({ lang });

  return (
    <Container>
      <PageHeader title={t(lang, "saved.title")} subtitle={t(lang, "saved.subtitle")} />
      <FavoritesGrid allRecipes={recipes} />
    </Container>
  );
}
