"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Truck
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { name: "Tổng quan", href: "/", icon: LayoutDashboard },
  { name: "Sản phẩm", href: "/products", icon: Package }, // Việc của bạn kia
  { name: "Đơn hàng", href: "/orders", icon: ShoppingCart }, // Việc của bạn
  { name: "Khách hàng", href: "/customers", icon: Users }, // Việc của bạn
  { name: "Nhà cung cấp", href: "/suppliers", icon: Truck }, // Việc của bạn kia
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-r bg-white px-3 py-4">
      <div>
        <div className="mb-6 flex items-center gap-2 px-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600"></div>
          <span className="text-xl font-bold text-gray-900">BizFlowa</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const LinkIcon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <LinkIcon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
        <LogOut className="h-5 w-5" />
        Đăng xuất
      </button>
    </div>
  );
}