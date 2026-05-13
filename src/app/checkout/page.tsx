"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { ChevronLeft, ShieldCheck, Lock } from "lucide-react";

export default function CheckoutPage() {
  const cartItems = products.slice(0, 2);
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="bg-white min-h-screen">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Checkout Form */}
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <Link href="/cart" className="flex items-center text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 hover:text-brand-charcoal transition-colors">
                <ChevronLeft size={14} className="mr-1" />
                <span>Back to Bag</span>
              </Link>
              <h1 className="text-2xl font-serif">Checkout</h1>
            </div>

            <div className="space-y-10">
              {/* Shipping Section */}
              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest font-bold border-b border-brand-charcoal/5 pb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">First Name</label>
                    <input type="text" className="w-full border-b border-brand-charcoal/10 py-2 outline-none focus:border-brand-gold transition-colors text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Last Name</label>
                    <input type="text" className="w-full border-b border-brand-charcoal/10 py-2 outline-none focus:border-brand-gold transition-colors text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Address</label>
                  <input type="text" className="w-full border-b border-brand-charcoal/10 py-2 outline-none focus:border-brand-gold transition-colors text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">City</label>
                    <input type="text" className="w-full border-b border-brand-charcoal/10 py-2 outline-none focus:border-brand-gold transition-colors text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Pincode</label>
                    <input type="text" className="w-full border-b border-brand-charcoal/10 py-2 outline-none focus:border-brand-gold transition-colors text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">State</label>
                    <input type="text" className="w-full border-b border-brand-charcoal/10 py-2 outline-none focus:border-brand-gold transition-colors text-sm" />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest font-bold border-b border-brand-charcoal/5 pb-4">Payment Method</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-4 p-4 border border-brand-charcoal/10 rounded-custom cursor-pointer hover:bg-brand-beige/30 transition-colors">
                    <input type="radio" name="payment" className="accent-brand-gold" defaultChecked />
                    <span className="text-sm font-medium">Online Payment (UPI, Cards, Net Banking)</span>
                  </label>
                  <label className="flex items-center space-x-4 p-4 border border-brand-charcoal/10 rounded-custom cursor-pointer hover:bg-brand-beige/30 transition-colors">
                    <input type="radio" name="payment" className="accent-brand-gold" />
                    <span className="text-sm font-medium">Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>

              <button className="btn-primary w-full h-14 flex items-center justify-center space-x-2">
                <Lock size={16} />
                <span>Pay ₹{total} & Place Order</span>
              </button>

              <div className="flex items-center justify-center space-x-8 pt-4">
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">
                  <ShieldCheck size={14} className="text-brand-gold" />
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">
                  <Lock size={14} className="text-brand-gold" />
                  <span>Safe Payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-brand-beige/30 p-8 lg:p-12 rounded-custom h-fit space-y-8">
            <h3 className="text-sm uppercase tracking-widest font-bold">Your Order</h3>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="relative w-16 aspect-[3/4] rounded-custom overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-xs font-bold truncate max-w-[150px]">{item.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/40">Size: M | Qty: 1</p>
                    </div>
                    <p className="text-xs font-bold">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-brand-charcoal/5">
              <div className="flex justify-between text-xs">
                <span className="text-brand-charcoal/40 uppercase tracking-widest font-bold">Subtotal</span>
                <span className="font-bold">₹{total}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-brand-charcoal/40 uppercase tracking-widest font-bold">Shipping</span>
                <span className="text-green-600 font-bold uppercase tracking-widest">Free</span>
              </div>
              <div className="border-t border-brand-charcoal/10 pt-4 flex justify-between items-baseline">
                <span className="text-lg font-serif">Total</span>
                <span className="text-2xl font-bold">₹{total}</span>
              </div>
            </div>

            <div className="bg-white/50 p-4 rounded-custom border border-brand-charcoal/5">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-2">Apply Coupon</p>
              <div className="flex space-x-2">
                <input type="text" placeholder="CODE" className="flex-grow bg-transparent border-b border-brand-charcoal/10 py-1 outline-none text-xs" />
                <button className="text-[10px] uppercase tracking-widest font-bold">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
