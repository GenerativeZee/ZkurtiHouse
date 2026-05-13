"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="container-custom py-24 text-center">Product not found.</div>;
  }

  const recommendations = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="container-custom py-6">
        <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-brand-charcoal/40 font-bold">
          <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-brand-charcoal">{product.name}</span>
        </nav>
      </div>

      <div className="container-custom pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[3/4] overflow-hidden rounded-custom bg-brand-beige group"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] relative overflow-hidden rounded-custom bg-brand-beige cursor-pointer group">
                  <Image
                    src={product.image}
                    alt={`${product.name} angle ${i}`}
                    fill
                    className="object-cover group-hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4 border-b border-brand-charcoal/5 pb-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold">{product.category}</p>
                  <h1 className="text-4xl font-serif">{product.name}</h1>
                </div>
                <button className="p-2 border border-brand-charcoal/10 rounded-full hover:bg-brand-beige transition-colors">
                  <Heart size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex text-brand-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-brand-charcoal/40 uppercase tracking-widest font-bold">({product.reviews} Reviews)</span>
              </div>

              <div className="flex items-baseline space-x-4">
                <p className="text-3xl font-bold tracking-tight">₹{product.price}</p>
                <p className="text-sm text-brand-charcoal/40 line-through">₹{Math.round(product.price * 1.5)}</p>
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Save 33%</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold">The Essence</h3>
              <p className="text-sm text-brand-charcoal/70 leading-relaxed">{product.description}</p>
              <div className="grid grid-cols-2 gap-y-4 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/40 font-bold">Fabric</p>
                  <p className="text-xs font-medium">{product.fabric}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/40 font-bold">Fit</p>
                  <p className="text-xs font-medium">{product.fit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/40 font-bold">Occasion</p>
                  <p className="text-xs font-medium">{product.occasion}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/40 font-bold">Care</p>
                  <p className="text-xs font-medium">Dry Clean Recommended</p>
                </div>
              </div>
            </div>

            {/* Selection */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs uppercase tracking-widest font-bold">Select Size</h3>
                  <button className="text-[10px] uppercase tracking-widest font-bold text-brand-gold border-b border-brand-gold">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center text-xs font-bold border transition-all",
                        selectedSize === size 
                          ? "bg-brand-charcoal text-white border-brand-charcoal shadow-lg" 
                          : "border-brand-charcoal/10 hover:border-brand-gold"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center border border-brand-charcoal/10 h-14">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 hover:bg-brand-beige transition-colors">-</button>
                  <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 hover:bg-brand-beige transition-colors">+</button>
                </div>
                <button className="flex-grow bg-brand-charcoal text-white h-14 uppercase tracking-widest text-xs font-bold hover:bg-brand-charcoal-light transition-colors flex items-center justify-center space-x-2">
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
              <button className="w-full bg-brand-gold text-white h-14 uppercase tracking-widest text-xs font-bold hover:opacity-90 transition-opacity">
                Buy It Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-brand-charcoal/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-beige flex items-center justify-center">
                  <Truck size={14} className="text-brand-gold" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold leading-tight">Free <br/> Shipping</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-beige flex items-center justify-center">
                  <RefreshCw size={14} className="text-brand-gold" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold leading-tight">7-Day <br/> Returns</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-beige flex items-center justify-center">
                  <ShieldCheck size={14} className="text-brand-gold" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold leading-tight">Quality <br/> Assured</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-32 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif">You May Also Like</h2>
            <div className="w-12 h-[2px] bg-brand-gold mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

