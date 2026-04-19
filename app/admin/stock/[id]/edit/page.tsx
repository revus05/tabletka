import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { StockForm } from "@/components/admin/stock-form"
import { upsertStockAction } from "@/lib/actions/stock"

type Props = { params: Promise<{ id: string }> }

export default async function EditStockPage({ params }: Props) {
  const { id } = await params
  const [stock, pharmacies, medications] = await Promise.all([
    prisma.stock.findUnique({ where: { id: Number(id) } }),
    prisma.pharmacy.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, city: true } }),
    prisma.medication.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ])

  if (!stock) notFound()

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/stock" className="text-gray hover:text-brand text-[14px]">
          ← Остатки
        </Link>
        <span className="text-gray">/</span>
        <h1 className="text-dark text-[24px] font-semibold">Редактировать остаток</h1>
      </div>

      <div className="bg-white rounded-[4px] border border-gray-border p-6">
        <StockForm
          action={upsertStockAction}
          pharmacies={pharmacies}
          medications={medications}
          defaultValues={{
            medicationId: stock.medicationId,
            pharmacyId: stock.pharmacyId,
            price: Number(stock.price),
            quantity: stock.quantity,
            maxQuantity: stock.maxQuantity,
            inStock: stock.inStock,
          }}
        />
      </div>
    </div>
  )
}
