"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  text: string;
  speed?: number;
  className?: string;
}

const Marquee = ({ text, speed = 20, className = "" }: MarqueeProps) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap py-4 border-y border-brand-charcoal/5 flex bg-white ${className}`}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          duration: speed, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex space-x-12 items-center min-w-full"
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-charcoal/60 flex items-center">
            {text}
            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full ml-12" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
