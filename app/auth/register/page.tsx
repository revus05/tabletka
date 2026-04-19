import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Logo } from "@/components/ui/logo";

export const metadata = {
  title: "Регистрация — Таблетка.бай",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Logo />
        </Link>

        <div className="bg-white rounded-[4px] border border-gray-border p-8">
          <h1 className="text-dark text-[24px] font-semibold mb-6">
            Регистрация
          </h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
