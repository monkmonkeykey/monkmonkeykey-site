import type { Client, ClientKind, ClientImage } from "@/content/clients";
import { buildCloudinaryImageUrl } from "@/server/cloudinary";
import { getMongoDatabase } from "@/server/mongodb";

export type ClientPayload = {
  slug: string;
  name: string;
  sector: { es: string; en: string };
  summary: { es: string; en: string };
  website?: string;
  image?: {
    alt: { es: string; en: string };
    src?: string;
    publicId?: string;
  } | null;
  kind?: ClientKind;
  order?: number | null;
};

type ClientDocument = {
  slug: string;
  name: string;
  sector: { es: string; en: string };
  summary: { es: string; en: string };
  website?: string;
  image?: (ClientImage & { publicId?: string }) | null;
  kind?: ClientKind;
  order?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
};

const normalizeImage = (
  image:
    | (ClientImage & { publicId?: string })
    | { alt: { es: string; en: string }; src?: string; publicId?: string }
    | undefined
    | null,
): (ClientImage & { publicId?: string }) | undefined => {
  if (!image) {
    return undefined;
  }

  const srcCandidate = "src" in image ? image.src : undefined;
  const src = srcCandidate || (image.publicId ? buildCloudinaryImageUrl(image.publicId) ?? "" : "");

  return {
    ...image,
    src,
  };
};

const normalizeClient = (document: ClientDocument): Client => {
  const image = normalizeImage(document.image);

  return {
    slug: document.slug,
    name: document.name,
    sector: document.sector,
    summary: document.summary,
    website: document.website,
    image,
    kind: document.kind ?? "client",
  } satisfies Client;
};

export const fetchClientsFromDatabase = async (): Promise<Client[] | null> => {
  const db = await getMongoDatabase();

  if (!db) {
    return null;
  }

  const collection = db.collection<ClientDocument>("clients");

  const documents = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1, name: 1 })
    .toArray();

  return documents.map(normalizeClient);
};

export const fetchClientBySlug = async (slug: string): Promise<Client | null> => {
  const db = await getMongoDatabase();

  if (!db) {
    return null;
  }

  const collection = db.collection<ClientDocument>("clients");

  const document = await collection.findOne({ slug }, { projection: { _id: 0 } });

  if (!document) {
    return null;
  }

  return normalizeClient(document);
};

const prepareClientDocument = (payload: ClientPayload) => {
  const baseImage = normalizeImage(payload.image ?? undefined);

  return {
    slug: payload.slug,
    name: payload.name,
    sector: payload.sector,
    summary: payload.summary,
    website: payload.website,
    image: baseImage,
    kind: payload.kind ?? "client",
    order: payload.order ?? null,
    updatedAt: new Date(),
  };
};

export const upsertClient = async (payload: ClientPayload): Promise<Client | null> => {
  const db = await getMongoDatabase();

  if (!db) {
    return null;
  }

  const collection = db.collection<ClientDocument>("clients");

  const document = prepareClientDocument(payload);

  await collection.updateOne(
    { slug: payload.slug },
    {
      $set: document,
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );

  const stored = await collection.findOne({ slug: payload.slug }, { projection: { _id: 0 } });

  return stored ? normalizeClient(stored) : null;
};

export const deleteClient = async (slug: string): Promise<boolean> => {
  const db = await getMongoDatabase();

  if (!db) {
    return false;
  }

  const collection = db.collection<ClientDocument>("clients");

  const result = await collection.deleteOne({ slug });
  return (result.deletedCount ?? 0) > 0;
};

export const ensureClientIndexes = async (): Promise<void> => {
  const db = await getMongoDatabase();

  if (!db) {
    return;
  }

  const collection = db.collection<ClientDocument>("clients");

  await collection.createIndex({ slug: 1 }, { unique: true });
  await collection.createIndex({ order: 1, name: 1 });
};

