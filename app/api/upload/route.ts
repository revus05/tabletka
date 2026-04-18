import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const folder = (formData.get("folder") as string) ?? "medications"

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const result = await uploadImage(buffer, folder as "medications" | "pharmacies")
  return NextResponse.json(result)
}
