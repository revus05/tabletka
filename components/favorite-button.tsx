"use client"

import { useFavorites } from "./favorites-context"
import { useRouter } from "next/navigation"

type FavoriteButtonProps = {
  medicationId: number
  showLabel?: boolean
  size?: "sm" | "md"
}

export function FavoriteButton({ medicationId, showLabel = false, size = "md" }: FavoriteButtonProps) {
  const { isInFavorites, toggleFavorite } = useFavorites()
  const router = useRouter()
  const isFavorite = isInFavorites(medicationId)

  const iconSize = size === "sm" ? 18 : 22

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const result = await toggleFavorite(medicationId)
    if (result.error) {
      router.push("/auth/login")
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-1.5 transition-colors ${
        isFavorite ? "text-red-500" : "text-gray hover:text-red-500"
      }`}
      title={isFavorite ? "Убрать из аптечки" : "Добавить в аптечку"}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {showLabel && (
        <span className="text-[13px]">
          {isFavorite ? "В аптечке" : "В аптечку"}
        </span>
      )}
    </button>
  )
}
