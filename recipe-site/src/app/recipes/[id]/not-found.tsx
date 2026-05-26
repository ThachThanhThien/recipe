import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/translations";

export default async function NotFound() {
  const lang = await getLang();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lang={lang} />
      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-20">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6" aria-hidden>🍽️</div>
          <h1 className="font-outfit text-4xl font-black mb-3">{t(lang, "detail.notFound")}</h1>
          <p className="text-muted-foreground mb-8">
            {lang === "vi"
              ? "Công thức bạn đang tìm không tồn tại, hoặc có thể không khả dụng."
              : "The recipe you're looking for doesn't exist, or it might be unavailable."}
          </p>
          <Link
            href="/recipes"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            {t(lang, "home.browseAllLong")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
