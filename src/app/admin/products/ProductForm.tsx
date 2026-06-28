"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ProductFormData {
  name: string;
  price: string;
  category: string;
  description: string;
  fabric: string;
  fit: string;
  occasion: string;
  sizes: string;
  colors: string;
  stock: string;
  isBestseller: boolean;
  imageUrl: string;
  images: string[];
}

interface Props {
  initialData?: Partial<ProductFormData & { id: string }>;
  mode: "create" | "edit";
}

const CATEGORIES = ["Daily Wear", "Office Wear", "Festive Wear"];

export default function ProductForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name ?? "",
    price: initialData?.price?.toString() ?? "",
    category: initialData?.category ?? "Daily Wear",
    description: initialData?.description ?? "",
    fabric: initialData?.fabric ?? "",
    fit: initialData?.fit ?? "",
    occasion: initialData?.occasion ?? "",
    sizes: initialData?.sizes ?? "",
    colors: initialData?.colors ?? "",
    stock: initialData?.stock?.toString() ?? "100",
    isBestseller: initialData?.isBestseller ?? false,
    imageUrl: initialData?.imageUrl ?? "",
    images: initialData?.images ?? [],
  });

  const update = (field: keyof ProductFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      setForm(prev => ({
        ...prev,
        imageUrl: prev.imageUrl || data.url,
        images: [...prev.images, data.url],
      }));
    }
    setUploading(false);
  };

  const removeImage = (url: string) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter(i => i !== url),
      imageUrl: prev.imageUrl === url ? (prev.images.find(i => i !== url) ?? "") : prev.imageUrl,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name: form.name,
      price: parseInt(form.price),
      category: form.category,
      description: form.description,
      fabric: form.fabric,
      fit: form.fit,
      occasion: form.occasion,
      sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map(s => s.trim()).filter(Boolean),
      stock: parseInt(form.stock),
      isBestseller: form.isBestseller,
      imageUrl: form.imageUrl,
      images: form.images,
    };

    const url = mode === "create" ? "/api/products" : `/api/products/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-gold transition-colors";
  const labelClass = "block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-sm">Product Info</h2>
            <div>
              <label className={labelClass}>Product Name *</label>
              <input required value={form.name} onChange={update("name")} className={inputClass} placeholder="Minimalist Olive Co-ord Set" />
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea required value={form.description} onChange={update("description")} rows={4} className={inputClass + " resize-none"} placeholder="Describe the product..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Fabric *</label>
                <input required value={form.fabric} onChange={update("fabric")} className={inputClass} placeholder="Fine Cotton" />
              </div>
              <div>
                <label className={labelClass}>Fit *</label>
                <input required value={form.fit} onChange={update("fit")} className={inputClass} placeholder="Straight Cut" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Occasion</label>
              <input value={form.occasion} onChange={update("occasion")} className={inputClass} placeholder="Daily Wear" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Sizes (comma-separated)</label>
                <input value={form.sizes} onChange={update("sizes")} className={inputClass} placeholder="S, M, L, XL" />
              </div>
              <div>
                <label className={labelClass}>Colors (comma-separated)</label>
                <input value={form.colors} onChange={update("colors")} className={inputClass} placeholder="Olive Green, Ivory" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-sm">Product Images</h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-8 cursor-pointer hover:border-brand-gold transition-colors">
              <Upload size={24} className="text-gray-300 mb-2" />
              <span className="text-sm text-gray-400">{uploading ? "Uploading..." : "Click to upload image"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
            {form.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {form.images.map((url) => (
                  <div key={url} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-brand-beige group">
                    <Image src={url} alt="Product" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {url === form.imageUrl && (
                      <span className="absolute bottom-1 left-1 bg-brand-gold text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Main</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-sm">Pricing & Category</h2>
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input required type="number" min="1" value={form.price} onChange={update("price")} className={inputClass} placeholder="1450" />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select required value={form.category} onChange={update("category")} className={inputClass}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" min="0" value={form.stock} onChange={update("stock")} className={inputClass} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBestseller}
                onChange={e => setForm(prev => ({ ...prev, isBestseller: e.target.checked }))}
                className="accent-brand-gold w-4 h-4"
              />
              <span className="text-sm font-medium">Mark as Bestseller</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full bg-brand-charcoal text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-brand-charcoal-light transition-colors disabled:opacity-60 rounded-lg"
          >
            {saving ? "Saving..." : mode === "create" ? "Publish Product" : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full border border-gray-200 text-gray-500 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
