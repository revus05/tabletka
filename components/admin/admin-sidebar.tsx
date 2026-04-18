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
    <aside className="w-[240px] shrink-0 bg-white border-r border-[#e5eaeb] flex flex-col min-h-screen">
      <div className="p-5 border-b border-[#e5eaeb]">
        <Link href="/" className="flex items-center gap-2">
          <Logo label={false} />
          <span className="text-[16px] font-semibold text-[#2b2b2b]">
            <span className="text-[#29a373]">Админ</span>панель
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
                  ? "bg-[#eaf6f1] text-[#29a373]"
                  : "text-[#2b2b2b] hover:bg-[#f5f5f5] hover:text-[#29a373]"
              }`}
            >
              <span className="text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e5eaeb]">
        <p className="text-[13px] text-[#7a7a7a] mb-2 truncate">{userName}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full h-[36px] text-[14px] text-[#7a7a7a] hover:text-[#ef4444] border border-[#e5eaeb] rounded-[4px] hover:border-[#ef4444] transition-colors"
          >
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );
}
