import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { deletePharmacyAction } from "@/lib/actions/pharmacies"

export default async function PharmaciesPage() {
  const pharmacies = await prisma.pharmacy.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { stocks: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#2b2b2b] text-[28px] font-semibold">Аптеки</h1>
        <Link
          href="/admin/pharmacies/new"
          className="h-[40px] px-5 bg-[#29a373] text-white text-[15px] font-semibold rounded-[4px] hover:bg-[#196346] transition-colors flex items-center"
        >
          + Добавить
        </Link>
      </div>

      <div className="bg-white rounded-[4px] border border-[#e5eaeb] overflow-hidden">
        <table className="w-full text-[14px]">
          <thead className="bg-[#f5f5f5] border-b border-[#e5eaeb]">
            <tr>
              <th className="text-left px-4 py-3 text-[#7a7a7a] font-semibold">ID</th>
              <th className="text-left px-4 py-3 text-[#7a7a7a] font-semibold">Название</th>
              <th className="text-left px-4 py-3 text-[#7a7a7a] font-semibold">Город</th>
              <th className="text-left px-4 py-3 text-[#7a7a7a] font-semibold">Телефон</th>
              <th className="text-left px-4 py-3 text-[#7a7a7a] font-semibold">Позиций</th>
              <th className="text-left px-4 py-3 text-[#7a7a7a] font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5eaeb]">
            {pharmacies.map((p) => (
              <tr key={p.id} className="hover:bg-[#f5f5f5] transition-colors">
                <td className="px-4 py-3 text-[#7a7a7a]">{p.id}</td>
                <td className="px-4 py-3 text-[#2b2b2b] font-semibold">{p.name}</td>
                <td className="px-4 py-3 text-[#2b2b2b]">{p.city}</td>
                <td className="px-4 py-3 text-[#7a7a7a]">{p.phone ?? "—"}</td>
                <td className="px-4 py-3 text-[#2b2b2b]">{p._count.stocks}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/pharmacies/${p.id}/edit`}
                      className="text-[#29a373] hover:text-[#196346] font-semibold"
                    >
                      Изменить
                    </Link>
                    <form
                      action={async () => {
                        "use server"
                        await deletePharmacyAction(p.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="text-[#ef4444] hover:text-red-700 font-semibold"
                        onClick={(e) => {
                          if (!confirm(`Удалить аптеку "${p.name}"?`)) e.preventDefault()
                        }}
                      >
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {pharmacies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#7a7a7a]">
                  Аптек пока нет. <Link href="/admin/pharmacies/new" className="text-[#29a373]">Добавить первую</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
