import type { Metadata } from "next";
import { CookPlanner } from "@/components/cook/cook-planner";
import { Container, PageHeader } from "@/components/ui";
import { getCookData } from "@/lib/api";
import { toLang, type LangParams } from "@/lib/lang";
import { t } from "@/lib/translations";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = toLang((await params).lang);
  return { title: `${t(lang, "planner.title")} | TastyFresh` };
}

export default async function CookPage({ params }: LangParams) {
  const lang = toLang((await params).lang);
  const { ingredients, recipes } = await getCookData({ lang });

  return (
    <Container>
      <PageHeader title={t(lang, "planner.title")} subtitle={t(lang, "planner.subtitle")} />
      <CookPlanner ingredients={ingredients} recipes={recipes} />
    </Container>
  );
}
