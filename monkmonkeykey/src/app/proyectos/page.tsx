"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import {
  PROJECTS,
  PROJECT_CATEGORY_LABELS,
  translateValue,
  type ProjectCategory,
} from "@/content/projects";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

const PAGE_TITLE = {
  es: "Proyectos destacados",
  en: "Featured work",
} as const;

const PAGE_COPY = {
  es: "Casos en los que acompañamos a equipos de producto, museografía y marcas para desplegar experiencias memorables.",
  en: "Projects where we partner with product, museography, and brand teams to deploy memorable experiences.",
} as const;

const FILTER_LABEL = {
  es: "Filtrar por",
  en: "Filter by",
} as const;

const FILTER_ALL = {
  es: "Todos",
  en: "All",
} as const;

const DETAILS_TITLE = {
  es: "Ficha del proyecto",
  en: "Project details",
} as const;

const YEAR_LABEL = {
  es: "Año",
  en: "Year",
} as const;

const CLIENT_LABEL = {
  es: "Cliente",
  en: "Client",
} as const;

const LOCATION_LABEL = {
  es: "Lugar",
  en: "Location",
} as const;

const GALLERY_TITLE = {
  es: "Galería",
  en: "Gallery",
} as const;

const EMPTY_STATE = {
  es: "No hay proyectos para esta categoría todavía.",
  en: "There are no projects for this category yet.",
} as const;

export default function ProjectsPage() {
  const { locale } = useLocale();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");

  const categories = useMemo(() => {
    const unique = new Set<ProjectCategory>();

    PROJECTS.forEach((project) => {
      project.categories.forEach((category) => unique.add(category));
    });

    return Array.from(unique);
  }, []);

  const filteredProjects = activeCategory === "all"
    ? PROJECTS
    : PROJECTS.filter((project) => project.categories.includes(activeCategory));

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {translate(locale, PAGE_TITLE)}
          </h1>
          <p className="text-base text-foreground/70 sm:text-lg">
            {translate(locale, PAGE_COPY)}
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
          <Image
            src="/images/projects-visual.svg"
            alt={
              locale === "es"
                ? "Ilustración abstracta de tableros de proyecto"
                : "Abstract illustration of project boards"
            }
            fill
            sizes="(min-width: 1024px) 384px, 100vw"
            className="object-cover"
          />
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
          {translate(locale, FILTER_LABEL)}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              activeCategory === "all"
                ? "border-foreground/20 bg-foreground/10 text-foreground"
                : "border-foreground/10 text-foreground/60 hover:border-foreground/20 hover:text-foreground"
            }`}
          >
            {translate(locale, FILTER_ALL)}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                activeCategory === category
                  ? "border-foreground/20 bg-foreground/10 text-foreground"
                  : "border-foreground/10 text-foreground/60 hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {translate(locale, PROJECT_CATEGORY_LABELS[category])}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {filteredProjects.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-foreground/10 bg-foreground/5 p-6 text-sm text-foreground/60">
            {translate(locale, EMPTY_STATE)}
          </p>
        ) : (
          filteredProjects.map((project) => {
            const detailItems = [
              { label: YEAR_LABEL, value: project.year },
              { label: CLIENT_LABEL, value: project.client },
              { label: LOCATION_LABEL, value: project.location },
              ...project.meta,
            ];

            return (
              <article
                key={project.slug}
                id={project.slug}
                className="scroll-mt-28 space-y-8 rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm lg:p-10"
              >
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:items-start">
                  <div className="space-y-6">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
                      <Image
                        src={project.cover.src}
                        alt={translate(locale, project.cover.alt)}
                        fill
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-3xl font-semibold tracking-tight">
                            {translate(locale, project.name)}
                          </h2>
                          <span className="inline-flex items-center rounded-full border border-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/50">
                            {project.year}
                          </span>
                        </div>
                        <p className="text-lg text-foreground/70">
                          {translate(locale, project.subtitle)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.categories.map((category) => (
                            <span
                              key={`${project.slug}-${category}`}
                              className="rounded-full border border-foreground/10 px-3 py-1 text-xs font-medium text-foreground/70"
                            >
                              {translate(locale, PROJECT_CATEGORY_LABELS[category])}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
                        {project.description.map((paragraph, index) => (
                          <p key={`${project.slug}-paragraph-${index}`}>
                            {translate(locale, paragraph)}
                          </p>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
                          {translate(locale, GALLERY_TITLE)}
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {project.gallery.map((image, index) => (
                            <div
                              key={`${project.slug}-gallery-${index}`}
                              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5"
                            >
                              <Image
                                src={image.src}
                                alt={translate(locale, image.alt)}
                                fill
                                sizes="(min-width: 1024px) 20vw, 100vw"
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-6 rounded-3xl border border-foreground/10 bg-foreground/5 p-6">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
                      {translate(locale, DETAILS_TITLE)}
                    </h3>
                    <dl className="space-y-4 text-sm text-foreground/80">
                      {detailItems.map((detail) => (
                        <div key={`${project.slug}-${detail.label.es}`} className="space-y-1">
                          <dt className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                            {translate(locale, detail.label)}
                          </dt>
                          <dd className="text-base text-foreground/80">
                            {translateValue(locale, detail.value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </aside>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
