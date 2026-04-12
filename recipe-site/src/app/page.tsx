"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RecipeCard } from "@/components/recipe-card"
import { MOCK_RECIPES } from "@/lib/mock-data"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Play, Utensils, Zap, Leaf, Heart, Share2, Printer, CheckCircle2, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
  const featuredRecipes = MOCK_RECIPES.filter(r => r.isFeatured)
  const trendingRecipes = MOCK_RECIPES.filter(r => r.isTrending)
  const allRecipes = MOCK_RECIPES

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center pt-20 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/hero.png" 
              alt="Delicious Mediterranean Bowl" 
              fill 
              className="object-cover brightness-[0.85] contrast-125"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-full mb-6">
                <Zap size={14} className="text-primary fill-primary" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">New Season Recipes</span>
              </div>
              <h1 className="font-outfit text-6xl md:text-8xl font-black text-white leading-[0.9] mb-8 drop-shadow-2xl">
                Cook Like a <span className="text-primary italic">Pro</span> At Home.
              </h1>
              <p className="text-white/80 text-xl md:text-2xl mb-10 leading-relaxed font-medium">
                Discover 5,000+ hand-picked recipes that turn every meal into a culinary masterpiece.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/recipes" className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-primary/20 flex items-center gap-3 group">
                  Explore Recipes
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <button className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-3">
                  <Play size={20} className="fill-white" />
                  Watch Stories
                </button>
              </div>

              <div className="mt-16 flex items-center gap-8 text-white/60">
                <div className="flex flex-col gap-1">
                  <span className="text-white text-2xl font-black">5.2k+</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Recipes</span>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex flex-col gap-1">
                  <span className="text-white text-2xl font-black">120k+</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Followers</span>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex flex-col gap-1">
                  <span className="text-white text-2xl font-black">4.9/5</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Top Rated</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="font-outfit text-4xl md:text-5xl font-black mb-4">Choose Your <span className="text-primary">Mood</span>.</h2>
              <p className="text-muted-foreground text-lg font-medium">Filter recipes by your current dietary preference or meal time.</p>
            </div>
            <Link href="/categories" className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline transition-all">
              View All Categories <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Breakfast", icon: "🍳", color: "bg-orange-100 dark:bg-orange-950" },
              { name: "Lunch", icon: "🥗", color: "bg-green-100 dark:bg-green-950" },
              { name: "Dinner", icon: "🥩", color: "bg-red-100 dark:bg-red-950" },
              { name: "Vegan", icon: "🌱", color: "bg-emerald-100 dark:bg-emerald-950" },
              { name: "Dessert", icon: "🍰", color: "bg-pink-100 dark:bg-pink-950" },
              { name: "Quick", icon: "⚡", color: "bg-yellow-100 dark:bg-yellow-950" },
            ].map((cat, i) => (
              <motion.div
                key={cat.name}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer transition-shadow hover:shadow-xl",
                  cat.color
                )}
              >
                <div className="text-5xl">{cat.icon}</div>
                <span className="font-bold text-lg tracking-tight">{cat.name}</span>
                <div className="w-8 h-1 bg-primary/20 rounded-full" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Grid */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-primary" />
              <span className="font-bold text-primary uppercase tracking-widest text-sm">Editor's Choice</span>
            </div>
            <h2 className="font-outfit text-5xl font-black mb-16">Featured <span className="text-primary italic">Recipes</span>.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {allRecipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>

            <div className="mt-20 text-center">
              <button className="bg-charcoal text-white hover:bg-primary px-12 py-5 rounded-full font-bold shadow-2xl transition-all duration-300">
                Show More Recipes
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto bg-primary rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-white group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="font-outfit text-5xl md:text-7xl font-black mb-8 leading-tight">Join Our Foodie <span className="italic underline underline-offset-8 decoration-white/30">Family</span>.</h2>
              <p className="text-white/80 text-xl mb-12 font-medium">Subscribe to our newsletter and get the weekly most popular recipes and exclusive cooking tips.</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/20 backdrop-blur-md border border-white/30 px-8 py-5 rounded-full text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white flex-grow font-semibold" 
                />
                <button className="bg-white text-primary px-10 py-5 rounded-full font-bold hover:scale-105 transition-all shadow-xl">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
