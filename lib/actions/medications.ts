"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export type ActionResult = { error: string } | { success: true };

const MedicationSchema = z.object({
  name: z.string().min(2, "Название должно быть не менее 2 символов"),
  genericName: z.string().optional(),
  manufacturer: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
});

export async function createMedicationAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = MedicationSchema.safeParse({
    name: formData.get("name"),
    genericName: formData.get("genericName") || undefined,
    manufacturer: formData.get("manufacturer") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  await prisma.medication.create({ data: parsed.data });
  revalidatePath("/admin/medications");
  redirect("/admin/medications");
}

export async function updateMedicationAction(
  id: number,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = MedicationSchema.safeParse({
    name: formData.get("name"),
    genericName: formData.get("genericName") || undefined,
    manufacturer: formData.get("manufacturer") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  await prisma.medication.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/medications");
  redirect("/admin/medications");
}

export async function deleteMedicationAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.medication.delete({ where: { id } });
  revalidatePath("/admin/medications");
}
