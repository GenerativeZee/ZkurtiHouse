"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-brand-beige py-20">
        <div className="container-custom text-center space-y-4">
          <h1 className="text-5xl font-serif">My Wishlist</h1>
          <p className="text-sm text-brand-charcoal/60 uppercase tracking-widest">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="container-custom py-16">
        {items.length === 0 ? (
          <div className="text-center py-24 space-y-8">
            <div className="w-24 h-24 bg-brand-beige rounded-full flex items-center justify-center mx-auto">
              <Heart size={40} strokeWidth={1} className="text-brand-charcoal/20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-serif">Your wishlist is empty</h2>
              <p className="text-sm text-brand-charcoal/60">Save pieces you love by clicking the heart on any product.</p>
            </div>
            <Link href="/shop" className="btn-primary inline-block">Explore Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20">
            {items.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
