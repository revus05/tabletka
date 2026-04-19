"use client"

import { useActionState } from "react"
import type { ActionResult } from "@/lib/actions/stock"

type Pharmacy = { id: number; name: string; city: string }
type Medication = { id: number; name: string }

type StockFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>
  pharmacies: Pharmacy[]
  medications: Medication[]
  defaultValues?: {
    medicationId?: number
    pharmacyId?: number
    price?: number
    quantity?: number
    maxQuantity?: number
    inStock?: boolean
  }
}

export function StockForm({ action, pharmacies, medications, defaultValues = {} }: StockFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-[600px]">
      {state && "error" in state && (
        <div className="bg-red-50 border border-red-200 rounded-[4px] p-3 text-red-700 text-[14px]">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-dark">Лекарство *</label>
        <select
          name="medicationId"
          required
          defaultValue={defaultValues.medicationId}
          className="h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] outline-none focus:border-brand transition-colors bg-white"
        >
          <option value="">Выберите лекарство</option>
          {medications.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-dark">Аптека *</label>
        <select
          name="pharmacyId"
          required
          defaultValue={defaultValues.pharmacyId}
          className="h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] outline-none focus:border-brand transition-colors bg-white"
        >
          <option value="">Выберите аптеку</option>
          {pharmacies.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-dark">Цена (руб.) *</label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0.01"
            required
            defaultValue={defaultValues.price}
            placeholder="9.90"
            className="h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] outline-none focus:border-brand transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-dark">Кол-во *</label>
          <input
            type="number"
            name="quantity"
            min="0"
            required
            defaultValue={defaultValues.quantity ?? 0}
            className="h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] outline-none focus:border-brand transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-dark">Макс. кол-во</label>
          <input
            type="number"
            name="maxQuantity"
            min="1"
            required
            defaultValue={defaultValues.maxQuantity ?? 100}
            className="h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] outline-none focus:border-brand transition-colors"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="inStock"
          value="on"
          defaultChecked={defaultValues.inStock ?? true}
          className="w-4 h-4 accent-brand"
        />
        <span className="text-[15px] text-dark font-semibold">В наличии</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="h-[44px] px-8 bg-brand text-white text-[16px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors disabled:opacity-60"
        >
          {isPending ? "Сохранение..." : "Сохранить"}
        </button>
        <a
          href="/admin/stock"
          className="h-[44px] px-6 border border-gray-border text-gray text-[15px] font-semibold rounded-[4px] hover:border-brand hover:text-brand transition-colors flex items-center"
        >
          Отмена
        </a>
      </div>
    </form>
  )
}
