import Link from "next/link"
import { redirect } from "next/navigation"
import { FavoriteButton } from "@/components/favorite-button"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

export const metadata = {
  title: "Моя аптечка — Таблетка.бай",
  description: "Избранные товары",
}

export default async function FavoritesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?redirect=/favorites")
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: Number(session.sub) },
    include: {
      medication: {
        include: {
          stocks: {
            where: { inStock: true },
            select: { price: true },
            orderBy: { price: "asc" },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1200px] px-4 md:px-5 py-6">
        <nav className="flex items-center gap-2 text-[14px] text-gray mb-5">
          <Link href="/" className="hover:text-brand">Главная</Link>
          <span>/</span>
          <span className="text-dark">Моя аптечка</span>
        </nav>

        <h1 className="text-dark text-[24px] md:text-[28px] font-semibold mb-6">
          Моя аптечка
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-16 border border-gray-border rounded-[4px]">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-gray-border">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p className="text-[18px] text-gray mb-2">Ваша аптечка пуста</p>
            <p className="text-[15px] text-gray mb-4">Добавляйте товары в избранное, чтобы быстро находить их</p>
            <Link
              href="/search"
              className="inline-flex items-center justify-center h-[44px] px-6 bg-brand text-white text-[15px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors"
            >
              Перейти к каталогу
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favorites.map(({ medication }) => {
              const minPrice = medication.stocks[0] ? Number(medication.stocks[0].price) : null
              return (
                <div
                  key={medication.id}
                  className="rounded-[4px] border border-gray-border hover:border-brand transition-colors flex flex-col overflow-hidden relative"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton medicationId={medication.id} size="sm" />
                  </div>
                  <div className="h-[120px] bg-gray-bg flex items-center justify-center shrink-0">
                    {medication.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={medication.imageUrl} alt={medication.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                        <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <p className="text-dark text-[15px] font-semibold leading-snug line-clamp-2 flex-1">{medication.name}</p>
                    {minPrice !== null && (
                      <p className="text-brand text-[16px] font-semibold">от {minPrice.toFixed(2)} р.</p>
                    )}
                    <Link
                      href={`/product/${medication.id}`}
                      className="inline-flex items-center justify-center h-[36px] border border-brand text-brand text-[14px] font-semibold rounded-[4px] hover:bg-brand hover:text-white transition-colors"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
