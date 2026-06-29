"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/lib/data";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`)
        .then(r => r.json())
        .then(res => { const data = res?.data ?? res; if (Array.isArray(data)) setSearchResults(data); })
        .catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/#categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          isScrolled ? "glass py-4 shadow-sm" : "bg-transparent py-6"
        )}
      >
        <div className="container-custom flex items-center justify-between">
          <div className="flex-1">
            <Link href="/" className="group inline-block">
              <span className="text-2xl font-serif tracking-tight text-brand-charcoal">
                Label <span className="text-brand-gold italic">Noor</span>
              </span>
            </Link>
          </div>

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

          <div className="flex-1 flex items-center justify-end space-x-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-brand-charcoal/80 hover:text-brand-gold transition-colors"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <Link href="/wishlist" className="text-brand-charcoal/80 hover:text-brand-gold transition-colors relative" aria-label="Wishlist">
              <Heart size={18} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="text-brand-charcoal/80 hover:text-brand-gold transition-colors relative" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60 hover:text-brand-gold transition-colors hidden lg:block">
                  Sign In
                </button>
              </SignInButton>
            )}

            <button
              className="lg:hidden text-brand-charcoal"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

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

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container-custom py-6">
                <div className="flex items-center gap-4 border-b border-brand-charcoal/10 pb-4">
                  <Search size={20} className="text-brand-charcoal/40 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search kurtis, fabrics, occasions..."
                    className="flex-grow text-base outline-none bg-transparent font-sans"
                  />
                  <button onClick={() => setIsSearchOpen(false)}>
                    <X size={20} className="text-brand-charcoal/40 hover:text-brand-charcoal transition-colors" />
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <ul className="py-4 space-y-1">
                    {searchResults.map(p => (
                      <li key={p.id}>
                        <Link
                          href={`/product/${p.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-4 px-2 py-3 hover:bg-brand-beige rounded-custom transition-colors group"
                        >
                          <span className="text-sm font-medium group-hover:text-brand-gold transition-colors">{p.name}</span>
                          <span className="text-[10px] uppercase tracking-widest text-brand-charcoal/40 font-bold ml-auto">₹{p.price}</span>
                          <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">{p.category}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {searchQuery.trim().length > 1 && searchResults.length === 0 && (
                  <p className="py-6 text-sm text-brand-charcoal/40 text-center">No products found for &ldquo;{searchQuery}&rdquo;</p>
                )}

                {searchQuery.trim().length === 0 && (
                  <p className="py-4 text-[10px] uppercase tracking-widest text-brand-charcoal/30 font-bold">
                    Try: Daily Wear, Silk, Festive, Co-ord Sets...
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
