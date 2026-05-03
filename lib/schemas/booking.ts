import { z } from "zod"

// Регулярное выражение для белорусского телефона
// Поддерживает форматы:
// +375 (29) 123-45-67
// +375(29)1234567
// +37529123-45-67
const belarusPhoneRegex = /^\+375\s?\(?\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/

export const BookingFormSchema = z.object({
  quantity: z
    .number({
      required_error: "Количество обязательно",
      invalid_type_error: "Количество должно быть числом",
    })
    .int("Количество должно быть целым числом")
    .min(1, "Минимальное количество: 1"),

  customerName: z
    .string({
      required_error: "Имя обязательно",
    })
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя должно содержать максимум 100 символов")
    .trim(),

  customerPhone: z
    .string({
      required_error: "Телефон обязателен",
    })
    .regex(
      belarusPhoneRegex,
      "Неверный формат телефона. Используйте формат: +375 (XX) XXX-XX-XX"
    ),

  customerEmail: z
    .string()
    .email("Неверный формат email")
    .optional()
    .or(z.literal("")),

  notes: z
    .string()
    .max(500, "Комментарий должен содержать максимум 500 символов")
    .optional()
    .or(z.literal("")),
})

export type BookingFormInput = z.infer<typeof BookingFormSchema>
