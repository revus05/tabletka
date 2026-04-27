import Link from "next/link"
import { FavoriteButton } from "@/components/favorite-button"
import { searchMedications } from "@/lib/queries/search"
import { SearchMobileFilters } from "@/components/search-mobile-filters"
import { SearchFilters } from "@/components/search-filters"

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
          <span className="text-dark truncate max-w-[200px]">
            {query ? `Поиск: ${query}` : "Все товары"}
          </span>
        </nav>

        <div className="flex gap-6">
          {/* ── Sidebar filters — desktop only ── */}
          <SearchFilters query={query} region={region} inStock={inStock} regions={regions} />

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h1 className="text-dark text-[20px] md:text-[24px] font-semibold min-w-0">
                {query ? (
                  <>«{query}»<span className="text-gray text-[16px] md:text-[18px] ml-2 font-normal">— {results.length} товаров</span></>
                ) : (
                  <>Все товары<span className="text-gray text-[16px] md:text-[18px] ml-2 font-normal">— {results.length} позиций</span></>
                )}
              </h1>
              <div className="flex items-center gap-2">
                <SearchMobileFilters
                  query={query}
                  region={region}
                  inStock={inStock}
                  regions={regions}
                />
              </div>
            </div>

            {results.length === 0 && (
              <div className="text-center py-16 text-gray">
                <p className="text-[18px] mb-2">Ничего не найдено</p>
                <p className="text-[15px]">Попробуйте изменить запрос или фильтры</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {results.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center gap-3 md:gap-5 bg-white border border-gray-border rounded-[4px] p-3 md:p-5 hover:border-brand hover:shadow-sm transition-all group relative"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton medicationId={med.id} size="sm" />
                  </div>
                  <Link
                    href={`/product/${med.id}${query ? `?from=${encodeURIComponent(query)}` : ""}`}
                    className="flex items-center gap-3 md:gap-5 flex-1"
                  >
                    {/* Image */}
                    <div className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] shrink-0 border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center overflow-hidden">
                      {med.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={med.imageUrl} alt={med.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                          <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                          <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-dark text-[15px] md:text-[16px] font-semibold leading-snug mb-0.5 group-hover:text-brand transition-colors truncate">
                        {med.name}
                      </p>
                      {med.genericName && (
                        <p className="text-gray text-[13px] truncate mb-1">{med.genericName}</p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[13px] text-gray">
                          {med.pharmacyCount} {med.pharmacyCount === 1 ? "аптека" : med.pharmacyCount < 5 ? "аптеки" : "аптек"}
                        </span>
                        {med.anyInStock ? (
                          <span className="text-[13px] text-brand font-medium">В наличии</span>
                        ) : (
                          <span className="text-[13px] text-gray">Нет в наличии</span>
                        )}
                      </div>
                    </div>

                    {/* Price + button */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      {med.minPrice !== null && (
                        <div className="text-right">
                          <p className="text-gray text-[12px]">от</p>
                          <p className="text-dark text-[18px] md:text-[22px] font-semibold">
                            {med.minPrice.toFixed(2)} р.
                          </p>
                        </div>
                      )}
                      <span className="inline-flex items-center justify-center h-[34px] md:h-[36px] px-3 md:px-5 bg-brand text-white text-[13px] md:text-[15px] font-semibold rounded-[4px] group-hover:bg-brand-hover transition-colors whitespace-nowrap">
                        Подробнее
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
