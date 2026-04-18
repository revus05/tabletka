import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const [pharmacyCount, medicationCount, userCount, stockCount] = await Promise.all([
    prisma.pharmacy.count(),
    prisma.medication.count(),
    prisma.user.count(),
    prisma.stock.count({ where: { inStock: true } }),
  ])

  const stats = [
    { label: "Аптеки", value: pharmacyCount, href: "/admin/pharmacies", color: "bg-[#29a373]" },
    { label: "Лекарства", value: medicationCount, href: "/admin/medications", color: "bg-[#0066cc]" },
    { label: "Пользователи", value: userCount, href: "#", color: "bg-[#f59e0b]" },
    { label: "В наличии позиций", value: stockCount, href: "/admin/stock", color: "bg-[#196346]" },
  ]

  return (
    <div>
      <h1 className="text-[#2b2b2b] text-[28px] font-semibold mb-6">Дашборд</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-[4px] border border-[#e5eaeb] p-6 hover:border-[#29a373] transition-colors"
          >
            <p className="text-[#7a7a7a] text-[14px] mb-2">{s.label}</p>
            <p className="text-[#2b2b2b] text-[40px] font-semibold leading-none">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/admin/pharmacies/new"
          className="flex items-center justify-center gap-2 h-[56px] bg-[#29a373] text-white text-[15px] font-semibold rounded-[4px] hover:bg-[#196346] transition-colors"
        >
          + Добавить аптеку
        </Link>
        <Link
          href="/admin/medications/new"
          className="flex items-center justify-center gap-2 h-[56px] bg-white border border-[#29a373] text-[#29a373] text-[15px] font-semibold rounded-[4px] hover:bg-[#eaf6f1] transition-colors"
        >
          + Добавить лекарство
        </Link>
        <Link
          href="/admin/stock/new"
          className="flex items-center justify-center gap-2 h-[56px] bg-white border border-[#e5eaeb] text-[#2b2b2b] text-[15px] font-semibold rounded-[4px] hover:border-[#29a373] transition-colors"
        >
          + Добавить остаток
        </Link>
      </div>
    </div>
  )
}
