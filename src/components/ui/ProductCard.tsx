"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/lib/data";
import Tilt from "@/components/ui/Tilt";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0];
    addToCart(product, defaultSize, defaultColor, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
      data-cursor="product"
    >
      <Link href={`/product/${product.id}`} className="block">
        <Tilt>
          <div className="relative aspect-[3/4] overflow-hidden bg-brand-beige rounded-custom group shadow-2xl transition-shadow duration-500 group-hover:shadow-brand-gold/20">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              style={{ transform: "translateZ(20px)" }}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

            {/* Quick Add Overlay */}
            <div
              className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10"
              style={{ transform: "translateZ(40px)" }}
            >
              <button
                onClick={handleQuickAdd}
                className="w-full bg-white/90 backdrop-blur-md text-brand-charcoal py-4 text-[9px] uppercase tracking-[0.3em] font-bold flex items-center justify-center space-x-2 hover:bg-brand-charcoal hover:text-white transition-colors"
              >
                <ShoppingBag size={12} />
                <span>{added ? "Added!" : `Quick Add (${product.sizes[0]})`}</span>
              </button>
            </div>

            <button
              onClick={handleWishlist}
              className="absolute top-4 right-4 z-10 p-2 transition-colors"
              aria-label="Toggle Wishlist"
              style={{ transform: "translateZ(30px)" }}
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                className={wishlisted ? "fill-brand-gold text-brand-gold" : "text-brand-charcoal hover:text-brand-gold"}
              />
            </button>
          </div>

          <div
            className="mt-6 space-y-2 text-center"
            style={{ transform: "translateZ(30px)" }}
          >
            <p className="text-[8px] uppercase tracking-[0.4em] text-brand-gold font-bold">{product.category}</p>
            <h3 className="text-sm font-serif tracking-wide group-hover:italic transition-all duration-500">
              {product.name}
            </h3>
            <p className="text-xs font-medium tracking-widest text-brand-charcoal/60">₹{product.price}</p>
          </div>
        </Tilt>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
