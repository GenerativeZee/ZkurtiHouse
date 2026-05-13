"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";

const AIAssistant = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-80 bg-white shadow-2xl rounded-2xl overflow-hidden border border-brand-charcoal/5"
          >
            <div className="bg-brand-charcoal p-6 text-white">
              <h3 className="font-serif text-lg">Noor AI</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/50">Your Personal Stylist</p>
            </div>
            
            <div className="h-64 p-6 bg-brand-ivory/50 flex flex-col justify-end">
              <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm text-xs mb-4 max-w-[80%]">
                Hello! Looking for something specific from our Aligarh collection?
              </div>
            </div>
            
            <div className="p-4 bg-white border-t border-brand-charcoal/5 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Ask Noor..." 
                className="flex-grow text-xs outline-none bg-transparent"
              />
              <button className="text-brand-gold">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 bg-brand-charcoal text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-gold transition-colors"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </motion.button>
    </div>
  );
};

export default AIAssistant;
