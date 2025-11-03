"use client";

import Image from "next/image";
import Link from "next/link";
import { CLIENTS } from "@/content/clients";
import {
  PROJECTS,
  PROJECT_CATEGORY_LABELS,
  translateValue,
} from "@/content/projects";
import { SERVICES } from "@/content/services";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

const HERO_HEADLINE = {
  es: "Un socio estratégico para escalar tus productos digitales",
  en: "A strategic partner to scale your digital products",
} as const;

const HERO_SUBTITLE = {
  es: "Unimos estrategia, diseño y growth para que cada release conecte con tus objetivos de negocio.",
  en: "We combine strategy, design, and growth so every release matches your business goals.",
} as const;

const HERO_PRIMARY = {
  es: "Agenda una llamada",
  en: "Book a call",
} as const;

const HERO_SECONDARY = {
  es: "Ver proyectos",
  en: "View work",
} as const;

const HOME_SERVICES_TITLE = {
  es: "Cómo colaboramos",
  en: "How we collaborate",
} as const;

const HOME_SERVICES_COPY = {
  es: "Seleccionamos squads a medida para cada etapa: desde validar oportunidades hasta acelerar productos en producción.",
  en: "We assemble the right squad for every stage—from validating opportunities to accelerating products in production.",
} as const;

const HOME_PROJECTS_TITLE = {
  es: "Historias recientes",
  en: "Recent stories",
} as const;

const HOME_CLIENTS_TITLE = {
  es: "Equipos que confían en nosotros",
  en: "Teams that trust us",
} as const;

export default function HomePage() {
  const { locale } = useLocale();

  return (
    <div className="space-y-20">
      <section className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {translate(locale, HERO_HEADLINE)}
          </h1>
          <p className="text-base text-foreground/70 sm:text-lg">
            {translate(locale, HERO_SUBTITLE)}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              {translate(locale, HERO_PRIMARY)}
            </Link>
            <Link
              href="/proyectos"
              className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-semibold text-foreground transition hover:border-foreground/40 hover:text-foreground/80"
            >
              {translate(locale, HERO_SECONDARY)}
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
          <Image
            src="/images/hero-visual.svg"
            alt={
              locale === "es"
                ? "Ilustración abstracta del flujo de trabajo de producto"
                : "Abstract illustration of a product workflow"
            }
            fill
            priority
            className="object-cover"
          />
          <div className="relative grid gap-4 p-6 text-sm text-foreground/80 sm:p-8">
            <div className="rounded-2xl bg-background/90 p-4 shadow-sm backdrop-blur">
              <p className="font-semibold">Discovery</p>
              <p className="mt-2 text-sm text-foreground/70">
                {locale === "es"
                  ? "Sumamos investigación rápida y workshops con tu equipo para entender el contexto desde el inicio."
                  : "We run rapid research and workshops with your team to understand context from day one."}
              </p>
            </div>
            <div className="rounded-2xl bg-background/90 p-4 shadow-sm backdrop-blur">
              <p className="font-semibold">Delivery</p>
              <p className="mt-2 text-sm text-foreground/70">
                {locale === "es"
                  ? "Trabajamos en ciclos cortos, con prototipos validados y métricas claras por sprint."
                  : "We work in short cycles, with validated prototypes and clear metrics each sprint."}
              </p>
            </div>
            <div className="rounded-2xl bg-background/90 p-4 shadow-sm backdrop-blur">
              <p className="font-semibold">Growth</p>
              <p className="mt-2 text-sm text-foreground/70">
                {locale === "es"
                  ? "Activamos experimentos de crecimiento y aprendizaje continuo para sostener resultados."
                  : "We activate growth experiments and continuous learning to sustain outcomes."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {translate(locale, HOME_SERVICES_TITLE)}
            </h2>
            <p className="text-base text-foreground/70">
              {translate(locale, HOME_SERVICES_COPY)}
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
            <Image
              src="/images/services-visual.svg"
              alt={
                locale === "es"
                  ? "Ilustración abstracta de servicios modulares"
                  : "Abstract illustration of modular services"
              }
              fill
              className="object-cover"
            />
          </div>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.slug}
              className="flex h-full flex-col rounded-2xl border border-foreground/10 bg-background/80 p-5 shadow-sm transition hover:-translate-y-1 hover:border-foreground/20"
            >
              <h3 className="text-lg font-semibold">
                {translate(locale, service.title)}
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                {translate(locale, service.summary)}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/70">
                {service.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-foreground/60" aria-hidden />
                    <span>{translate(locale, outcome)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Link
                  href={`/servicios#${service.slug}`}
                  className="text-sm font-semibold text-foreground/80 transition hover:text-foreground"
                >
                  {locale === "es" ? "Ver detalle" : "See details"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {translate(locale, HOME_PROJECTS_TITLE)}
            </h2>
            <p className="text-base text-foreground/70">
              {locale === "es"
                ? "Casos end-to-end donde combinamos estrategia, diseño y crecimiento para entregar impacto medible."
                : "End-to-end projects where we blend strategy, design, and growth to deliver measurable impact."}
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
            <Image
              src="/images/projects-visual.svg"
              alt={
                locale === "es"
                  ? "Ilustración abstracta de tableros de proyectos"
                  : "Abstract illustration of project boards"
              }
              fill
              className="object-cover"
            />
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-2">
          {PROJECTS.slice(0, 2).map((project) => (
            <article
              key={project.slug}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-background shadow-sm"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-foreground/10 bg-foreground/5">
                <Image
                  src={project.cover.src}
                  alt={translate(locale, project.cover.alt)}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                    {translateValue(locale, project.client)}
                  </p>
                  <span className="inline-flex items-center rounded-full border border-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/50">
                    {project.year}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">
                  {translate(locale, project.name)}
                </h3>
                <p className="text-sm text-foreground/70">
                  {translate(locale, project.subtitle)}
                </p>
                <p className="text-sm text-foreground/70">
                  {translate(locale, project.description[0])}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-foreground/60">
                  {project.categories.map((category) => (
                    <span
                      key={`${project.slug}-cat-${category}`}
                      className="rounded-full border border-foreground/10 px-3 py-1"
                    >
                      {translate(locale, PROJECT_CATEGORY_LABELS[category])}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                    {translateValue(locale, project.location)}
                  </span>
                </div>
              </div>
              <div className="border-t border-foreground/10 bg-foreground/5 px-6 py-4">
                <Link
                  href={`/proyectos#${project.slug}`}
                  className="text-sm font-semibold text-foreground/80 transition hover:text-foreground"
                >
                  {locale === "es" ? "Ver caso completo" : "Read full case"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {translate(locale, HOME_CLIENTS_TITLE)}
            </h2>
            <p className="text-base text-foreground/70">
              {locale === "es"
                ? "Colaboramos con equipos de producto, innovación y data en toda Latinoamérica y Europa."
                : "We collaborate with product, innovation, and data teams across Latin America and Europe."}
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
            <Image
              src="/images/clients-visual.svg"
              alt={
                locale === "es"
                  ? "Ilustración abstracta de una red de clientes"
                  : "Abstract illustration of a client network"
              }
              fill
              className="object-cover"
            />
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CLIENTS.map((client) => (
            <article
              key={client.name}
              className="rounded-2xl border border-foreground/10 bg-background/80 p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-foreground/80">{client.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                {translate(locale, client.sector)}
              </p>
              <p className="mt-3 text-sm text-foreground/70">
                {translate(locale, client.summary)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
