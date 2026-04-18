import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      include: { pharmacy: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    })
    return NextResponse.json({ promotions })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
