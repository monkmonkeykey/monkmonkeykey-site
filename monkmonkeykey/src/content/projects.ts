import fs from "node:fs";
import path from "node:path";

import type { Locale, LocaleText } from "@/lib/i18n";

export type LocalizedValue = string | LocaleText;

export type ProjectGalleryImage = {
  src: string;
  alt: LocaleText;
};

export type ProjectCategory =
  | "museografia"
  | "experiencias-digitales"
  | "branding";

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, LocaleText> = {
  museografia: {
    es: "Museografía",
    en: "Museography",
  },
  "experiencias-digitales": {
    es: "Experiencias digitales",
    en: "Digital experiences",
  },
  branding: {
    es: "Branding",
    en: "Branding",
  },
};

export type Project = {
  slug: string;
  name: LocaleText;
  subtitle: LocaleText;
  categories: ProjectCategory[];
  year: string;
  client: LocalizedValue;
  location: LocalizedValue;
  cover: ProjectGalleryImage;
  gallery: ProjectGalleryImage[];
  description: LocaleText[];
  meta: { label: LocaleText; value: LocalizedValue }[];
};

type ProjectFrontmatter = {
  order?: number;
  slug: string;
  name: LocaleText;
  subtitle: LocaleText;
  categories: ProjectCategory[];
  year: string;
  client: LocalizedValue;
  location: LocalizedValue;
  cover: ProjectGalleryImage;
  gallery: ProjectGalleryImage[];
  description: Record<Locale, string[]>;
  meta: { label: LocaleText; value: LocalizedValue }[];
};

const FRONTMATTER_REGEX = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*/;
const PROJECTS_DIR = path.join(process.cwd(), "content/projects");

export const translateValue = (locale: Locale, value: LocalizedValue): string => {
  if (typeof value === "string") {
    return value;
  }

  return value[locale];
};

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

const parseLocalizedValue = (value: unknown, field: string): LocalizedValue => {
  if (typeof value === "string") {
    return value;
  }

  return parseLocaleText(value, field);
};

const parseGallery = (value: unknown, projectName: string): ProjectGalleryImage[] => {
  if (!Array.isArray(value)) {
    throw new Error(`Gallery for ${projectName} must be an array`);
  }

  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Gallery item ${index + 1} for ${projectName} is invalid`);
    }

    const src = (item as Record<string, unknown>).src;
    const alt = (item as Record<string, unknown>).alt;

    if (typeof src !== "string") {
      throw new Error(`Gallery item ${index + 1} for ${projectName} is missing a src`);
    }

    return {
      src,
      alt: parseLocaleText(alt, `${projectName} gallery alt ${index + 1}`),
    };
  });
};

const parseDescription = (
  value: Record<Locale, string[]>,
  projectName: string,
): LocaleText[] => {
  const es = Array.isArray(value.es) ? value.es : [];
  const en = Array.isArray(value.en) ? value.en : [];
  const length = Math.max(es.length, en.length);

  if (length === 0) {
    throw new Error(`Description for ${projectName} must include at least one paragraph`);
  }

  return Array.from({ length }, (_, index) => ({
    es: es[index] ?? "",
    en: en[index] ?? "",
  }));
};

const parseMeta = (
  value: { label: LocaleText; value: LocalizedValue }[] | undefined,
  projectName: string,
): { label: LocaleText; value: LocalizedValue }[] => {
  if (!value) {
    return [];
  }

  return value.map((item, index) => ({
    label: parseLocaleText(item.label, `${projectName} meta label ${index + 1}`),
    value: parseLocalizedValue(item.value, `${projectName} meta value ${index + 1}`),
  }));
};

const readProjectFile = (filePath: string): { project: Project; order: number } => {
  const rawContent = fs.readFileSync(filePath, "utf8");
  const match = rawContent.match(FRONTMATTER_REGEX);

  if (!match) {
    throw new Error(`Project file ${filePath} is missing frontmatter`);
  }

  const frontmatter = JSON.parse(match[1].trim()) as ProjectFrontmatter;

  if (!frontmatter.slug) {
    throw new Error(`Project file ${filePath} is missing a slug`);
  }

  const name = parseLocaleText(frontmatter.name, `${frontmatter.slug} name`);
  const subtitle = parseLocaleText(frontmatter.subtitle, `${frontmatter.slug} subtitle`);
  const cover = {
    src: frontmatter.cover?.src ?? "",
    alt: parseLocaleText(frontmatter.cover?.alt, `${frontmatter.slug} cover alt`),
  };

  if (!cover.src) {
    throw new Error(`Project file ${filePath} must include a cover src`);
  }

  const project: Project = {
    slug: frontmatter.slug,
    name,
    subtitle,
    categories: frontmatter.categories ?? [],
    year: frontmatter.year,
    client: parseLocalizedValue(frontmatter.client, `${frontmatter.slug} client`),
    location: parseLocalizedValue(frontmatter.location, `${frontmatter.slug} location`),
    cover,
    gallery: parseGallery(frontmatter.gallery, frontmatter.slug),
    description: parseDescription(frontmatter.description, frontmatter.slug),
    meta: parseMeta(frontmatter.meta, frontmatter.slug),
  };

  return { project, order: frontmatter.order ?? Number.MAX_SAFE_INTEGER };
};

const PROJECT_FILES = fs
  .readdirSync(PROJECTS_DIR)
  .filter((file) => file.endsWith(".md"))
  .map((file) => path.join(PROJECTS_DIR, file));

export const PROJECTS: Project[] = PROJECT_FILES
  .map(readProjectFile)
  .sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }

    return a.project.slug.localeCompare(b.project.slug);
  })
  .map(({ project }) => project);
