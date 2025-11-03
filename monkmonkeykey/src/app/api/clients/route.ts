import { NextResponse } from "next/server";

import type { Client } from "@/content/clients";
import { getClients, refreshClientsCache } from "@/data/clients";
import { hasDatabaseConfig } from "@/lib/env";
import { clientPayloadSchema } from "@/server/validation";
import { upsertClient } from "@/server/clients";
import { verifyRequestSession } from "@/server/auth";

export async function GET() {
  const clients = await getClients();
  return NextResponse.json(clients satisfies Client[]);
}

export async function POST(request: Request) {
  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "Database is not configured. Set MONGODB_URI to enable admin actions." },
      { status: 500 },
    );
  }

  const session = verifyRequestSession(request.headers.get("cookie") ?? undefined);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parseResult = clientPayloadSchema.safeParse(payload);

  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
  }

  const client = await upsertClient(parseResult.data);

  if (!client) {
    return NextResponse.json({ error: "Failed to save client" }, { status: 500 });
  }

  await refreshClientsCache();
  return NextResponse.json(client satisfies Client);
}
