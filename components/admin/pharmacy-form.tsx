"use client"

import { useActionState, useState } from "react"
import { ImageUpload } from "./image-upload"
import type { ActionResult } from "@/lib/actions/pharmacies"

type PharmacyFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>
  defaultValues?: {
    name?: string
    address?: string
    city?: string
    region?: string
    phone?: string
    logoUrl?: string
  }
}

export function PharmacyForm({ action, defaultValues = {} }: PharmacyFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)
  const [logoUrl, setLogoUrl] = useState(defaultValues.logoUrl ?? "")

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-[600px]">
      {state && "error" in state && (
        <div className="bg-red-50 border border-red-200 rounded-[4px] p-3 text-red-700 text-[14px]">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-dark">Название *</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={defaultValues.name}
          placeholder="Белфармация Аптека N25"
          className="h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] outline-none focus:border-brand transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-dark">Адрес *</label>
        <input
          type="text"
          name="address"
          required
          defaultValue={defaultValues.address}
          placeholder="ул. Ленина, 1"
          className="h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] outline-none focus:border-brand transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-dark">Город *</label>
          <input
            type="text"
            name="city"
            required
            defaultValue={defaultValues.city}
            placeholder="Минск"
            className="h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] outline-none focus:border-brand transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-dark">Регион *</label>
          <select
            name="region"
            required
            defaultValue={defaultValues.region}
            className="h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] outline-none focus:border-brand transition-colors bg-white"
          >
            <option value="">Выберите регион</option>
            {["Минск", "Гомель", "Витебск", "Гродно", "Брест", "Могилёв", "Минская область"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-dark">Телефон</label>
        <input
          type="text"
          name="phone"
          defaultValue={defaultValues.phone}
          placeholder="+375 17 123 45 67"
          className="h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] outline-none focus:border-brand transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-dark">Логотип</label>
        <ImageUpload
          name="logoUrl"
          value={logoUrl}
          onChange={setLogoUrl}
          folder="pharmacies"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="h-[44px] px-8 bg-brand text-white text-[16px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors disabled:opacity-60"
        >
          {isPending ? "Сохранение..." : "Сохранить"}
        </button>
        <a
          href="/admin/pharmacies"
          className="h-[44px] px-6 border border-gray-border text-gray text-[15px] font-semibold rounded-[4px] hover:border-brand hover:text-brand transition-colors flex items-center"
        >
          Отмена
        </a>
      </div>
    </form>
  )
}
