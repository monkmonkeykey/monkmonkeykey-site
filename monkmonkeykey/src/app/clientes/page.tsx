"use client";

import Image from "next/image";

import { CLIENTS } from "@/content/clients";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

const PAGE_TITLE = {
  es: "Clientes y aliados",
  en: "Clients and partners",
} as const;

const PAGE_COPY = {
  es: "Co-diseñamos soluciones junto a startups, scaleups y corporativos que buscan acelerar la entrega de valor.",
  en: "We co-design solutions with startups, scaleups, and enterprises that need to accelerate value delivery.",
} as const;

export default function ClientsPage() {
  const { locale } = useLocale();

  return (
    <div className="space-y-10">
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
            src="/images/clients-visual.svg"
            alt={
              locale === "es"
                ? "Ilustración abstracta de conexiones con clientes"
                : "Abstract illustration of client connections"
            }
            fill
            className="object-cover"
          />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {CLIENTS.map((client) => (
          <article
            key={client.name}
            className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold text-foreground/90">
                {client.name}
              </h2>
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                {translate(locale, client.sector)}
              </span>
            </div>
            <p className="mt-4 text-sm text-foreground/70">
              {translate(locale, client.summary)}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
