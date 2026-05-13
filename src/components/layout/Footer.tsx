import Link from "next/link";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-beige border-t border-brand-charcoal/5 pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif tracking-tighter">Label Noor</h2>
            <p className="text-sm text-brand-charcoal-light leading-relaxed">
              Grace in every thread. We bring you luxurious, premium ethnic wear that celebrates femininity and tradition with a modern touch.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-brand-gold transition-colors">
                <Instagram size={20} strokeWidth={1.5} />
              </Link>
              <Link href="#" className="hover:text-brand-gold transition-colors">
                <Facebook size={20} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-widest font-semibold">Quick Links</h3>
            <ul className="space-y-4 text-sm text-brand-charcoal-light">
              <li><Link href="/shop" className="hover:text-brand-gold transition-colors">Shop All</Link></li>
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link></li>
              <li><Link href="/returns" className="hover:text-brand-gold transition-colors">Returns Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-widest font-semibold">Categories</h3>
            <ul className="space-y-4 text-sm text-brand-charcoal-light">
              <li><Link href="/shop?category=daily" className="hover:text-brand-gold transition-colors">Daily Wear</Link></li>
              <li><Link href="/shop?category=office" className="hover:text-brand-gold transition-colors">Office Wear</Link></li>
              <li><Link href="/shop?category=festive" className="hover:text-brand-gold transition-colors">Festive Wear</Link></li>
              <li><Link href="/shop?category=new" className="hover:text-brand-gold transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-widest font-semibold">Contact</h3>
            <ul className="space-y-4 text-sm text-brand-charcoal-light">
              <li className="flex items-center space-x-3">
                <Mail size={16} strokeWidth={1.5} className="text-brand-gold" />
                <span>hello@labelnoor.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} strokeWidth={1.5} className="text-brand-gold" />
                <span>+91 98765 43210</span>
              </li>
              <li className="text-xs leading-relaxed pt-2">
                Visit us: 123 Fashion Street, <br />
                Aligarh, Uttar Pradesh, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-charcoal/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-brand-charcoal/50">
          <p>© {new Date().getFullYear()} LABEL NOOR. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
