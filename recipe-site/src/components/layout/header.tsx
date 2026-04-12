"use client"

import Link from "next/link"
import { Search, Heart, User, Menu, X, ChefHat, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Breakfast", href: "/categories/breakfast" },
    { name: "Lunch", href: "/categories/lunch" },
    { name: "Dinner", href: "/categories/dinner" },
    { name: "Desserts", href: "/categories/desserts" },
    { name: "Vegan", href: "/categories/vegan" },
  ]

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "glass py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
            <ChefHat size={24} />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight">Tasty<span className="text-primary italic">Fresh</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="font-medium text-sm text-foreground/80 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search recipes..." 
              className="bg-secondary/50 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-48 transition-all focus:w-64"
            />
          </div>
          <button 
            className="p-2 hover:bg-secondary rounded-full relative transition-colors"
          >
            <Heart size={20} className="hover:text-primary transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          {mounted && (
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button className="bg-charcoal text-white dark:bg-primary dark:text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
            Sign In
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b p-6 flex flex-col gap-6 md:hidden shadow-xl"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search recipes..." 
                className="bg-secondary/50 rounded-xl pl-10 pr-4 py-3 text-sm w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="p-4 bg-secondary/30 rounded-xl text-center font-medium hover:bg-primary/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <button className="w-full bg-primary text-white py-4 rounded-xl font-bold">
              Join Our Community
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
