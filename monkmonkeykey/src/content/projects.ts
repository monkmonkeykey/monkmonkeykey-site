import type { Locale, LocaleText } from "@/lib/i18n";

export type LocalizedValue = string | LocaleText;

export type ProjectGalleryImage = {
  src: string;
  alt: LocaleText;
};

export type ProjectCategory =
  | "museografia"
  | "experiencias-digitales"
  | "branding";

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, LocaleText> = {
  museografia: {
    es: "Museografía",
    en: "Museography",
  },
  "experiencias-digitales": {
    es: "Experiencias digitales",
    en: "Digital experiences",
  },
  branding: {
    es: "Branding",
    en: "Branding",
  },
};

export type Project = {
  slug: string;
  name: LocaleText;
  subtitle: LocaleText;
  categories: ProjectCategory[];
  year: string;
  client: LocalizedValue;
  location: LocalizedValue;
  cover: ProjectGalleryImage;
  gallery: ProjectGalleryImage[];
  description: LocaleText[];
  meta: { label: LocaleText; value: LocalizedValue }[];
};

export const translateValue = (locale: Locale, value: LocalizedValue): string => {
  if (typeof value === "string") {
    return value;
  }

  return value[locale];
};

export const PROJECTS: Project[] = [
  {
    slug: "museo-banco-mexico",
    name: {
      es: "Museo del Banco de México",
      en: "Bank of Mexico Museum",
    },
    subtitle: {
      es: "Desarrollo de exhibiciones multimedia",
      en: "Multimedia exhibition development",
    },
    categories: ["museografia", "experiencias-digitales"],
    year: "2023",
    client: "MIDE / Banco de México",
    location: {
      es: "Ciudad de México",
      en: "Mexico City",
    },
    cover: {
      src: "/projects/museo-banco-mexico/cover.svg",
      alt: {
        es: "Visualización abstracta de paneles informativos del Museo del Banco de México",
        en: "Abstract visualisation of the Bank of Mexico Museum exhibition panels",
      },
    },
    gallery: [1, 2, 3].map((index) => ({
      src: `/projects/museo-banco-mexico/gallery-${index}.svg`,
      alt: {
        es: `Detalle visual del proyecto Museo Banco de México ${index}`,
        en: `Visual detail of the Banco de México Museum project ${index}`,
      },
    })),
    description: [
      {
        es: "El Banco de México nos abrió las puertas del edificio principal para que el público conectara la colección institucional con las funciones del Banco Central.",
        en: "The Bank of Mexico invited us to activate the main building so visitors could connect the institutional collection with the Central Bank's role.",
      },
      {
        es: "Instalamos exhibiciones multimedia inmersivas que articulan los archivos históricos con experiencias táctiles y sonoras. El vestíbulo principal integra recursos audiovisuales, vitrinas interactivas y piezas gráficas restauradas.",
        en: "We installed immersive multimedia exhibits that combine historical archives with tactile and sound experiences. The main lobby now integrates audiovisual resources, interactive showcases, and restored graphic pieces.",
      },
      {
        es: "La cooperación del proyecto se concretó con la participación de la familia Revueltas, custodios del archivo personal de Fermín Revueltas. Los materiales inéditos del artista guían la narrativa museográfica y enfatizan la identidad moderna del Banco Central.",
        en: "The project came to life thanks to the Revueltas family, custodians of Fermín Revueltas' personal archive. The artist's unpublished materials guide the museographic narrative and highlight the modern identity of the Central Bank.",
      },
    ],
    meta: [
      {
        label: {
          es: "Colaboradores",
          en: "Collaborators",
        },
        value: {
          es: "Rheinsberger, RWA, AxC",
          en: "Rheinsberger, RWA, AxC",
        },
      },
      {
        label: {
          es: "Premios",
          en: "Awards",
        },
        value: {
          es: "Selección Bienal de Diseño Mexicano 2024",
          en: "Mexican Design Biennial Selection 2024",
        },
      },
    ],
  },
  {
    slug: "atlas-experience-lab",
    name: {
      es: "Atlas Experience Lab",
      en: "Atlas Experience Lab",
    },
    subtitle: {
      es: "Laboratorio inmersivo para descubrimiento de producto",
      en: "Immersive lab for product discovery",
    },
    categories: ["experiencias-digitales"],
    year: "2022",
    client: "Atlas Labs",
    location: {
      es: "Bogotá, Colombia",
      en: "Bogotá, Colombia",
    },
    cover: {
      src: "/projects/atlas-experience-lab/cover.svg",
      alt: {
        es: "Interfaz conceptual del laboratorio Atlas Experience Lab",
        en: "Conceptual interface for the Atlas Experience Lab",
      },
    },
    gallery: [1, 2, 3].map((index) => ({
      src: `/projects/atlas-experience-lab/gallery-${index}.svg`,
      alt: {
        es: `Detalle visual del proyecto Atlas Experience Lab ${index}`,
        en: `Visual detail of the Atlas Experience Lab project ${index}`,
      },
    })),
    description: [
      {
        es: "Atlas necesitaba un espacio dedicado para reunir investigación, prototipos y sesiones con clientes clave antes de grandes lanzamientos.",
        en: "Atlas needed a dedicated space to bring together research, prototypes, and key client sessions ahead of major releases.",
      },
      {
        es: "Diseñamos un laboratorio modular con estaciones sensoriales, paneles de datos en tiempo real y herramientas colaborativas. El equipo puede documentar hallazgos, ajustar conceptos y compartir decisiones en una sola visita.",
        en: "We designed a modular lab with sensory stations, real-time data panels, and collaborative tools. The team can document findings, adjust concepts, and align on decisions in a single visit.",
      },
    ],
    meta: [
      {
        label: {
          es: "Reconocimientos",
          en: "Recognitions",
        },
        value: {
          es: "Mención honorífica en Premios UX Latam",
          en: "Honourable mention at UX Latam Awards",
        },
      },
    ],
  },
  {
    slug: "loop-brand-labs",
    name: {
      es: "Loop Brand Labs",
      en: "Loop Brand Labs",
    },
    subtitle: {
      es: "Estrategia creativa y despliegue de identidad",
      en: "Creative strategy and identity roll-out",
    },
    categories: ["branding", "experiencias-digitales"],
    year: "2021",
    client: "Loop Brand Labs",
    location: {
      es: "Monterrey, México",
      en: "Monterrey, Mexico",
    },
    cover: {
      src: "/projects/loop-brand-labs/cover.svg",
      alt: {
        es: "Representación abstracta de un sistema de marca para Loop",
        en: "Abstract representation of the Loop brand system",
      },
    },
    gallery: [1, 2, 3].map((index) => ({
      src: `/projects/loop-brand-labs/gallery-${index}.svg`,
      alt: {
        es: `Detalle visual del proyecto Loop Brand Labs ${index}`,
        en: `Visual detail of the Loop Brand Labs project ${index}`,
      },
    })),
    description: [
      {
        es: "Loop buscaba reposicionarse para atraer alianzas internacionales y capital semilla. El equipo necesitaba un lenguaje visual consistente y adaptable a múltiples formatos.",
        en: "Loop wanted to reposition to attract international partnerships and seed funding. The team needed a consistent visual language adaptable to multiple formats.",
      },
      {
        es: "Co-creamos un sistema de identidad con herramientas de prototipado en vivo, guías modulares y activos para marketing. El despliegue se ejecutó en seis semanas con acompañamiento creativo.",
        en: "We co-created an identity system with live prototyping tools, modular guidelines, and marketing assets. The rollout launched in six weeks with ongoing creative support.",
      },
    ],
    meta: [
      {
        label: {
          es: "Servicios",
          en: "Services",
        },
        value: {
          es: "Identidad visual, diseño UX, producción",
          en: "Visual identity, UX design, production",
        },
      },
    ],
  },
];
