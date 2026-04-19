"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { logoutAction } from "@/lib/actions/auth";
import type { JWTPayload } from "@/lib/auth";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type HeaderProps = {
  user?: JWTPayload | null;
  pharmacyCount?: number;
  medicationCount?: number;
};

const navLinks = [
  { label: "Аптеки", href: "/pharmacies" },
  { label: "Производители", href: "#" },
  { label: "Бренды", href: "#" },
  { label: "МНН", href: "#" },
  { label: "Вопрос/Ответ", href: "#" },
  { label: "Помощь", href: "#" },
];

function Header({ user, pharmacyCount = 0, medicationCount = 0 }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileMenuOpen(false);
    }
  }

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main header row */}
      <div className="mx-auto max-w-[1200px] px-4 md:px-5">
        <div className="flex h-[64px] md:h-[82px] items-center gap-3 md:gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2 text-brand">
            <Logo />
          </Link>

          {/* Search form — hidden on mobile, shown on md+ */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 items-center gap-2"
          >
            <button
              type="button"
              className="flex items-center gap-2 shrink-0 h-[48px] px-4 bg-brand text-white rounded-[4px] text-[15px] font-semibold hover:bg-brand-hover transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="7" height="7" rx="1" fill="white" />
                <rect x="11" y="1" width="7" height="7" rx="1" fill="white" />
                <rect x="1" y="11" width="7" height="7" rx="1" fill="white" />
                <rect x="11" y="11" width="7" height="7" rx="1" fill="white" />
              </svg>
              Каталог
            </button>

            <div className="flex flex-1 items-center border border-brand rounded-[4px] h-[48px] overflow-hidden">
              <div className="flex items-center gap-1 h-full px-3 bg-brand-light border-r border-brand shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1C5.24 1 3 3.24 3 6c0 4.25 5 9 5 9s5-4.75 5-9c0-2.76-2.24-5-5-5zm0 6.75A1.75 1.75 0 1 1 8 4.25a1.75 1.75 0 0 1 0 3.5z"
                    fill="#29a373"
                  />
                </svg>
                <span className="text-brand text-[15px] whitespace-nowrap">Все регионы</span>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск лекарств"
                className="flex-1 px-3 text-[15px] text-dark outline-none bg-transparent"
              />
              <button
                type="submit"
                className="flex items-center justify-center h-full w-12 bg-brand hover:bg-brand-hover transition-colors shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="9" cy="9" r="5.5" stroke="white" strokeWidth="2" />
                  <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </form>

          {/* Mobile: search icon + burger */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <Link
              href="/search?q="
              className="flex items-center justify-center w-10 h-10 text-dark"
            >
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="2" />
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>

            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Открыть меню"
                  className="flex items-center justify-center w-10 h-10 text-dark"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </DrawerTrigger>

              <DrawerContent className="max-h-[90dvh]">
                <DrawerHeader className="pb-2">
                  <DrawerTitle className="text-left text-[16px]">Меню</DrawerTitle>
                </DrawerHeader>

                <div className="px-4 pb-6 overflow-y-auto flex flex-col gap-5">
                  {/* Mobile search */}
                  <form onSubmit={handleSearch} className="flex items-center border border-brand rounded-[4px] h-[48px] overflow-hidden">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Поиск лекарств"
                      className="flex-1 px-3 text-[15px] text-dark outline-none bg-transparent"
                    />
                    <button
                      type="submit"
                      className="flex items-center justify-center h-full w-12 bg-brand hover:bg-brand-hover transition-colors shrink-0"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="9" cy="9" r="5.5" stroke="white" strokeWidth="2" />
                        <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </form>

                  {/* Nav links */}
                  <nav className="flex flex-col gap-1">
                    {navLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[16px] font-semibold text-dark hover:text-brand transition-colors py-2 border-b border-gray-border last:border-0"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Icons row */}
                  <div className="flex flex-col gap-3">
                    <button className="flex items-center gap-3 text-[15px] text-dark py-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="7" height="7" rx="1" stroke="#2b2b2b" strokeWidth="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1" stroke="#2b2b2b" strokeWidth="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1" stroke="#2b2b2b" strokeWidth="1.5" />
                        <rect x="14" y="14" width="7" height="7" rx="1" stroke="#2b2b2b" strokeWidth="1.5" />
                      </svg>
                      Мультипоиск
                    </button>
                    <button className="flex items-center gap-3 text-[15px] text-dark py-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.5 2 6 4.5 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.5-2.5-6-6-6z" stroke="#2b2b2b" strokeWidth="1.5" />
                        <circle cx="12" cy="8" r="2" stroke="#2b2b2b" strokeWidth="1.5" />
                      </svg>
                      Моя аптечка
                    </button>

                    {user ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-[15px] text-dark py-2">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" fill="#29a373" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#29a373" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <span className="font-semibold">{user.name}</span>
                        </div>
                        <form action={logoutAction}>
                          <Button type="submit" variant="ghost" className="w-full justify-start text-error hover:text-error hover:bg-red-50">
                            Выйти
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <Link
                        href="/auth/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-[15px] text-dark hover:text-brand transition-colors py-2"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke="#2b2b2b" strokeWidth="1.5" />
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#2b2b2b" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Войти
                      </Link>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-2 border-t border-gray-border text-[12px] font-semibold uppercase text-gray">
                    <div className="flex items-center gap-1">
                      <span className="text-brand text-[20px] font-normal">{pharmacyCount.toLocaleString("ru-RU")}</span>
                      <span className="leading-tight">аптек<br />в поиске</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-brand text-[20px] font-normal">{medicationCount.toLocaleString("ru-RU")}</span>
                      <span className="leading-tight">товаров<br />в наличии</span>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Desktop: right icons */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <button className="flex flex-col items-center gap-1 text-[13px] text-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="#2b2b2b" strokeWidth="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="#2b2b2b" strokeWidth="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="#2b2b2b" strokeWidth="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="#2b2b2b" strokeWidth="1.5" />
              </svg>
              Мультипоиск
            </button>
            <button className="flex flex-col items-center gap-1 text-[13px] text-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.5 2 6 4.5 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.5-2.5-6-6-6z" stroke="#2b2b2b" strokeWidth="1.5" />
                <circle cx="12" cy="8" r="2" stroke="#2b2b2b" strokeWidth="1.5" />
              </svg>
              Моя аптечка
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" fill="#29a373" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#29a373" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[13px] text-dark max-w-[80px] truncate">{user.name}</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end" sideOffset={8}>
                    <div className="flex flex-col gap-1">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        {user.email && (
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        )}
                      </div>
                      <div className="border-t my-1" />
                      <form action={logoutAction}>
                        <Button type="submit" variant="ghost" className="w-full justify-start text-error hover:text-error hover:bg-red-50">
                          Выйти
                        </Button>
                      </form>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex flex-col items-center gap-1 text-[13px] text-dark hover:text-brand transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#2b2b2b" strokeWidth="1.5" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#2b2b2b" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Secondary nav — desktop only */}
      <div className="hidden md:block bg-brand-light border-t border-brand-muted">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="flex h-[44px] items-center justify-between">
            <nav className="flex items-center gap-8">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[15px] font-semibold text-dark hover:text-brand transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-5 text-[10px] font-semibold uppercase text-gray">
              <div className="flex items-center gap-1">
                <span className="text-brand text-[20px] font-normal">{pharmacyCount.toLocaleString("ru-RU")}</span>
                <span className="leading-tight">аптек<br />в поиске</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-brand text-[20px] font-normal">{medicationCount.toLocaleString("ru-RU")}</span>
                <span className="leading-tight">товаров<br />в наличии</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
