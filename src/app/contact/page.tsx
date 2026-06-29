"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim() || form.message.length < 10) errs.message = "Please write at least 10 characters";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors({ message: data.error || "Failed to send. Please try again." });
        return;
      }
      setSubmitted(true);
    } catch {
      setErrors({ message: "Failed to send. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof typeof form) =>
    `w-full bg-transparent border-b py-3 outline-none text-sm transition-colors ${
      errors[field] ? "border-red-400 focus:border-red-500" : "border-brand-charcoal/10 focus:border-brand-gold"
    }`;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand-beige py-24">
        <div className="container-custom text-center space-y-4">
          <h1 className="text-5xl font-serif">Get in Touch</h1>
          <p className="text-sm text-brand-charcoal/60 uppercase tracking-widest">We&apos;re here to help you find your perfect fit</p>
        </div>
      </div>

      <div className="container-custom py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-serif">Contact Information</h2>
              <p className="text-sm text-brand-charcoal/60 leading-relaxed">
                Have a question about sizing, delivery, or a recent order? Our team is available Monday to Saturday, 10 AM to 7 PM.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-brand-gold" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Email Us</p>
                  <p className="text-sm font-medium">hello@labelnoor.com</p>
                  <p className="text-xs text-brand-charcoal/50">Expect a response within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-brand-gold" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Call Us</p>
                  <p className="text-sm font-medium">+91 98765 43210</p>
                  <p className="text-xs text-brand-charcoal/50">Mon-Sat, 10am - 7pm IST.</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-brand-gold" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/40">Visit Our Studio</p>
                  <p className="text-sm font-medium">123 Fashion Street, Aligarh, UP, India</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button className="flex items-center space-x-3 bg-[#25D366] text-white px-8 py-4 rounded-custom font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                <MessageCircle size={20} fill="currentColor" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-brand-beige/30 p-10 lg:p-16 rounded-custom">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-12"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif">Message Sent!</h3>
                    <p className="text-sm text-brand-charcoal/60">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="text-[10px] uppercase tracking-widest font-bold text-brand-gold border-b border-brand-gold"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60">Your Name *</label>
                      <input type="text" value={form.name} onChange={update("name")} className={inputClass("name")} placeholder="Anjali Sharma" />
                      {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60">Email Address *</label>
                      <input type="email" value={form.email} onChange={update("email")} className={inputClass("email")} placeholder="anjali@example.com" />
                      {errors.email && <p className="text-[10px] text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60">Subject *</label>
                    <input type="text" value={form.subject} onChange={update("subject")} className={inputClass("subject")} placeholder="Order Inquiry" />
                    {errors.subject && <p className="text-[10px] text-red-500">{errors.subject}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60">Message *</label>
                    <textarea rows={4} value={form.message} onChange={update("message")} className={inputClass("message")} placeholder="How can we help you today?" />
                    {errors.message && <p className="text-[10px] text-red-500">{errors.message}</p>}
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
