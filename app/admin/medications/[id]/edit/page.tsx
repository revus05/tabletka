import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { MedicationForm } from "@/components/admin/medication-form"
import { updateMedicationAction } from "@/lib/actions/medications"

type Props = { params: Promise<{ id: string }> }

export default async function EditMedicationPage({ params }: Props) {
  const { id } = await params
  const medication = await prisma.medication.findUnique({ where: { id: Number(id) } })
  if (!medication) notFound()

  const action = updateMedicationAction.bind(null, medication.id)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/medications" className="text-[#7a7a7a] hover:text-[#29a373] text-[14px]">
          ← Лекарства
        </Link>
        <span className="text-[#7a7a7a]">/</span>
        <h1 className="text-[#2b2b2b] text-[24px] font-semibold">Редактировать лекарство</h1>
      </div>

      <div className="bg-white rounded-[4px] border border-[#e5eaeb] p-6">
        <MedicationForm
          action={action}
          defaultValues={{
            name: medication.name,
            genericName: medication.genericName ?? "",
            manufacturer: medication.manufacturer ?? "",
            imageUrl: medication.imageUrl ?? "",
            description: medication.description ?? "",
          }}
        />
      </div>
    </div>
  )
}
