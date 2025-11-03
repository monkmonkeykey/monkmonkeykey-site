import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonkMonkeyKey · Product Strategy Studio",
  description:
    "MonkMonkeyKey impulsa productos digitales con estrategia, diseño y desarrollo centrados en resultados tangibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-background text-foreground">{children}</body>
    </html>
  );
}
