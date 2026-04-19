import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PharmacyDeleteButton } from "@/components/admin/pharmacy-delete-button"

export default async function PharmaciesPage() {
  const pharmacies = await prisma.pharmacy.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { stocks: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-dark text-[28px] font-semibold">Аптеки</h1>
        <Link
          href="/admin/pharmacies/new"
          className="h-[40px] px-5 bg-brand text-white text-[15px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors flex items-center"
        >
          + Добавить
        </Link>
      </div>

      <div className="bg-white rounded-[4px] border border-gray-border overflow-hidden">
        <table className="w-full text-[14px]">
          <thead className="bg-gray-bg border-b border-gray-border">
            <tr>
              <th className="text-left px-4 py-3 text-gray font-semibold">ID</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Название</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Город</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Телефон</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Позиций</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {pharmacies.map((p) => (
              <tr key={p.id} className="hover:bg-gray-bg transition-colors">
                <td className="px-4 py-3 text-gray">{p.id}</td>
                <td className="px-4 py-3 text-dark font-semibold">{p.name}</td>
                <td className="px-4 py-3 text-dark">{p.city}</td>
                <td className="px-4 py-3 text-gray">{p.phone ?? "—"}</td>
                <td className="px-4 py-3 text-dark">{p._count.stocks}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/pharmacies/${p.id}/edit`}
                      className="text-brand hover:text-brand-hover font-semibold"
                    >
                      Изменить
                    </Link>
                    <PharmacyDeleteButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {pharmacies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray">
                  Аптек пока нет. <Link href="/admin/pharmacies/new" className="text-brand">Добавить первую</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
