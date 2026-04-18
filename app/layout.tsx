import { Roboto } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Таблетка.бай — поиск лекарств в аптеках",
  description: "Сравните цены на лекарства в аптеках Беларуси",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  const session = isAdmin ? null : await getSession();

  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={cn("antialiased", roboto.variable, "font-sans")}
    >
      <body>
        <ThemeProvider>
          {!isAdmin && <Header user={session} />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
