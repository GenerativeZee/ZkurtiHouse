import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products in catalog</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-brand-charcoal text-white px-4 py-2 text-sm font-bold hover:bg-brand-charcoal-light transition-colors">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Product", "Category", "Price", "Stock", "Bestseller", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-bold text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-12 rounded overflow-hidden bg-brand-beige shrink-0">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                    </div>
                    <p className="font-medium text-xs truncate max-w-[180px]">{p.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{p.category}</td>
                <td className="px-4 py-3 text-xs font-bold">₹{p.price.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-xs">{p.stock}</td>
                <td className="px-4 py-3">
                  {p.isBestseller ? (
                    <span className="text-[10px] bg-brand-gold/10 text-brand-gold font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Yes</span>
                  ) : (
                    <span className="text-[10px] text-gray-300 font-bold">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-gray-400 hover:text-brand-gold transition-colors">
                      <Pencil size={14} />
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
