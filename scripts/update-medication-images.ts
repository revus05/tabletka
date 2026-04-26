/**
 * Updates medication images in the database.
 * Sources: Wikimedia Commons (verified working URLs).
 * Uploads via Cloudinary, updates DB imageUrl.
 */
import "dotenv/config"
import { PrismaClient } from "../generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Verified working image URLs from Wikimedia Commons
// Key = medication name in DB, Value = source image URL
const MEDICATION_IMAGES: Record<string, string> = {
  // id=2  Амоксиклав 625 мг — amoxicillin+clavulanate tablets (Taiclav brand, same composition)
  "Амоксиклав 625 мг": "https://upload.wikimedia.org/wikipedia/commons/d/dc/Taiclav_lb-625.jpg",

  // id=3  Нольпаза 20 мг — pantoprazole 20mg tablets
  "Нольпаза 20 мг": "https://upload.wikimedia.org/wikipedia/commons/6/63/Pantoprazole_20mg.jpg",

  // id=13 Аугментин 875 мг — augmentin 1g tablets (same drug, close dosage)
  "Аугментин 875 мг": "https://upload.wikimedia.org/wikipedia/commons/9/97/Augmentin_1_g_tbl.jpg",

  // id=15 Омепразол 20 мг — omeprazole 20mg capsules
  "Омепразол 20 мг": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Omeprazole_20mg.jpg",

  // id=16 Цитрамон П — Russian citramon P tablet blister (actual product photo)
  "Цитрамон П": "https://upload.wikimedia.org/wikipedia/commons/0/03/%D0%A6%D0%98%D0%A2%D0%A0%D0%90%D0%9C%D0%9E%D0%9D_%D0%9F.jpg",

  // id=17 Но-шпа 40 мг — No-Spa tablets (actual Russian brand photo)
  "Но-шпа 40 мг": "https://upload.wikimedia.org/wikipedia/commons/0/05/No-spa.jpg",

  // id=20 Ибупрофен 200 мг — 200mg ibuprofen tablets
  "Ибупрофен 200 мг": "https://upload.wikimedia.org/wikipedia/commons/b/b0/200mg_ibuprofen_tablets.jpg",

  // id=24 Бисептол 480 мг — Bactrim (co-trimoxazole, same drug as Бисептол)
  "Бисептол 480 мг": "https://upload.wikimedia.org/wikipedia/commons/5/51/Bactrim.jpg",
}

async function uploadToCloudinary(sourceUrl: string, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      sourceUrl,
      { folder: "tabletka/medications", public_id: publicId, overwrite: true, resource_type: "image" },
      (error, result) => {
        if (error) reject(error)
        else resolve(result?.secure_url ?? "")
      }
    )
  })
}

async function main() {
  const medications = await prisma.medication.findMany({ orderBy: { id: "asc" } })
  console.log(`Total medications: ${medications.length}`)
  console.log(`Images to update: ${Object.keys(MEDICATION_IMAGES).length}\n`)

  let updated = 0
  let skipped = 0

  for (const med of medications) {
    const sourceUrl = MEDICATION_IMAGES[med.name]
    if (!sourceUrl) {
      console.log(`[${med.id}] ${med.name} — no image source, skipping`)
      skipped++
      continue
    }

    console.log(`[${med.id}] ${med.name}`)
    console.log(`  Source: ${sourceUrl}`)

    try {
      const cloudUrl = await uploadToCloudinary(sourceUrl, `med-${med.id}`)
      await prisma.medication.update({ where: { id: med.id }, data: { imageUrl: cloudUrl } })
      console.log(`  ✅ ${cloudUrl}`)
      updated++
    } catch (err) {
      console.error(`  ❌ Failed:`, err)
      skipped++
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500))
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
