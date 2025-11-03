import type { LocaleText } from "@/lib/i18n";

export type Project = {
  slug: string;
  client: string;
  title: LocaleText;
  challenge: LocaleText;
  approach: LocaleText;
  impact: LocaleText;
  tags: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "syntropy-expansion",
    client: "Syntropy Labs",
    title: {
      es: "Expansión regional con operaciones eficientes",
      en: "Regional expansion with efficient operations",
    },
    challenge: {
      es: "Necesitaban lanzar rápidamente en nuevos mercados con normativas cambiantes.",
      en: "Needed to launch quickly in new markets with evolving regulations.",
    },
    approach: {
      es: "Diseñamos un playbook de expansión y automatizamos los flujos de onboarding.",
      en: "Designed an expansion playbook and automated onboarding flows.",
    },
    impact: {
      es: "Ingresos regionales x2 y cumplimiento auditado en cada país.",
      en: "Doubled regional revenue with compliant launches in every country.",
    },
    tags: ["Strategy", "Ops", "Fintech"],
  },
  {
    slug: "solaria-ops",
    client: "Solaria",
    title: {
      es: "Control operativo 24/7 para plantas solares",
      en: "24/7 operational control for solar plants",
    },
    challenge: {
      es: "Los equipos distribuídos trabajaban con hojas de cálculo desconectadas.",
      en: "Distributed teams relied on disconnected spreadsheets.",
    },
    approach: {
      es: "Implementamos investigación contextual y prototipos para priorizar alertas críticas.",
      en: "Ran contextual research and prototypes to prioritise critical alerts.",
    },
    impact: {
      es: "Respuesta a incidentes 30% más rápida y fallas críticas reducidas a la mitad.",
      en: "30% faster incident response and critical failures cut in half.",
    },
    tags: ["UX", "Data", "Energy"],
  },
  {
    slug: "aulalibre-marketplace",
    client: "AulaLibre",
    title: {
      es: "Marketplace híbrido listo para escalar",
      en: "Hybrid marketplace ready to scale",
    },
    challenge: {
      es: "El MVP inicial no retenía a los docentes ni a los estudiantes.",
      en: "The initial MVP failed to retain teachers and students.",
    },
    approach: {
      es: "Co-creamos journeys diferenciados y un modelo de revenue compartido.",
      en: "Co-created tailored journeys and a shared revenue model.",
    },
    impact: {
      es: "Retención mensual +18 puntos y NPS +21 en tres meses.",
      en: "Monthly retention +18 points and NPS +21 within three months.",
    },
    tags: ["Product", "Growth", "Edtech"],
  },
];
