import { prisma } from "@/lib/prisma"

export type SearchParams = {
  q: string
  region?: string
  inStock?: boolean
}

export type MedicationResult = {
  id: number
  name: string
  genericName: string | null
  manufacturer: string | null
  imageUrl: string | null
  minPrice: number | null
  pharmacyCount: number
  anyInStock: boolean
}

export async function searchMedications({ q, region, inStock }: SearchParams): Promise<MedicationResult[]> {
  // Support multiple regions: comma-separated string
  let regionList: string[] = []

  if (region && typeof region === "string") {
    regionList = region
      .split(",")
      .map(r => r.trim())
      .filter(r => r && r !== "Все регионы")
  }

  const stockWhere = {
    ...(inStock ? { inStock: true } : {}),
    ...(regionList.length > 0
      ? { pharmacy: { OR: regionList.flatMap(r => [{ city: r }, { region: r }]) } }
      : {}),
  }

  const medications = await prisma.medication.findMany({
    where: {
      ...(q.trim()
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { genericName: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      stocks: { some: stockWhere },
    },
    include: {
      stocks: {
        where: stockWhere,
        select: { price: true, inStock: true },
      },
    },
    orderBy: { name: "asc" },
    take: 200,
  })

  return medications.map((med) => {
    const prices = med.stocks.map((s) => Number(s.price))
    return {
      id: med.id,
      name: med.name,
      genericName: med.genericName,
      manufacturer: med.manufacturer,
      imageUrl: med.imageUrl,
      minPrice: prices.length ? Math.min(...prices) : null,
      pharmacyCount: med.stocks.length,
      anyInStock: med.stocks.some((s) => s.inStock),
    }
  })
}
