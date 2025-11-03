"use client";

import { translate } from "@/lib/i18n";
import { useLocale } from "./locale-context";

const FOOTER_COPY = {
  es: "Construimos productos digitales centrados en las personas.",
  en: "We build people-centred digital products.",
} as const;

export function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="border-t border-foreground/10 bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-foreground/60 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} MonkMonkeyKey</p>
        <p>{translate(locale, FOOTER_COPY)}</p>
      </div>
    </footer>
  );
}
