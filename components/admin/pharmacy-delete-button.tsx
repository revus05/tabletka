"use client"

import { deletePharmacyAction } from "@/lib/actions/pharmacies"

export function PharmacyDeleteButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={async () => {
        await deletePharmacyAction(id)
      }}
    >
      <button
        type="submit"
        className="text-error hover:text-red-700 font-semibold"
        onClick={(e) => {
          if (!confirm(`Удалить аптеку "${name}"?`)) e.preventDefault()
        }}
      >
        Удалить
      </button>
    </form>
  )
}
