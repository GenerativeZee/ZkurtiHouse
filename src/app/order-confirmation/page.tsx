"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") ?? `LN-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-brand-beige/30 flex items-center justify-center px-4 py-24">
      <div className="max-w-lg w-full text-center space-y-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle size={48} className="text-green-500" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold">Order Confirmed</p>
          <h1 className="text-4xl md:text-5xl font-serif">Thank You!</h1>
          <p className="text-brand-charcoal/60 text-sm leading-relaxed">
            Your order has been placed successfully. A confirmation will be sent to your email shortly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-custom p-8 space-y-4 text-left shadow-sm"
        >
          <div className="flex justify-between items-center border-b border-brand-charcoal/5 pb-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Order ID</span>
            <span className="text-sm font-bold font-mono">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center border-b border-brand-charcoal/5 pb-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Estimated Delivery</span>
            <span className="text-sm font-medium">5 – 7 Business Days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Payment</span>
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Confirmed</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/shop" className="flex items-center justify-center gap-2 btn-outline">
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 btn-primary">
            <Home size={16} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-serif">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
