"use client";

import { useMemo, useState } from "react";

type Locale = "es" | "en";

type TranslationMap = {
  es: string;
  en: string;
};

type Feature = {
  icon: string;
  title: TranslationMap;
  description: TranslationMap;
};

type Step = {
  title: TranslationMap;
  description: TranslationMap;
};

type Testimonial = {
  quote: TranslationMap;
  author: string;
  role: TranslationMap;
};

type Stat = {
  value: string;
  label: TranslationMap;
};

const NAV_ITEMS: { id: string; label: TranslationMap }[] = [
  { id: "services", label: { es: "Servicios", en: "Services" } },
  { id: "process", label: { es: "Proceso", en: "Process" } },
  { id: "work", label: { es: "Casos", en: "Case studies" } },
  { id: "contact", label: { es: "Contacto", en: "Contact" } },
];

const STATS: Stat[] = [
  {
    value: "30+",
    label: {
      es: "productos impulsados con nuestra estrategia",
      en: "products launched with our strategy",
    },
  },
  {
    value: "9/10",
    label: {
      es: "de satisfacción promedio de nuestros clientes",
      en: "average satisfaction rating from our partners",
    },
  },
  {
    value: "12",
    label: {
      es: "años construyendo experiencias digitales",
      en: "years building digital experiences",
    },
  },
];

const FEATURES: Feature[] = [
  {
    icon: "🧭",
    title: {
      es: "Estrategia de producto",
      en: "Product strategy",
    },
    description: {
      es: "Validamos hipótesis, definimos métricas de éxito y priorizamos el roadmap con foco en valor de negocio.",
      en: "We validate hypotheses, define success metrics, and prioritize the roadmap around business value.",
    },
  },
  {
    icon: "🎨",
    title: {
      es: "Diseño centrado en personas",
      en: "Human-centered design",
    },
    description: {
      es: "Investigamos, prototipamos y testeamos para crear experiencias accesibles y memorables.",
      en: "We research, prototype, and test to create accessible and memorable product experiences.",
    },
  },
  {
    icon: "🧪",
    title: {
      es: "Experimentación continua",
      en: "Continuous experimentation",
    },
    description: {
      es: "Implementamos experimentos rápidos para aprender con datos reales y reducir riesgos de lanzamiento.",
      en: "We run fast experiments to learn from real data and reduce launch risk.",
    },
  },
  {
    icon: "🚀",
    title: {
      es: "Acompañamiento end-to-end",
      en: "End-to-end partnership",
    },
    description: {
      es: "Desde la idea hasta el crecimiento sostenido, nos integramos con tu equipo para lograr resultados.",
      en: "From idea to sustained growth, we embed with your team to deliver results.",
    },
  },
];

