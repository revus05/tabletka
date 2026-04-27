import { prisma } from "@/lib/prisma"
import { BookingStatusSelect } from "@/components/admin/booking-status-select"

export const metadata = {
  title: "Бронирования — Админпанель",
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Ожидает", color: "text-yellow-600 bg-yellow-50" },
  CONFIRMED: { label: "Подтверждено", color: "text-brand bg-brand-light" },
  CANCELLED: { label: "Отменено", color: "text-gray bg-gray-bg" },
  COMPLETED: { label: "Завершено", color: "text-blue-600 bg-blue-50" },
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      user: { select: { name: true, email: true } },
      medication: true,
      pharmacy: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-dark mb-6">Бронирования</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-[4px] p-4 border border-gray-border">
          <p className="text-[13px] text-gray mb-1">Всего</p>
          <p className="text-[24px] font-semibold text-dark">{stats.total}</p>
        </div>
        <div className="bg-white rounded-[4px] p-4 border border-yellow-200">
          <p className="text-[13px] text-gray mb-1">Ожидают</p>
          <p className="text-[24px] font-semibold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-[4px] p-4 border border-brand-muted">
          <p className="text-[13px] text-gray mb-1">Подтверждены</p>
          <p className="text-[24px] font-semibold text-brand">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-[4px] p-4 border border-blue-200">
          <p className="text-[13px] text-gray mb-1">Завершены</p>
          <p className="text-[24px] font-semibold text-blue-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-[4px] p-4 border border-gray-border">
          <p className="text-[13px] text-gray mb-1">Отменены</p>
          <p className="text-[24px] font-semibold text-gray">{stats.cancelled}</p>
        </div>
      </div>

      {/* Table */}
      {bookings.length === 0 ? (
        <div className="bg-white rounded-[4px] border border-gray-border p-8 text-center">
          <p className="text-gray">Бронирований пока нет</p>
        </div>
      ) : (
        <div className="bg-white rounded-[4px] border border-gray-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-bg border-b border-gray-border">
                <tr>
                  <th className="px-4 py-3 text-left text-[13px] font-semibold text-dark">ID</th>
                  <th className="px-4 py-3 text-left text-[13px] font-semibold text-dark">Дата</th>
                  <th className="px-4 py-3 text-left text-[13px] font-semibold text-dark">Клиент</th>
                  <th className="px-4 py-3 text-left text-[13px] font-semibold text-dark">Товар</th>
                  <th className="px-4 py-3 text-left text-[13px] font-semibold text-dark">Аптека</th>
                  <th className="px-4 py-3 text-left text-[13px] font-semibold text-dark">Кол-во</th>
                  <th className="px-4 py-3 text-left text-[13px] font-semibold text-dark">Статус</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const status = statusLabels[booking.status] || statusLabels.PENDING
                  return (
                    <tr key={booking.id} className="border-b border-gray-border last:border-0 hover:bg-gray-bg/50">
                      <td className="px-4 py-3 text-[14px] text-gray">#{booking.id}</td>
                      <td className="px-4 py-3 text-[14px] text-dark">
                        {new Date(booking.createdAt).toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-[14px] text-dark font-medium">{booking.customerName}</p>
                          <p className="text-[12px] text-gray">{booking.customerPhone}</p>
                          {booking.customerEmail && (
                            <p className="text-[12px] text-gray">{booking.customerEmail}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[14px] text-dark truncate max-w-[200px]">{booking.medication.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[14px] text-dark">{booking.pharmacy.name}</p>
                        <p className="text-[12px] text-gray">{booking.pharmacy.city}</p>
                      </td>
                      <td className="px-4 py-3 text-[14px] text-dark">{booking.quantity} шт.</td>
                      <td className="px-4 py-3">
                        <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
