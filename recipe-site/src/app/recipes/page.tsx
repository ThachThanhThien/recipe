"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RecipeCard } from "@/components/recipe-card"
import { MOCK_RECIPES } from "@/lib/mock-data"
import { Search, Filter, SlidersHorizontal, LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("Newest")

  const categories = ["All", ...new Set(MOCK_RECIPES.map(r => r.category))]

  const filteredRecipes = useMemo(() => {
    return MOCK_RECIPES.filter(recipe => {
      const matchesSearch = recipe.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory
      return matchesSearch && matchesCategory
    }).sort((a, b) => {
      if (sortBy === "Highest Rated") return b.rating - a.rating
      return 0 // Default
    })
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h1 className="font-outfit text-5xl font-black mb-6">Discover <span className="text-primary italic">Flavor</span>.</h1>
            <p className="text-muted-foreground text-lg font-medium">Browse our full collection of hand-crafted recipes for every meal and occasion.</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass p-4 rounded-3xl mb-12 flex flex-col md:flex-row gap-4 items-center shadow-xl border-border/40">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input 
                type="text" 
                placeholder="Search by ingredients, titles, tags..." 
                className="w-full bg-secondary/30 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <select 
                className="bg-secondary/30 rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none cursor-pointer hover:bg-secondary/50 transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Newest</option>
                <option>Highest Rated</option>
                <option>Most Popular</option>
              </select>
              
              <button className="bg-charcoal text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary transition-all">
                <SlidersHorizontal size={18} /> Filters
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-3 mb-16 items-center">
            <span className="text-xs uppercase tracking-widest font-black text-muted-foreground mr-4">Categories:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold transition-all border",
                  selectedCategory === cat 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                    : "bg-card border-border hover:border-primary/30 text-foreground/70"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe, index) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold mb-2">No recipes found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
