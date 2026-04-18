import { requireAdmin } from "@/lib/session"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const metadata = {
  title: "Админпанель — Таблетка.бай",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin()

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <AdminSidebar userName={user.name} />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
