import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { StockForm } from "@/components/admin/stock-form"
import { upsertStockAction } from "@/lib/actions/stock"

export default async function NewStockPage() {
  const [pharmacies, medications] = await Promise.all([
    prisma.pharmacy.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, city: true } }),
    prisma.medication.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/stock" className="text-gray hover:text-brand text-[14px]">
          ← Остатки
        </Link>
        <span className="text-gray">/</span>
        <h1 className="text-dark text-[24px] font-semibold">Новый остаток</h1>
      </div>

      <div className="bg-white rounded-[4px] border border-gray-border p-6">
        <StockForm action={upsertStockAction} pharmacies={pharmacies} medications={medications} />
      </div>
    </div>
  )
}
