type Resource = {
  title: string;
  category: string;
  year: number;
  description: string;
  mediaUrl?: string;
};

const resources: Resource[] = [
  {
    title: "Introducción a Monk Monkey Key",
    category: "Documentación",
    year: 2024,
    description:
      "Resumen general del proyecto, su misión y la hoja de ruta de funcionalidades planificadas.",
    mediaUrl: "https://example.com/presentacion.pdf",
  },
  {
    title: "Diseño de identidad visual",
    category: "Branding",
    year: 2023,
    description:
      "Guía de estilo que recopila paleta de colores, tipografías y aplicaciones del logotipo.",
    mediaUrl: "https://example.com/identidad-visual",
  },
  {
    title: "Demo interactiva de la plataforma",
    category: "Producto",
    year: 2024,
    description:
      "Recorrido guiado por las principales pantallas del producto y sus flujos básicos.",
    mediaUrl: "https://example.com/demo",
  },
  {
    title: "Notas de investigación de usuarios",
    category: "Investigación",
    year: 2022,
    description:
      "Hallazgos clave de entrevistas y pruebas de usabilidad realizadas con usuarios objetivo.",
  },
  {
    title: "Plan de lanzamiento",
    category: "Marketing",
    year: 2024,
    description:
      "Cronograma de actividades, canales y mensajes para la campaña de lanzamiento.",
  },
  {
    title: "KPIs y métricas de seguimiento",
    category: "Analítica",
    year: 2024,
    description:
      "Panel de métricas clave para evaluar el desempeño del producto tras su lanzamiento.",
    mediaUrl: "https://example.com/dashboard",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 sm:px-10 lg:px-16">
        <header className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400">
            Recursos destacados
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            Explora la evolución de Monk Monkey Key
          </h1>
          <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Una colección curada de materiales para conocer el proyecto desde diferentes perspectivas: estrategia,
            diseño, investigación y métricas.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <article
              key={`${resource.title}-${resource.year}`}
              className="flex h-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200">
                  {resource.category}
                </span>
                <h2 className="text-xl font-semibold leading-tight">{resource.title}</h2>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{resource.year}</p>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{resource.description}</p>
              </div>

              {resource.mediaUrl ? (
                <a
                  href={resource.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Ver material multimedia
                </a>
              ) : (
                <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                  Material en preparación
                </p>
              )}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
