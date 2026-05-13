"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  // Mock cart items (using the first 2 products)
  const [cartItems, setCartItems] = useState([
    { ...products[0], quantity: 1 },
    { ...products[1], quantity: 1 }
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-40 text-center space-y-8">
        <div className="w-24 h-24 bg-brand-beige rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={40} strokeWidth={1} className="text-brand-charcoal/20" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-serif">Your cart is empty</h1>
          <p className="text-sm text-brand-charcoal/60">It looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-serif mb-12">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-10">
            <div className="hidden md:grid grid-cols-6 gap-4 pb-6 border-b border-brand-charcoal/5 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">
              <div className="col-span-3">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4 items-center pb-10 border-b border-brand-charcoal/5">
                <div className="col-span-3 flex items-center space-x-6">
                  <div className="relative w-24 aspect-[3/4] rounded-custom overflow-hidden bg-brand-beige shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/40 font-bold">{item.category}</p>
                    <p className="text-xs text-brand-charcoal/60">Size: M</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-[10px] uppercase tracking-widest font-bold text-red-500 pt-2 flex items-center space-x-1"
                    >
                      <Trash2 size={12} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                <div className="md:text-center">
                  <p className="text-sm font-semibold">₹{item.price}</p>
                </div>

                <div className="flex justify-center">
                  <div className="flex items-center border border-brand-charcoal/10 h-10">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 hover:bg-brand-beige transition-colors">-</button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 hover:bg-brand-beige transition-colors">+</button>
                  </div>
                </div>

                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-beige p-8 rounded-custom space-y-8 sticky top-32">
              <h2 className="text-xl font-serif">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-charcoal/60">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-charcoal/60">Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">Calculated at checkout</span>
                </div>
                <div className="border-t border-brand-charcoal/10 pt-4 flex justify-between items-baseline">
                  <span className="text-lg font-serif">Total</span>
                  <span className="text-2xl font-bold">₹{total}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/checkout" className="btn-primary w-full block text-center">
                  Proceed to Checkout
                </Link>
                <Link href="/shop" className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 text-center block hover:text-brand-charcoal transition-colors">
                  Continue Shopping
                </Link>
              </div>

              <div className="pt-6 border-t border-brand-charcoal/10 space-y-4">
                <div className="flex items-center space-x-3 text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60">
                  <ShieldCheck size={16} className="text-brand-gold" />
                  <span>Secure Checkout</span>
                </div>
                <p className="text-[10px] text-brand-charcoal/40 leading-relaxed uppercase tracking-widest">
                  Taxes and shipping calculated at checkout. <br/> Easy 7-day returns available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
