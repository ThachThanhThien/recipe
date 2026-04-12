import Link from "next/link"
import { ChefHat, Mail, ArrowUpRight, Share2, Globe, MessageSquare } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const sections = [
    {
      title: "Recipes",
      links: [
        { name: "Meal of the Day", href: "#" },
        { name: "Vegetarian", href: "#" },
        { name: "Quick & Easy", href: "#" },
        { name: "Seasonal Favorites", href: "#" },
      ]
    },
    {
      title: "Community",
      links: [
        { name: "Submit a Recipe", href: "#" },
        { name: "Cooking Classes", href: "#" },
        { name: "Foodie Forum", href: "#" },
        { name: "Chef Interviews", href: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Settings", href: "#" },
      ]
    }
  ]

  return (
    <footer className="bg-charcoal text-white pt-20 pb-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg text-white">
                <ChefHat size={24} />
              </div>
              <span className="font-outfit text-2xl font-bold tracking-tight text-white">Tasty<span className="text-primary italic">Fresh</span></span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Bringing joy to your kitchen with modern, healthy, and delicious recipes curated by experts.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors"><MessageSquare size={20} /></Link>
              <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors"><Share2 size={20} /></Link>
              <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors"><Globe size={20} /></Link>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-6">
              <h3 className="font-outfit font-bold uppercase tracking-widest text-xs text-primary">{section.title}</h3>
              <ul className="flex flex-col gap-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-white/60 hover:text-primary transition-colors text-sm flex items-center group"
                    >
                      {link.name}
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40">
          <p>© {currentYear} TastyFresh Media Group. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors flex items-center gap-1">
              <Mail size={14} /> newsletter@tastyfresh.com
            </Link>
            <p>Made with ❤️ for food lovers</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
