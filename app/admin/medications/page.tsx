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
        <h1 className="text-dark text-[28px] font-semibold">Лекарства</h1>
        <Link
          href="/admin/medications/new"
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
              <th className="text-left px-4 py-3 text-gray font-semibold">МНН</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Производитель</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">В аптеках</th>
              <th className="text-left px-4 py-3 text-gray font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {medications.map((m) => (
              <tr key={m.id} className="hover:bg-gray-bg transition-colors">
                <td className="px-4 py-3 text-gray">{m.id}</td>
                <td className="px-4 py-3 text-dark font-semibold">{m.name}</td>
                <td className="px-4 py-3 text-gray">{m.genericName ?? "—"}</td>
                <td className="px-4 py-3 text-gray">{m.manufacturer ?? "—"}</td>
                <td className="px-4 py-3 text-dark">{m._count.stocks}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/medications/${m.id}/edit`}
                      className="text-brand hover:text-brand-hover font-semibold"
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
                        className="text-error hover:text-red-700 font-semibold"
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
                <td colSpan={6} className="px-4 py-8 text-center text-gray">
                  Лекарств пока нет.{" "}
                  <Link href="/admin/medications/new" className="text-brand">Добавить первое</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
