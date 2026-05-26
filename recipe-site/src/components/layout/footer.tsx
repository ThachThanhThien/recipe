import Link from "next/link";
import { ChefHat, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white pt-16 pb-8 px-6 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10 pb-12">
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg text-white">
                <ChefHat size={22} />
              </div>
              <span className="font-outfit text-xl font-bold tracking-tight text-white">
                Tasty<span className="text-primary italic">Fresh</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              Modern, friendly recipes curated for every kitchen. Browse, cook, and share with our growing community.
            </p>
          </div>

          <div>
            <h3 className="font-outfit font-bold uppercase tracking-widest text-xs text-primary mb-4">Explore</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/recipes" className="hover:text-primary transition-colors">All recipes</Link></li>
              <li><Link href="/recipes?featured=1" className="hover:text-primary transition-colors">Featured</Link></li>
              <li><Link href="/recipes?trending=1" className="hover:text-primary transition-colors">Trending</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-outfit font-bold uppercase tracking-widest text-xs text-primary mb-4">Contact</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              <li className="flex items-center gap-2"><Mail size={14} /> hello@tastyfresh.dev</li>
              <li>Made with care for food lovers</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {currentYear} TastyFresh. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
