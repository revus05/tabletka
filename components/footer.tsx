import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-[#2b2b2b] text-white mt-12">
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        <div className="grid grid-cols-4 gap-8">
          {/* Logo + description */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo />
            </div>
            <p className="text-[13px] text-[#7a7a7a] leading-relaxed">
              Сервис поиска и сравнения цен на лекарства в аптеках Беларуси
            </p>
          </div>

          {/* Фармация */}
          <div>
            <h4 className="text-[15px] font-semibold mb-4">Фармация</h4>
            <ul className="space-y-2">
              {["Аптеки", "Производители", "Бренды", "МНН"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-[13px] text-[#7a7a7a] hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Информация */}
          <div>
            <h4 className="text-[15px] font-semibold mb-4">Информация</h4>
            <ul className="space-y-2">
              {["О проекте", "Вопрос/Ответ", "Помощь", "Контакты"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-[13px] text-[#7a7a7a] hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* App */}
          <div>
            <h4 className="text-[15px] font-semibold mb-4">Приложение</h4>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="flex items-center gap-3 border border-[#7a7a7a] rounded-[4px] px-4 py-2 hover:border-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M3.18 23.76A2 2 0 0 0 5 24c.67 0 1.38-.18 2.01-.56l11.27-6.51-3.5-3.5L3.18 23.76zM22.72 9.32l-3.38-1.95-3.91 3.91 3.91 3.91 3.4-1.96A2.02 2.02 0 0 0 24 11.27a2.02 2.02 0 0 0-1.28-1.95zM1.05.29A2 2 0 0 0 .06 2v20a2 2 0 0 0 .99 1.71l.12.07 11.2-11.2v-.27L1.17.21l-.12.08zm14.59 8.14L4.43.76 3.18.04A2 2 0 0 0 1.05.29l11.32 11.32 3.27-3.27z" />
                </svg>
                <div>
                  <div className="text-[10px] text-[#7a7a7a]">Доступно в</div>
                  <div className="text-[14px] font-semibold">Google Play</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 border border-[#7a7a7a] rounded-[4px] px-4 py-2 hover:border-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-[10px] text-[#7a7a7a]">Загрузить в</div>
                  <div className="text-[14px] font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#3a3a3a] flex items-center justify-between">
          <p className="text-[13px] text-[#7a7a7a]">
            © {new Date().getFullYear()} tabletka.by — все права защищены
          </p>
          <p className="text-[13px] text-[#7a7a7a]">Лицензия МЗ РБ</p>
        </div>
      </div>
    </footer>
  );
}
