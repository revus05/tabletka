"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

export type BookingFormData = {
  pharmacyId: number
  medicationId: number
  quantity: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  notes?: string
}

export async function createBooking(data: BookingFormData) {
  const session = await getSession()
  if (!session) {
    return { error: "Необходимо войти в аккаунт" }
  }

  // Verify stock exists and is in stock
  const stock = await prisma.stock.findUnique({
    where: {
      medicationId_pharmacyId: {
        medicationId: data.medicationId,
        pharmacyId: data.pharmacyId,
      },
    },
  })

  if (!stock || !stock.inStock) {
    return { error: "Товар недоступен для бронирования" }
  }

  if (data.quantity > stock.quantity) {
    return { error: `Доступно только ${stock.quantity} шт.` }
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        userId: Number(session.sub),
        pharmacyId: data.pharmacyId,
        medicationId: data.medicationId,
        quantity: data.quantity,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        notes: data.notes || null,
      },
    })

    revalidatePath("/profile")
    revalidatePath("/admin/bookings")

    return { success: true, bookingId: booking.id }
  } catch {
    return { error: "Не удалось создать бронирование" }
  }
}

export async function cancelBooking(bookingId: number) {
  const session = await getSession()
  if (!session) {
    return { error: "Необходимо войти в аккаунт" }
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  })

  if (!booking) {
    return { error: "Бронирование не найдено" }
  }

  if (booking.userId !== Number(session.sub)) {
    return { error: "Нет доступа к этому бронированию" }
  }

  if (booking.status !== "PENDING") {
    return { error: "Невозможно отменить это бронирование" }
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  })

  revalidatePath("/profile")
  return { success: true }
}

export async function updateBookingStatus(bookingId: number, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return { error: "Недостаточно прав" }
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  })

  revalidatePath("/admin/bookings")
  return { success: true }
}
