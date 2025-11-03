"use client";

import Image from "next/image";

import { PROJECTS } from "@/content/projects";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

const PAGE_TITLE = {
  es: "Proyectos destacados",
  en: "Featured work",
} as const;

const PAGE_COPY = {
  es: "Casos en los que acompañamos a equipos de producto para escalar operaciones, lanzar nuevos modelos o elevar la experiencia de usuario.",
  en: "Projects where we partnered with product teams to scale operations, launch new models, or elevate the user experience.",
} as const;

export default function ProjectsPage() {
  const { locale } = useLocale();

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
            className="object-cover"
          />
        </div>
      </header>

      <div className="space-y-10">
        {PROJECTS.map((project) => (
          <article
            key={project.slug}
            id={project.slug}
            className="scroll-mt-28 rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {project.client}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  {translate(locale, project.title)}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-foreground/10 px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-foreground/5 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {locale === "es" ? "Desafío" : "Challenge"}
                </p>
                <p className="mt-2 text-sm text-foreground/80">
                  {translate(locale, project.challenge)}
                </p>
              </div>
              <div className="rounded-2xl bg-foreground/5 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {locale === "es" ? "Enfoque" : "Approach"}
                </p>
                <p className="mt-2 text-sm text-foreground/80">
                  {translate(locale, project.approach)}
                </p>
              </div>
              <div className="rounded-2xl bg-foreground/5 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {locale === "es" ? "Impacto" : "Impact"}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground/90">
                  {translate(locale, project.impact)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
