"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ShieldCheck, Lock, Tag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const COUPONS: Record<string, number> = {
  NOOR10: 10,
  WELCOME20: 20,
  ALIGARH15: 15,
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise(resolve => {
    if (document.getElementById("razorpay-script")) { resolve(); return; }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", pincode: "", state: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [payment, setPayment] = useState("online");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [serverError, setServerError] = useState("");

  const discountAmount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount / 100) : 0;
  const total = subtotal - discountAmount;

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) errs.phone = "Valid 10-digit phone required";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.city.trim()) errs.city = "Required";
    if (!form.pincode.trim() || form.pincode.replace(/\D/g, "").length < 6) errs.pincode = "Valid 6-digit pincode required";
    if (!form.state.trim()) errs.state = "Required";
    return errs;
  };

  const buildOrderData = () => ({
    customerName: `${form.firstName} ${form.lastName}`,
    customerEmail: form.email,
    customerPhone: form.phone,
    shippingAddress: {
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      state: form.state,
    },
    items: items.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      selectedSize: i.selectedSize,
      selectedColor: i.selectedColor,
      image: i.image,
    })),
    subtotal,
    discount: discountAmount,
    couponCode: appliedCoupon?.code ?? null,
    total,
  });

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, discount: COUPONS[code] });
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setPlacing(true);
    setServerError("");

    try {
      if (payment === "online") {
        await loadRazorpayScript();

        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });
        const { id, amount, currency, key, error } = await res.json();
        if (error) throw new Error(error);

        const options = {
          key,
          amount,
          currency,
          name: "Label Noor",
          description: "Aligarh Heritage Collection",
          image: "/images/product-1.png",
          order_id: id,
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: buildOrderData(),
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.error) throw new Error(verifyData.error);
            clearCart();
            router.push(`/order-confirmation?orderNumber=${verifyData.orderNumber}`);
          },
          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },
          notes: {
            address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
          },
          theme: { color: "#D4AF37" },
          modal: {
            ondismiss: () => setPlacing(false),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => {
          setServerError("Payment failed. Please try again.");
          setPlacing(false);
        });
        rzp.open();
        return; // placing state stays true until handler fires
      } else {
        // Cash on Delivery
        const res = await fetch("/api/save-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderData: buildOrderData() }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        clearCart();
        router.push(`/order-confirmation?orderNumber=${data.orderNumber}`);
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-40 text-center space-y-6">
        <h1 className="text-4xl font-serif">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary inline-block">Browse Collection</Link>
      </div>
    );
  }

  const inputClass = (field: keyof typeof form) =>
    `w-full border-b py-2 outline-none text-sm transition-colors bg-transparent ${
      errors[field] ? "border-red-400 focus:border-red-500" : "border-brand-charcoal/10 focus:border-brand-gold"
    }`;

  return (
    <div className="bg-white min-h-screen">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Form */}
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <Link href="/cart" className="flex items-center text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40 hover:text-brand-charcoal transition-colors">
                <ChevronLeft size={14} className="mr-1" />Back to Bag
              </Link>
              <h1 className="text-2xl font-serif">Checkout</h1>
            </div>

            <div className="space-y-10">
              {/* Shipping */}
              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest font-bold border-b border-brand-charcoal/5 pb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">First Name *</label>
                    <input type="text" value={form.firstName} onChange={update("firstName")} className={inputClass("firstName")} />
                    {errors.firstName && <p className="text-[10px] text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Last Name *</label>
                    <input type="text" value={form.lastName} onChange={update("lastName")} className={inputClass("lastName")} />
                    {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Email *</label>
                    <input type="email" value={form.email} onChange={update("email")} className={inputClass("email")} />
                    {errors.email && <p className="text-[10px] text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Phone *</label>
                    <input type="tel" value={form.phone} onChange={update("phone")} className={inputClass("phone")} placeholder="10-digit mobile" />
                    {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Address *</label>
                  <input type="text" value={form.address} onChange={update("address")} className={inputClass("address")} placeholder="House no., Street, Area" />
                  {errors.address && <p className="text-[10px] text-red-500">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">City *</label>
                    <input type="text" value={form.city} onChange={update("city")} className={inputClass("city")} />
                    {errors.city && <p className="text-[10px] text-red-500">{errors.city}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Pincode *</label>
                    <input type="text" value={form.pincode} onChange={update("pincode")} className={inputClass("pincode")} maxLength={6} />
                    {errors.pincode && <p className="text-[10px] text-red-500">{errors.pincode}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">State *</label>
                    <input type="text" value={form.state} onChange={update("state")} className={inputClass("state")} />
                    {errors.state && <p className="text-[10px] text-red-500">{errors.state}</p>}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest font-bold border-b border-brand-charcoal/5 pb-4">Payment Method</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-4 p-4 border border-brand-charcoal/10 rounded-custom cursor-pointer hover:bg-brand-beige/30 transition-colors">
                    <input type="radio" name="payment" value="online" checked={payment === "online"} onChange={() => setPayment("online")} className="accent-brand-gold" />
                    <div>
                      <p className="text-sm font-medium">Online Payment</p>
                      <p className="text-[10px] text-brand-charcoal/40 uppercase tracking-widest mt-0.5">UPI · Debit/Credit Cards · Net Banking</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-4 p-4 border border-brand-charcoal/10 rounded-custom cursor-pointer hover:bg-brand-beige/30 transition-colors">
                    <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} className="accent-brand-gold" />
                    <div>
                      <p className="text-sm font-medium">Cash on Delivery</p>
                      <p className="text-[10px] text-brand-charcoal/40 uppercase tracking-widest mt-0.5">Pay when your order arrives</p>
                    </div>
                  </label>
                </div>
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-custom">
                  {serverError}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="btn-primary w-full h-14 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Lock size={16} />
                <span>{placing ? "Processing..." : `${payment === "online" ? "Pay" : "Place Order"} · ₹${total}`}</span>
              </button>

              <div className="flex items-center justify-center space-x-8">
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

          {/* Order Summary */}
          <div className="bg-brand-beige/30 p-8 lg:p-12 rounded-custom h-fit space-y-8">
            <h3 className="text-sm uppercase tracking-widest font-bold">
              Your Order ({items.length} item{items.length !== 1 ? "s" : ""})
            </h3>

            <div className="space-y-6 max-h-72 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex space-x-4">
                  <div className="relative w-16 aspect-[3/4] rounded-custom overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-xs font-bold truncate max-w-[150px]">{item.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/40">
                        {item.selectedSize} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold shrink-0">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="bg-white/60 p-4 rounded-custom border border-brand-charcoal/5">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-2 flex items-center gap-2">
                <Tag size={12} /> Apply Coupon
              </p>
              {appliedCoupon ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-green-600">
                    {appliedCoupon.code} — {appliedCoupon.discount}% off applied!
                  </span>
                  <button onClick={() => setAppliedCoupon(null)}>
                    <X size={14} className="text-brand-charcoal/40 hover:text-brand-charcoal" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Try NOOR10"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value); setCouponError(""); }}
                      onKeyDown={e => e.key === "Enter" && applyCoupon()}
                      className="flex-grow bg-transparent border-b border-brand-charcoal/10 py-1 outline-none text-xs"
                    />
                    <button onClick={applyCoupon} className="text-[10px] uppercase tracking-widest font-bold hover:text-brand-gold transition-colors">
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 mt-1">{couponError}</p>}
                </>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-4 pt-2 border-t border-brand-charcoal/5">
              <div className="flex justify-between text-xs">
                <span className="text-brand-charcoal/40 uppercase tracking-widest font-bold">Subtotal</span>
                <span className="font-bold">₹{subtotal}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-xs">
                  <span className="text-green-600 uppercase tracking-widest font-bold">Discount ({appliedCoupon.discount}%)</span>
                  <span className="font-bold text-green-600">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-brand-charcoal/40 uppercase tracking-widest font-bold">Shipping</span>
                <span className="text-green-600 font-bold uppercase tracking-widest">Free</span>
              </div>
              <div className="border-t border-brand-charcoal/10 pt-4 flex justify-between items-baseline">
                <span className="text-lg font-serif">Total</span>
                <span className="text-2xl font-bold">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
