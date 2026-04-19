import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Таблетка.бай — поиск лекарств",
    short_name: "Таблетка",
    description: "Сравните цены на лекарства в аптеках Беларуси",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#29a373",
    orientation: "portrait",
    categories: ["health", "medical"],
    lang: "ru",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-large",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
