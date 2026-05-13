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
        {/* Left Navigation */}
        <nav className="hidden md:flex items-center space-x-8 flex-1">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-brand-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Centered Logo */}
        <Link href="/" className="group flex flex-col items-center flex-1">
          <span className="text-3xl font-serif tracking-tighter text-brand-charcoal group-hover:tracking-[0.1em] transition-all duration-700">
            Label Noor
          </span>
          <span className="text-[8px] uppercase tracking-[0.5em] text-brand-gold font-bold opacity-0 group-hover:opacity-100 transition-all duration-700 -mt-1">
            Aligarh
          </span>
        </Link>

        {/* Right Navigation / Icons */}
        <div className="flex items-center justify-end space-x-8 flex-1">
          <nav className="hidden lg:flex items-center space-x-8 mr-8">
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-brand-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-6">
            <button className="hover:text-brand-gold transition-colors" aria-label="Search">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link href="/cart" className="hover:text-brand-gold transition-colors relative" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                0
              </span>
            </Link>
            <button
              className="md:hidden hover:text-brand-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-ivory border-t border-brand-charcoal/5 overflow-hidden"
          >
            <div className="container-custom py-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-serif tracking-wide hover:text-brand-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex space-x-6 pt-4">
                <Heart size={20} strokeWidth={1.5} />
                <span className="text-sm font-medium">Wishlist</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
