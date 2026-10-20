import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LangProvider } from "@/components/lang-provider";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { notFound } from "next/navigation";
import { isLang, SUPPORTED_LANGS } from "@/lib/lang";
import { SITE_URL } from "@/lib/seo";
import { t } from "@/lib/translations";

// Designed for Vietnamese: every tone mark renders in the same typeface.
const sans = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "TastyFresh | Recipes",
  description: "A personal recipe notebook — search, save and cook.",
  keywords: ["recipes", "cooking", "vietnamese food", "công thức", "nấu ăn"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

// Pre-render every page once per language; any other first segment is a 404.
export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={sans.variable} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LangProvider lang={lang}>
            <a
              href="#main"
              className="sr-only z-50 rounded-lg bg-card px-4 py-2 font-medium shadow-raised focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
            >
              {t(lang, "nav.skip")}
            </a>
            <SiteHeader lang={lang} />
            <main id="main" className="min-h-[calc(100dvh-3.5rem)] pb-tabbar md:pb-0">
              {children}
            </main>
            <SiteFooter lang={lang} />
            <BottomNav />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
