import { Roboto } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { PwaRegister } from "./pwa-register";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#29a373",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Таблетка.бай — поиск лекарств в аптеках",
  description: "Сравните цены на лекарства в аптеках Беларуси",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Таблетка",
  },
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

  // Fetch counts for header
  const [pharmacyCount, medicationCount] = await Promise.all([
    prisma.pharmacy.count(),
    prisma.medication.count(),
  ]);

  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={cn("antialiased", roboto.variable, "font-sans")}
    >
      <body>
        <ThemeProvider>
          {<Header user={session} pharmacyCount={pharmacyCount} medicationCount={medicationCount} />}
          {children}
        </ThemeProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
