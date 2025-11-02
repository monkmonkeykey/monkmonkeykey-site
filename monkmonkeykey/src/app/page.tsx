import Image from "next/image";

const testimonials = [
  {
    quote:
      "La claridad estratégica que recibimos nos permitió articular una visión compartida en todo el equipo en menos de un mes.",
    name: "Daniela García",
    role: "Directora de Innovación",
    organization: "Studio Norte",
  },
  {
    quote:
      "Transformaron una idea compleja en un sistema de marca simple y poderoso que ahora guía todas nuestras decisiones.",
    name: "Leonardo Pérez",
    role: "CEO",
    organization: "Orbital",
  },
  {
    quote:
      "El acompañamiento fue impecable: procesos ligeros, preguntas profundas y resultados con los que la organización se identifica.",
    name: "Isabel Méndez",
    role: "People & Culture",
    organization: "Casa del Sol",
  },
  {
    quote:
      "Nos ayudaron a ordenar nuestras prioridades y diseñar una narrativa honesta que hoy conecta con nuestros aliados.",
    name: "Mauricio Rojas",
    role: "Cofundador",
    organization: "Alameda",
  },
];

const partners = [
  { name: "Atlas", logo: "/partners/atlas.svg" },
  { name: "Monument", logo: "/partners/monument.svg" },
  { name: "Helios", logo: "/partners/helios.svg" },
  { name: "Radii", logo: "/partners/radii.svg" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 py-16 sm:px-10 lg:px-16">
        <header className="flex flex-col gap-8">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Consultoría creativa</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
            Estrategias, marcas y experiencias diseñadas con precisión y calma.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-600">
            Acompañamos equipos visionarios a construir sistemas claros, sensibles y sostenibles. Nuestro trabajo cruza
            investigación, identidad y diseño de servicios para transformar organizaciones desde adentro.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-zinc-500">
            <span className="rounded-full border border-zinc-200 px-4 py-2">Diagnóstico de marca</span>
            <span className="rounded-full border border-zinc-200 px-4 py-2">Arquitectura narrativa</span>
            <span className="rounded-full border border-zinc-200 px-4 py-2">Diseño de experiencias</span>
          </div>
        </header>

        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">Testimonios</h2>
            <p className="max-w-2xl text-2xl font-medium leading-tight text-zinc-900">
              Voces de quienes confían en procesos cuidadosamente diseñados.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article
                key={`${testimonial.name}-${testimonial.organization}`}
                className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)]"
              >
                <blockquote className="text-lg leading-relaxed text-zinc-700">
                  “{testimonial.quote}”
                </blockquote>
                <footer className="flex flex-col gap-1 text-sm uppercase tracking-[0.2em] text-zinc-500">
                  <span className="font-medium text-zinc-900">{testimonial.name}</span>
                  <span>
                    {testimonial.role} · {testimonial.organization}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-10 pb-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">Alianzas</h2>
            <p className="max-w-xl text-2xl font-medium leading-tight text-zinc-900">
              Colaboramos con equipos que valoran la simplicidad y el detalle.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center justify-center rounded-3xl border border-zinc-200 bg-white py-8 transition-colors hover:border-zinc-300"
              >
                <Image src={partner.logo} alt={`${partner.name} logo`} width={120} height={40} priority />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
