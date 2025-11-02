const events = [
  {
    date: "2024-07-12",
    title: "Jam Electrónica en la Azotea",
    venue: "Terraza Luminosa, CDMX",
    link: "https://example.com/eventos/jam-azotea",
  },
  {
    date: "2024-08-03",
    title: "Taller de Live Coding Creativo",
    venue: "Laboratorio Sonoro, Guadalajara",
    link: "https://example.com/eventos/live-coding",
  },
  {
    date: "2024-09-14",
    title: "MonkMonkeyKey en Concierto",
    venue: "Foro Indie Rocks!, CDMX",
    link: "https://example.com/eventos/mmk-concierto",
  },
];

function formatDate(date: string) {
  const parsed = new Date(date);
  const day = parsed.toLocaleDateString("es-MX", { day: "2-digit" });
  const month = parsed
    .toLocaleDateString("es-MX", { month: "short" })
    .replace(".", "");
  const year = parsed.toLocaleDateString("es-MX", { year: "numeric" });

  return { day, month, year };
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-50">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-16 px-6 py-20 sm:px-10 lg:px-16">
        <header className="flex flex-col gap-6 text-center sm:text-left">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">
            Próximos eventos
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Vibra con las próximas presentaciones de MonkMonkeyKey
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-300 sm:mx-0">
            Descubre dónde estaremos mezclando ritmos experimentales y energía
            en vivo. ¡Reserva tu lugar antes de que se agoten!
          </p>
        </header>

        <section className="flex flex-col gap-6">
          {events.map((event) => {
            const { day, month, year } = formatDate(event.date);

            return (
              <article
                key={event.date + event.title}
                className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-8"
              >
                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="flex min-w-[96px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-lime-400 to-amber-400 px-6 py-4 text-black shadow-lg">
                    <span className="text-xs font-semibold uppercase tracking-widest">
                      {month}
                    </span>
                    <span className="text-4xl font-black leading-none">
                      {day}
                    </span>
                    <span className="text-xs font-medium">{year}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold sm:text-2xl">
                      {event.title}
                    </h2>
                    <p className="text-sm text-zinc-300 sm:text-base">
                      {event.venue}
                    </p>
                  </div>
                </div>

                <a
                  href={event.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-black transition hover:-translate-y-0.5 hover:bg-emerald-300"
                >
                  Reservar entradas
                  <span aria-hidden>→</span>
                </a>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
