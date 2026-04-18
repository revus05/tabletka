import Link from "next/link"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/prisma"
// Header is rendered in app/layout.tsx

// ─── Static data ──────────────────────────────────────────────────────────────

const articles = [
  { id: 1, title: "Apteka.by — заказ лекарств, БАДов и аптечной косметики по всей Беларуси" },
  { id: 2, title: "Средства снижающие проницаемость капилляров" },
  { id: 3, title: "Невидимый за 1 секунду" },
  { id: 4, title: "Болеть — не наша традиция!" },
  { id: 5, title: "Следуй за весной" },
  { id: 6, title: "Зачем коже лица нужен ретинол" },
  { id: 7, title: "Как защититься от клещей" },
  { id: 8, title: "Витамины группы B и зачем мы их пьем" },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [popularSearches, promotions, newsItems, pharmacies] = await Promise.all([
    prisma.popularSearch.findMany({
      include: { medication: true },
      orderBy: { searchCount: "desc" },
      take: 10,
    }),
    prisma.promotion.findMany({
      include: { pharmacy: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    prisma.pharmacy.findMany({
      include: { stocks: { select: { price: true } } },
      take: 5,
    }),
  ])

  const newInDirectory = popularSearches.slice(0, 8).map((s) => s.medication.name)

  const priceLeaders = pharmacies
    .map((p) => {
      const prices = p.stocks.map((s) => Number(s.price))
      const avg = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0
      return { name: p.name, address: `${p.city}, ${p.address}`, price: `${avg.toFixed(2)} р.` }
    })
    .sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* ── Hero ── */}
        <section className="mx-auto max-w-[1200px] px-5 py-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left: BAD delivery banner */}
            <div className="relative overflow-hidden bg-[#29a373] rounded-[4px] p-8 min-h-[364px] flex flex-col justify-between">
              <div className="relative z-10">
                <h2 className="text-white text-[32px] font-semibold leading-tight mb-3">
                  Доставляем БАДы<br />на дом
                </h2>
                <p className="text-[#d4ede3] text-[15px] leading-relaxed max-w-[250px]">
                  Огромный выбор БАДов мировых брендов
                </p>
              </div>
              <Link
                href="#"
                className="relative z-10 inline-flex items-center justify-center bg-white text-[#29a373] font-semibold text-[16px] h-[40px] px-6 rounded-[4px] hover:bg-[#eaf6f1] transition-colors w-fit"
              >
                Подробнее
              </Link>
              <div className="absolute right-0 top-0 w-[200px] h-[200px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute right-20 bottom-0 w-[150px] h-[150px] bg-white/10 rounded-full translate-y-1/2" />
            </div>

            {/* Right: New in directory + 2 small banners */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#f5f5f5] rounded-[4px] p-5">
                <h3 className="text-[#2b2b2b] text-[18px] font-semibold mb-4">Новое в справочнике</h3>
                <div className="flex flex-wrap gap-2">
                  {newInDirectory.length > 0 ? newInDirectory.map((item) => (
                    <Link
                      key={item}
                      href={`/search?q=${encodeURIComponent(item)}`}
                      className="inline-flex items-center px-3 py-1.5 bg-white rounded-[4px] text-[14px] text-[#2b2b2b] hover:bg-[#eaf6f1] hover:text-[#29a373] transition-colors border border-[#e5eaeb]"
                    >
                      {item}
                    </Link>
                  )) : (
                    <p className="text-[#7a7a7a] text-[14px]">Пока пусто</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-[#29a373] rounded-[4px] p-4 flex flex-col justify-between min-h-[170px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#29a373] to-[#196346]" />
                  <div className="relative z-10">
                    <p className="text-[#d4ede3] text-[13px] font-semibold mb-2">tabletka.by</p>
                    <p className="text-white text-[16px] font-semibold leading-tight">
                      Заказывайте со склада
                    </p>
                    <p className="text-[#d4ede3] text-[13px] mt-1">и сэкономьте больше</p>
                  </div>
                </div>
                <div className="bg-[#eaf6f1] rounded-[4px] p-4 flex flex-col justify-between min-h-[170px]">
                  <p className="text-[#7a7a7a] text-[13px] font-semibold">АВЕН</p>
                  <p className="text-[#2b2b2b] text-[16px] font-semibold leading-tight">
                    Невидимый за 1 секунду
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Popular searches ── */}
        <section className="mx-auto max-w-[1200px] px-5 mb-6">
          <div className="bg-[#eaf6f1] rounded-[4px] p-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-4">
                <h2 className="text-[#2b2b2b] text-[20px] font-semibold">Популярные запросы</h2>
                <Link href="#" className="text-[#29a373] text-[15px] font-semibold hover:text-[#196346]">
                  Подробная статистика
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item, i) => (
                  <Link
                    key={item.id}
                    href={`/search?q=${encodeURIComponent(item.medication.name)}`}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[15px] transition-colors ${
                      i === 0
                        ? "bg-[#29a373] text-white"
                        : "bg-white text-[#2b2b2b] hover:bg-[#29a373] hover:text-white"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>{item.medication.name}</span>
                    <span className="opacity-60 text-[13px]">{item.searchCount}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="shrink-0 w-[200px] h-[130px] flex items-center justify-center opacity-60">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="55" stroke="#29a373" strokeWidth="2" opacity="0.3" />
                <circle cx="60" cy="60" r="40" fill="#29a373" opacity="0.15" />
                <path d="M40 60 Q60 30 80 60 Q60 90 40 60Z" fill="#29a373" opacity="0.4" />
                <circle cx="60" cy="60" r="12" fill="#29a373" opacity="0.6" />
              </svg>
            </div>
          </div>
        </section>

        {/* ── Articles / Materials ── */}
        <section className="mx-auto max-w-[1200px] px-5 mb-8">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-[#eaf6f1] rounded-[4px] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-[#2b2b2b] text-[18px] font-semibold mb-3">
                  Полезные<br />материалы
                </h3>
                <p className="text-[#7a7a7a] text-[14px] leading-relaxed">
                  Читайте статьи и новости о здоровье и будьте в курсе выгодных акций
                </p>
              </div>
              <Link href="#" className="inline-flex items-center justify-center h-[40px] px-4 bg-[#29a373] text-white text-[15px] font-semibold rounded-[4px] hover:bg-[#196346] transition-colors">
                Все материалы
              </Link>
            </div>
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} title={article.title} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {articles.slice(3, 5).map((article) => (
              <WideArticleCard key={article.id} title={article.title} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {articles.slice(5, 8).map((article) => (
              <ArticleCard key={article.id} title={article.title} tall />
            ))}
          </div>
        </section>

        {/* ── Pharmacy leaders ── */}
        {priceLeaders.length > 0 && (
          <section className="mx-auto max-w-[1200px] px-5 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <PharmacyLeaderTable
                title="Лидеры средних цен"
                subtitle="/ по всей Беларуси"
                items={priceLeaders}
              />
              <PharmacyLeaderTable
                title="Лидеры ассортимента"
                subtitle="/ по всей Беларуси"
                items={priceLeaders}
                activeIndex={0}
              />
            </div>
          </section>
        )}

        {/* ── Promotions ── */}
        {promotions.length > 0 && (
          <section className="mx-auto max-w-[1200px] px-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#2b2b2b] text-[24px] font-semibold">Акции аптечных сетей</h2>
              <Link href="#" className="text-[#29a373] text-[15px] font-semibold hover:text-[#196346]">
                Все акции
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="rounded-[4px] overflow-hidden border border-[#e5eaeb]">
                  <div className="h-[234px] bg-[#eaf6f1] flex items-center justify-center">
                    {promo.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[22px] font-bold text-[#29a373]">АКЦИЯ</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[#2b2b2b] text-[15px] font-semibold leading-snug mb-4">{promo.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#7a7a7a] text-[13px]">
                        {promo.endDate
                          ? `до ${new Date(promo.endDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}`
                          : ""}
                      </span>
                      <Link href="#" className="text-[#29a373] text-[15px] font-semibold hover:text-[#196346] flex items-center gap-1">
                        Подробнее
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── News ── */}
        {newsItems.length > 0 && (
          <section className="mx-auto max-w-[1200px] px-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#2b2b2b] text-[24px] font-semibold">Новости</h2>
              <Link href="#" className="text-[#29a373] text-[15px] font-semibold hover:text-[#196346]">
                Все новости
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {newsItems.map((item) => (
                <div key={item.id} className="rounded-[4px] overflow-hidden border border-[#e5eaeb] hover:border-[#29a373] transition-colors group">
                  <div className="h-[160px] bg-[#f5f5f5]">
                    {item.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[#7a7a7a] text-[13px] mb-2">
                      {new Date(item.publishedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p className="text-[#2b2b2b] text-[15px] font-semibold leading-snug mb-3 line-clamp-3">
                      {item.title}
                    </p>
                    <Link href="#" className="text-[#29a373] text-[15px] font-semibold hover:text-[#196346] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Подробнее
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── App download banner ── */}
        <section className="mx-auto max-w-[1200px] px-5 mb-8">
          <div className="bg-[#eaf6f1] rounded-[4px] p-10 relative overflow-hidden">
            <div className="relative z-10 max-w-[600px]">
              <h2 className="text-[#2b2b2b] text-[28px] font-semibold mb-6">
                Установите наше приложение
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6 text-[15px] text-[#2b2b2b]">
                <ul className="space-y-2">
                  {["Удобный поиск лекарств", "Бронирование лекарств в аптеке"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#29a373] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {["Отображение аптек на карте", "Мультипоиск лекарств в аптеках"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#29a373] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4">
                <a href="#" className="flex items-center gap-3 bg-[#2b2b2b] text-white px-5 py-3 rounded-[4px] hover:bg-black transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M3.18 23.76A2 2 0 0 0 5 24c.67 0 1.38-.18 2.01-.56l11.27-6.51-3.5-3.5L3.18 23.76zM22.72 9.32l-3.38-1.95-3.91 3.91 3.91 3.91 3.4-1.96A2.02 2.02 0 0 0 24 11.27a2.02 2.02 0 0 0-1.28-1.95zM1.05.29A2 2 0 0 0 .06 2v20a2 2 0 0 0 .99 1.71l.12.07 11.2-11.2v-.27L1.17.21l-.12.08zm14.59 8.14L4.43.76 3.18.04A2 2 0 0 0 1.05.29l11.32 11.32 3.27-3.27z" />
                  </svg>
                  <div>
                    <div className="text-[10px] text-gray-400">Доступно в</div>
                    <div className="text-[14px] font-semibold">Google Play</div>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 bg-[#2b2b2b] text-white px-5 py-3 rounded-[4px] hover:bg-black transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <div className="text-[10px] text-gray-400">Загрузить в</div>
                    <div className="text-[14px] font-semibold">App Store</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-[400px] flex items-end justify-center pb-0 opacity-20">
              <div className="w-[140px] h-[280px] bg-[#29a373] rounded-[20px] -rotate-12 mr-8 mb-4 shadow-xl" />
              <div className="w-[140px] h-[280px] bg-[#196346] rounded-[20px] rotate-6 shadow-xl" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ArticleCard({ title, tall = false }: { title: string; tall?: boolean }) {
  return (
    <div className="rounded-[4px] overflow-hidden border border-[#e5eaeb] hover:border-[#29a373] transition-colors group">
      <div className={`${tall ? "h-[232px]" : "h-[172px]"} bg-[#f5f5f5]`} />
      <div className="p-4">
        <p className="text-[#2b2b2b] text-[15px] font-semibold leading-snug mb-3 line-clamp-3">{title}</p>
        <Link href="#" className="text-[#29a373] text-[15px] font-semibold hover:text-[#196346] flex items-center gap-1">
          Подробнее
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

function WideArticleCard({ title }: { title: string }) {
  return (
    <div className="flex rounded-[4px] overflow-hidden border border-[#e5eaeb] hover:border-[#29a373] transition-colors">
      <div className="w-[282px] shrink-0 bg-[#f5f5f5] h-[172px]" />
      <div className="flex flex-col justify-between p-5 flex-1">
        <p className="text-[#2b2b2b] text-[16px] font-semibold leading-snug line-clamp-3">{title}</p>
        <Link href="#" className="text-[#29a373] text-[15px] font-semibold hover:text-[#196346] flex items-center gap-1">
          Подробнее
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

function PharmacyLeaderTable({
  title,
  subtitle,
  items,
  activeIndex,
}: {
  title: string
  subtitle: string
  items: { name: string; address: string; price: string }[]
  activeIndex?: number
}) {
  return (
    <div className="bg-[#f5f5f5] rounded-[4px] overflow-hidden">
      <div className="bg-[#29a373] px-7 py-3 flex items-center gap-2">
        <span className="text-white text-[20px] font-semibold">{title}</span>
        <span className="text-[#d4ede3] text-[15px] font-semibold">{subtitle}</span>
      </div>
      <div className="p-7 flex flex-col gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className={`bg-white flex gap-5 p-4 rounded-[4px] ${
              i === activeIndex ? "border border-[#29a373]" : ""
            }`}
          >
            <div className="w-[92px] h-[92px] shrink-0 border border-[#e5eaeb] rounded-[4px] bg-[#f5f5f5] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="text-[#2b2b2b] text-[16px] font-semibold leading-snug">{item.name}</p>
              <p className="text-[#7a7a7a] text-[15px] leading-relaxed line-clamp-2">{item.address}</p>
              <p className="text-[#2b2b2b] text-[16px] font-semibold">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-7 pb-4 text-right">
        <Link href="#" className="text-[#29a373] text-[15px] font-semibold hover:text-[#196346]">
          Подробная статистика
        </Link>
      </div>
    </div>
  )
}
