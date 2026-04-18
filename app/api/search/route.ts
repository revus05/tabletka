import { type NextRequest, NextResponse } from "next/server"
import { searchMedications } from "@/lib/queries/search"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const q = searchParams.get("q") ?? ""
  const region = searchParams.get("region") ?? undefined
  const inStock = searchParams.get("inStock") === "true"

  try {
    const results = await searchMedications({ q, region, inStock })
    return NextResponse.json({ query: q, total: results.length, results })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
