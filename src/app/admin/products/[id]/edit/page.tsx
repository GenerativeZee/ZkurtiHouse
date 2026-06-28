import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "../../ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-serif">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">{product.name}</p>
      </div>
      <ProductForm
        mode="edit"
        initialData={{
          id: product.id,
          name: product.name,
          price: product.price.toString(),
          category: product.category,
          description: product.description,
          fabric: product.fabric,
          fit: product.fit,
          occasion: product.occasion,
          sizes: product.sizes.join(", "),
          colors: product.colors.join(", "),
          stock: product.stock.toString(),
          isBestseller: product.isBestseller,
          imageUrl: product.imageUrl,
          images: product.images,
        }}
      />
    </div>
  );
}
