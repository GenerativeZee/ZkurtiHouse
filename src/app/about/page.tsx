import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/about-brand.png"
          alt="Label Noor Story"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="container-custom relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-serif mb-4">Our Story</h1>
          <p className="text-sm uppercase tracking-[0.4em] font-medium opacity-90">Crafting Grace Since 2024</p>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold">The Label Noor Essence</p>
                <h2 className="text-4xl md:text-5xl font-serif">Redefining Elegance for the Modern Woman</h2>
              </div>
              <p className="text-brand-charcoal/70 leading-relaxed">
                Label Noor was born out of a desire to bridge the gap between luxury aesthetics and everyday affordability. We believe that every woman deserves to feel graceful, confident, and beautiful without having to compromise on her budget.
              </p>
              <p className="text-brand-charcoal/70 leading-relaxed">
                Our designs are inspired by the rich heritage of Aligarh's craftsmanship, blending traditional embroidery techniques with contemporary silhouettes. From the softest cottons to the finest linens, we handpick fabrics that feel like a second skin.
              </p>
              <div className="pt-4">
                <Link href="/shop" className="btn-outline inline-flex items-center group">
                  Explore the Collection <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-custom overflow-hidden">
              <Image
                src="/images/category-daily.png"
                alt="Craftsmanship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-brand-beige">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-serif">Artisan First</h3>
              <p className="text-sm text-brand-charcoal/60 leading-relaxed">
                We work directly with local artisans, ensuring fair wages and preserving age-old embroidery traditions.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-serif">Ethical Fashion</h3>
              <p className="text-sm text-brand-charcoal/60 leading-relaxed">
                Our production process is slow and mindful, focusing on quality over quantity to minimize waste.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-serif">Inclusivity</h3>
              <p className="text-sm text-brand-charcoal/60 leading-relaxed">
                Our sizes and styles are designed to celebrate all body types, making premium fashion accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-32 bg-white">
        <div className="container-custom text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif italic leading-relaxed text-brand-charcoal/80">
            "Style is a way to say who you are without having to speak. We provide the threads; you provide the soul."
          </h2>
          <div className="w-12 h-[2px] bg-brand-gold mx-auto mt-12" />
          <p className="mt-8 text-xs uppercase tracking-widest font-bold">— Noor, Founder</p>
        </div>
      </section>
    </div>
  );
}
