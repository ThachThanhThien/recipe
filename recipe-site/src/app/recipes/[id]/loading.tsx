import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getLang } from "@/lib/lang-server";

export default async function Loading() {
  const lang = await getLang();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lang={lang} />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8 animate-pulse">
              <div className="aspect-[16/10] rounded-[2rem] bg-secondary/60" />
              <div className="h-12 w-3/4 bg-secondary/60 rounded" />
              <div className="h-4 w-full bg-secondary/40 rounded" />
              <div className="h-4 w-2/3 bg-secondary/40 rounded" />
              <div className="h-24 bg-secondary/40 rounded-3xl" />
            </div>
            <div className="lg:col-span-5 space-y-6 animate-pulse">
              <div className="h-96 bg-secondary/40 rounded-3xl" />
              <div className="h-32 bg-secondary/40 rounded-3xl" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
