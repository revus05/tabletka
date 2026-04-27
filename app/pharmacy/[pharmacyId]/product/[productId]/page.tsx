import { notFound } from "next/navigation"
import Link from "next/link"
import { FavoriteButton } from "@/components/favorite-button"
import { BookingForm } from "@/components/booking-form"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

type ProductPageProps = {
  params: Promise<{ pharmacyId: string; productId: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { pharmacyId, productId } = await params

  const stock = await prisma.stock.findUnique({
    where: {
      medicationId_pharmacyId: {
        medicationId: Number(productId),
        pharmacyId: Number(pharmacyId),
      },
    },
    include: {
      medication: true,
      pharmacy: true,
    },
  })

  if (!stock) notFound()

  const [otherStocks, session] = await Promise.all([
    prisma.stock.findMany({
      where: {
        medicationId: Number(productId),
        pharmacyId: { not: Number(pharmacyId) },
        inStock: true,
      },
      include: { pharmacy: true },
      orderBy: { price: "asc" },
      take: 5,
    }),
    getSession(),
  ])

  // Fetch user data if logged in
  const user = session
    ? await prisma.user.findUnique({
        where: { id: Number(session.sub) },
        select: { name: true, email: true, phone: true },
      })
    : null

  const { medication, pharmacy } = stock

  const mapSrc = pharmacy.latitude && pharmacy.longitude
    ? `https://yandex.ru/map-widget/v1/?ll=${pharmacy.longitude},${pharmacy.latitude}&z=16&pt=${pharmacy.longitude},${pharmacy.latitude},pm2rdm&lang=ru_RU`
    : `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(`${pharmacy.city}, ${pharmacy.address}`)}&z=16&lang=ru_RU`

  const scarcityPct = stock.inStock
    ? Math.max(5, Math.round((stock.quantity / stock.maxQuantity) * 100))
    : 0
  const scarcityColor =
    scarcityPct > 50 ? "#29a373" : scarcityPct > 20 ? "#f59e0b" : "#ef4444"

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1200px] px-5 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-gray mb-5 flex-wrap">
          <Link href="/" className="hover:text-brand">Главная</Link>
          <span>/</span>
          <Link href={`/search?q=${encodeURIComponent(medication.name)}`} className="hover:text-brand">
            {medication.name}
          </Link>
          <span>/</span>
          <span className="text-dark">{pharmacy.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">
          {/* ── Main content ── */}
          <div className="flex flex-col gap-6">
            {/* Product card */}
            <div className="border border-gray-border rounded-[4px] p-6">
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                {/* Image */}
                <div className="w-full sm:w-[200px] h-[180px] sm:h-[200px] sm:shrink-0 border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center overflow-hidden">
                  {medication.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={medication.imageUrl} alt={medication.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="30" fill="#eaf6f1" />
                      <path d="M20 32h24M32 20v24" stroke="#29a373" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-dark text-[24px] font-semibold mb-2">{medication.name}</h1>

                  {medication.genericName && (
                    <p className="text-gray text-[14px] mb-1">МНН: {medication.genericName}</p>
                  )}
                  {medication.manufacturer && (
                    <p className="text-gray text-[14px] mb-4">Производитель: {medication.manufacturer}</p>
                  )}

                  {/* Price */}
                  <div className="flex items-end gap-3 mb-4">
                    <span className="text-dark text-[32px] font-semibold">{Number(stock.price).toFixed(2)} р.</span>
                    {stock.inStock ? (
                      <span className="text-brand text-[15px] font-semibold mb-1">В наличии</span>
                    ) : (
                      <span className="text-error text-[15px] font-semibold mb-1">Нет в наличии</span>
                    )}
                  </div>

                  {/* Scarcity */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[14px] text-gray">Дефицитность</span>
                      <span className="text-[14px] font-semibold" style={{ color: scarcityColor }}>
                        {stock.inStock ? `${stock.quantity} шт. в наличии` : "Нет в наличии"}
                      </span>
                    </div>
                    <div className="h-[8px] bg-gray-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${scarcityPct}%`, backgroundColor: scarcityColor }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[12px] text-gray">Редкий товар</span>
                      <span className="text-[12px] text-gray">В наличии везде</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {stock.inStock && (
                      <BookingForm
                        pharmacyId={pharmacy.id}
                        pharmacyName={pharmacy.name}
                        medicationId={medication.id}
                        medicationName={medication.name}
                        price={Number(stock.price)}
                        maxQuantity={stock.quantity}
                        user={user}
                      />
                    )}
                    <a
                      href="#pharmacy-map"
                      className="h-[44px] px-6 border border-brand text-brand text-[16px] font-semibold rounded-[4px] hover:bg-brand-light transition-colors flex items-center"
                    >
                      На карте
                    </a>
                    <FavoriteButton medicationId={medication.id} showLabel />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {medication.description && (
              <div className="border border-gray-border rounded-[4px] p-6">
                <h2 className="text-dark text-[18px] font-semibold mb-3">Описание</h2>
                <p className="text-dark text-[15px] leading-relaxed">{medication.description}</p>
              </div>
            )}

            {/* Other pharmacies */}
            {otherStocks.length > 0 && (
              <div>
                <h2 className="text-dark text-[20px] font-semibold mb-4">
                  Также в других аптеках
                </h2>
                <div className="flex flex-col gap-3">
                  {otherStocks.map((s) => (
                    <Link
                      key={s.pharmacyId}
                      href={`/pharmacy/${s.pharmacyId}/product/${productId}`}
                      className="flex items-center justify-between border border-gray-border rounded-[4px] p-3 md:p-4 hover:border-brand transition-colors gap-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-[48px] h-[48px] border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center shrink-0 overflow-hidden">
                          {s.pharmacy.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={s.pharmacy.logoUrl} alt={s.pharmacy.name} className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                              <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                              <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                        <p className="text-dark text-[15px] font-semibold">{s.pharmacy.name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-dark text-[18px] font-semibold">{Number(s.price).toFixed(2)} р.</span>
                        <span className="text-brand text-[14px] font-semibold">Подробнее →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div id="pharmacy-map" className="border border-gray-border rounded-[4px] overflow-hidden">
              <div className="px-6 pt-5 pb-4">
                <h2 className="text-dark text-[18px] font-semibold">На карте</h2>
                <p className="text-gray text-[14px] mt-1">{pharmacy.city}, {pharmacy.address}</p>
              </div>
              <iframe
                  src={mapSrc}
                  width="100%"
                  height="360"
                  frameBorder="0"
                  allowFullScreen
                  title="Карта аптеки"
                  className="block"
              />
            </div>
          </div>

          {/* ── Sidebar: Pharmacy info ── */}
          <aside className="flex flex-col gap-4">
            <div className="border border-gray-border rounded-[4px] p-5 md:sticky md:top-[144px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[48px] h-[48px] border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center shrink-0 overflow-hidden">
                  {pharmacy.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pharmacy.logoUrl} alt={pharmacy.name} className="w-full h-full object-contain p-0.5" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                      <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <h3 className="text-dark text-[16px] font-semibold">{pharmacy.name}</h3>
              </div>

              <div className="flex flex-col gap-3 text-[14px]">
                <div className="flex gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                    <path d="M8 1C5.24 1 3 3.24 3 6c0 4.25 5 9 5 9s5-4.75 5-9c0-2.76-2.24-5-5-5z" fill="#29a373" />
                  </svg>
                  <span className="text-dark">{pharmacy.city}, {pharmacy.address}</span>
                </div>

                {pharmacy.phone && (
                  <div className="flex gap-2 items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path d="M12 10.5c-.7 0-1.4-.1-2-.3-.3-.1-.6 0-.8.2l-1.2 1.2C6.1 10.6 5.4 9.9 4.4 8.9L5.6 7.7c.2-.2.3-.5.2-.8C5.6 6.4 5.5 5.7 5.5 5c0-.5-.4-.9-.9-.9H3c-.6 0-1 .4-1 1C2 10.4 5.6 14 10.9 14c.6 0 1-.4 1-1v-1.6c0-.5-.4-.9-.9-.9z" fill="#29a373" />
                    </svg>
                    <a href={`tel:${pharmacy.phone}`} className="text-brand hover:underline">
                      {pharmacy.phone}
                    </a>
                  </div>
                )}

                <div className="flex gap-2 items-start">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                    <circle cx="8" cy="8" r="6.5" stroke="#29a373" strokeWidth="1.5" />
                    <path d="M8 5v3.5l2 2" stroke="#29a373" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="text-gray">Пн–Пт 8:00–20:00, Сб–Вс 9:00–18:00</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-border">
                <a href="#pharmacy-map" className="text-[13px] text-gray mb-2 block">На карте ↓</a>
                <div className="rounded-[4px] overflow-hidden">
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="160"
                    frameBorder="0"
                    allowFullScreen
                    title="Мини-карта аптеки"
                    className="block"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
