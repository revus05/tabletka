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
        <label className="text-[14px] font-semibold text-[#2b2b2b]">Название *</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={defaultValues.name}
          placeholder="Белфармация Аптека N25"
          className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] outline-none focus:border-[#29a373] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#2b2b2b]">Адрес *</label>
        <input
          type="text"
          name="address"
          required
          defaultValue={defaultValues.address}
          placeholder="ул. Ленина, 1"
          className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] outline-none focus:border-[#29a373] transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-[#2b2b2b]">Город *</label>
          <input
            type="text"
            name="city"
            required
            defaultValue={defaultValues.city}
            placeholder="Минск"
            className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] outline-none focus:border-[#29a373] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-[#2b2b2b]">Регион *</label>
          <select
            name="region"
            required
            defaultValue={defaultValues.region}
            className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] outline-none focus:border-[#29a373] transition-colors bg-white"
          >
            <option value="">Выберите регион</option>
            {["Минск", "Гомель", "Витебск", "Гродно", "Брест", "Могилёв", "Минская область"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#2b2b2b]">Телефон</label>
        <input
          type="text"
          name="phone"
          defaultValue={defaultValues.phone}
          placeholder="+375 17 123 45 67"
          className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] outline-none focus:border-[#29a373] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#2b2b2b]">Логотип</label>
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
          className="h-[44px] px-8 bg-[#29a373] text-white text-[16px] font-semibold rounded-[4px] hover:bg-[#196346] transition-colors disabled:opacity-60"
        >
          {isPending ? "Сохранение..." : "Сохранить"}
        </button>
        <a
          href="/admin/pharmacies"
          className="h-[44px] px-6 border border-[#e5eaeb] text-[#7a7a7a] text-[15px] font-semibold rounded-[4px] hover:border-[#29a373] hover:text-[#29a373] transition-colors flex items-center"
        >
          Отмена
        </a>
      </div>
    </form>
  )
}
