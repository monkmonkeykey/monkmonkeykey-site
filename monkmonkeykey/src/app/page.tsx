import Image from "next/image";

const milestones = [
  {
    year: "2015",
    title: "Primer boceto digital",
    description:
      "Transformé mis cuadernos en proyectos digitales y lancé mis primeras comisiones como ilustrador freelance.",
  },
  {
    year: "2018",
    title: "Estudio creativo independiente",
    description:
      "Fundé un pequeño estudio para acompañar a marcas locales en proyectos de identidad visual y storytelling visual.",
  },
  {
    year: "2023",
    title: "Narrativas inmersivas",
    description:
      "Integro animación, ilustración y experiencias web para construir universos visuales coherentes y memorables.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-20 font-sans dark:bg-black sm:px-8">
      <main className="w-full max-w-5xl rounded-3xl bg-white/80 p-10 shadow-xl ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-900/60 dark:ring-zinc-800 sm:p-16">
        <section className="flex flex-col gap-12 md:flex-row md:items-start md:gap-20">
          <div className="flex justify-center md:sticky md:top-16 md:w-80 md:flex-shrink-0">
            <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 shadow-lg dark:border-zinc-800">
              <Image
                src="/portrait.svg"
                alt="Retrato estilizado de Monk Monkey Key"
                width={320}
                height={400}
                priority
                className="h-auto w-56 md:w-64"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-12">
            <header className="flex flex-col gap-6">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                Monk Monkey Key · Ilustrador y narrador visual
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                Historias visuales que conectan la imaginación con la estrategia.
              </h1>
              <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                Acompaño a equipos creativos y marcas emergentes a traducir sus ideas en universos visuales llenos de
                personalidad. Desde la exploración conceptual hasta la producción final, trabajo mano a mano para que cada
                proyecto respire autenticidad y abra la puerta a nuevas conversaciones.
              </p>
            </header>

            <blockquote className="rounded-3xl border border-sky-200/70 bg-sky-50/80 p-8 text-lg leading-relaxed text-sky-900 shadow-sm dark:border-sky-900/40 dark:bg-sky-900/40 dark:text-sky-100">
              “La curiosidad es el trazo que da forma a cada personaje y la empatía es el color que llena sus mundos.”
            </blockquote>

            <div className="flex flex-col gap-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500 dark:text-zinc-400">
                Hitos recientes
              </h2>
              <ol className="grid gap-6 sm:grid-cols-3">
                {milestones.map((milestone) => (
                  <li
                    key={milestone.year}
                    className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900/70"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">
                      {milestone.year}
                    </span>
                    <p className="mt-3 text-base font-medium text-zinc-900 dark:text-zinc-100">{milestone.title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{milestone.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
