const notes = [
  {
    title: "Monk Monkey Key revela su próxima gira mundial",
    outlet: "Rolling Stone",
    url: "https://www.rollingstone.com/music/music-news/",
    year: 2024,
  },
  {
    title: "La banda que redefine el funk latino",
    outlet: "Billboard",
    url: "https://www.billboard.com/music/latin/",
    year: 2023,
  },
  {
    title: "Un viaje sonoro lleno de groove y psicodelia",
    outlet: "Pitchfork",
    url: "https://pitchfork.com/reviews/albums/",
    year: 2022,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-100 px-6 py-16 text-zinc-900 dark:from-black dark:via-zinc-950 dark:to-black dark:text-zinc-50">
      <main className="flex w-full max-w-4xl flex-col gap-12">
        <header className="flex flex-col gap-4 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
            Monk Monkey Key
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Notas de prensa seleccionadas
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Una colección de artículos destacados sobre el proyecto, con enlaces directos para profundizar en la historia detrás del sonido.
          </p>
          <div>
            <a
              href="/docs/press-kit.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <span aria-hidden>⬇️</span>
              Descargar press kit
            </a>
          </div>
        </header>

        <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {notes.map((note) => (
              <li key={`${note.outlet}-${note.year}`} className="flex items-start gap-4 py-5">
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-zinc-900 text-lg text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  🗞️
                </span>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {note.outlet}
                    </p>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {note.year}
                    </span>
                  </div>
                  <a
                    href={note.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                  >
                    {note.title}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
