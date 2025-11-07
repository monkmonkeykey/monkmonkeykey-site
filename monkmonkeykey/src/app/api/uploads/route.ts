import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import {
  createAssetsSchema,
  type CreateAssetsInput,
  type NormalizedAssetInput,
} from "@/lib/validators/upload";
import { ZodError } from "zod";

type JsonRecord = Record<string, unknown>;

type NormalizedPayload = {
  label?: string;
  assets: NormalizedAssetInput[];
};

const JSON_CONTENT_TYPE = "application/json";

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parsePositiveInt(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (!Number.isFinite(numericValue)) {
    return undefined;
  }

  const intValue = Math.trunc(numericValue);
  if (intValue < 0) {
    return undefined;
  }

  return intValue;
}

function normalizeMetadata(value: unknown): JsonRecord | null | undefined {
  if (value === null) {
    return null;
  }

  if (isJsonRecord(value)) {
    return value;
  }

  return undefined;
}

function normalizeAsset(
  raw: JsonRecord,
  fallbackLabel?: string,
): NormalizedAssetInput {
  const publicId =
    getString(raw.publicId) ?? getString(raw.public_id) ?? "";
  const secureUrl =
    getString(raw.secureUrl) ?? getString(raw.secure_url) ?? "";
  const originalFilename =
    getString(raw.originalFilename) ?? getString(raw.original_filename);
  const resourceType =
    getString(raw.resourceType) ?? getString(raw.resource_type);
  const folder = getString(raw.folder) ?? getString(raw.folder_path);
  const format = getString(raw.format);
  const bytes = parsePositiveInt(raw.bytes ?? raw.size);
  const width = parsePositiveInt(raw.width);
  const height = parsePositiveInt(raw.height);
  const label = getString(raw.label) ?? fallbackLabel;
  const metadata = normalizeMetadata(raw.metadata ?? raw.context);

  return {
    publicId,
    secureUrl,
    originalFilename,
    resourceType,
    folder,
    format,
    bytes: bytes ?? -1,
    width,
    height,
    label,
    metadata,
  } satisfies NormalizedAssetInput;
}

function normalizePayload(payload: unknown): NormalizedPayload {
  if (!isJsonRecord(payload)) {
    return { assets: [] };
  }

  const fallbackLabel = getString(payload.label);

  const candidates = [
    payload.assets,
    payload.files,
    payload.resources,
    payload.uploads,
    payload.items,
    payload.result,
  ];

  let rawAssets: unknown[] = [];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      rawAssets = candidate;
      break;
    }

    if (isJsonRecord(candidate)) {
      rawAssets = [candidate];
      break;
    }
  }

  const assets = rawAssets
    .filter(isJsonRecord)
    .map((asset) => normalizeAsset(asset, fallbackLabel));

  return {
    label: fallbackLabel,
    assets,
  } satisfies NormalizedPayload;
}

function formatValidationIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export async function POST(request: NextRequest) {
  let payload: CreateAssetsInput;

  try {
    if (request.headers.get("content-type")?.includes(JSON_CONTENT_TYPE)) {
      const json = await request.json();
      payload = createAssetsSchema.parse(normalizePayload(json));
    } else {
      // Support form submissions containing a JSON payload under the `payload` key.
      const formData = await request.formData();
      const raw = formData.get("payload");
      if (typeof raw !== "string") {
        throw new Error("EMPTY_PAYLOAD");
      }

      const parsed = JSON.parse(raw) as unknown;
      payload = createAssetsSchema.parse(normalizePayload(parsed));
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "No se pudo interpretar el cuerpo de la solicitud.",
        },
        { status: 400 },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "La información recibida es inválida.",
          issues: formatValidationIssues(error),
        },
        { status: 400 },
      );
    }

    if ((error as Error).message === "EMPTY_PAYLOAD") {
      return NextResponse.json(
        {
          error: "No se encontró información de archivos en la solicitud.",
        },
        { status: 400 },
      );
    }

    console.error("[uploads.parse]", error);
    return NextResponse.json(
      {
        error: "No se pudo procesar la información enviada.",
      },
      { status: 400 },
    );
  }

  try {
    const savedAssets = await prisma.$transaction(
      payload.assets.map((asset) => {
        const label = asset.label ?? payload.label ?? null;
        const sharedData = {
          secureUrl: asset.secureUrl,
          originalFilename: asset.originalFilename ?? null,
          resourceType: asset.resourceType ?? null,
          folder: asset.folder ?? null,
          format: asset.format ?? null,
          bytes: asset.bytes,
          width: asset.width ?? null,
          height: asset.height ?? null,
          label,
          metadata: (asset.metadata as Prisma.JsonValue | null | undefined) ?? null,
        } satisfies Omit<Prisma.AssetUncheckedCreateInput, "publicId" | "id">;

        return prisma.asset.upsert({
          where: { publicId: asset.publicId },
          update: sharedData,
          create: {
            publicId: asset.publicId,
            ...sharedData,
          },
        });
      }),
    );

    const message =
      savedAssets.length === 1
        ? "Se registró 1 archivo en la base de datos."
        : `Se registraron ${savedAssets.length} archivos en la base de datos.`;

    return NextResponse.json(
      {
        message,
        assets: savedAssets,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[uploads.persist]", error);
    return NextResponse.json(
      {
        error: "No fue posible guardar la información de los archivos.",
      },
      { status: 500 },
    );
  }
}