const STEPS: Step[] = [
  {
    title: {
      es: "Descubrimiento profundo",
      en: "Deep discovery",
    },
    description: {
      es: "Entendemos contexto, equipo y métricas para diseñar un plan accionable desde el día uno.",
      en: "We understand context, team, and metrics to design an actionable plan from day one.",
    },
  },
  {
    title: {
      es: "Co-creación",
      en: "Co-creation",
    },
    description: {
      es: "Trabajamos junto a tus stakeholders con workshops, prototipos y decisiones basadas en evidencia.",
      en: "We facilitate workshops, prototypes, and evidence-based decisions with your stakeholders.",
    },
  },
  {
    title: {
      es: "Entrega iterativa",
      en: "Iterative delivery",
    },
    description: {
      es: "Alineamos diseño y desarrollo en ciclos cortos para que tu producto avance cada semana.",
      en: "Design and engineering advance together in short cycles so your product moves forward every week.",
    },
  },
  {
    title: {
      es: "Aprendizaje y crecimiento",
      en: "Learning & growth",
    },
    description: {
      es: "Medimos impacto, compartimos aprendizajes y ajustamos la estrategia para escalar con confianza.",
      en: "We measure impact, share learnings, and adjust strategy so you can scale confidently.",
    },
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote: {
      es: "Nos ayudaron a lanzar una primera versión en ocho semanas y validar el modelo con usuarios reales.",
      en: "They helped us ship the first version in eight weeks and validate the model with real users.",
    },
    author: "Camila R.",
    role: {
      es: "CEO · Fintech latinoamericana",
      en: "CEO · Latin American fintech",
    },
  },
  {
    quote: {
      es: "MonkMonkeyKey se integró como parte del equipo y nos dio claridad estratégica en cada sprint.",
      en: "MonkMonkeyKey embedded with our team and brought strategic clarity to every sprint.",
    },
    author: "Luis M.",
    role: {
      es: "Director de Producto · SaaS B2B",
      en: "Head of Product · B2B SaaS",
    },
  },
];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("es");

  const texts = useMemo(() => {
    return {
      tagline:
        locale === "es"
          ? "Estudio boutique de producto digital"
          : "Boutique digital product studio",
      heroTitle:
        locale === "es"
          ? "Transformamos ideas en productos que la gente ama usar."
          : "We turn bold ideas into products people love to use.",
      heroDescription:
        locale === "es"
          ? "MonkMonkeyKey combina estrategia, diseño e ingeniería para lanzar y escalar productos digitales con impacto medible."
          : "MonkMonkeyKey combines strategy, design, and engineering to launch and scale digital products with measurable impact.",
      primaryCTA: locale === "es" ? "Agenda una llamada" : "Book a call",
      secondaryCTA: locale === "es" ? "Ver casos" : "See work",
      secondaryHref: "#work",
      sectionTitles: {
        services: locale === "es" ? "Servicios clave" : "Key services",
        process: locale === "es" ? "Cómo trabajamos" : "How we work",
        work: locale === "es" ? "Historias de impacto" : "Impact stories",
        contact: locale === "es" ? "Listo para conversar?" : "Ready to talk?",
      },
      testimonialsIntro:
        locale === "es"
          ? "Lo que dicen quienes construyen con nosotros"
          : "What our partners say about working with us",
      contactDescription:
        locale === "es"
          ? "Cuéntanos sobre tu desafío y diseñemos juntos el siguiente paso. Respondemos en menos de 24 horas."
          : "Tell us about your challenge and let's design the next step together. We reply in under 24 hours.",
      contactCTA: locale === "es" ? "Escríbenos" : "Write to us",
      languageLabel: locale === "es" ? "Idioma" : "Language",
    };
  }, [locale]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),_transparent_50%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-10 sm:px-10">
        <header className="flex flex-col gap-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">MonkMonkeyKey</span>
            <p className="text-lg text-zinc-600">{texts.tagline}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-700">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-full border border-transparent px-4 py-2 transition hover:border-zinc-300 hover:bg-white/70"
              >
                {item.label[locale]}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="hidden sm:inline">{texts.languageLabel}</span>
            <div className="flex gap-1 rounded-full bg-zinc-100 p-1">
              {(["es", "en"] as Locale[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                    locale === code
                      ? "bg-white text-zinc-900 shadow"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                  aria-pressed={locale === code}
                >
                  {code === "es" ? "ES" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="mt-12 flex flex-1 flex-col gap-20">
          <section className="grid gap-12 rounded-3xl border border-white/60 bg-white/80 p-10 shadow-xl backdrop-blur-md lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                <span className="inline-flex items-center gap-2 self-start rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                  {texts.tagline}
                </span>
                <h1 className="text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl">
                  {texts.heroTitle}
                </h1>
                <p className="text-lg leading-relaxed text-zinc-600">
                  {texts.heroDescription}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:hola@monkmonkeykey.com"
                  className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
                >
                  {texts.primaryCTA}
                </a>
                <a
                  href={texts.secondaryHref}
                  className="flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-white"
                >
                  {texts.secondaryCTA}
                </a>
              </div>
            </div>
            <div className="grid gap-6">
              <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  {locale === "es" ? "Indicadores" : "Signals"}
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                  {STATS.map((stat) => (
                    <div key={stat.value} className="flex flex-col gap-1">
                      <span className="text-3xl font-semibold text-zinc-900">{stat.value}</span>
                      <p className="text-sm leading-relaxed text-zinc-500">
                        {stat.label[locale]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/70 p-6 text-sm text-zinc-500">
                {locale === "es"
                  ? "Nos integramos con startups y equipos corporativos para impulsar nuevos productos, optimizar funnels existentes y crear experiencias memorables."
                  : "We partner with startups and corporate teams to launch new products, optimize existing funnels, and craft memorable experiences."}
              </div>
            </div>
          </section>

          <section id="services" className="space-y-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-semibold text-zinc-900">
                {texts.sectionTitles.services}
              </h2>
              <p className="text-lg text-zinc-600">
                {locale === "es"
                  ? "Servicios modulares que se adaptan a tu etapa y necesidades."
                  : "Modular services tailored to your stage and needs."}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.icon}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-lg backdrop-blur"
                >
                  <span className="text-3xl">{feature.icon}</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-zinc-900">
                      {feature.title[locale]}
                    </h3>
                    <p className="text-base leading-relaxed text-zinc-600">
                      {feature.description[locale]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="process" className="space-y-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-semibold text-zinc-900">
                {texts.sectionTitles.process}
              </h2>
              <p className="text-lg text-zinc-600">
                {locale === "es"
                  ? "Un marco probado que reduce la incertidumbre y acelera el aprendizaje."
                  : "A proven framework that reduces uncertainty and accelerates learning."}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {STEPS.map((step, index) => (
                <div
                  key={step.title.es}
                  className="relative flex h-full flex-col gap-4 rounded-3xl border border-dashed border-zinc-200 bg-white/70 p-8"
                >
                  <span className="absolute -top-4 left-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white shadow-lg">
                    {index + 1}
                  </span>
                  <h3 className="pt-6 text-xl font-semibold text-zinc-900">
                    {step.title[locale]}
                  </h3>
                  <p className="text-base leading-relaxed text-zinc-600">
                    {step.description[locale]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="work" className="space-y-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-semibold text-zinc-900">
                {texts.sectionTitles.work}
              </h2>
              <p className="text-lg text-zinc-600">{texts.testimonialsIntro}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {TESTIMONIALS.map((testimonial) => (
                <figure
                  key={testimonial.author}
                  className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-lg"
                >
                  <blockquote className="text-lg italic leading-relaxed text-zinc-700">
                    “{testimonial.quote[locale]}”
                  </blockquote>
                  <figcaption className="text-sm font-medium text-zinc-500">
                    <span className="block text-zinc-900">{testimonial.author}</span>
                    <span>{testimonial.role[locale]}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="space-y-6 rounded-3xl border border-zinc-200 bg-zinc-900 px-10 py-12 text-white shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold">{texts.sectionTitles.contact}</h2>
              <p className="text-lg text-zinc-200">{texts.contactDescription}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:hola@monkmonkeykey.com"
                className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                {texts.contactCTA}
              </a>
              <a
                href="https://cal.com/monkmonkeykey/consulta"
                className="flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                {locale === "es" ? "Agendar sesión" : "Schedule a session"}
              </a>
            </div>
          </section>
        </main>

        <footer className="mt-16 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/70 p-6 text-sm text-zinc-500 sm:flex-row">
          <span>© {new Date().getFullYear()} MonkMonkeyKey. {locale === "es" ? "Todos los derechos reservados." : "All rights reserved."}</span>
          <div className="flex gap-4">
            <a href="mailto:hola@monkmonkeykey.com" className="hover:text-zinc-700">
              hola@monkmonkeykey.com
            </a>
            <a href="https://www.linkedin.com" className="hover:text-zinc-700" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://www.instagram.com" className="hover:text-zinc-700" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
