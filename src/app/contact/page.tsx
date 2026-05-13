"use client";

import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand-beige py-24">
        <div className="container-custom text-center space-y-4">
          <h1 className="text-5xl font-serif">Get in Touch</h1>
          <p className="text-sm text-brand-charcoal/60 uppercase tracking-widest">We're here to help you find your perfect fit</p>
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
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60">Your Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-brand-charcoal/10 py-3 outline-none focus:border-brand-gold transition-colors text-sm" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60">Email Address</label>
                  <input type="email" className="w-full bg-transparent border-b border-brand-charcoal/10 py-3 outline-none focus:border-brand-gold transition-colors text-sm" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60">Subject</label>
                <input type="text" className="w-full bg-transparent border-b border-brand-charcoal/10 py-3 outline-none focus:border-brand-gold transition-colors text-sm" placeholder="Order Inquiry" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-charcoal/60">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-brand-charcoal/10 py-3 outline-none focus:border-brand-gold transition-colors text-sm resize-none" placeholder="How can we help you today?"></textarea>
              </div>
              <button className="btn-primary w-full">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
