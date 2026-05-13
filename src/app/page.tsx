"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, RefreshCw, Truck } from "lucide-react";
import { products, categories, testimonials } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import Marquee from "@/components/ui/Marquee";
import Tilt from "@/components/ui/Tilt";
import { useRef, useState, useEffect } from "react";

import dynamic from "next/dynamic";
const StickyNav = dynamic(() => import("@/components/ui/StickyNav"), { ssr: false });

export default function Home() {
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    "/images/product-1.png",
    "/images/product-5.png",
    "/images/hero-banner.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden" id="top">
      <StickyNav />
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-brand-ivory">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-0 will-change-opacity"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={heroImages[currentImageIndex]}
                alt="Label Noor Hero"
                fill
                priority
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-ivory/20" />
          </motion.div>
        </AnimatePresence>

        {/* Textured Grain Overlay */}
        <div className="absolute inset-0 z-[1] opacity-[0.02] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <span className="text-[10px] md:text-[12px] uppercase tracking-[0.6em] mb-6 block font-bold text-white/90">
              The Aligarh Heritage Collection
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif mb-10 leading-[0.9] tracking-tighter overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="block"
              >
                Minimalist
              </motion.span>
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="block italic text-brand-gold -mt-2"
              >
                Grace
              </motion.span>
            </h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-col items-center"
            >
              <Link
                href="/shop"
                className="group relative px-10 py-4 bg-white text-brand-charcoal text-[10px] uppercase tracking-[0.3em] font-bold overflow-hidden transition-all duration-300 hover:text-white"
              >
                <span className="relative z-10">Enter the Boutique</span>
                <div className="absolute inset-0 bg-brand-charcoal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4"
        >
          <div className="w-[1px] h-20 bg-white/30 relative">
            <motion.div
              animate={{ height: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full bg-white"
            />
          </div>
        </motion.div>
      </section>

      {/* Marquee Branding */}
      <Marquee text="Handcrafted in Aligarh • Sustainable Fashion • Premium Silk & Cotton • Worldwide Shipping" />

      {/* Featured Categories */}
      <section id="categories" className="py-32 bg-white">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0"
          >
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold">Collections</p>
              <h2 className="text-5xl md:text-6xl font-serif">Curated Selection</h2>
            </div>
            <Link href="/shop" className="text-[10px] uppercase tracking-[0.3em] font-bold flex items-center group border-b border-brand-charcoal/20 pb-1 hover:border-brand-gold transition-colors">
              Explore All <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Tilt key={cat.name} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative aspect-[3/4] overflow-hidden rounded-custom cursor-pointer shadow-xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    style={{ transform: "translateZ(20px)" }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center" style={{ transform: "translateZ(50px)" }}>
                    <h3 className="text-2xl font-serif mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.name}</h3>
                    <Link href={cat.link} className="text-[8px] uppercase tracking-[0.3em] font-bold border-b border-white/40 pb-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      Discover
                    </Link>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook Section */}
      <section id="lookbook" className="py-40 bg-brand-charcoal text-white overflow-hidden">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="w-full md:w-1/2 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold">The Lookbook</p>
                <h2 className="text-6xl md:text-8xl font-serif leading-none">Timeless <br /> Elegance</h2>
                <p className="text-sm text-white/50 leading-loose max-w-md">
                  Captured in the heart of Aligarh, our latest collection explores the intersection of heritage craftsmanship and modern silhouettes.
                </p>
              </motion.div>
              
              <div className="flex gap-4">
                <Link href="/shop" className="px-10 py-4 border border-white/20 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-brand-charcoal transition-all">
                  View Collection
                </Link>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 relative h-[600px]">
              <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src="/images/about-brand.png"
                  alt="Lookbook"
                  fill
                  className="object-cover opacity-60"
                />
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-1/2 h-[120%] border border-white/10 absolute -rotate-6" />
                <div className="w-1/2 h-[120%] border border-brand-gold/20 absolute rotate-12" />
              </div>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -right-10 w-40 h-40 flex items-center justify-center border border-white/10 rounded-full"
              >
                <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Label Noor • Aligarh • </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-brand-beige/30">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <Star className="text-brand-gold" size={32} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl">Premium Quality</h4>
                <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 leading-relaxed">Artisan crafted with the finest fabrics.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <ShieldCheck className="text-brand-gold" size={32} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl">Secure Payments</h4>
                <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 leading-relaxed">Encrypted transactions for your safety.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <RefreshCw className="text-brand-gold" size={32} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl">Easy Returns</h4>
                <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 leading-relaxed">7-day hassle-free returns guaranteed.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <Truck className="text-brand-gold" size={32} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl">Fast Delivery</h4>
                <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 leading-relaxed">Express shipping worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section id="bestsellers" className="py-32 bg-white">
        <div className="container-custom">
          <div className="text-center mb-24 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold">Trending</p>
            <h2 className="text-5xl md:text-6xl font-serif">Seasonal Bestsellers</h2>
            <div className="w-12 h-[1px] bg-brand-gold mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-24">
            <Link href="/shop" className="btn-outline border-none bg-brand-beige px-16 py-6 hover:bg-brand-charcoal">
              View Entire Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-brand-beige/50 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-24">
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold mb-4">Reviews</p>
              <h2 className="text-4xl md:text-5xl font-serif">Community Grace</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-6 text-center"
                >
                  <div className="flex justify-center text-brand-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm font-serif italic text-brand-charcoal/80 leading-relaxed">"{t.comment}"</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold">— {t.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="py-32 bg-white">
        <div className="container-custom">
          <div className="flex flex-col items-center text-center mb-20 space-y-4">
            <h2 className="text-5xl font-serif">Instagram @labelnoor</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-charcoal/40 font-bold">Follow us for daily inspiration</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[1, 2, 3, 1, 2, 3].map((num, i) => (
              <div key={i} className="aspect-square relative overflow-hidden group">
                <Image
                  src={`/images/instagram-${num}.png`}
                  alt={`Instagram ${i}`}
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram size={20} className="text-white" strokeWidth={1} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-40 bg-brand-charcoal text-white relative overflow-hidden">
        {/* Subtle background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif text-white/[0.03] whitespace-nowrap pointer-events-none">
          LABEL NOOR
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold">Join Us</p>
              <h2 className="text-5xl md:text-6xl font-serif">The Inner Circle</h2>
            </div>
            <p className="text-xs text-white/50 tracking-[0.2em] leading-relaxed max-w-lg mx-auto">
              Subscribe for exclusive access to new collections, seasonal sales, and Aligarh craftsmanship stories.
            </p>
            <form className="flex flex-col sm:flex-row gap-0 border-b border-white/20 pb-4 mt-12">
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                className="flex-grow bg-transparent px-2 py-4 text-[10px] uppercase tracking-[0.3em] focus:outline-none placeholder:text-white/20"
              />
              <button className="bg-transparent text-white px-8 py-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:text-brand-gold transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

const Instagram = ({ size, className, strokeWidth = 2 }: { size: number; className: string; strokeWidth?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
