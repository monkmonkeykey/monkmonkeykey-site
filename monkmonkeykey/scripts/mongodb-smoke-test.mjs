#!/usr/bin/env node
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "monkmonkeykey";

if (!uri) {
  console.error("[mongo-smoke-test] Define MONGODB_URI para ejecutar la prueba.");
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

const randomSlug = () => `debug-${Math.random().toString(36).slice(2, 8)}`;

async function main() {
  const slug = randomSlug();
  const payload = {
    slug,
    name: "Cliente de prueba",
    kind: "client",
    sector: { es: "Tecnología", en: "Technology" },
    summary: { es: "Registro de diagnóstico", en: "Diagnostic record" },
    website: "https://example.org",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const start = Date.now();
    await client.connect();
    console.log(`[mongo-smoke-test] Conectado en ${Date.now() - start}ms`);

    const db = client.db(dbName);
    const collection = db.collection("clients");

    await collection.insertOne(payload);
    console.log(`[mongo-smoke-test] Insertado documento con slug ${slug}`);

    const stored = await collection.findOne({ slug }, { projection: { _id: 0 } });
    console.log("[mongo-smoke-test] Documento recuperado:", stored);

    await collection.deleteOne({ slug });
    console.log("[mongo-smoke-test] Registro temporal eliminado. La conexión funciona correctamente.");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("[mongo-smoke-test] Error al conectar o consultar MongoDB:", error);
  process.exit(1);
});
