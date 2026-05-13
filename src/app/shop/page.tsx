"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ShopContent = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(1500);

  const categories = ["Daily Wear", "Office Wear", "Festive Wear"];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    result = result.filter(p => p.price <= priceRange);

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result.sort((a, b) => b.id.localeCompare(a.id));

    return result;
  }, [selectedCategory, priceRange, sortBy]);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Page Header */}
      <div className="bg-brand-beige py-20">
        <div className="container-custom text-center space-y-4">
          <h1 className="text-5xl font-serif">Shop All</h1>
          <p className="text-sm text-brand-charcoal/60 uppercase tracking-widest">Discover our latest collection of premium kurtis</p>
        </div>
      </div>

      <div className="container-custom mt-12">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-b border-brand-charcoal/5 gap-6">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold"
            >
              <SlidersHorizontal size={16} />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
            <p className="text-xs text-brand-charcoal/40 uppercase tracking-widest">
              Showing {filteredProducts.length} Products
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Sort By:</span>
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent text-xs uppercase tracking-widest font-bold pr-8 outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 mt-12">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full lg:w-64 space-y-12"
              >
                {/* Category Filter */}
                <div className="space-y-6">
                  <h3 className="text-sm uppercase tracking-widest font-bold">Category</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "block text-sm transition-colors",
                        !selectedCategory ? "text-brand-gold font-bold" : "text-brand-charcoal/60 hover:text-brand-charcoal"
                      )}
                    >
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "block text-sm transition-colors",
                          selectedCategory === cat ? "text-brand-gold font-bold" : "text-brand-charcoal/60 hover:text-brand-charcoal"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm uppercase tracking-widest font-bold">Price Range</h3>
                    <span className="text-xs font-bold text-brand-gold">Up to ₹{priceRange}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="1500" 
                    step="50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-brand-gold"
                  />
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-charcoal/40 font-bold">
                    <span>₹500</span>
                    <span>₹1500</span>
                  </div>
                </div>

                {/* Size Filter */}
                <div className="space-y-6">
                  <h3 className="text-sm uppercase tracking-widest font-bold">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {["S", "M", "L", "XL", "XXL"].map(size => (
                      <button key={size} className="w-10 h-10 border border-brand-charcoal/10 text-xs font-medium hover:border-brand-gold hover:text-brand-gold transition-colors">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear All */}
                {(selectedCategory || priceRange < 1500) && (
                  <button 
                    onClick={() => {
                      setSelectedCategory(null);
                      setPriceRange(1500);
                    }}
                    className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-red-500"
                  >
                    <X size={14} />
                    <span>Clear All Filters</span>
                  </button>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center space-y-4">
                <h3 className="text-2xl font-serif">No products found</h3>
                <p className="text-sm text-brand-charcoal/60">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange(1500);
                  }}
                  className="btn-outline mt-4"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-serif">Loading Boutique...</div>}>
      <ShopContent />
    </Suspense>
  );
};

export default ShopPage;
