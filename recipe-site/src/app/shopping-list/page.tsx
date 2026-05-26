import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShoppingListView } from "@/components/shopping-list-view";
import { getLang } from "@/lib/lang-server";

export const metadata = {
  title: "Shopping list | TastyFresh",
  description: "Ingredients you've saved from recipes, ready to take to the store.",
};

export default async function ShoppingListPage() {
  const lang = await getLang();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lang={lang} />
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="font-outfit text-4xl md:text-5xl font-black mb-3">
              {lang === "vi" ? (
                <>
                  Danh sách <span className="text-primary italic">mua sắm</span>
                </>
              ) : (
                <>
                  Shopping <span className="text-primary italic">list</span>
                </>
              )}
            </h1>
            <p className="text-muted-foreground">
              {lang === "vi"
                ? "Nhóm theo công thức. Tích từng món khi bạn mua — lưu trên thiết bị này."
                : "Grouped by recipe. Check items off as you shop — saved on this device."}
            </p>
          </header>
          <ShoppingListView />
        </div>
      </main>
      <Footer />
    </div>
  );
}
