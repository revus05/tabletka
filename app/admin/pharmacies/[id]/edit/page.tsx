import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PharmacyForm } from "@/components/admin/pharmacy-form"
import { updatePharmacyAction } from "@/lib/actions/pharmacies"

type Props = { params: Promise<{ id: string }> }

export default async function EditPharmacyPage({ params }: Props) {
  const { id } = await params
  const pharmacy = await prisma.pharmacy.findUnique({ where: { id: Number(id) } })
  if (!pharmacy) notFound()

  const action = updatePharmacyAction.bind(null, pharmacy.id)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pharmacies" className="text-[#7a7a7a] hover:text-[#29a373] text-[14px]">
          ← Аптеки
        </Link>
        <span className="text-[#7a7a7a]">/</span>
        <h1 className="text-[#2b2b2b] text-[24px] font-semibold">Редактировать аптеку</h1>
      </div>

      <div className="bg-white rounded-[4px] border border-[#e5eaeb] p-6">
        <PharmacyForm
          action={action}
          defaultValues={{
            name: pharmacy.name,
            address: pharmacy.address,
            city: pharmacy.city,
            region: pharmacy.region,
            phone: pharmacy.phone ?? "",
            logoUrl: pharmacy.logoUrl ?? "",
          }}
        />
      </div>
    </div>
  )
}
