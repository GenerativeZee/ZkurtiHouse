"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to delete (${res.status})`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group/del">
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
        title={error || "Delete product"}
      >
        <Trash2 size={14} />
      </button>
      {error && (
        <div className="absolute bottom-full right-0 mb-1 px-2 py-1 bg-red-100 text-red-700 text-[10px] rounded whitespace-nowrap z-10 pointer-events-none">
          {error}
        </div>
      )}
    </div>
  );
}
