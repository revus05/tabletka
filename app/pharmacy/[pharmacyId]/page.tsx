import Link from "next/link"
import { notFound } from "next/navigation"
import { FavoriteButton } from "@/components/favorite-button"
import { PharmacySingleMap } from "@/components/pharmacy-single-map"
import { prisma } from "@/lib/prisma"

type PharmacyPageProps = {
  params: Promise<{ pharmacyId: string }>
  searchParams: Promise<{ inStock?: string }>
}

export async function generateMetadata({ params }: PharmacyPageProps) {
  const { pharmacyId } = await params
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id: Number(pharmacyId) },
  })

  if (!pharmacy) {
    return { title: "Аптека не найдена" }
  }

  return {
    title: `${pharmacy.name} — Таблетка.бай`,
    description: `${pharmacy.name} в ${pharmacy.city}, ${pharmacy.address}`,
  }
}

export default async function PharmacyPage({ params, searchParams }: PharmacyPageProps) {
  const { pharmacyId } = await params
  const { inStock } = await searchParams
  const showOnlyInStock = inStock === "true"

  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id: Number(pharmacyId) },
  })

  if (!pharmacy) {
    notFound()
  }

  // Get all stock for this pharmacy with medication info
  const stocks = await prisma.stock.findMany({
    where: {
      pharmacyId: pharmacy.id,
      ...(showOnlyInStock ? { inStock: true } : {}),
    },
    include: {
      medication: true,
    },
    orderBy: [
      { inStock: "desc" }, // In stock first
      { medication: { name: "asc" } }, // Then alphabetically
    ],
  })

  const totalCount = await prisma.stock.count({
    where: { pharmacyId: pharmacy.id },
  })

  const inStockCount = await prisma.stock.count({
    where: { pharmacyId: pharmacy.id, inStock: true },
  })

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1200px] px-4 md:px-5 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-gray mb-5">
          <Link href="/" className="hover:text-brand">Главная</Link>
          <span>/</span>
          <Link href="/pharmacies" className="hover:text-brand">Аптеки</Link>
          <span>/</span>
          <span className="text-dark truncate max-w-[200px]">{pharmacy.name}</span>
        </nav>

        {/* Pharmacy header */}
        <div className="mb-6 border border-gray-border rounded-[4px] p-5 bg-white">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-[80px] h-[80px] shrink-0 border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center overflow-hidden">
              {pharmacy.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pharmacy.logoUrl}
                  alt={pharmacy.name}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                  <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[24px] md:text-[28px] font-semibold text-dark mb-2">
                {pharmacy.name}
              </h1>
              <div className="flex flex-col gap-2 text-[14px]">
                <div className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                    <path d="M8 1C5.24 1 3 3.24 3 6c0 4.25 5 9 5 9s5-4.75 5-9c0-2.76-2.24-5-5-5z" fill="#29a373" />
                  </svg>
                  <span className="text-dark">{pharmacy.city}, {pharmacy.address}</span>
                </div>
                {pharmacy.phone && (
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path d="M12 10.5c-.7 0-1.4-.1-2-.3-.3-.1-.6 0-.8.2l-1.2 1.2C6.1 10.6 5.4 9.9 4.4 8.9L5.6 7.7c.2-.2.3-.5.2-.8C5.6 6.4 5.5 5.7 5.5 5c0-.5-.4-.9-.9-.9H3c-.6 0-1 .4-1 1C2 10.4 5.6 14 10.9 14c.6 0 1-.4 1-1v-1.6c0-.5-.4-.9-.9-.9z" fill="#29a373" />
                    </svg>
                    <a
                      href={`tel:${pharmacy.phone}`}
                      className="text-brand hover:underline"
                    >
                      {pharmacy.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          {pharmacy.latitude && pharmacy.longitude && (
            <div className="mt-4 border border-gray-border rounded-[4px] overflow-hidden">
              <PharmacySingleMap
                pharmacy={{
                  id: pharmacy.id,
                  name: pharmacy.name,
                  address: `${pharmacy.city}, ${pharmacy.address}`,
                  latitude: pharmacy.latitude,
                  longitude: pharmacy.longitude,
                }}
              />
            </div>
          )}
        </div>

        {/* Filters and count */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-dark text-[20px] md:text-[24px] font-semibold">
            Товары
            <span className="text-gray text-[16px] md:text-[18px] ml-2 font-normal">
              — {showOnlyInStock ? inStockCount : totalCount} позиций
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <Link
              href={`/pharmacy/${pharmacy.id}`}
              className={`px-4 py-2 rounded-[4px] text-[14px] font-semibold transition-colors ${
                !showOnlyInStock
                  ? "bg-brand text-white"
                  : "border border-gray-border text-dark hover:border-brand"
              }`}
            >
              Все товары
            </Link>
            <Link
              href={`/pharmacy/${pharmacy.id}?inStock=true`}
              className={`px-4 py-2 rounded-[4px] text-[14px] font-semibold transition-colors ${
                showOnlyInStock
                  ? "bg-brand text-white"
                  : "border border-gray-border text-dark hover:border-brand"
              }`}
            >
              В наличии
            </Link>
          </div>
        </div>

        {/* Medications grid */}
        {stocks.length === 0 ? (
          <div className="text-center py-16 text-gray border border-gray-border rounded-[4px]">
            <p className="text-[18px] mb-2">Товаров не найдено</p>
            {showOnlyInStock && (
              <p className="text-[15px]">
                <Link href={`/pharmacy/${pharmacy.id}`} className="text-brand hover:underline">
                  Показать все товары
                </Link>
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <div
                key={stock.id}
                className="border border-gray-border rounded-[4px] p-4 hover:border-brand hover:shadow-sm transition-all bg-white group relative"
              >
                <div className="absolute top-2 right-2 z-10">
                  <FavoriteButton medicationId={stock.medication.id} size="sm" />
                </div>
                <Link
                  href={`/pharmacy/${pharmacy.id}/product/${stock.medication.id}`}
                  className="block"
                >
                  {/* Image */}
                  <div className="w-full h-[160px] mb-3 border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center overflow-hidden">
                    {stock.medication.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={stock.medication.imageUrl}
                        alt={stock.medication.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                        <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mb-3">
                    <h3 className="text-dark text-[15px] font-semibold leading-snug mb-1 group-hover:text-brand transition-colors line-clamp-2">
                      {stock.medication.name}
                    </h3>
                    {stock.medication.genericName && (
                      <p className="text-gray text-[13px] truncate">{stock.medication.genericName}</p>
                    )}
                  </div>

                  {/* Price and availability */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-brand text-[20px] font-semibold">
                        {Number(stock.price).toFixed(2)} р.
                      </p>
                      <p className={`text-[13px] ${stock.inStock ? "text-green-600" : "text-gray"}`}>
                        {stock.inStock ? `В наличии (${stock.quantity} шт.)` : "Нет в наличии"}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
