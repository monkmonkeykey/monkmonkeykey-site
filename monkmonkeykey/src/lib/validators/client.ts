import { z } from "zod";

export const clientStatusSchema = z
  .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
  .catch("DRAFT");

export const createClientSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido." })
    .trim()
    .min(1, "El nombre es requerido."),
  slug: z
    .string({ required_error: "El identificador es requerido." })
    .trim()
    .min(1, "El identificador es requerido.")
    .regex(
      /^[a-z0-9-]+$/,
      "El identificador solo puede contener letras minúsculas, números y guiones.",
    ),
  tagline: z.string().trim().min(1).optional(),
  summary: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  website: z.string().trim().url("El sitio web no tiene un formato válido.").optional(),
  email: z.string().trim().email("El correo no tiene un formato válido.").optional(),
  phone: z.string().trim().min(1).optional(),
  contactName: z.string().trim().min(1).optional(),
  contactEmail: z
    .string()
    .trim()
    .email("El correo de contacto no tiene un formato válido.")
    .optional(),
  contactPhone: z.string().trim().min(1).optional(),
  logoPublicId: z.string().trim().min(1).optional(),
  heroPublicId: z.string().trim().min(1).optional(),
  galleryPublicIds: z.array(z.string().trim().min(1)).default([]),
  tags: z.array(z.string().trim().min(1)).default([]),
  order: z.number().int().nonnegative().optional(),
  status: clientStatusSchema,
  metadata: z.record(z.unknown()).nullable().optional(),
  rawPayload: z.record(z.unknown()),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
