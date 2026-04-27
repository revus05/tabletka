"use client"

type SearchFiltersProps = {
  query: string
  region?: string
  inStock: boolean
  regions: string[]
}

export function SearchFilters({ query, region, inStock, regions }: SearchFiltersProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const selectedRegions = formData.getAll("region") as string[]

    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (selectedRegions.length > 0) params.set("region", selectedRegions.join(","))
    if (formData.get("inStock")) params.set("inStock", "true")

    window.location.href = `/search?${params.toString()}`
  }

  return (
    <aside className="hidden md:block w-[250px] shrink-0">
      <form method="GET" action="/search" onSubmit={handleSubmit}>
        {query && <input type="hidden" name="q" value={query} />}
        <div className="bg-gray-bg rounded-[4px] p-5 mb-4">
          <h3 className="text-dark text-[16px] font-semibold mb-4">Регион</h3>
          <div className="flex flex-col gap-2">
            {regions.filter(r => r !== "Все регионы").map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="region"
                  value={r}
                  defaultChecked={region ? region.split(",").filter(Boolean).includes(r) : false}
                  className="accent-brand w-4 h-4"
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
  )
}
