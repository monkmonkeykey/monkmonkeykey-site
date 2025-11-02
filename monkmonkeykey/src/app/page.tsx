export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-3xl rounded-3xl bg-white p-10 shadow-xl dark:bg-zinc-950 dark:text-zinc-50">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold tracking-tight">Conectemos</h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            ¿Tienes una idea, proyecto o simplemente quieres saludar? Completa el formulario o utiliza
            las opciones directas para ponerte en contacto.
          </p>
        </div>

        <section aria-labelledby="contact-form-heading" className="mt-10">
          <h2 id="contact-form-heading" className="text-2xl font-semibold">
            Enviar mensaje
          </h2>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-300">
            Responderé lo antes posible. Los campos marcados con * son obligatorios.
          </p>
          <form
            className="mt-8 space-y-6"
            action="mailto:hola@monkmonkeykey.com"
            method="post"
            encType="text/plain"
          >
            {/* TODO: Reemplazar por integración con Formspree u otro servicio para gestionar envíos. */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="name">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus-visible:ring-zinc-100"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="email">
                Correo electrónico
                <span aria-hidden="true" className="text-rose-600">
                  *
                </span>
                <span className="sr-only"> (obligatorio)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus-visible:ring-zinc-100"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="message">
                Mensaje
                <span aria-hidden="true" className="text-rose-600">
                  *
                </span>
                <span className="sr-only"> (obligatorio)</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus-visible:ring-zinc-100"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-900"
            >
              Enviar mensaje
            </button>
          </form>
        </section>

        <section aria-labelledby="contact-direct-heading" className="mt-12">
          <h2 id="contact-direct-heading" className="text-2xl font-semibold">
            Opciones rápidas
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              className="flex items-center justify-center rounded-2xl border border-zinc-200 px-5 py-4 text-base font-medium text-zinc-900 transition hover:border-zinc-400 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:text-white dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-900"
              href="mailto:hola@monkmonkeykey.com"
            >
              Escribir un correo
            </a>
            <a
              className="flex items-center justify-center rounded-2xl border border-zinc-200 px-5 py-4 text-base font-medium text-zinc-900 transition hover:border-zinc-400 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:text-white dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-900"
              href="https://cal.com/monkmonkeykey"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar una reunión
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
