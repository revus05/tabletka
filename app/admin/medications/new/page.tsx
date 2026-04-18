import Link from "next/link"
import { MedicationForm } from "@/components/admin/medication-form"
import { createMedicationAction } from "@/lib/actions/medications"

export default function NewMedicationPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/medications" className="text-[#7a7a7a] hover:text-[#29a373] text-[14px]">
          ← Лекарства
        </Link>
        <span className="text-[#7a7a7a]">/</span>
        <h1 className="text-[#2b2b2b] text-[24px] font-semibold">Новое лекарство</h1>
      </div>

      <div className="bg-white rounded-[4px] border border-[#e5eaeb] p-6">
        <MedicationForm action={createMedicationAction} />
      </div>
    </div>
  )
}
