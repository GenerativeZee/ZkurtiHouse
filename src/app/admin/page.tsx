import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, IndianRupee } from "lucide-react";

export default async function AdminDashboard() {
  const [productCount, orderCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true, orderNumber: true, customerName: true,
        total: true, status: true, createdAt: true,
      },
    }),
  ]);

  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "paid" },
  });

  const stats = [
    { label: "Total Products", value: productCount, icon: Package, href: "/admin/products" },
    { label: "Total Orders", value: orderCount, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Revenue (Paid)", value: `₹${(revenue._sum.total ?? 0).toLocaleString("en-IN")}`, icon: IndianRupee, href: "/admin/orders" },
    { label: "Pending Orders", value: orders.filter(o => o.status === "confirmed").length, icon: TrendingUp, href: "/admin/orders" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-serif">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back — here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{label}</p>
              <Icon size={18} className="text-brand-gold" />
            </div>
            <p className="text-2xl font-bold text-brand-charcoal">{value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-brand-gold font-bold uppercase tracking-widest">View All</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {orders.length === 0 && (
            <p className="p-6 text-sm text-gray-400">No orders yet.</p>
          )}
          {orders.map(order => (
            <div key={order.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold font-mono">{order.orderNumber}</p>
                <p className="text-xs text-gray-400">{order.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">₹{order.total.toLocaleString("en-IN")}</p>
                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                  order.status === "delivered" ? "bg-green-100 text-green-600" :
                  order.status === "shipped" ? "bg-blue-100 text-blue-600" :
                  "bg-amber-100 text-amber-600"
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
