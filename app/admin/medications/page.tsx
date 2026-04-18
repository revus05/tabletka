import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { deleteMedicationAction } from "@/lib/actions/medications"

export default async function MedicationsPage() {
  const medications = await prisma.medication.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { stocks: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#2b2b2b] text-[28px] font-semibold">Лекарства</h1>
        <Link
          href="/admin/medications/new"
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
              <th className="text-left px-4 py-3 text-[#7a7a7a] font-semibold">МНН</th>
              <th className="text-left px-4 py-3 text-[#7a7a7a] font-semibold">Производитель</th>
              <th className="text-left px-4 py-3 text-[#7a7a7a] font-semibold">В аптеках</th>
              <th className="text-left px-4 py-3 text-[#7a7a7a] font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5eaeb]">
            {medications.map((m) => (
              <tr key={m.id} className="hover:bg-[#f5f5f5] transition-colors">
                <td className="px-4 py-3 text-[#7a7a7a]">{m.id}</td>
                <td className="px-4 py-3 text-[#2b2b2b] font-semibold">{m.name}</td>
                <td className="px-4 py-3 text-[#7a7a7a]">{m.genericName ?? "—"}</td>
                <td className="px-4 py-3 text-[#7a7a7a]">{m.manufacturer ?? "—"}</td>
                <td className="px-4 py-3 text-[#2b2b2b]">{m._count.stocks}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/medications/${m.id}/edit`}
                      className="text-[#29a373] hover:text-[#196346] font-semibold"
                    >
                      Изменить
                    </Link>
                    <form
                      action={async () => {
                        "use server"
                        await deleteMedicationAction(m.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="text-[#ef4444] hover:text-red-700 font-semibold"
                      >
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {medications.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#7a7a7a]">
                  Лекарств пока нет.{" "}
                  <Link href="/admin/medications/new" className="text-[#29a373]">Добавить первое</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
