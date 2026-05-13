"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/#categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled ? "glass py-4 shadow-sm" : "bg-transparent py-6"
      )}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex-1">
          <Link href="/" className="group inline-block">
            <span className="text-2xl font-serif tracking-tight text-brand-charcoal">
              Label <span className="text-brand-gold italic">Noor</span>
            </span>
          </Link>
        </div>

        {/* Center: Main Menu */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-charcoal/80 hover:text-brand-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end space-x-6">
          <button className="text-brand-charcoal/80 hover:text-brand-gold transition-colors" aria-label="Search">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button className="text-brand-charcoal/80 hover:text-brand-gold transition-colors" aria-label="Wishlist">
            <Heart size={18} strokeWidth={1.5} />
          </button>
          <Link href="/cart" className="text-brand-charcoal/80 hover:text-brand-gold transition-colors relative" aria-label="Cart">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              0
            </span>
          </Link>
          
          <button
            className="lg:hidden text-brand-charcoal"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-brand-ivory border-t border-brand-charcoal/5 overflow-hidden"
          >
            <div className="container-custom py-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xl font-serif text-brand-charcoal hover:text-brand-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
