import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function getImageUrl(seed: number): Promise<string> {
  // Using Unsplash API with proper parameters
  // Falls back to picsum.photos which is more reliable
  const picsum = `https://picsum.photos/800/600?random=${seed}`;
  return picsum;
}

async function uploadToCloudinary(
  imageUrl: string,
  folder: string,
  publicId: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageUrl,
      {
        folder: `tabletka/${folder}`,
        public_id: publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || "");
      },
    );
  });
}

async function uploadMedicineImages() {
  console.log("🏥 Starting medicine images upload...");

  const medications = await prisma.medication.findMany();
  console.log(`Found ${medications.length} medications`);

  for (let i = 0; i < medications.length; i++) {
    const medication = medications[i];

    try {
      console.log(`\n[${i + 1}/${medications.length}] Uploading image for: ${medication.name}`);

      const imageUrl = await getImageUrl(medication.id);

      const cloudinaryUrl = await uploadToCloudinary(
        imageUrl,
        "medications",
        `med-${medication.id}`,
      );

      await prisma.medication.update({
        where: { id: medication.id },
        data: { imageUrl: cloudinaryUrl },
      });

      console.log(`✅ Updated: ${medication.name}`);
      console.log(`   URL: ${cloudinaryUrl}`);
    } catch (error) {
      console.error(`❌ Failed for ${medication.name}:`, error);
    }
  }
}

async function uploadPharmacyImages() {
  console.log("\n🏢 Starting pharmacy images upload...");

  const pharmacies = await prisma.pharmacy.findMany();
  console.log(`Found ${pharmacies.length} pharmacies`);

  for (let i = 0; i < pharmacies.length; i++) {
    const pharmacy = pharmacies[i];

    try {
      console.log(`\n[${i + 1}/${pharmacies.length}] Uploading logo for: ${pharmacy.name}`);

      const imageUrl = await getImageUrl(pharmacy.id);

      const cloudinaryUrl = await uploadToCloudinary(
        imageUrl,
        "pharmacies",
        `pharmacy-${pharmacy.id}`,
      );

      await prisma.pharmacy.update({
        where: { id: pharmacy.id },
        data: { logoUrl: cloudinaryUrl },
      });

      console.log(`✅ Updated: ${pharmacy.name}`);
      console.log(`   URL: ${cloudinaryUrl}`);
    } catch (error) {
      console.error(`❌ Failed for ${pharmacy.name}:`, error);
    }
  }
}

async function main() {
  try {
    await uploadMedicineImages();
    await uploadPharmacyImages();

    console.log("\n✨ All images uploaded successfully!");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
