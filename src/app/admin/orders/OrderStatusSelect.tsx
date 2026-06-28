"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

const COLORS: Record<string, string> = {
  confirmed: "text-amber-700 bg-amber-100",
  processing: "text-blue-700 bg-blue-100",
  shipped: "text-purple-700 bg-purple-100",
  delivered: "text-green-700 bg-green-100",
  cancelled: "text-red-600 bg-red-100",
};

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setSaving(true);
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${COLORS[status]} disabled:opacity-60`}
    >
      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
