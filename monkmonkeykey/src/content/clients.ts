import fs from "node:fs";
import path from "node:path";

import type { LocaleText } from "@/lib/i18n";

export type Client = {
  name: string;
  sector: LocaleText;
  summary: LocaleText;
};

type ClientFrontmatter = {
  order?: number;
  name: string;
  sector: LocaleText;
  summary: LocaleText;
};

const FRONTMATTER_REGEX = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*/;
const CLIENTS_DIR = path.join(process.cwd(), "content/clients");

const parseLocaleText = (value: unknown, field: string): LocaleText => {
  if (
    !value ||
    typeof value !== "object" ||
    !("es" in value) ||
    !("en" in value)
  ) {
    throw new Error(`Missing locale values for ${field}`);
  }

  const es = (value as Record<string, unknown>).es;
  const en = (value as Record<string, unknown>).en;

  if (typeof es !== "string" || typeof en !== "string") {
    throw new Error(`Locale values for ${field} must be strings`);
  }

  return { es, en };
};

const readClientFile = (filePath: string): { client: Client; order: number } => {
  const rawContent = fs.readFileSync(filePath, "utf8");
  const match = rawContent.match(FRONTMATTER_REGEX);

  if (!match) {
    throw new Error(`Client file ${filePath} is missing frontmatter`);
  }

  const frontmatter = JSON.parse(match[1].trim()) as ClientFrontmatter;

  if (!frontmatter.name) {
    throw new Error(`Client file ${filePath} is missing a name`);
  }

  const client: Client = {
    name: frontmatter.name,
    sector: parseLocaleText(frontmatter.sector, `${frontmatter.name} sector`),
    summary: parseLocaleText(frontmatter.summary, `${frontmatter.name} summary`),
  };

  return { client, order: frontmatter.order ?? Number.MAX_SAFE_INTEGER };
};

const CLIENT_FILES = fs
  .readdirSync(CLIENTS_DIR)
  .filter((file) => file.endsWith(".md"))
  .map((file) => path.join(CLIENTS_DIR, file));

export const CLIENTS: Client[] = CLIENT_FILES
  .map(readClientFile)
  .sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }

    return a.client.name.localeCompare(b.client.name);
  })
  .map(({ client }) => client);
