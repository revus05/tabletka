import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { CancelBookingButton } from "@/components/cancel-booking-button"

export const metadata = {
  title: "Профиль — Таблетка.бай",
  description: "Личный кабинет пользователя",
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Ожидает", color: "text-yellow-600 bg-yellow-50" },
  CONFIRMED: { label: "Подтверждено", color: "text-brand bg-brand-light" },
  CANCELLED: { label: "Отменено", color: "text-gray bg-gray-bg" },
  COMPLETED: { label: "Завершено", color: "text-blue-600 bg-blue-50" },
}

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?redirect=/profile")
  }

  const [user, bookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: Number(session.sub) },
      select: { name: true, email: true, phone: true, createdAt: true },
    }),
    prisma.booking.findMany({
      where: { userId: Number(session.sub) },
      include: {
        medication: true,
        pharmacy: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1200px] px-4 md:px-5 py-6">
        <nav className="flex items-center gap-2 text-[14px] text-gray mb-5">
          <Link href="/" className="hover:text-brand">Главная</Link>
          <span>/</span>
          <span className="text-dark">Профиль</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="border border-gray-border rounded-[4px] p-5 h-fit">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-border">
              <div className="w-[56px] h-[56px] bg-brand-light rounded-full flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="#29a373" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#29a373" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-dark text-[16px] font-semibold">{user.name}</p>
                <p className="text-gray text-[14px]">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[14px]">
              {user.phone && (
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 10.5c-.7 0-1.4-.1-2-.3-.3-.1-.6 0-.8.2l-1.2 1.2C6.1 10.6 5.4 9.9 4.4 8.9L5.6 7.7c.2-.2.3-.5.2-.8C5.6 6.4 5.5 5.7 5.5 5c0-.5-.4-.9-.9-.9H3c-.6 0-1 .4-1 1C2 10.4 5.6 14 10.9 14c.6 0 1-.4 1-1v-1.6c0-.5-.4-.9-.9-.9z" fill="#29a373" />
                  </svg>
                  <span className="text-dark">{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="#29a373" strokeWidth="1.5" />
                  <path d="M8 5v3.5l2 2" stroke="#29a373" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-gray">
                  С {new Date(user.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-border">
              <Link
                href="/favorites"
                className="flex items-center gap-2 text-[15px] text-dark hover:text-brand transition-colors py-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Моя аптечка
              </Link>
            </div>
          </aside>

          {/* Bookings */}
          <div>
            <h1 className="text-dark text-[24px] font-semibold mb-6">Мои бронирования</h1>

            {bookings.length === 0 ? (
              <div className="text-center py-16 border border-gray-border rounded-[4px]">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-gray-border">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-[18px] text-gray mb-2">У вас пока нет бронирований</p>
                <p className="text-[15px] text-gray mb-4">Найдите нужное лекарство и забронируйте его в аптеке</p>
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center h-[44px] px-6 bg-brand text-white text-[15px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors"
                >
                  Перейти к каталогу
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map((booking) => {
                  const status = statusLabels[booking.status] || statusLabels.PENDING
                  return (
                    <div
                      key={booking.id}
                      className="border border-gray-border rounded-[4px] p-4 md:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray text-[13px]">
                              #{booking.id}
                            </span>
                            <span className={`text-[12px] px-2 py-0.5 rounded-[4px] font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-gray text-[13px]">
                            {new Date(booking.createdAt).toLocaleDateString("ru-RU", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {booking.status === "PENDING" && (
                          <CancelBookingButton bookingId={booking.id} />
                        )}
                      </div>

                      <div className="flex gap-4 mb-3">
                        <div className="w-[60px] h-[60px] shrink-0 border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center overflow-hidden">
                          {booking.medication.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={booking.medication.imageUrl} alt={booking.medication.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                              <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                              <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${booking.medicationId}`}
                            className="text-dark text-[15px] font-semibold hover:text-brand transition-colors block truncate"
                          >
                            {booking.medication.name}
                          </Link>
                          <p className="text-gray text-[14px]">{booking.pharmacy.name}</p>
                          <p className="text-gray text-[13px]">{booking.pharmacy.city}, {booking.pharmacy.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-border">
                        <span className="text-[14px] text-gray">
                          {booking.quantity} шт.
                        </span>
                        <Link
                          href={`/pharmacy/${booking.pharmacyId}/product/${booking.medicationId}`}
                          className="text-brand text-[14px] font-semibold hover:text-brand-hover"
                        >
                          Подробнее →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
