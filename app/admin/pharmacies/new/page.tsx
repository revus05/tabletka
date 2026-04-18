import Link from "next/link"
import { PharmacyForm } from "@/components/admin/pharmacy-form"
import { createPharmacyAction } from "@/lib/actions/pharmacies"

export default function NewPharmacyPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pharmacies" className="text-[#7a7a7a] hover:text-[#29a373] text-[14px]">
          ← Аптеки
        </Link>
        <span className="text-[#7a7a7a]">/</span>
        <h1 className="text-[#2b2b2b] text-[24px] font-semibold">Новая аптека</h1>
      </div>

      <div className="bg-white rounded-[4px] border border-[#e5eaeb] p-6">
        <PharmacyForm action={createPharmacyAction} />
      </div>
    </div>
  )
}
