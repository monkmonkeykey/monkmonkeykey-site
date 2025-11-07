import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import {
  createClientSchema,
  type CreateClientInput,
} from "@/lib/validators/client";
import { ZodError, type z } from "zod";

const JSON_CONTENT_TYPE = "application/json";

type JsonRecord = Record<string, unknown>;

type CreateClientSchemaInput = z.input<typeof createClientSchema>;

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

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (isJsonRecord(item)) {
          return (
            getString(item.publicId) ??
            getString(item.public_id) ??
            getString(item.id) ??
            getString(item.value)
          );
        }

        return getString(item);
      })
      .filter((item): item is string => typeof item === "string");
  }

  const asString = getString(value);
  if (!asString) {
    return [];
  }

  return asString
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function parseMetadata(value: unknown): JsonRecord | null | undefined {
  if (value === null) {
    return null;
  }

  if (isJsonRecord(value)) {
    return value;
  }

  return undefined;
}

function toJsonRecord(value: unknown): JsonRecord | undefined {
  if (isJsonRecord(value)) {
    return value;
  }

  return undefined;
}

const STATUS_MAP: Record<string, CreateClientInput["status"]> = {
  draft: "DRAFT",
  borrador: "DRAFT",
  pending: "DRAFT",
  pendiente: "DRAFT",
  published: "PUBLISHED",
  activo: "PUBLISHED",
  active: "PUBLISHED",
  public: "PUBLISHED",
  publicado: "PUBLISHED",
  archived: "ARCHIVED",
  inactive: "ARCHIVED",
  inactivo: "ARCHIVED",
  archivado: "ARCHIVED",
};

