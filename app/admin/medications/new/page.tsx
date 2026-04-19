import Link from "next/link"
import { MedicationForm } from "@/components/admin/medication-form"
import { createMedicationAction } from "@/lib/actions/medications"

export default function NewMedicationPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/medications" className="text-gray hover:text-brand text-[14px]">
          ← Лекарства
        </Link>
        <span className="text-gray">/</span>
        <h1 className="text-dark text-[24px] font-semibold">Новое лекарство</h1>
      </div>

      <div className="bg-white rounded-[4px] border border-gray-border p-6">
        <MedicationForm action={createMedicationAction} />
      </div>
    </div>
  )
}
