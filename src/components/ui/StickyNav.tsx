"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const StickyNav = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const sections = [
    { name: "Top", id: "top" },
    { name: "Collections", id: "categories" },
    { name: "Lookbook", id: "lookbook" },
    { name: "Bestsellers", id: "bestsellers" },
  ];

  return (
    <div className="fixed left-10 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col space-y-8 items-center">
      <div className="w-[1px] h-20 bg-brand-charcoal/10" />
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
          className="group relative"
        >
          <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-brand-charcoal/30 group-hover:text-brand-gold transition-colors -rotate-90 origin-center absolute left-[-40px] opacity-0 group-hover:opacity-100 transition-all duration-500">
            {section.name}
          </span>
          <div className="w-1.5 h-1.5 rounded-full border border-brand-charcoal/20 group-hover:bg-brand-gold group-hover:border-brand-gold transition-all duration-500" />
        </button>
      ))}
      <div className="w-[1px] h-20 bg-brand-charcoal/10" />
    </div>
  );
};

export default StickyNav;
