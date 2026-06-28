import { prisma } from "@/lib/prisma";
import OrderStatusSelect from "./OrderStatusSelect";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const totalRevenue = orders
    .filter(o => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-serif">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          {orders.length} orders · ₹{totalRevenue.toLocaleString("en-IN")} total revenue
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-bold text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">No orders yet.</td></tr>
            )}
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-bold font-mono text-xs">{order.orderNumber}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-xs">{order.customerName}</p>
                  <p className="text-gray-400 text-[10px]">{order.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                <td className="px-4 py-3 text-xs font-bold">₹{order.total.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    order.paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {order.paymentStatus === "paid" ? "Paid" : `COD`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </td>
                <td className="px-4 py-3 text-[10px] text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
