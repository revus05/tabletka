"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export type ActionResult = { error: string } | { success: true };

const StockSchema = z.object({
  medicationId: z.coerce.number().int().positive("Выберите лекарство"),
  pharmacyId: z.coerce.number().int().positive("Выберите аптеку"),
  price: z.coerce.number().positive("Цена должна быть положительной"),
  quantity: z.coerce
    .number()
    .int()
    .min(0, "Количество не может быть отрицательным"),
  maxQuantity: z.coerce
    .number()
    .int()
    .positive("Максимальное количество должно быть положительным"),
  inStock: z.string().transform((v) => v === "true" || v === "on"),
});

export async function upsertStockAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = StockSchema.safeParse({
    medicationId: formData.get("medicationId"),
    pharmacyId: formData.get("pharmacyId"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    maxQuantity: formData.get("maxQuantity"),
    inStock: formData.get("inStock") ?? "false",
  });

  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  const { medicationId, pharmacyId, ...data } = parsed.data;

  await prisma.stock.upsert({
    where: { medicationId_pharmacyId: { medicationId, pharmacyId } },
    update: data,
    create: { medicationId, pharmacyId, ...data },
  });

  revalidatePath("/admin/stock");
  redirect("/admin/stock");
}

export async function deleteStockAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.stock.delete({ where: { id } });
  revalidatePath("/admin/stock");
}
