"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/data";
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const SIZE_CHART = [
  { size: "S",   chest: "34\"", waist: "28\"", hip: "36\"", length: "44\"" },
  { size: "M",   chest: "36\"", waist: "30\"", hip: "38\"", length: "44\"" },
  { size: "L",   chest: "38\"", waist: "32\"", hip: "40\"", length: "45\"" },
  { size: "XL",  chest: "40\"", waist: "34\"", hip: "42\"", length: "45\"" },
  { size: "XXL", chest: "42\"", waist: "36\"", hip: "44\"", length: "46\"" },
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    setLoading(true);
    setSelectedSize("");
    setSelectedColor("");
    setActiveImage(0);

    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.ok ? r.json() : null),
      fetch("/api/products").then(r => r.json()),
    ]).then(([p, all]) => {
      setProduct(p);
      if (p && Array.isArray(all)) {
        setRelatedProducts(
          all.filter((x: Product) => x.id !== p.id && x.category === p.category).slice(0, 4)
        );
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-24 text-center">
        <p className="text-sm text-brand-charcoal/40 uppercase tracking-widest animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="container-custom py-24 text-center">Product not found.</div>;
  }

  const galleryImages = [product.image, ...relatedProducts.slice(0, 3).map(p => p.image)];
  const defaultColor = selectedColor || product.colors[0];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart(product, selectedSize, defaultColor, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart(product, selectedSize, defaultColor, quantity);
    router.push("/checkout");
  };

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
                src={galleryImages[activeImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "aspect-[3/4] relative overflow-hidden rounded-custom bg-brand-beige transition-all",
                    activeImage === i ? "ring-2 ring-brand-gold" : "opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                </button>
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
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 border border-brand-charcoal/10 rounded-full hover:bg-brand-beige transition-colors"
                  aria-label="Toggle Wishlist"
                >
                  <Heart
                    size={20}
                    strokeWidth={1.5}
                    className={isWishlisted(product.id) ? "fill-brand-gold text-brand-gold" : ""}
                  />
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

            {/* Color Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest font-bold">
                  Color: <span className="text-brand-gold">{defaultColor}</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-4 py-2 border text-[10px] uppercase tracking-widest font-bold transition-all",
                      (selectedColor === color || (!selectedColor && color === product.colors[0]))
                        ? "border-brand-charcoal bg-brand-charcoal text-white"
                        : "border-brand-charcoal/10 hover:border-brand-gold text-brand-charcoal"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className={cn("text-xs uppercase tracking-widest font-bold", sizeError && "text-red-500")}>
                  {sizeError ? "Please select a size" : "Select Size"}
                </h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[10px] uppercase tracking-widest font-bold text-brand-gold border-b border-brand-gold"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={cn(
                      "w-12 h-12 flex items-center justify-center text-xs font-bold border transition-all",
                      selectedSize === size
                        ? "bg-brand-charcoal text-white border-brand-charcoal shadow-lg"
                        : sizeError
                        ? "border-red-300 hover:border-red-400"
                        : "border-brand-charcoal/10 hover:border-brand-gold"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center border border-brand-charcoal/10 h-14">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 hover:bg-brand-beige transition-colors">-</button>
                  <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 hover:bg-brand-beige transition-colors">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-grow bg-brand-charcoal text-white h-14 uppercase tracking-widest text-xs font-bold hover:bg-brand-charcoal-light transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={18} />
                  <span>{addedFeedback ? "Added to Cart!" : "Add to Cart"}</span>
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                className="w-full bg-brand-gold text-white h-14 uppercase tracking-widest text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Buy It Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-brand-charcoal/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-beige flex items-center justify-center">
                  <Truck size={14} className="text-brand-gold" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold leading-tight">Free <br /> Shipping</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-beige flex items-center justify-center">
                  <RefreshCw size={14} className="text-brand-gold" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold leading-tight">7-Day <br /> Returns</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-beige flex items-center justify-center">
                  <ShieldCheck size={14} className="text-brand-gold" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold leading-tight">Quality <br /> Assured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif">You May Also Like</h2>
              <div className="w-12 h-[2px] bg-brand-gold mx-auto" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-custom p-8 max-w-lg w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif">Size Guide</h2>
                <button onClick={() => setShowSizeGuide(false)}>
                  <X size={20} className="text-brand-charcoal/40 hover:text-brand-charcoal transition-colors" />
                </button>
              </div>
              <p className="text-xs text-brand-charcoal/50 uppercase tracking-widest mb-6">All measurements are in inches</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-charcoal/10">
                    {["Size", "Chest", "Waist", "Hip", "Length"].map(h => (
                      <th key={h} className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 pb-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.map(row => (
                    <tr
                      key={row.size}
                      className={cn(
                        "border-b border-brand-charcoal/5",
                        selectedSize === row.size && "bg-brand-gold/5"
                      )}
                    >
                      <td className={cn("py-3 font-bold", selectedSize === row.size && "text-brand-gold")}>{row.size}</td>
                      <td className="py-3 text-brand-charcoal/70">{row.chest}</td>
                      <td className="py-3 text-brand-charcoal/70">{row.waist}</td>
                      <td className="py-3 text-brand-charcoal/70">{row.hip}</td>
                      <td className="py-3 text-brand-charcoal/70">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-brand-charcoal/40 uppercase tracking-widest mt-6 leading-relaxed">
                If you are between sizes, we recommend sizing up for a relaxed fit.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
