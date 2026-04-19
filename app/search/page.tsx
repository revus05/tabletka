import Link from "next/link"
import { Footer } from "@/components/footer"
import { searchMedications } from "@/lib/queries/search"
import { SearchMobileFilters } from "@/components/search-mobile-filters"

type SearchPageProps = {
  searchParams: Promise<{ q?: string; region?: string; inStock?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q ?? ""
  const region = params.region
  const inStock = params.inStock === "true"

  const results = await searchMedications({ q: query, region, inStock })
  const regions = ["Все регионы", "Минск", "Гомель", "Витебск", "Гродно", "Брест", "Могилёв"]

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1200px] px-4 md:px-5 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-gray mb-5 flex-wrap">
          <Link href="/" className="hover:text-brand">Главная</Link>
          <span>/</span>
          <span className="text-dark truncate max-w-[200px]">Поиск: {query}</span>
        </nav>

        <div className="flex gap-6">
          {/* ── Sidebar filters — desktop only ── */}
          <aside className="hidden md:block w-[250px] shrink-0">
            <form method="GET" action="/search">
              {query && <input type="hidden" name="q" value={query} />}
              <div className="bg-gray-bg rounded-[4px] p-5 mb-4">
                <h3 className="text-dark text-[16px] font-semibold mb-4">Регион</h3>
                <div className="flex flex-col gap-2">
                  {regions.map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="region"
                        value={r}
                        defaultChecked={region ? region === r : r === "Все регионы"}
                        className="accent-brand"
                      />
                      <span className="text-[15px] text-dark group-hover:text-brand transition-colors">
                        {r}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-bg rounded-[4px] p-5 mb-4">
                <h3 className="text-dark text-[16px] font-semibold mb-4">Наличие</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    value="true"
                    defaultChecked={inStock}
                    className="accent-brand"
                  />
                  <span className="text-[15px] text-dark">Только в наличии</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-[40px] bg-brand text-white text-[15px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors"
              >
                Применить
              </button>
            </form>
          </aside>

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h1 className="text-dark text-[20px] md:text-[24px] font-semibold min-w-0">
                {query ? (
                  <>«{query}»<span className="text-gray text-[16px] md:text-[18px] ml-2 font-normal">— {results.length} аптек</span></>
                ) : (
                  "Результаты поиска"
                )}
              </h1>
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <SearchMobileFilters
                  query={query}
                  region={region}
                  inStock={inStock}
                  regions={regions}
                />
                <div className="flex items-center gap-2 text-[15px]">
                  <span className="text-gray hidden sm:inline">Сортировка:</span>
                  <select className="border border-gray-border rounded-[4px] px-2 md:px-3 py-1.5 text-dark text-[14px] md:text-[15px] outline-none focus:border-brand">
                    <option>По цене (возр.)</option>
                    <option>По цене (убыв.)</option>
                    <option>По наличию</option>
                  </select>
                </div>
              </div>
            </div>

            {results.length === 0 && query && (
              <div className="text-center py-16 text-gray">
                <p className="text-[18px] mb-2">Ничего не найдено</p>
                <p className="text-[15px]">Попробуйте изменить запрос или фильтры</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {results.map((result) => {
                const scarcityPct = result.inStock
                  ? Math.max(5, Math.round((result.quantity / result.maxQuantity) * 100))
                  : 0
                const scarcityColor =
                  scarcityPct > 50 ? "#29a373" : scarcityPct > 20 ? "#f59e0b" : "#ef4444"

                return (
                  <Link
                    key={result.id}
                    href={`/pharmacy/${result.pharmacyId}/product/${result.medicationId}`}
                    className="flex items-start gap-3 md:gap-5 bg-white border border-gray-border rounded-[4px] p-3 md:p-5 hover:border-brand hover:shadow-sm transition-all group"
                  >
                    <div className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] shrink-0 border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center overflow-hidden">
                      {result.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.logoUrl} alt={result.pharmacyName} className="w-full h-full object-contain p-1" />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                          <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                          <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-dark text-[13px] text-gray mb-0.5 truncate">{result.medicationName}</p>
                      <p className="text-dark text-[15px] md:text-[16px] font-semibold leading-snug mb-1 group-hover:text-brand transition-colors">
                        {result.pharmacyName}
                      </p>
                      <p className="text-gray text-[13px] md:text-[14px] mb-2 truncate">{result.address}</p>

                      <div className="hidden sm:flex items-center gap-3">
                        <span className="text-[13px] text-gray shrink-0">Наличие:</span>
                        <div className="flex-1 max-w-[180px] h-[6px] bg-gray-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${scarcityPct}%`, backgroundColor: scarcityColor }}
                          />
                        </div>
                        <span className="text-[13px] font-semibold shrink-0" style={{ color: scarcityColor }}>
                          {result.inStock ? `${result.quantity} шт.` : "Нет"}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <p className="text-dark text-[18px] md:text-[22px] font-semibold">
                        {result.price.toFixed(2)} р.
                      </p>
                      {result.inStock ? (
                        <span className="inline-flex items-center justify-center h-[34px] md:h-[36px] px-3 md:px-5 bg-brand text-white text-[13px] md:text-[15px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors whitespace-nowrap">
                          Подробнее
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center h-[34px] md:h-[36px] px-3 md:px-5 bg-gray-bg text-gray text-[13px] md:text-[15px] rounded-[4px] whitespace-nowrap">
                          Нет в наличии
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
