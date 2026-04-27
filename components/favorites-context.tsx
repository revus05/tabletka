"use client"

import { createContext, useContext, useState, useCallback, useOptimistic, useTransition, type ReactNode } from "react"
import { addToFavorites, removeFromFavorites } from "@/lib/actions/favorites"

type FavoritesContextType = {
  favorites: number[]
  isInFavorites: (medicationId: number) => boolean
  toggleFavorite: (medicationId: number) => Promise<{ error?: string }>
  isPending: boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({
  children,
  initialFavorites,
}: {
  children: ReactNode
  initialFavorites: number[]
}) {
  const [favorites, setFavorites] = useState<number[]>(initialFavorites)
  const [optimisticFavorites, setOptimisticFavorites] = useOptimistic(favorites)
  const [isPending, startTransition] = useTransition()

  const isInFavorites = useCallback(
    (medicationId: number) => optimisticFavorites.includes(medicationId),
    [optimisticFavorites]
  )

  const toggleFavorite = useCallback(
    async (medicationId: number): Promise<{ error?: string }> => {
      const isCurrentlyFavorite = favorites.includes(medicationId)

      startTransition(async () => {
        // Optimistic update
        setOptimisticFavorites((prev) =>
          isCurrentlyFavorite
            ? prev.filter((id) => id !== medicationId)
            : [...prev, medicationId]
        )

        const result = isCurrentlyFavorite
          ? await removeFromFavorites(medicationId)
          : await addToFavorites(medicationId)

        if (result.error) {
          // Revert on error
          return
        }

        // Update actual state
        setFavorites((prev) =>
          isCurrentlyFavorite
            ? prev.filter((id) => id !== medicationId)
            : [...prev, medicationId]
        )
      })

      return {}
    },
    [favorites, setOptimisticFavorites]
  )

  return (
    <FavoritesContext.Provider
      value={{ favorites: optimisticFavorites, isInFavorites, toggleFavorite, isPending }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider")
  }
  return context
}
