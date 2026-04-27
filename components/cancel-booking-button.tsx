"use client"

import { useState } from "react"
import { cancelBooking } from "@/lib/actions/bookings"

export function CancelBookingButton({ bookingId }: { bookingId: number }) {
  const [loading, setLoading] = useState(false)

  async function handleCancel() {
    if (!confirm("Вы уверены, что хотите отменить бронирование?")) {
      return
    }

    setLoading(true)
    await cancelBooking(bookingId)
    setLoading(false)
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="text-[13px] text-error hover:underline disabled:opacity-50"
    >
      {loading ? "Отмена..." : "Отменить"}
    </button>
  )
}