const STATUS_VALUES = new Set<CreateClientInput["status"]>([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

function normalizeStatus(value: unknown): CreateClientInput["status"] {
  if (typeof value === "boolean") {
    return value ? "PUBLISHED" : "DRAFT";
  }

  const raw = getString(value)?.toLowerCase();
  if (!raw) {
    return "DRAFT";
  }

  const mapped = STATUS_MAP[raw];
  if (mapped) {
    return mapped;
  }

  const upper = raw.toUpperCase() as CreateClientInput["status"];
  if (STATUS_VALUES.has(upper)) {
    return upper;
  }

  return "DRAFT";
}

const CANDIDATE_RECORD_KEYS = [
  "client",
  "data",
  "payload",
  "body",
  "input",
  "form",
];

function getPrimaryRecord(record: JsonRecord): JsonRecord {
  for (const key of CANDIDATE_RECORD_KEYS) {
    const candidate = toJsonRecord(record[key]);
    if (candidate) {
      return candidate;
    }
  }

  return record;
}

const DIACRITIC_REGEX = /\p{Diacritic}/gu;
const NON_SLUG_CHARS = /[^a-z0-9]+/g;
const DUPLICATED_HYPHENS = /-{2,}/g;

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(DIACRITIC_REGEX, "")
    .toLowerCase()
    .replace(NON_SLUG_CHARS, "-")
    .replace(DUPLICATED_HYPHENS, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeClientPayload(payload: unknown): CreateClientSchemaInput {
  if (!isJsonRecord(payload)) {
    throw new Error("EMPTY_CLIENT_PAYLOAD");
  }

  const primary = getPrimaryRecord(payload);
  const rawPayload = primary;

  const name =
    getString(primary.name) ??
    getString(primary.title) ??
    getString(primary.nombre) ??
    getString(primary.razonSocial);

  if (!name) {
    throw new Error("MISSING_CLIENT_NAME");
  }

  const rawSlug =
    getString(primary.slug) ??
    getString(primary.identifier) ??
    getString(primary.handle) ??
    getString(primary.uid);

  const slug = rawSlug ? slugify(rawSlug) : slugify(name);

  if (!slug) {
    throw new Error("MISSING_CLIENT_SLUG");
  }

  const contact = toJsonRecord(primary.contact);

  const metadataCandidates = [
    primary.metadata,
    primary.extra,
    primary.additional,
    primary.settings,
  ];

  let metadata: JsonRecord | null | undefined;
  for (const candidate of metadataCandidates) {
    metadata = parseMetadata(candidate);
    if (metadata !== undefined) {
      break;
    }
  }

  const galleryCandidates = [
    primary.gallery,
    primary.galleryPublicIds,
    primary.galleryItems,
    primary.images,
    primary.resources,
    primary.media,
  ];

  const galleryPublicIds = galleryCandidates
    .flatMap((candidate) => parseStringArray(candidate))
    .filter((value, index, array) => array.indexOf(value) === index);

  const tags = Array.from(
    new Set(parseStringArray(primary.tags ?? primary.labels ?? primary.categories)),
  );

  const status = normalizeStatus(primary.status ?? primary.state ?? primary.published);

  return {
    name,
    slug,
    tagline:
      getString(primary.tagline) ??
      getString(primary.subtitle) ??
      getString(primary.slogan) ??
      undefined,
    summary:
      getString(primary.summary) ??
      getString(primary.extract) ??
      getString(primary.resumen) ??
      undefined,
    description:
      getString(primary.description) ??
      getString(primary.body) ??
      getString(primary.content) ??
      undefined,
    website:
      getString(primary.website) ??
      getString(primary.websiteUrl) ??
      getString(primary.url) ??
      getString(primary.sitioWeb) ??
      undefined,
    email: getString(primary.email) ?? getString(primary.mail) ?? undefined,
    phone: getString(primary.phone) ?? getString(primary.telefono) ?? undefined,
    contactName:
      getString(primary.contactName) ??
      getString(primary.representative) ??
      getString(contact?.name) ??
      undefined,
    contactEmail:
      getString(primary.contactEmail) ??
      getString(contact?.email) ??
      undefined,
    contactPhone:
      getString(primary.contactPhone) ??
      getString(contact?.phone) ??
      undefined,
    logoPublicId:
      getString(primary.logoPublicId) ??
      getString(primary.logoAssetId) ??
      getString(primary.logo) ??
      getString(primary.logoId) ??
      undefined,
    heroPublicId:
      getString(primary.heroPublicId) ??
      getString(primary.coverPublicId) ??
      getString(primary.coverAssetId) ??
      getString(primary.hero) ??
      getString(primary.cover) ??
      undefined,
    galleryPublicIds,
    tags,
    order:
      parsePositiveInt(primary.order ?? primary.position ?? primary.priority ?? primary.index) ??
      undefined,
    status,
    metadata,
    rawPayload,
  } satisfies CreateClientSchemaInput;
}

function formatValidationIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export async function POST(request: NextRequest) {
  let payload: CreateClientInput;

  try {
    if (request.headers.get("content-type")?.includes(JSON_CONTENT_TYPE)) {
      const json = (await request.json()) as unknown;
      payload = createClientSchema.parse(normalizeClientPayload(json));
    } else {
      const formData = await request.formData();
      const raw = formData.get("payload");
      const serialized =
        typeof raw === "string"
          ? raw
          : typeof raw === "object" && raw !== null
            ? JSON.stringify(Object.fromEntries(formData.entries()))
            : undefined;

      if (!serialized) {
        throw new Error("EMPTY_CLIENT_PAYLOAD");
      }

      const parsed = JSON.parse(serialized) as unknown;
      payload = createClientSchema.parse(normalizeClientPayload(parsed));
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
          error: "La información del cliente es inválida.",
          issues: formatValidationIssues(error),
        },
        { status: 400 },
      );
    }

    if ((error as Error).message === "MISSING_CLIENT_NAME") {
      return NextResponse.json(
        {
          error: "El nombre del cliente es obligatorio.",
        },
        { status: 400 },
      );
    }

    if ((error as Error).message === "EMPTY_CLIENT_PAYLOAD") {
      return NextResponse.json(
        {
          error: "No se recibió información del cliente en la solicitud.",
        },
        { status: 400 },
      );
    }

    if ((error as Error).message === "MISSING_CLIENT_SLUG") {
      return NextResponse.json(
        {
          error: "No fue posible generar un identificador único para el cliente.",
        },
        { status: 400 },
      );
    }

    console.error("[clients.parse]", error);
    return NextResponse.json(
      {
        error: "No se pudo procesar la información del cliente.",
      },
      { status: 400 },
    );
  }

  try {
    const savedClient = await prisma.client.upsert({
      where: { slug: payload.slug },
      update: {
        name: payload.name,
        tagline: payload.tagline ?? null,
        summary: payload.summary ?? null,
        description: payload.description ?? null,
        website: payload.website ?? null,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        contactName: payload.contactName ?? null,
        contactEmail: payload.contactEmail ?? null,
        contactPhone: payload.contactPhone ?? null,
        logoPublicId: payload.logoPublicId ?? null,
        heroPublicId: payload.heroPublicId ?? null,
        galleryPublicIds: payload.galleryPublicIds,
        tags: payload.tags,
        order: payload.order ?? null,
        status: payload.status,
        metadata: (payload.metadata as Prisma.JsonValue | null | undefined) ?? null,
        rawPayload: (payload.rawPayload as Prisma.JsonValue | undefined) ?? null,
      },
      create: {
        name: payload.name,
        slug: payload.slug,
        tagline: payload.tagline ?? null,
        summary: payload.summary ?? null,
        description: payload.description ?? null,
        website: payload.website ?? null,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        contactName: payload.contactName ?? null,
        contactEmail: payload.contactEmail ?? null,
        contactPhone: payload.contactPhone ?? null,
        logoPublicId: payload.logoPublicId ?? null,
        heroPublicId: payload.heroPublicId ?? null,
        galleryPublicIds: payload.galleryPublicIds,
        tags: payload.tags,
        order: payload.order ?? null,
        status: payload.status,
        metadata: (payload.metadata as Prisma.JsonValue | null | undefined) ?? null,
        rawPayload: (payload.rawPayload as Prisma.JsonValue | undefined) ?? null,
      },
    });

    return NextResponse.json(
      {
        message: "El cliente fue guardado correctamente.",
        client: savedClient,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[clients.persist]", error);
    return NextResponse.json(
      {
        error: "No fue posible guardar la información del cliente.",
      },
      { status: 500 },
    );
  }
}
