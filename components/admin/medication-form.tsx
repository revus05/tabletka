"use client"

import { useActionState, useState } from "react"
import { ImageUpload } from "./image-upload"
import type { ActionResult } from "@/lib/actions/medications"

type MedicationFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>
  defaultValues?: {
    name?: string
    genericName?: string
    manufacturer?: string
    imageUrl?: string
    description?: string
  }
}

export function MedicationForm({ action, defaultValues = {} }: MedicationFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl ?? "")

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
          placeholder="Синупрет таблетки"
          className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] outline-none focus:border-[#29a373] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#2b2b2b]">МНН (генерическое название)</label>
        <input
          type="text"
          name="genericName"
          defaultValue={defaultValues.genericName}
          placeholder="Экстракт травы вербены"
          className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] outline-none focus:border-[#29a373] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#2b2b2b]">Производитель</label>
        <input
          type="text"
          name="manufacturer"
          defaultValue={defaultValues.manufacturer}
          placeholder="Bionorica SE, Германия"
          className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] outline-none focus:border-[#29a373] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#2b2b2b]">Описание</label>
        <textarea
          name="description"
          defaultValue={defaultValues.description}
          rows={4}
          placeholder="Описание препарата..."
          className="px-3 py-2 border border-[#e5eaeb] rounded-[4px] text-[15px] outline-none focus:border-[#29a373] transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#2b2b2b]">Изображение</label>
        <ImageUpload
          name="imageUrl"
          value={imageUrl}
          onChange={setImageUrl}
          folder="medications"
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
          href="/admin/medications"
          className="h-[44px] px-6 border border-[#e5eaeb] text-[#7a7a7a] text-[15px] font-semibold rounded-[4px] hover:border-[#29a373] hover:text-[#29a373] transition-colors flex items-center"
        >
          Отмена
        </a>
      </div>
    </form>
  )
}
