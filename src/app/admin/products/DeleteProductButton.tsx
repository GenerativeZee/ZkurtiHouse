"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
    >
      <Trash2 size={14} />
    </button>
  );
}
