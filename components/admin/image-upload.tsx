"use client"

import { useState, useRef } from "react"

type ImageUploadProps = {
  value: string
  onChange: (url: string) => void
  folder: "medications" | "pharmacies"
  name: string
}

export function ImageUpload({ value, onChange, folder, name }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError(null)
    const formData = new FormData()
    formData.set("file", file)
    formData.set("folder", folder)

    const res = await fetch("/api/upload", { method: "POST", body: formData })
    const data = await res.json()
    setUploading(false)

    if (!res.ok) {
      setError(data.error ?? "Ошибка загрузки")
      return
    }
    onChange(data.url)
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={value} />

      {value && (
        <div className="relative w-[120px] h-[120px] border border-[#e5eaeb] rounded-[4px] overflow-hidden bg-[#f5f5f5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-contain p-1" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 w-5 h-5 bg-[#ef4444] text-white rounded-full text-[11px] flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="h-[40px] px-4 border border-dashed border-[#29a373] text-[#29a373] text-[14px] rounded-[4px] hover:bg-[#eaf6f1] transition-colors disabled:opacity-60 w-fit"
      >
        {uploading ? "Загружается..." : value ? "Заменить изображение" : "Загрузить изображение"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />

      {error && <p className="text-[13px] text-[#ef4444]">{error}</p>}
    </div>
  )
}
