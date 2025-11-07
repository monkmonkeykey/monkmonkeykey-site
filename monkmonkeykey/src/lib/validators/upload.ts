import { z } from "zod";

export const normalizedAssetSchema = z.object({
  publicId: z.string().min(1, "El identificador público es obligatorio."),
  secureUrl: z.string().url("La URL segura proporcionada no es válida."),
  originalFilename: z.string().optional(),
  resourceType: z.string().optional(),
  folder: z.string().optional(),
  format: z.string().optional(),
  bytes: z
    .number({ invalid_type_error: "Los bytes deben ser un número." })
    .int("Los bytes deben ser un número entero.")
    .nonnegative("Los bytes no pueden ser negativos."),
  width: z
    .number()
    .int("El ancho debe ser un número entero.")
    .nonnegative("El ancho no puede ser negativo.")
    .optional(),
  height: z
    .number()
    .int("La altura debe ser un número entero.")
    .nonnegative("La altura no puede ser negativa.")
    .optional(),
  metadata: z.record(z.any()).nullable().optional(),
  label: z.string().optional(),
});

export const createAssetsSchema = z.object({
  label: z.string().min(1).max(120).optional(),
  assets: z.array(normalizedAssetSchema).min(1, "Se requiere al menos un archivo."),
});

export type NormalizedAssetInput = z.infer<typeof normalizedAssetSchema>;
export type CreateAssetsInput = z.infer<typeof createAssetsSchema>;
