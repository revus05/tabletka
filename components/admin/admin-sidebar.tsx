"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { logoutAction } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "Дашборд", icon: "⊞" },
  { href: "/admin/pharmacies", label: "Аптеки", icon: "⊕" },
  { href: "/admin/medications", label: "Лекарства", icon: "+" },
  { href: "/admin/stock", label: "Остатки", icon: "≡" },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] shrink-0 bg-white border-r border-gray-border flex flex-col min-h-screen">
      <div className="p-5 border-b border-gray-border">
        <Link href="/" className="flex items-center gap-2">
          <Logo label={false} />
          <span className="text-[16px] font-semibold text-dark">
            <span className="text-brand">Админ</span>панель
          </span>
        </Link>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[15px] font-semibold transition-colors ${
                isActive
                  ? "bg-brand-light text-brand"
                  : "text-dark hover:bg-gray-bg hover:text-brand"
              }`}
            >
              <span className="text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-border">
        <p className="text-[13px] text-gray mb-2 truncate">{userName}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full h-[36px] text-[14px] text-gray hover:text-error border border-gray-border rounded-[4px] hover:border-error transition-colors"
          >
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );
}
