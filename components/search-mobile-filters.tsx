"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type Props = {
  query: string;
  region?: string;
  inStock: boolean;
  regions: string[];
};

export function SearchMobileFilters({ query, region, inStock, regions }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 h-[40px] px-4 border border-brand text-brand text-[15px] font-semibold rounded-[4px] hover:bg-brand-light transition-colors md:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Фильтры
        </button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-left">Фильтры</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6 overflow-y-auto">
          <form
            method="GET"
            action="/search"
            onSubmit={(e) => {
              // Combine selected regions into comma-separated string
              const formData = new FormData(e.currentTarget)
              const selectedRegions = formData.getAll("region") as string[]

              // Create new URL params
              const params = new URLSearchParams()
              if (query) params.set("q", query)
              if (selectedRegions.length > 0) {
                params.set("region", selectedRegions.join(","))
              }

              const inStockCheckbox = formData.get("inStock")
              if (inStockCheckbox) params.set("inStock", "true")

              // Navigate with updated params
              window.location.href = `/search?${params.toString()}`
              setOpen(false)
              e.preventDefault()
            }}
          >
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
                    <span className="text-[15px] text-dark group-hover:text-brand transition-colors">{r}</span>
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
              className="w-full h-[44px] bg-brand text-white text-[15px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors"
            >
              Применить
            </button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
