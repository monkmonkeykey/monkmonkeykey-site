import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden bg-slate-950 py-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),transparent_65%)]" />
        <div className="absolute left-[-10%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute right-[-12%] top-1/3 h-[360px] w-[360px] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 text-center sm:px-10 lg:flex-row lg:items-center lg:gap-20 lg:px-12 lg:text-left">
        <div className="flex max-w-2xl flex-1 flex-col items-center lg:items-start">
          <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-sky-300/80">
            Plataforma Creativa
          </span>
          <h1 className="mt-8 text-4xl font-semibold leading-[1.1] text-slate-50 sm:text-5xl lg:text-6xl">
            Diseña experiencias digitales memorables con un sistema de creación ágil.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Simplifica tu flujo de trabajo, colabora en tiempo real y publica productos con una estética impecable. Todo desde un único panel listo para equipos modernos.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link
              href="#contacto"
              className="group inline-flex items-center justify-center rounded-full bg-sky-400 px-8 py-3 text-base font-semibold text-slate-950 shadow-[0_15px_50px_rgba(56,189,248,0.35)] transition hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200"
            >
              Empieza hoy
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3 text-base font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            >
              Ver demo
            </Link>
          </div>
          <div className="mt-12 grid w-full max-w-lg grid-cols-1 gap-6 sm:grid-cols-3 sm:text-left">
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-slate-100 shadow-[0_25px_40px_rgba(15,23,42,0.35)]">
              <span className="text-3xl font-semibold text-slate-50">+45%</span>
              <span className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Productividad</span>
            </div>
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-slate-100 shadow-[0_25px_40px_rgba(15,23,42,0.35)]">
              <span className="text-3xl font-semibold text-slate-50">24/7</span>
              <span className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Soporte</span>
            </div>
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-slate-100 shadow-[0_25px_40px_rgba(15,23,42,0.35)]">
              <span className="text-3xl font-semibold text-slate-50">1.2M</span>
              <span className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Usuarios</span>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 justify-center">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/10" />
            <Image
              src="/hero-illustration.svg"
              alt="Ilustración de una plataforma creativa"
              width={560}
              height={560}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
