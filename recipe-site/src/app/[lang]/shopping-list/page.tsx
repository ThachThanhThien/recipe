import type { Metadata } from "next";
import { ShoppingListView } from "@/components/shopping-list-view";
import { Container, PageHeader } from "@/components/ui";
import { toLang, type LangParams } from "@/lib/lang";
import { t } from "@/lib/translations";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = toLang((await params).lang);
  return { title: `${t(lang, "shop.title")} | TastyFresh` };
}

export default async function ShoppingListPage({ params }: LangParams) {
  const lang = toLang((await params).lang);
  return (
    <Container className="max-w-3xl">
      <PageHeader title={t(lang, "shop.title")} subtitle={t(lang, "shop.subtitle")} />
      <ShoppingListView />
    </Container>
  );
}
