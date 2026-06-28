import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-serif">Add New Product</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details and upload images to Cloudinary.</p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
