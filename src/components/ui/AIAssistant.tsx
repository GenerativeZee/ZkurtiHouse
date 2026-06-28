"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const RESPONSES: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["size", "sizing", "fit", "measurements"],
    reply: "Our kurtis follow standard Indian sizes. S fits chest 34\", M fits 36\", L fits 38\", XL fits 40\", XXL fits 42\". If you're between sizes, we recommend sizing up for a relaxed fit. You can also check the Size Guide on any product page.",
  },
  {
    keywords: ["return", "returns", "refund", "exchange"],
    reply: "We offer hassle-free 7-day returns from the date of delivery. The item must be unused, unwashed, and in original packaging. Reach out at hello@labelnoor.com or WhatsApp to initiate a return.",
  },
  {
    keywords: ["shipping", "delivery", "deliver", "dispatch"],
    reply: "We ship across India with free delivery on all orders! Standard delivery takes 5–7 business days. Express shipping (2–3 days) is available for select pincodes at ₹99 extra.",
  },
  {
    keywords: ["fabric", "material", "cotton", "silk", "chiffon"],
    reply: "We use premium fabrics including Fine Cotton, Silk Blend, Chanderi, Georgette, and Linen Blend. Each product page lists the exact fabric. All our fabrics are hand-picked for breathability and comfort.",
  },
  {
    keywords: ["festive", "wedding", "occasion", "party", "celebration"],
    reply: "For festive occasions, I'd recommend our Navy Blue Gold Thread Kurti (₹1,499), Dusty Rose Mirror Work Kurti (₹950), or the Lavender Silver Thread Kurti (₹1,250). All feature intricate embroidery perfect for celebrations!",
  },
  {
    keywords: ["office", "work", "formal", "professional"],
    reply: "For office wear, our Cream Silk Straight Kurti (₹1,199) and Coral Peach Lace Kurti (₹1,350) are bestsellers. Both offer a sophisticated, polished look perfect for long workdays.",
  },
  {
    keywords: ["daily", "casual", "everyday", "comfort"],
    reply: "For daily wear, the Mustard Yellow Block Print Kurti (₹750) and Ivory Lucknowi Chikan Kurti (₹1,100) are perfect — comfortable, stylish, and easy to style for any casual occasion.",
  },
  {
    keywords: ["price", "cost", "cheap", "affordable", "budget", "discount", "coupon", "offer"],
    reply: "Our kurtis are priced between ₹750 and ₹1,499. We also offer exclusive coupon codes — try NOOR10 for 10% off, WELCOME20 for 20% off your first order, or ALIGARH15 for 15% off!",
  },
  {
    keywords: ["care", "wash", "washing", "clean", "cleaning"],
    reply: "Most of our embroidered kurtis are recommended for dry cleaning to preserve the embroidery. Our cotton daily wear kurtis can be hand-washed in cold water with mild detergent. Avoid wringing — lay flat to dry.",
  },
  {
    keywords: ["payment", "pay", "upi", "card", "cod", "cash"],
    reply: "We accept all major payment methods — UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, and Cash on Delivery (COD). All online payments are SSL-encrypted for your security.",
  },
  {
    keywords: ["track", "tracking", "order", "status"],
    reply: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also WhatsApp us at +91 98765 43210 with your order ID for real-time updates.",
  },
  {
    keywords: ["aligarh", "brand", "label noor", "story", "about"],
    reply: "Label Noor is a boutique ethnic wear brand born in Aligarh, UP. We collaborate directly with local artisans to bring you handcrafted kurtis that blend traditional embroidery with modern silhouettes — at accessible prices.",
  },
];

const FALLBACK = "I'd love to help! Could you share more details — are you looking for a specific style, size, or have a question about your order? You can also reach us at hello@labelnoor.com.";

function getReply(input: string): string {
  const lower = input.toLowerCase();
  for (const { keywords, reply } of RESPONSES) {
    if (keywords.some(kw => lower.includes(kw))) return reply;
  }
  return FALLBACK;
}

const AIAssistant = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I'm Noor, your personal style assistant. Ask me about sizing, delivery, fabrics, or product recommendations!" },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  if (!mounted) return null;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setThinking(true);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 600));
    const reply = getReply(text);
    setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    setThinking(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-80 bg-white shadow-2xl rounded-2xl overflow-hidden border border-brand-charcoal/5 flex flex-col"
            style={{ height: 420 }}
          >
            <div className="bg-brand-charcoal p-5 text-white shrink-0">
              <h3 className="font-serif text-lg">Noor AI</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/50">Your Personal Stylist</p>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-brand-ivory/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-brand-charcoal text-white rounded-br-none"
                        : "bg-white shadow-sm text-brand-charcoal rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm px-4 py-3 rounded-2xl rounded-bl-none">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 bg-brand-charcoal/40 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 bg-white border-t border-brand-charcoal/5 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask Noor..."
                className="flex-grow text-xs outline-none bg-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || thinking}
                className="text-brand-gold disabled:opacity-30 transition-opacity"
              >
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
