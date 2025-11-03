import type { LocaleText } from "@/lib/i18n";

export type Client = {
  name: string;
  sector: LocaleText;
  summary: LocaleText;
};

export const CLIENTS: Client[] = [
  {
    name: "Syntropy Labs",
    sector: { es: "Fintech", en: "Fintech" },
    summary: {
      es: "Escalamos su plataforma de pagos B2B a cinco nuevos mercados en seis meses.",
      en: "Scaled their B2B payments platform to five new markets in six months.",
    },
  },
  {
    name: "Solaria",
    sector: { es: "Energía", en: "Energy" },
    summary: {
      es: "Creamos un dashboard operativo que redujo tiempos de respuesta en un 30%.",
      en: "Built an operational dashboard that cut response times by 30%.",
    },
  },
  {
    name: "AulaLibre",
    sector: { es: "Edtech", en: "Edtech" },
    summary: {
      es: "Lanzamos un marketplace de cursos híbridos con onboarding auto-gestionado.",
      en: "Launched a hybrid course marketplace with self-serve onboarding.",
    },
  },
  {
    name: "LogiTrack",
    sector: { es: "Logística", en: "Logistics" },
    summary: {
      es: "Implementamos analítica avanzada para optimizar rutas en tiempo real.",
      en: "Implemented advanced analytics to optimise routes in real time.",
    },
  },
];
