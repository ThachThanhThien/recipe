"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Star, Heart, ChefHat } from "lucide-react"
import { motion } from "framer-motion"
import { Recipe } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

export function RecipeCard({ recipe, index }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-card rounded-3xl overflow-hidden border border-border/40 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image 
          src={recipe.image} 
          alt={recipe.title.en} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          {recipe.isFeatured && (
            <span className="bg-primary text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg">
              Featured
            </span>
          )}
          <span className="glass text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            {recipe.category}
          </span>
        </div>

        <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-primary p-2.5 rounded-full text-white transition-all shadow-lg group/heart">
          <Heart size={18} className="group-hover/heart:fill-white transition-colors" />
        </button>

        <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white text-xs font-medium translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1.5 rounded-full backdrop-blur-md">
            <Clock size={14} className="text-primary" />
            {recipe.prepTime}
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1.5 rounded-full backdrop-blur-md">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            {recipe.rating}
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow bg-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-px bg-primary/30" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary/80">
            {recipe.difficulty} • {recipe.calories} kcal
          </span>
        </div>
        
        <Link href={`/recipes/${recipe.id}`} className="block group/title mb-3">
          <h3 className="font-outfit text-xl font-bold leading-tight group-hover/title:text-primary transition-colors line-clamp-2">
            {recipe.title.en}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
          {recipe.description.en}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary overflow-hidden border border-border shadow-sm">
              <ChefHat size={16} />
            </div>
            <span className="text-xs font-semibold text-foreground/70 tracking-tight">By TastyChef</span>
          </div>
          <Link 
            href={`/recipes/${recipe.id}`}
            className="text-primary text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-all flex items-center gap-1 group/btn"
          >
            Recipe Details
            <motion.span 
              whileHover={{ x: 3 }}
              className="inline-block"
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
