import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Аптеки — Таблетка.бай",
  description: "Список всех аптек",
};

export default async function PharmaciesPage() {
  const pharmacies = await prisma.pharmacy.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-gray-bg">
      <div className="mx-auto max-w-[1200px] px-5 py-8">
        <h1 className="mb-8 text-3xl font-semibold text-dark">Аптеки</h1>

        {pharmacies.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-gray">Аптек не найдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {pharmacy.logoUrl && (
                  <img
                    src={pharmacy.logoUrl}
                    alt={pharmacy.name}
                    className="mb-4 h-16 w-full object-contain"
                  />
                )}
                <h2 className="mb-2 text-lg font-semibold text-dark">
                  {pharmacy.name}
                </h2>
                <div className="mb-4 space-y-1 text-sm text-gray">
                  {pharmacy.city && (
                    <p>
                      <span className="font-medium">Город:</span> {pharmacy.city}
                    </p>
                  )}
                  {pharmacy.region && (
                    <p>
                      <span className="font-medium">Регион:</span> {pharmacy.region}
                    </p>
                  )}
                  {pharmacy.address && (
                    <p>
                      <span className="font-medium">Адрес:</span> {pharmacy.address}
                    </p>
                  )}
                  {pharmacy.phone && (
                    <p>
                      <span className="font-medium">Телефон:</span>{" "}
                      <a
                        href={`tel:${pharmacy.phone}`}
                        className="text-brand hover:underline"
                      >
                        {pharmacy.phone}
                      </a>
                    </p>
                  )}
                </div>
                <Link
                  href={`/search?pharmacy=${pharmacy.id}`}
                  className="inline-block rounded-[4px] bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover transition-colors"
                >
                  Товары в этой аптеке
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
