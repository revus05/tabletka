"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

export async function addToFavorites(medicationId: number) {
  const session = await getSession()
  if (!session) {
    return { error: "Необходимо войти в аккаунт" }
  }

  try {
    await prisma.favorite.create({
      data: {
        userId: Number(session.sub),
        medicationId,
      },
    })
    revalidatePath("/")
    revalidatePath("/favorites")
    return { success: true }
  } catch {
    // Already exists
    return { success: true }
  }
}

export async function removeFromFavorites(medicationId: number) {
  const session = await getSession()
  if (!session) {
    return { error: "Необходимо войти в аккаунт" }
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: Number(session.sub),
      medicationId,
    },
  })
  revalidatePath("/")
  revalidatePath("/favorites")
  return { success: true }
}

export async function getUserFavorites() {
  const session = await getSession()
  if (!session) {
    return []
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: Number(session.sub) },
    select: { medicationId: true },
  })

  return favorites.map(f => f.medicationId)
}
