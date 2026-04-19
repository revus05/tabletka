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
    { label: "Аптеки", value: pharmacyCount, href: "/admin/pharmacies", color: "bg-brand" },
    { label: "Лекарства", value: medicationCount, href: "/admin/medications", color: "bg-info" },
    { label: "Пользователи", value: userCount, href: "#", color: "bg-warning" },
    { label: "В наличии позиций", value: stockCount, href: "/admin/stock", color: "bg-brand-hover" },
  ]

  return (
    <div>
      <h1 className="text-dark text-[28px] font-semibold mb-6">Дашборд</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-[4px] border border-gray-border p-6 hover:border-brand transition-colors"
          >
            <p className="text-gray text-[14px] mb-2">{s.label}</p>
            <p className="text-dark text-[40px] font-semibold leading-none">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/admin/pharmacies/new"
          className="flex items-center justify-center gap-2 h-[56px] bg-brand text-white text-[15px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors"
        >
          + Добавить аптеку
        </Link>
        <Link
          href="/admin/medications/new"
          className="flex items-center justify-center gap-2 h-[56px] bg-white border border-brand text-brand text-[15px] font-semibold rounded-[4px] hover:bg-brand-light transition-colors"
        >
          + Добавить лекарство
        </Link>
        <Link
          href="/admin/stock/new"
          className="flex items-center justify-center gap-2 h-[56px] bg-white border border-gray-border text-dark text-[15px] font-semibold rounded-[4px] hover:border-brand transition-colors"
        >
          + Добавить остаток
        </Link>
      </div>
    </div>
  )
}
