"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export type ActionResult = { error: string } | { success: true };

const PharmacySchema = z.object({
  name: z.string().min(2, "Название должно быть не менее 2 символов"),
  address: z.string().min(5, "Укажите полный адрес"),
  city: z.string().min(2, "Укажите город"),
  region: z.string().min(2, "Укажите регион"),
  phone: z.string().optional(),
  logoUrl: z.string().optional(),
});

export async function createPharmacyAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = PharmacySchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    region: formData.get("region"),
    phone: formData.get("phone") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  await prisma.pharmacy.create({ data: parsed.data });
  revalidatePath("/admin/pharmacies");
  redirect("/admin/pharmacies");
}

export async function updatePharmacyAction(
  id: number,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = PharmacySchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    region: formData.get("region"),
    phone: formData.get("phone") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  await prisma.pharmacy.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/pharmacies");
  redirect("/admin/pharmacies");
}

export async function deletePharmacyAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.pharmacy.delete({ where: { id } });
  revalidatePath("/admin/pharmacies");
}
