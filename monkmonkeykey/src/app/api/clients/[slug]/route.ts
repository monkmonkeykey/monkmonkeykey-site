import { NextResponse } from "next/server";

import type { Client } from "@/content/clients";
import { getClientBySlug, refreshClientsCache } from "@/data/clients";
import { hasDatabaseConfig } from "@/lib/env";
import { deleteClient, upsertClient } from "@/server/clients";
import { clientPayloadSchema } from "@/server/validation";
import { verifyRequestSession } from "@/server/auth";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const params = await context.params;
  const client = await getClientBySlug(params.slug);

  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(client satisfies Client);
}

export async function PATCH(request: Request, context: RouteContext) {
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

  const params = await context.params;

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const bodyRecord: Record<string, unknown> =
    typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>) : {};

  const parseResult = clientPayloadSchema.safeParse({ ...bodyRecord, slug: params.slug });

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

export async function DELETE(request: Request, context: RouteContext) {
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

  const params = await context.params;

  const success = await deleteClient(params.slug);

  if (!success) {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }

  await refreshClientsCache();
  return NextResponse.json({ success: true });
}
