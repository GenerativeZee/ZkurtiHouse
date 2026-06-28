import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (email !== process.env.ADMIN_EMAIL) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-charcoal text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Label Noor</p>
          <p className="font-serif text-lg">Admin</p>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {[
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/products", label: "Products", icon: Package },
            { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <UserButton />
          <div className="flex-grow min-w-0">
            <p className="text-xs text-white/60 truncate">{email}</p>
          </div>
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            <LogOut size={14} />
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-grow overflow-auto">
        {children}
      </main>
    </div>
  );
}
