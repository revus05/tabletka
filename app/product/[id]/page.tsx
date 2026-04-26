import { notFound } from "next/navigation"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/prisma"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}

export default async function MedicationPage({ params, searchParams }: Props) {
  const { id } = await params
  const { from } = await searchParams

  const medication = await prisma.medication.findUnique({
    where: { id: Number(id) },
    include: {
      stocks: {
        include: {
          pharmacy: true,
        },
        orderBy: { price: "asc" },
      },
    },
  })

  if (!medication) notFound()

  const inStockEntries = medication.stocks.filter((s) => s.inStock)
  const minPrice = medication.stocks.length
    ? Math.min(...medication.stocks.map((s) => Number(s.price)))
    : null

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1200px] px-4 md:px-5 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-gray mb-5 flex-wrap">
          <Link href="/" className="hover:text-brand">Главная</Link>
          <span>/</span>
          <Link
            href={from ? `/search?q=${encodeURIComponent(from)}` : "/search?q="}
            className="hover:text-brand"
          >
            {from ? `Поиск: ${from}` : "Все товары"}
          </Link>
          <span>/</span>
          <span className="text-dark truncate max-w-[240px]">{medication.name}</span>
        </nav>

        {/* Medication info */}
        <div className="border border-gray-border rounded-[4px] p-5 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-5 md:gap-6">
            {/* Image */}
            <div className="w-full sm:w-[180px] h-[160px] sm:h-[180px] shrink-0 border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center overflow-hidden">
              {medication.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={medication.imageUrl}
                  alt={medication.name}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" fill="#eaf6f1" />
                  <path d="M20 32h24M32 20v24" stroke="#29a373" strokeWidth="4" strokeLinecap="round" />
                </svg>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-dark text-[22px] md:text-[26px] font-semibold mb-2 leading-snug">
                {medication.name}
              </h1>

              {medication.genericName && (
                <p className="text-gray text-[14px] mb-1">МНН: {medication.genericName}</p>
              )}
              {medication.manufacturer && (
                <p className="text-gray text-[14px] mb-4">Производитель: {medication.manufacturer}</p>
              )}

              <div className="flex flex-wrap gap-4 items-center">
                {minPrice !== null && (
                  <div>
                    <span className="text-gray text-[13px]">от </span>
                    <span className="text-dark text-[28px] font-semibold">{minPrice.toFixed(2)} р.</span>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] text-dark">
                    {medication.stocks.length}{" "}
                    {medication.stocks.length === 1 ? "аптека" : medication.stocks.length < 5 ? "аптеки" : "аптек"}
                  </span>
                  {inStockEntries.length > 0 ? (
                    <span className="text-[14px] text-brand font-medium">
                      В наличии в {inStockEntries.length}{" "}
                      {inStockEntries.length === 1 ? "аптеке" : inStockEntries.length < 5 ? "аптеках" : "аптеках"}
                    </span>
                  ) : (
                    <span className="text-[14px] text-gray">Нет в наличии</span>
                  )}
                </div>
              </div>

              {medication.description && (
                <p className="text-dark text-[14px] leading-relaxed mt-4 text-gray">
                  {medication.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pharmacy list */}
        <h2 className="text-dark text-[18px] md:text-[20px] font-semibold mb-4">
          Где купить
        </h2>

        {medication.stocks.length === 0 ? (
          <div className="text-center py-12 text-gray border border-gray-border rounded-[4px]">
            <p className="text-[16px]">Нет данных об аптеках</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {medication.stocks.map((entry) => {
              const scarcityPct = entry.inStock
                ? Math.max(5, Math.round((entry.quantity / entry.maxQuantity) * 100))
                : 0
              const scarcityColor =
                scarcityPct > 50 ? "#29a373" : scarcityPct > 20 ? "#f59e0b" : "#ef4444"

              return (
                <Link
                  key={entry.pharmacyId}
                  href={`/pharmacy/${entry.pharmacyId}/product/${medication.id}`}
                  className="flex items-center gap-3 md:gap-5 border border-gray-border rounded-[4px] p-3 md:p-4 hover:border-brand hover:shadow-sm transition-all group"
                >
                  {/* Pharmacy logo */}
                  <div className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] shrink-0 border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center overflow-hidden">
                    {entry.pharmacy.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.pharmacy.logoUrl}
                        alt={entry.pharmacy.name}
                        className="w-full h-full object-contain p-0.5"
                      />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                        <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>

                  {/* Pharmacy info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-dark text-[15px] font-semibold group-hover:text-brand transition-colors truncate mb-0.5">
                      {entry.pharmacy.name}
                    </p>
                    <p className="text-gray text-[13px] truncate mb-2">
                      {entry.pharmacy.city}, {entry.pharmacy.address}
                    </p>
                    <div className="hidden sm:flex items-center gap-3">
                      <div className="flex-1 max-w-[160px] h-[6px] bg-gray-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${scarcityPct}%`, backgroundColor: scarcityColor }}
                        />
                      </div>
                      <span className="text-[13px] font-medium shrink-0" style={{ color: scarcityColor }}>
                        {entry.inStock ? `${entry.quantity} шт.` : "Нет"}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <p className="text-dark text-[18px] md:text-[20px] font-semibold">
                      {Number(entry.price).toFixed(2)} р.
                    </p>
                    {entry.inStock ? (
                      <span className="text-[13px] text-brand font-medium">Подробнее →</span>
                    ) : (
                      <span className="text-[13px] text-gray">Нет в наличии</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
