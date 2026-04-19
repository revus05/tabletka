import Link from "next/link"
import { PharmacyForm } from "@/components/admin/pharmacy-form"
import { createPharmacyAction } from "@/lib/actions/pharmacies"

export default function NewPharmacyPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pharmacies" className="text-gray hover:text-brand text-[14px]">
          ← Аптеки
        </Link>
        <span className="text-gray">/</span>
        <h1 className="text-dark text-[24px] font-semibold">Новая аптека</h1>
      </div>

      <div className="bg-white rounded-[4px] border border-gray-border p-6">
        <PharmacyForm action={createPharmacyAction} />
      </div>
    </div>
  )
}
