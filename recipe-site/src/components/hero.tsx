"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface HeroProps {
  recipeCount: number;
  categoryCount: number;
}

export function Hero({ recipeCount, categoryCount }: HeroProps) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/recipes?q=${encodeURIComponent(term)}` : "/recipes");
  };

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/10" />
        <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-6"
        >
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs uppercase font-bold tracking-widest text-primary">Fresh recipes, every day</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="font-outfit text-5xl md:text-7xl font-black leading-[1.05] mb-6"
        >
          Cook something{" "}
          <span className="text-primary italic">delicious</span>
          <br className="hidden sm:block" /> tonight.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto"
        >
          Browse hand-picked recipes from our kitchen — quick weeknight meals, weekend showstoppers, and everything in between.
        </motion.p>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="max-w-xl mx-auto mb-8"
          role="search"
        >
          <div className="relative flex items-center bg-card border border-border/60 rounded-full shadow-lg shadow-black/5 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
            <Search className="absolute left-5 text-muted-foreground" size={18} />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, ingredient, or tag..."
              aria-label="Search recipes"
              className="flex-grow bg-transparent pl-12 pr-2 py-4 text-base focus:outline-none"
            />
            <button
              type="submit"
              className="m-1.5 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all"
            >
              Search
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground"
        >
          <Link href="/recipes" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
            Browse all recipes <ArrowRight size={14} />
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="font-black text-foreground text-lg">{recipeCount}</span>
              <span className="ml-1.5 uppercase text-xs tracking-widest">Recipes</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div>
              <span className="font-black text-foreground text-lg">{categoryCount}</span>
              <span className="ml-1.5 uppercase text-xs tracking-widest">Categories</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
