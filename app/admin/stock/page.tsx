import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { deleteStockAction } from "@/lib/actions/stock"

export default async function StockPage() {
  const stocks = await prisma.stock.findMany({
    include: {
      medication: { select: { name: true } },
      pharmacy: { select: { name: true, city: true } },
    },
    orderBy: [{ pharmacy: { name: "asc" } }, { medication: { name: "asc" } }],
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-dark text-[28px] font-semibold">Остатки</h1>
        <Link
          href="/admin/stock/new"
          className="h-[40px] px-5 bg-brand text-white text-[15px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors flex items-center"
        >
          + Добавить
        </Link>
      </div>

      <div className="bg-white rounded-[4px] border border-gray-border overflow-hidden">
        <table className="w-full text-[14px]">
          <thead className="bg-gray-bg border-b border-gray-border">
            <tr>
              <th className="text-left px-4 py-3 text-gray font-semibold">Лекарство</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Аптека</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Цена</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Кол-во</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Наличие</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {stocks.map((s) => (
              <tr key={s.id} className="hover:bg-gray-bg transition-colors">
                <td className="px-4 py-3 text-dark font-semibold">{s.medication.name}</td>
                <td className="px-4 py-3 text-dark">
                  {s.pharmacy.name}
                  <span className="text-gray text-[12px] ml-1">({s.pharmacy.city})</span>
                </td>
                <td className="px-4 py-3 text-dark">{Number(s.price).toFixed(2)} р.</td>
                <td className="px-4 py-3 text-dark">{s.quantity} / {s.maxQuantity}</td>
                <td className="px-4 py-3">
                  {s.inStock ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-semibold bg-brand-light text-brand">
                      В наличии
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-semibold bg-red-50 text-red-600">
                      Нет
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/stock/${s.id}/edit`}
                      className="text-brand hover:text-brand-hover font-semibold"
                    >
                      Изменить
                    </Link>
                    <form
                      action={async () => {
                        "use server"
                        await deleteStockAction(s.id)
                      }}
                    >
                      <button type="submit" className="text-error hover:text-red-700 font-semibold">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {stocks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray">
                  Нет ни одного остатка.{" "}
                  <Link href="/admin/stock/new" className="text-brand">Добавить</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
