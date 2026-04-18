import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
      take: 6,
    })
    return NextResponse.json({ news })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
