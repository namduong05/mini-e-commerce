import { z } from "zod";

const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

export const createCheckoutSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z
      .string()
      .min(2, `${t("validate.fullNameRequired")}`)
      .max(50, `${t("validate.fullNameMax50")}`),

    email: z
      .string()
      .min(1, `${t("validate.emailRequired")}`)
      .email(`${t("validate.emailInvalid")}`),

    phone: z
      .string()
      .min(1, `${t("validate.phoneRequired")}`)
      .regex(phoneRegex, `${t("validate.phoneInvalid")}`),

    address: z.string().min(5, `${t("validate.addressRequired")}`),

    city: z.string().min(1, `${t("validate.cityRequired")}`),

    paymentMethod: z
      .enum(["cod", "credit_card", "momo"])
      .refine((val) => !!val, {
        message: `${t("validate.paymentRequired")}`,
      }),

    note: z.string().optional(),
  });

export type CheckoutFormData = z.infer<ReturnType<typeof createCheckoutSchema>>;
