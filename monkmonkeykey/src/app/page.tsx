import Image from "next/image";

const services = [
  {
    title: "Curaduría y diseño de exposiciones",
    description:
      "Conceptualizamos narrativas inmersivas y producimos experiencias que conectan con públicos diversos.",
    icon: "🎨",
  },
  {
    title: "Programación cultural y festivales",
    description:
      "Acompañamos el desarrollo integral de festivales y ciclos culturales, desde la ideación hasta la producción.",
    icon: "🎭",
  },
  {
    title: "Laboratorios y residencias académicas",
    description:
      "Diseñamos programas de investigación-creación para universidades y centros educativos en colaboración.",
    icon: "🏛️",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="flex w-full max-w-5xl flex-col gap-20 px-6 py-16 sm:px-16">
        <section className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-2xl flex-col gap-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Productora cultural independiente
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Creamos experiencias culturales que inspiran, movilizan y construyen comunidad.
            </h1>
            <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">
              Trabajamos junto a instituciones culturales, festivales y universidades para diseñar proyectos que conecten con
              audiencias reales, integrando investigación, producción y comunicación con un enfoque sensible y contemporáneo.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                className="flex h-12 items-center justify-center rounded-full bg-emerald-600 px-8 text-base font-semibold text-white transition-colors hover:bg-emerald-500"
                href="mailto:hola@monkmonkeykey.com?subject=Quiero%20conversar"
              >
                Agendar conversación
              </a>
              <a
                className="flex h-12 items-center justify-center rounded-full border border-emerald-600 px-8 text-base font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-zinc-900"
                href="mailto:hola@monkmonkeykey.com?subject=Solicitar%20propuesta"
              >
                Solicitar propuesta
              </a>
            </div>
          </div>
          <div className="flex w-full justify-center sm:w-auto">
            <Image
              className="h-40 w-40 rounded-full border border-zinc-200 object-cover dark:border-zinc-800"
              src="/next.svg"
              alt="Identidad de Monk Monkey Key"
              width={160}
              height={160}
              priority
            />
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold sm:text-3xl">Servicios para aliados culturales</h2>
            <p className="max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
              Acompañamos a equipos que buscan producir experiencias memorables. Nuestros servicios combinan estrategia cultural,
              gestión operativa y contenidos listos para activar comunidades.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="text-3xl" aria-hidden="true">
                  {service.icon}
                </span>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">{service.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
