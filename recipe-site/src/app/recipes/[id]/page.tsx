"use client"

import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MOCK_RECIPES } from "@/lib/mock-data"
import { motion } from "framer-motion"
import Image from "next/image"
import { 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  ChevronLeft, 
  Heart, 
  Share2, 
  Printer, 
  CheckCircle2,
  Bookmark
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const recipe = MOCK_RECIPES.find(r => r.id === params.id)
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([])

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Recipe Not Found</h1>
          <button onClick={() => router.push("/")} className="text-primary hover:underline font-bold">Return to Home</button>
        </div>
      </div>
    )
  }

  const toggleIngredient = (item: string) => {
    setCheckedIngredients(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs"
            >
              <ChevronLeft size={16} /> Back to recipes
            </button>
            <div className="flex items-center gap-4">
              <button className="p-3 bg-card border rounded-full hover:shadow-lg transition-all"><Heart size={20} /></button>
              <button className="p-3 bg-card border rounded-full hover:shadow-lg transition-all"><Share2 size={20} /></button>
              <button className="p-3 bg-card border rounded-full hover:shadow-lg transition-all"><Printer size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Content: Image & Metadata */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl mb-12"
              >
                <Image 
                  src={recipe.image} 
                  alt={recipe.title.en} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute top-6 left-6 flex gap-3">
                  {recipe.tags.map(tag => (
                    <span key={tag} className="glass text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              <div className="flex flex-col gap-6 mb-12">
                <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-sm uppercase">
                  <ChefHat size={18} /> Mastered by TastyChef
                </div>
                <h1 className="font-outfit text-5xl md:text-6xl font-black">{recipe.title.en}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed italic">
                  "{recipe.description.en}"
                </p>
              </div>

              {/* Prep Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-card rounded-[2rem] border border-border/40 shadow-sm mb-16">
                {[
                  { icon: Clock, label: "PREP", value: recipe.prepTime, color: "text-blue-500" },
                  { icon: Clock, label: "COOK", value: recipe.cookTime, color: "text-orange-500" },
                  { icon: Users, label: "SERVINGS", value: `${recipe.servings} People`, color: "text-green-500" },
                  { icon: Flame, label: "CALORIES", value: `${recipe.calories} kcal`, color: "text-red-500" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-secondary/30">
                    <item.icon className={cn("mb-3", item.color)} size={24} />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{item.label}</span>
                    <span className="text-lg font-black">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <section className="mb-16">
                <h2 className="font-outfit text-3xl font-black mb-8 flex items-center gap-4">
                  Instructions <div className="h-px flex-grow bg-border/40" />
                </h2>
                <div className="flex flex-col gap-10">
                  {recipe.instructions.en.split('\n').filter(s => s.trim()).map((step, i) => (
                    <div key={i} className="group relative flex gap-8">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-outfit font-black text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        {i + 1}
                      </div>
                      <div className="pt-2">
                        <p className="text-lg leading-relaxed text-foreground group-hover:text-primary transition-colors">
                          {step}
                        </p>
                      </div>
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-500 rounded-full" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Content: Sidebar Ingredients */}
            <div className="lg:col-span-5">
              <aside className="sticky top-32">
                <div className="bg-card rounded-[2.5rem] border border-border/60 p-10 shadow-xl overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  
                  <h3 className="font-outfit text-3xl font-black mb-8 relative z-10">Ingredients.</h3>
                  <div className="flex flex-col gap-5 relative z-10">
                    {recipe.ingredients.map((ing, i) => (
                      <label 
                        key={i} 
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border border-transparent transition-all cursor-pointer select-none",
                          checkedIngredients.includes(ing.item.en) 
                            ? "bg-primary/5 border-primary/10 opacity-60" 
                            : "hover:bg-secondary/50 hover:border-border"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={(e) => { e.preventDefault(); toggleIngredient(ing.item.en); }}
                            className={cn(
                              "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                              checkedIngredients.includes(ing.item.en) 
                                ? "bg-primary border-primary" 
                                : "border-muted-foreground/30"
                            )}
                          >
                            {checkedIngredients.includes(ing.item.en) && <CheckCircle2 size={16} className="text-white" />}
                          </button>
                          <span className={cn(
                            "font-semibold transition-all",
                            checkedIngredients.includes(ing.item.en) && "line-through"
                          )}>
                            {ing.item.en}
                          </span>
                        </div>
                        <span className="text-primary font-bold uppercase tracking-tight text-sm">
                          {ing.amount}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t relative z-10">
                    <button className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                      Add all to Shopping List
                    </button>
                    <p className="text-center mt-6 text-xs text-muted-foreground font-medium">
                      Based on {recipe.servings} servings
                    </p>
                  </div>
                </div>

                {/* Rating Card */}
                <div className="mt-8 bg-charcoal rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <h4 className="font-outfit font-bold mb-2">Recipe Rating</h4>
                    <div className="flex items-center gap-1 text-yellow-400 mb-4">
                      {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                      <span className="text-white font-bold ml-2">{recipe.rating}</span>
                      <span className="text-white/40 text-sm ml-1">({recipe.reviews} reviews)</span>
                    </div>
                    <button className="text-xs uppercase tracking-widest font-black text-primary hover:text-white transition-colors">
                      Write a review →
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
