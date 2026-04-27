"use client"

import { useState } from "react"
import { updateBookingStatus } from "@/lib/actions/bookings"

type Props = {
  bookingId: number
  currentStatus: string
}

const statuses = [
  { value: "PENDING", label: "Ожидает" },
  { value: "CONFIRMED", label: "Подтверждено" },
  { value: "COMPLETED", label: "Завершено" },
  { value: "CANCELLED", label: "Отменено" },
] as const

export function BookingStatusSelect({ bookingId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as "CONFIRMED" | "CANCELLED" | "COMPLETED"
    setLoading(true)
    setStatus(newStatus)
    await updateBookingStatus(bookingId, newStatus)
    setLoading(false)
  }

  const statusColors: Record<string, string> = {
    PENDING: "border-yellow-300 bg-yellow-50",
    CONFIRMED: "border-brand-muted bg-brand-light",
    COMPLETED: "border-blue-200 bg-blue-50",
    CANCELLED: "border-gray-border bg-gray-bg",
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`px-2 py-1 text-[13px] rounded-[4px] border outline-none cursor-pointer disabled:opacity-50 ${statusColors[status] || ""}`}
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  )
}
