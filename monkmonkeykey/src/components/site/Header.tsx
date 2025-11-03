"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/content/navigation";
import { AVAILABLE_LOCALES, translate } from "@/lib/i18n";
import { useLocale } from "./locale-context";

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();

  return (
    <header className="border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          MonkMonkeyKey
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {NAVIGATION.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition hover:text-foreground/80 ${
                  isActive ? "font-semibold text-foreground" : "text-foreground/60"
                }`}
              >
                {translate(locale, item.label)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 text-xs">
          {AVAILABLE_LOCALES.map((option) => {
            const isSelected = option.code === locale;

            return (
              <button
                key={option.code}
                type="button"
                onClick={() => setLocale(option.code)}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  isSelected
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
