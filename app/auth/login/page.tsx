import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/ui/logo";

export const metadata = {
  title: "Вход — Таблетка.бай",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Logo />
        </Link>

        <div className="bg-white rounded-[4px] border border-[#e5eaeb] p-8">
          <h1 className="text-[#2b2b2b] text-[24px] font-semibold mb-6">
            Вход в аккаунт
          </h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
