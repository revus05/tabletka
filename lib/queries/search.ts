import { prisma } from "@/lib/prisma"

export type SearchParams = {
  q: string
  region?: string
  inStock?: boolean
}

export type SearchResult = {
  id: number
  pharmacyId: number
  pharmacyName: string
  address: string
  city: string
  logoUrl: string | null
  price: number
  quantity: number
  maxQuantity: number
  inStock: boolean
  medicationId: number
  medicationName: string
}

export async function searchMedications({ q, region, inStock }: SearchParams): Promise<SearchResult[]> {
  if (!q.trim()) return []

  const results = await prisma.stock.findMany({
    where: {
      ...(inStock ? { inStock: true } : {}),
      medication: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { genericName: { contains: q, mode: "insensitive" } },
        ],
      },
      ...(region && region !== "Все регионы"
        ? { pharmacy: { OR: [{ city: region }, { region }] } }
        : {}),
    },
    include: {
      medication: { select: { id: true, name: true } },
      pharmacy: { select: { id: true, name: true, address: true, city: true, logoUrl: true } },
    },
    orderBy: { price: "asc" },
    take: 50,
  })

  return results.map((r) => ({
    id: r.id,
    pharmacyId: r.pharmacyId,
    pharmacyName: r.pharmacy.name,
    address: r.pharmacy.address,
    city: r.pharmacy.city,
    logoUrl: r.pharmacy.logoUrl,
    price: Number(r.price),
    quantity: r.quantity,
    maxQuantity: r.maxQuantity,
    inStock: r.inStock,
    medicationId: r.medicationId,
    medicationName: r.medication.name,
  }))
}
