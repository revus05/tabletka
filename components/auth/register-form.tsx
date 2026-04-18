"use client"

import { useActionState } from "react"
import Link from "next/link"
import { registerAction } from "@/lib/actions/auth"

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state && "error" in state && (
        <div className="bg-red-50 border border-red-200 rounded-[4px] p-3 text-red-700 text-[14px]">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#2b2b2b]">Имя</label>
        <input
          type="text"
          name="name"
          required
          placeholder="Иван Иванов"
          className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] text-[#2b2b2b] outline-none focus:border-[#29a373] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#2b2b2b]">Email</label>
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] text-[#2b2b2b] outline-none focus:border-[#29a373] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#2b2b2b]">Пароль</label>
        <input
          type="password"
          name="password"
          required
          placeholder="Минимум 8 символов"
          className="h-[44px] px-3 border border-[#e5eaeb] rounded-[4px] text-[15px] text-[#2b2b2b] outline-none focus:border-[#29a373] transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="h-[44px] bg-[#29a373] text-white text-[16px] font-semibold rounded-[4px] hover:bg-[#196346] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Регистрация..." : "Зарегистрироваться"}
      </button>

      <p className="text-center text-[14px] text-[#7a7a7a]">
        Уже есть аккаунт?{" "}
        <Link href="/auth/login" className="text-[#29a373] font-semibold hover:text-[#196346]">
          Войти
        </Link>
      </p>
    </form>
  )
}
