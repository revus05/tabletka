import Link from "next/link";
import { PharmacyMap } from "@/components/pharmacy-map";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Аптеки — Таблетка.бай",
  description: "Список всех аптек",
};

export default async function PharmaciesPage() {
  const pharmacies = await prisma.pharmacy.findMany({
    orderBy: { name: "asc" },
  });

  // Prepare pharmacy data for map
  const pharmaciesForMap = pharmacies.map((p) => ({
    id: p.id,
    name: p.name,
    address: `${p.city}, ${p.address}`,
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1200px] px-4 md:px-5 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-gray mb-5">
          <Link href="/" className="hover:text-brand">Главная</Link>
          <span>/</span>
          <span className="text-dark">Аптеки</span>
        </nav>

        <h1 className="mb-6 text-[24px] md:text-[28px] font-semibold text-dark">Аптеки</h1>

        {/* Map */}
        <div className="mb-8 border border-gray-border rounded-[4px] overflow-hidden">
          <div className="px-5 py-4 bg-gray-bg border-b border-gray-border">
            <h2 className="text-dark text-[18px] font-semibold">Аптеки на карте</h2>
            <p className="text-gray text-[14px]">{pharmacies.length} аптек</p>
          </div>
          <PharmacyMap pharmacies={pharmaciesForMap} />
        </div>

        {pharmacies.length === 0 ? (
          <div className="rounded-[4px] bg-gray-bg p-8 text-center">
            <p className="text-gray">Аптек не найдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="rounded-[4px] bg-white border border-gray-border p-5 hover:border-brand transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-[56px] h-[56px] shrink-0 border border-gray-border rounded-[4px] bg-gray-bg flex items-center justify-center overflow-hidden">
                    {pharmacy.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pharmacy.logoUrl}
                        alt={pharmacy.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="15" fill="#eaf6f1" />
                        <path d="M10 16h12M16 10v12" stroke="#29a373" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[16px] font-semibold text-dark truncate">
                      {pharmacy.name}
                    </h2>
                    <p className="text-[14px] text-gray">{pharmacy.region}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-[14px] mb-4">
                  <div className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                      <path d="M8 1C5.24 1 3 3.24 3 6c0 4.25 5 9 5 9s5-4.75 5-9c0-2.76-2.24-5-5-5z" fill="#29a373" />
                    </svg>
                    <span className="text-dark">{pharmacy.city}, {pharmacy.address}</span>
                  </div>
                  {pharmacy.phone && (
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                        <path d="M12 10.5c-.7 0-1.4-.1-2-.3-.3-.1-.6 0-.8.2l-1.2 1.2C6.1 10.6 5.4 9.9 4.4 8.9L5.6 7.7c.2-.2.3-.5.2-.8C5.6 6.4 5.5 5.7 5.5 5c0-.5-.4-.9-.9-.9H3c-.6 0-1 .4-1 1C2 10.4 5.6 14 10.9 14c.6 0 1-.4 1-1v-1.6c0-.5-.4-.9-.9-.9z" fill="#29a373" />
                      </svg>
                      <a
                        href={`tel:${pharmacy.phone}`}
                        className="text-brand hover:underline"
                      >
                        {pharmacy.phone}
                      </a>
                    </div>
                  )}
                </div>

                <Link
                  href={`/search?pharmacy=${pharmacy.id}`}
                  className="inline-flex items-center justify-center h-[36px] px-4 border border-brand text-brand text-[14px] font-semibold rounded-[4px] hover:bg-brand hover:text-white transition-colors w-full"
                >
                  Товары в аптеке
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
