import { env } from "@/lib/env";

type MongoFindCursor<T> = {
  sort(sort: Record<string, number>): MongoFindCursor<T>;
  toArray(): Promise<T[]>;
};

export type MongoCollection<T> = {
  find(query?: Record<string, unknown>, options?: Record<string, unknown>): MongoFindCursor<T>;
  findOne(query: Record<string, unknown>, options?: Record<string, unknown>): Promise<T | null>;
  updateOne(
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<unknown>;
  deleteOne(filter: Record<string, unknown>): Promise<{ deletedCount?: number }>;
  createIndex(keys: Record<string, number>, options?: Record<string, unknown>): Promise<unknown>;
};

export type MongoDatabase = {
  collection<T = unknown>(name: string): MongoCollection<T>;
};

type MongoClientInstance = {
  connect(): Promise<MongoClientInstance>;
  db(name?: string): MongoDatabase;
};

type MongoModule = {
  MongoClient: new (uri: string, options?: Record<string, unknown>) => MongoClientInstance;
};

let mongoModule: MongoModule | null | undefined;
let mongoModulePromise: Promise<MongoModule | null> | null = null;
let mongoClientPromise: Promise<MongoClientInstance> | null = null;
let mongoClient: MongoClientInstance | null = null;
let warnedMissingDriver = false;
let warnedConnectionFailure = false;
const RETRY_DELAY_MS = 5 * 60 * 1000;
let nextRetryTimestamp = 0;

const loadMongoModule = async (): Promise<MongoModule | null> => {
  if (mongoModule !== undefined) {
    return mongoModule;
  }

  if (!mongoModulePromise) {
    mongoModulePromise = import("mongodb")
      .then((module) => {
        mongoModule = module as MongoModule;
        return mongoModule;
      })
      .catch((error) => {
        mongoModule = null;

        if (!warnedMissingDriver) {
          warnedMissingDriver = true;
          const errorMessage =
            error instanceof Error ? error.message : "Unknown MongoDB driver load error";
          console.warn(
            `MongoDB driver failed to load. Install it with \`npm install mongodb\` to enable database features. Error: ${errorMessage}`,
          );
        }

        return null;
      })
      .finally(() => {
        mongoModulePromise = null;
      });
  }

  return mongoModulePromise;
};

export const getMongoClient = async (): Promise<MongoClientInstance | null> => {
  if (!env.mongodbUri) {
    return null;
  }

  if (nextRetryTimestamp > Date.now()) {
    return null;
  }

  const mongodb = await loadMongoModule();

  if (!mongodb) {
    return null;
  }

  if (!mongoClientPromise) {
    mongoClient = new mongodb.MongoClient(env.mongodbUri, {
      maxPoolSize: 5,
    });
    mongoClientPromise = mongoClient.connect().then((client) => {
      mongoClient = client;
      return client;
    });
  }

  try {
    const client = await mongoClientPromise;
    mongoClient = client;
    return client;
  } catch (error) {
    mongoClientPromise = null;
    mongoClient = null;
    nextRetryTimestamp = Date.now() + RETRY_DELAY_MS;

    if (!warnedConnectionFailure) {
      warnedConnectionFailure = true;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown MongoDB connection error";
      console.error(
        `Failed to connect to MongoDB. Falling back to Markdown content. Error: ${errorMessage}`,
      );
    }

    return null;
  }
};

export const getMongoDatabase = async (): Promise<MongoDatabase | null> => {
  const client = await getMongoClient();

  if (!client) {
    return null;
  }

  const databaseName = env.mongodbDb || undefined;
  return client.db(databaseName);
};
