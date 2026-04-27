"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBooking } from "@/lib/actions/bookings"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import * as Dialog from "@radix-ui/react-dialog"

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return isDesktop
}

type BookingFormProps = {
  pharmacyId: number
  pharmacyName: string
  medicationId: number
  medicationName: string
  price: number
  maxQuantity: number
  user?: {
    name: string
    email?: string | null
    phone?: string | null
  } | null
}

export function BookingForm({
  pharmacyId,
  pharmacyName,
  medicationId,
  medicationName,
  price,
  maxQuantity,
  user,
}: BookingFormProps) {
  const router = useRouter()
  const isDesktop = useIsDesktop()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [quantity, setQuantity] = useState(1)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createBooking({
      pharmacyId,
      medicationId,
      quantity: Number(formData.get("quantity")),
      customerName: formData.get("customerName") as string,
      customerPhone: formData.get("customerPhone") as string,
      customerEmail: formData.get("customerEmail") as string || undefined,
      notes: formData.get("notes") as string || undefined,
    })

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        router.push("/profile")
      }, 2000)
    }
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push("/auth/login")}
        className="h-[44px] px-8 bg-brand text-white text-[16px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors"
      >
        Забронировать
      </button>
    )
  }

  const formContent = success ? (
    <div className="text-center py-8">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-brand">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-[18px] font-semibold text-dark mb-2">Бронирование создано!</p>
      <p className="text-[15px] text-gray">Перенаправление в профиль...</p>
    </div>
  ) : (
    <>
      <div className="bg-gray-bg rounded-[4px] p-4 mb-4">
        <p className="text-dark text-[15px] font-semibold mb-1">{medicationName}</p>
        <p className="text-gray text-[14px] mb-2">{pharmacyName}</p>
        <p className="text-brand text-[18px] font-semibold">{price.toFixed(2)} р.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[14px] text-dark font-medium mb-1.5">Количество</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-gray-border rounded-[4px] flex items-center justify-center hover:border-brand transition-colors"
            >−</button>
            <input
              type="number"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, Number(e.target.value))))}
              min={1}
              max={maxQuantity}
              className="w-20 h-10 border border-gray-border rounded-[4px] text-center text-[15px] focus:border-brand outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              className="w-10 h-10 border border-gray-border rounded-[4px] flex items-center justify-center hover:border-brand transition-colors"
            >+</button>
            <span className="text-[13px] text-gray">из {maxQuantity} шт.</span>
          </div>
        </div>

        <div className="bg-brand-light rounded-[4px] p-3 flex items-center justify-between">
          <span className="text-[15px] text-dark">Итого:</span>
          <span className="text-[20px] font-semibold text-brand">{(price * quantity).toFixed(2)} р.</span>
        </div>

        <div>
          <label className="block text-[14px] text-dark font-medium mb-1.5">Имя <span className="text-error">*</span></label>
          <input type="text" name="customerName" defaultValue={user.name} required className="w-full h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] focus:border-brand outline-none" />
        </div>

        <div>
          <label className="block text-[14px] text-dark font-medium mb-1.5">Телефон <span className="text-error">*</span></label>
          <input type="tel" name="customerPhone" defaultValue={user.phone || ""} required placeholder="+375 (XX) XXX-XX-XX" className="w-full h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] focus:border-brand outline-none" />
        </div>

        <div>
          <label className="block text-[14px] text-dark font-medium mb-1.5">Email</label>
          <input type="email" name="customerEmail" defaultValue={user.email || ""} className="w-full h-[44px] px-3 border border-gray-border rounded-[4px] text-[15px] focus:border-brand outline-none" />
        </div>

        <div>
          <label className="block text-[14px] text-dark font-medium mb-1.5">Комментарий</label>
          <textarea name="notes" rows={2} className="w-full px-3 py-2 border border-gray-border rounded-[4px] text-[15px] focus:border-brand outline-none resize-none" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-error text-[14px] p-3 rounded-[4px]">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[48px] bg-brand text-white text-[16px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors disabled:opacity-50"
        >
          {loading ? "Создание..." : "Подтвердить бронирование"}
        </button>
      </form>
    </>
  )

  const triggerButton = (
    <button className="h-[44px] px-8 bg-brand text-white text-[16px] font-semibold rounded-[4px] hover:bg-brand-hover transition-colors">
      Забронировать
    </button>
  )

  if (isDesktop) {
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[480px] max-h-[90dvh] bg-white rounded-[8px] shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
              <Dialog.Title className="text-[18px] font-semibold text-dark">Бронирование</Dialog.Title>
              <Dialog.Close className="w-8 h-8 flex items-center justify-center text-gray hover:text-dark transition-colors rounded-[4px]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Dialog.Close>
            </div>
            <div className="px-6 pb-6 overflow-y-auto">{formContent}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="max-h-[90dvh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-left text-[18px]">Бронирование</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 overflow-y-auto">{formContent}</div>
      </DrawerContent>
    </Drawer>
  )
}
