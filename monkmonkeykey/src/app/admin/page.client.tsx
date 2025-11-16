"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Client, ClientKind } from "@/content/clients";
import type { LocalizedValue, Project, ProjectCategory } from "@/domain/projects";
import { PROJECT_CATEGORY_LABELS } from "@/domain/projects";

import type { LocaleText } from "@/lib/i18n";

type AdminDashboardProps = {
  clients: Client[];
  projects: Project[];
  databaseReady: boolean;
  cloudinaryReady: boolean;
};

type LocaleField = { es: string; en: string };

type ImageField = {
  id: string;
  src: string;
  publicId: string;
  alt: LocaleField;
};

type ProjectMetaField = {
  id: string;
  label: LocaleField;
  value: LocaleField;
};

type ProjectDescriptionField = {
  id: string;
  text: LocaleField;
};

type ProjectVideoField = {
  url: string;
  title: LocaleField;
};

type CloudinaryAsset = {
  id: string;
  publicId: string;
  folder: string;
  url: string;
  thumbnailUrl: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
  createdAt: string;
};

type CloudinaryPickerOptions = {
  folder?: string;
  onSelect: (asset: CloudinaryAsset) => void;
};

type CloudinaryPickerState = {
  open: boolean;
  folder?: string;
  onSelect?: (asset: CloudinaryAsset) => void;
};

const CLIENT_KINDS: { value: ClientKind; label: string }[] = [
  { value: "client", label: "Cliente" },
  { value: "institution", label: "Institución" },
  { value: "partner", label: "Aliado" },
];

const CATEGORY_OPTIONS: { value: ProjectCategory; label: LocaleText }[] = (
  Object.entries(PROJECT_CATEGORY_LABELS) as [ProjectCategory, LocaleText][]
).map(([value, label]) => ({ value, label }));

const createLocaleField = (value?: LocaleText | LocalizedValue): LocaleField => {
  if (!value) {
    return { es: "", en: "" };
  }

  if (typeof value === "string") {
    return { es: value, en: value };
  }

  return { es: value.es ?? "", en: value.en ?? "" };
};

const createImageField = (id: string, image?: { src?: string; publicId?: string; alt: LocaleText }): ImageField => ({
  id,
  src: image?.src ?? "",
  publicId: image?.publicId ?? "",
  alt: createLocaleField(image?.alt),
});

const createMetaField = (id: string, meta?: { label: LocaleText; value: LocalizedValue }): ProjectMetaField => ({
  id,
  label: createLocaleField(meta?.label),
  value: createLocaleField(meta?.value),
});

const createDescriptionField = (id: string, text?: LocaleText): ProjectDescriptionField => ({
  id,
  text: createLocaleField(text),
});

const trimLocaleField = (value: LocaleField): LocaleField => ({
  es: value.es.trim(),
  en: value.en.trim(),
});

const hasLocaleContent = (value: LocaleField): boolean =>
  value.es.trim().length > 0 || value.en.trim().length > 0;

const imageHasData = (image: ImageField): boolean =>
  image.src.trim().length > 0 || image.publicId.trim().length > 0;

const randomId = () => Math.random().toString(36).slice(2, 10);

const extractApiErrorMessage = (payload: unknown, fallback: string): string => {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const { error } = payload as { error?: unknown };

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (typeof error === "number" || typeof error === "boolean") {
    return String(error);
  }

  if (typeof error === "object" && error !== null) {
    try {
      const serialized = JSON.stringify(error);
      if (serialized && serialized !== "{}") {
        return serialized;
      }
    } catch {
      // Ignore JSON serialization failures.
    }
  }

  return fallback;
};

const uploadToCloudinary = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);

  if (folder.trim().length > 0) {
    formData.append("folder", folder);
  }

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(extractApiErrorMessage(data, "Cloudinary rechazó la carga"));
  }

  const payload = (await response.json()) as { publicId: string; src: string };

  return payload;
};

const formatFileSize = (bytes: number): string => {
  if (!bytes || Number.isNaN(bytes)) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const CloudinaryLibraryDialog = ({
  isOpen,
  folder,
  onSelect,
  onClose,
}: {
  isOpen: boolean;
  folder?: string;
  onSelect?: (asset: CloudinaryAsset) => void;
  onClose: () => void;
}) => {
  const [assets, setAssets] = useState<CloudinaryAsset[]>([]);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchAssets = useCallback(
    async (cursor?: string, replace = false) => {
      if (!isOpen) {
        return;
      }

      setStatus("loading");
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("maxResults", "30");

        if (folder?.trim()) {
          params.set("folder", folder.trim());
        }

        if (cursor) {
          params.set("nextCursor", cursor);
        }

        const endpoint = `/api/cloudinary/library?${params.toString()}`;
        const response = await fetch(endpoint, { credentials: "include" });
        const text = await response.text();
        let payload: { assets?: CloudinaryAsset[]; nextCursor?: string | null; error?: unknown } = {};

        if (text.length > 0) {
          try {
            payload = JSON.parse(text) as typeof payload;
          } catch {
            payload = {};
          }
        }

        if (!response.ok) {
          throw new Error(
            extractApiErrorMessage(payload, "No fue posible cargar las imágenes de Cloudinary"),
          );
        }

        setAssets((previous) => (replace ? payload.assets ?? [] : [...previous, ...(payload.assets ?? [])]));
        setNextCursor(payload.nextCursor ?? null);
        setStatus("idle");
      } catch (error) {
        console.error(error);
        setStatus("idle");
        setError(
          error instanceof Error ? error.message : "No fue posible cargar las imágenes de Cloudinary",
        );
      }
    },
    [folder, isOpen],
  );

  useEffect(() => {
    if (!isOpen) {
      setAssets([]);
      setError(null);
      setNextCursor(null);
      setStatus("idle");
      return;
    }

    void fetchAssets(undefined, true);
  }, [fetchAssets, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="relative w-full max-w-5xl space-y-5 rounded-3xl bg-background p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Biblioteca de Cloudinary</h3>
            <p className="text-sm text-foreground/60">
              Selecciona una imagen existente{folder ? ` en “${folder}”` : ""} o carga un nuevo archivo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-foreground/15 px-4 py-1 text-sm font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
          >
            Cerrar
          </button>
        </div>

        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => {
                onSelect?.(asset);
                onClose();
              }}
              className="group rounded-2xl border border-foreground/10 text-left transition hover:border-foreground/50"
            >
              <div className="overflow-hidden rounded-t-2xl bg-foreground/5">
                <Image
                  src={asset.thumbnailUrl || asset.url}
                  alt={asset.publicId}
                  width={640}
                  height={360}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="space-y-1 px-4 py-3 text-xs text-foreground/70">
                <p className="truncate text-sm font-semibold text-foreground" title={asset.publicId}>
                  {asset.publicId}
                </p>
                <p className="truncate" title={asset.folder}>
                  {asset.folder || "(raíz)"}
                </p>
                <p>
                  {asset.format.toUpperCase()} · {asset.width}×{asset.height} · {formatFileSize(asset.bytes)}
                </p>
              </div>
            </button>
          ))}
        </div>

        {assets.length === 0 && status === "idle" && !error && (
          <p className="rounded-2xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground/60">
            No se encontraron imágenes en esta carpeta.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-foreground/60">
          <span>
            {status === "loading"
              ? "Cargando imágenes…"
              : assets.length > 0
                ? `${assets.length} archivo${assets.length === 1 ? "" : "s"}`
                : "Sin resultados"}
          </span>

          <div className="flex gap-3">
            {nextCursor && (
              <button
                type="button"
                onClick={() => void fetchAssets(nextCursor)}
                className="rounded-full border border-foreground/15 px-4 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
              >
                Cargar más
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-foreground/15 px-4 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientManager = ({
  clients,
  cloudinaryReady,
  openCloudinaryPicker,
}: {
  clients: Client[];
  cloudinaryReady: boolean;
  openCloudinaryPicker?: (options: CloudinaryPickerOptions) => void;
}) => {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string>("new");
  const [status, setStatus] = useState<"idle" | "saving" | "deleting">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const emptyForm = useMemo(
    () => ({
      slug: "",
      name: "",
      kind: "client" as ClientKind,
      sector: { es: "", en: "" },
      summary: { es: "", en: "" },
      website: "",
      order: "",
      image: createImageField(randomId()),
    }),
    [],
  );

  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    if (selectedSlug === "new") {
      setForm({ ...emptyForm, image: createImageField(randomId()) });
      return;
    }

    const client = clients.find((item) => item.slug === selectedSlug);

    if (client) {
      setForm({
        slug: client.slug,
        name: client.name,
        kind: client.kind,
        sector: createLocaleField(client.sector),
        summary: createLocaleField(client.summary),
        website: client.website ?? "",
        order: "",
        image: createImageField(randomId(), client.image),
      });
    }
  }, [selectedSlug, clients, emptyForm]);

  const handleSubmit = async () => {
    setStatus("saving");
    setMessage(null);

    try {
      if (!form.slug.trim() || !form.name.trim()) {
        throw new Error("El slug y el nombre son obligatorios");
      }

      const payload: Record<string, unknown> = {
        slug: form.slug.trim(),
        name: form.name.trim(),
        kind: form.kind,
        sector: trimLocaleField(form.sector),
        summary: trimLocaleField(form.summary),
      };

      if (form.website.trim()) {
        payload.website = form.website.trim();
      }

      if (form.order.trim()) {
        const orderNumber = Number.parseInt(form.order.trim(), 10);
        if (!Number.isNaN(orderNumber)) {
          payload.order = orderNumber;
        }
      }

      if (imageHasData(form.image)) {
        payload.image = {
          src: form.image.src.trim() || undefined,
          publicId: form.image.publicId.trim() || undefined,
          alt: trimLocaleField(form.image.alt),
        };
      }

      const endpoint = selectedSlug === "new" ? "/api/clients" : `/api/clients/${selectedSlug}`;
      const method = selectedSlug === "new" ? "POST" : "PATCH";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(extractApiErrorMessage(data, "No fue posible guardar el cliente"));
      }

      setMessage("Cliente guardado correctamente");
      setStatus("idle");
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus("idle");
      setMessage(error instanceof Error ? error.message : "Ocurrió un error al guardar");
    }
  };

  const handleDelete = async () => {
    if (selectedSlug === "new") {
      setForm({ ...emptyForm, image: createImageField(randomId()) });
      return;
    }

    setStatus("deleting");
    setMessage(null);

    try {
      const response = await fetch(`/api/clients/${selectedSlug}` as const, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(extractApiErrorMessage(data, "No fue posible eliminar el cliente"));
      }

      setMessage("Cliente eliminado");
      setStatus("idle");
      setSelectedSlug("new");
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus("idle");
      setMessage(error instanceof Error ? error.message : "Ocurrió un error al eliminar");
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground/90">Clientes y organizaciones</h2>
        <p className="text-sm text-foreground/60">
          Gestiona los perfiles de clientes, instituciones y aliados que aparecen en el sitio.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,220px)_1fr]">
        <aside className="space-y-2 rounded-2xl border border-foreground/10 bg-foreground/5 p-4">
          <button
            type="button"
            onClick={() => setSelectedSlug("new")}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
              selectedSlug === "new"
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
            }`}
          >
            + Nuevo registro
          </button>

          <div className="max-h-80 space-y-1 overflow-y-auto pr-1 text-sm">
            {clients.map((client) => (
              <button
                key={client.slug}
                type="button"
                onClick={() => setSelectedSlug(client.slug)}
                className={`w-full rounded-xl px-3 py-2 text-left transition ${
                  selectedSlug === client.slug
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                }`}
              >
                {client.name}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-5 rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Slug</span>
              <input
                value={form.slug}
                onChange={(event) => setForm((previous) => ({ ...previous, slug: event.target.value }))}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                placeholder="ej. atlas-labs"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Nombre</span>
              <input
                value={form.name}
                onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Sector (ES)</span>
              <input
                value={form.sector.es}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    sector: { ...previous.sector, es: event.target.value },
                  }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Sector (EN)</span>
              <input
                value={form.sector.en}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    sector: { ...previous.sector, en: event.target.value },
                  }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Tipo</span>
              <select
                value={form.kind}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, kind: event.target.value as ClientKind }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              >
                {CLIENT_KINDS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Orden (opcional)</span>
              <input
                value={form.order}
                onChange={(event) => setForm((previous) => ({ ...previous, order: event.target.value }))}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                placeholder="ej. 10"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60 sm:col-span-2">
              <span>Sitio web</span>
              <input
                value={form.website}
                onChange={(event) => setForm((previous) => ({ ...previous, website: event.target.value }))}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                placeholder="https://"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Resumen (ES)</span>
              <textarea
                value={form.summary.es}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    summary: { ...previous.summary, es: event.target.value },
                  }))
                }
                className="min-h-[96px] w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Resumen (EN)</span>
              <textarea
                value={form.summary.en}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    summary: { ...previous.summary, en: event.target.value },
                  }))
                }
                className="min-h-[96px] w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                Identidad visual
              </span>
              {cloudinaryReady && (
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-foreground/15 px-4 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        try {
                          const result = await uploadToCloudinary(file, `clients/${form.slug || "nuevo"}`);
                          setForm((previous) => ({
                            ...previous,
                            image: {
                              ...previous.image,
                              publicId: result.publicId,
                              src: result.src,
                            },
                          }));
                        } catch (error) {
                          console.error(error);
                          setMessage(error instanceof Error ? error.message : "Error al subir la imagen");
                        }
                      }
                    }}
                  />
                  Subir desde Cloudinary
                </label>
              )}
              {cloudinaryReady && openCloudinaryPicker && (
                <button
                  type="button"
                  onClick={() =>
                    openCloudinaryPicker({
                      folder: form.slug.trim() ? `clients/${form.slug.trim()}` : "clients",
                      onSelect: (asset) => {
                        setForm((previous) => ({
                          ...previous,
                          image: {
                            ...previous.image,
                            publicId: asset.publicId,
                            src: asset.url,
                          },
                        }));
                        setMessage("Imagen asignada desde Cloudinary");
                      },
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
                >
                  Elegir existente
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>URL</span>
                <input
                  value={form.image.src}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      image: { ...previous.image, src: event.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                  placeholder="https://"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>Public ID</span>
                <input
                  value={form.image.publicId}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      image: { ...previous.image, publicId: event.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                  placeholder="clients/atlas/logo"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>Alt (ES)</span>
                <input
                  value={form.image.alt.es}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      image: {
                        ...previous.image,
                        alt: { ...previous.image.alt, es: event.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>Alt (EN)</span>
                <input
                  value={form.image.alt.en}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      image: {
                        ...previous.image,
                        alt: { ...previous.image.alt, en: event.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                />
              </label>
            </div>
          </div>

          {message && (
            <p className="rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground/70">
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status !== "idle"}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-60"
            >
              {status === "saving" ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={status === "saving"}
              className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {status === "deleting" ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectManager = ({
  projects,
  clients,
  cloudinaryReady,
  openCloudinaryPicker,
}: {
  projects: Project[];
  clients: Client[];
  cloudinaryReady: boolean;
  openCloudinaryPicker?: (options: CloudinaryPickerOptions) => void;
}) => {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string>("new");
  const [status, setStatus] = useState<"idle" | "saving" | "deleting">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const emptyForm = useMemo(
    () => ({
      slug: "",
      name: createLocaleField(),
      subtitle: createLocaleField(),
      categories: [] as ProjectCategory[],
      year: "",
      client: createLocaleField(),
      location: createLocaleField(),
      cover: createImageField(randomId()),
      gallery: [] as ImageField[],
      video: null as ProjectVideoField | null,
      description: [createDescriptionField(randomId())],
      meta: [] as ProjectMetaField[],
      entities: [] as string[],
      order: "",
    }),
    [],
  );

  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    if (selectedSlug === "new") {
      setForm({
        ...emptyForm,
        cover: createImageField(randomId()),
        description: [createDescriptionField(randomId())],
      });
      return;
    }

    const project = projects.find((item) => item.slug === selectedSlug);

    if (project) {
      setForm({
        slug: project.slug,
        name: createLocaleField(project.name),
        subtitle: createLocaleField(project.subtitle),
        categories: [...project.categories],
        year: project.year,
        client: createLocaleField(project.client),
        location: createLocaleField(project.location),
        cover: createImageField(randomId(), project.cover),
        gallery: project.gallery.map((image) => createImageField(randomId(), image)),
        video: project.video
          ? { url: project.video.url, title: createLocaleField(project.video.title) }
          : null,
        description:
          project.description.length > 0
            ? project.description.map((paragraph) => createDescriptionField(randomId(), paragraph))
            : [createDescriptionField(randomId())],
        meta: project.meta.map((item) => createMetaField(randomId(), item)),
        entities: project.entities.map((entity) => entity.slug),
        order: "",
      });
    }
  }, [selectedSlug, projects, emptyForm]);

  const ensureDescription = () => {
    setForm((previous) => ({
      ...previous,
      description:
        previous.description.length === 0
          ? [createDescriptionField(randomId())]
          : previous.description,
    }));
  };

  useEffect(() => {
    ensureDescription();
  }, [selectedSlug]);

  const buildPayload = () => {
    if (!form.slug.trim()) {
      throw new Error("El proyecto necesita un slug");
    }

    if (!form.year.trim()) {
      throw new Error("El campo año es obligatorio");
    }

    if (!imageHasData(form.cover)) {
      throw new Error("Agrega una imagen principal del proyecto");
    }

    const description = form.description
      .map((paragraph) => trimLocaleField(paragraph.text))
      .filter(hasLocaleContent);

    if (description.length === 0) {
      throw new Error("Agrega al menos un párrafo de descripción");
    }

    const payload: Record<string, unknown> = {
      slug: form.slug.trim(),
      name: trimLocaleField(form.name),
      subtitle: trimLocaleField(form.subtitle),
      categories: form.categories,
      year: form.year.trim(),
      client: trimLocaleField(form.client),
      location: trimLocaleField(form.location),
      cover: {
        src: form.cover.src.trim() || undefined,
        publicId: form.cover.publicId.trim() || undefined,
        alt: trimLocaleField(form.cover.alt),
      },
      gallery: form.gallery
        .filter(imageHasData)
        .map((image) => ({
          src: image.src.trim() || undefined,
          publicId: image.publicId.trim() || undefined,
          alt: trimLocaleField(image.alt),
        })),
      description,
      meta: form.meta
        .map((item) => ({
          label: trimLocaleField(item.label),
          value: trimLocaleField(item.value),
        }))
        .filter((item) => hasLocaleContent(item.label) && hasLocaleContent(item.value)),
      entities: form.entities,
    };

    if (form.video?.url.trim()) {
      payload.video = {
        url: form.video.url.trim(),
        title: trimLocaleField(form.video.title),
      };
    }

    if (form.order.trim()) {
      const orderNumber = Number.parseInt(form.order.trim(), 10);
      if (!Number.isNaN(orderNumber)) {
        payload.order = orderNumber;
      }
    }

    return payload;
  };

  const handleSubmit = async () => {
    setStatus("saving");
    setMessage(null);

    try {
      const payload = buildPayload();
      const endpoint = selectedSlug === "new" ? "/api/projects" : `/api/projects/${selectedSlug}`;
      const method = selectedSlug === "new" ? "POST" : "PATCH";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "No fue posible guardar el proyecto");
      }

      setMessage("Proyecto guardado correctamente");
      setStatus("idle");
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus("idle");
      setMessage(error instanceof Error ? error.message : "Ocurrió un error al guardar");
    }
  };

  const handleDelete = async () => {
    if (selectedSlug === "new") {
      setForm({
        ...emptyForm,
        cover: createImageField(randomId()),
        description: [createDescriptionField(randomId())],
      });
      return;
    }

    setStatus("deleting");
    setMessage(null);

    try {
      const response = await fetch(`/api/projects/${selectedSlug}` as const, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "No fue posible eliminar el proyecto");
      }

      setMessage("Proyecto eliminado");
      setStatus("idle");
      setSelectedSlug("new");
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus("idle");
      setMessage(error instanceof Error ? error.message : "Ocurrió un error al eliminar");
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground/90">Proyectos</h2>
        <p className="text-sm text-foreground/60">
          Administra los proyectos, galerías, videos y organizaciones relacionadas.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,220px)_1fr]">
        <aside className="space-y-2 rounded-2xl border border-foreground/10 bg-foreground/5 p-4">
          <button
            type="button"
            onClick={() => setSelectedSlug("new")}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
              selectedSlug === "new"
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
            }`}
          >
            + Nuevo proyecto
          </button>

          <div className="max-h-80 space-y-1 overflow-y-auto pr-1 text-sm">
            {projects.map((project) => (
              <button
                key={project.slug}
                type="button"
                onClick={() => setSelectedSlug(project.slug)}
                className={`w-full rounded-xl px-3 py-2 text-left transition ${
                  selectedSlug === project.slug
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                }`}
              >
                {project.name.es}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-6 rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Slug</span>
              <input
                value={form.slug}
                onChange={(event) => setForm((previous) => ({ ...previous, slug: event.target.value }))}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Año</span>
              <input
                value={form.year}
                onChange={(event) => setForm((previous) => ({ ...previous, year: event.target.value }))}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                placeholder="2024"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Título (ES)</span>
              <input
                value={form.name.es}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    name: { ...previous.name, es: event.target.value },
                  }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Título (EN)</span>
              <input
                value={form.name.en}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    name: { ...previous.name, en: event.target.value },
                  }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Subtítulo (ES)</span>
              <input
                value={form.subtitle.es}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    subtitle: { ...previous.subtitle, es: event.target.value },
                  }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Subtítulo (EN)</span>
              <input
                value={form.subtitle.en}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    subtitle: { ...previous.subtitle, en: event.target.value },
                  }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <div className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60 md:col-span-2">
              <span>Categorías</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      form.categories.includes(option.value)
                        ? "border-foreground bg-foreground text-background"
                        : "border-foreground/15 text-foreground/70 hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={form.categories.includes(option.value)}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          categories: event.target.checked
                            ? [...previous.categories, option.value]
                            : previous.categories.filter((item) => item !== option.value),
                        }))
                      }
                    />
                    <span>{option.label.es}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Cliente (ES)</span>
              <input
                value={form.client.es}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    client: { ...previous.client, es: event.target.value },
                  }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Cliente (EN)</span>
              <input
                value={form.client.en}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    client: { ...previous.client, en: event.target.value },
                  }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Ubicación (ES)</span>
              <input
                value={form.location.es}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    location: { ...previous.location, es: event.target.value },
                  }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Ubicación (EN)</span>
              <input
                value={form.location.en}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    location: { ...previous.location, en: event.target.value },
                  }))
                }
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <span>Orden (opcional)</span>
              <input
                value={form.order}
                onChange={(event) => setForm((previous) => ({ ...previous, order: event.target.value }))}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                placeholder="ej. 20"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                Portada
              </span>
              {cloudinaryReady && (
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-foreground/15 px-4 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        try {
                          const result = await uploadToCloudinary(
                            file,
                            `projects/${form.slug || "nuevo"}/cover`,
                          );
                          setForm((previous) => ({
                            ...previous,
                            cover: {
                              ...previous.cover,
                              publicId: result.publicId,
                              src: result.src,
                            },
                          }));
                        } catch (error) {
                          console.error(error);
                          setMessage(error instanceof Error ? error.message : "Error al subir la portada");
                        }
                      }
                    }}
                  />
                  Subir portada
                </label>
              )}
              {cloudinaryReady && openCloudinaryPicker && (
                <button
                  type="button"
                  onClick={() =>
                    openCloudinaryPicker({
                      folder: form.slug.trim() ? `projects/${form.slug.trim()}` : "projects",
                      onSelect: (asset) => {
                        setForm((previous) => ({
                          ...previous,
                          cover: {
                            ...previous.cover,
                            publicId: asset.publicId,
                            src: asset.url,
                          },
                        }));
                        setMessage("Portada actualizada desde Cloudinary");
                      },
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
                >
                  Elegir existente
                </button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>URL</span>
                <input
                  value={form.cover.src}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      cover: { ...previous.cover, src: event.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>Public ID</span>
                <input
                  value={form.cover.publicId}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      cover: { ...previous.cover, publicId: event.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>Alt (ES)</span>
                <input
                  value={form.cover.alt.es}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      cover: {
                        ...previous.cover,
                        alt: { ...previous.cover.alt, es: event.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>Alt (EN)</span>
                <input
                  value={form.cover.alt.en}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      cover: {
                        ...previous.cover,
                        alt: { ...previous.cover.alt, en: event.target.value },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                Galería
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    gallery: [...previous.gallery, createImageField(randomId())],
                  }))
                }
                className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
              >
                Añadir imagen
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {form.gallery.map((image) => (
                <div key={image.id} className="space-y-2 rounded-2xl border border-foreground/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                      Imagen
                    </span>
                    <div className="flex items-center gap-2">
                      {cloudinaryReady && (
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (event) => {
                              const file = event.target.files?.[0];

                              if (file) {
                                try {
                                  const result = await uploadToCloudinary(
                                    file,
                                    `projects/${form.slug || "nuevo"}/gallery`,
                                  );
                                  setForm((previous) => ({
                                    ...previous,
                                    gallery: previous.gallery.map((item) =>
                                      item.id === image.id
                                        ? { ...item, publicId: result.publicId, src: result.src }
                                        : item,
                                    ),
                                  }));
                                } catch (error) {
                                  console.error(error);
                                  setMessage(error instanceof Error ? error.message : "Error al subir la imagen");
                                }
                              }
                            }}
                          />
                          Subir
                        </label>
                      )}
                      {cloudinaryReady && openCloudinaryPicker && (
                        <button
                          type="button"
                          onClick={() =>
                            openCloudinaryPicker({
                              folder: form.slug.trim() ? `projects/${form.slug.trim()}/gallery` : "projects",
                              onSelect: (asset) => {
                                setForm((previous) => ({
                                  ...previous,
                                  gallery: previous.gallery.map((item) =>
                                    item.id === image.id
                                      ? { ...item, publicId: asset.publicId, src: asset.url }
                                      : item,
                                  ),
                                }));
                                setMessage("Imagen de galería actualizada desde Cloudinary");
                              },
                            })
                          }
                          className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
                        >
                          Elegir existente
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            gallery: previous.gallery.filter((item) => item.id !== image.id),
                          }))
                        }
                        className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                      <span>URL</span>
                      <input
                        value={image.src}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            gallery: previous.gallery.map((item) =>
                              item.id === image.id
                                ? { ...item, src: event.target.value }
                                : item,
                            ),
                          }))
                        }
                        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                      <span>Public ID</span>
                      <input
                        value={image.publicId}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            gallery: previous.gallery.map((item) =>
                              item.id === image.id
                                ? { ...item, publicId: event.target.value }
                                : item,
                            ),
                          }))
                        }
                        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                      <span>Alt (ES)</span>
                      <input
                        value={image.alt.es}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            gallery: previous.gallery.map((item) =>
                              item.id === image.id
                                ? { ...item, alt: { ...item.alt, es: event.target.value } }
                                : item,
                            ),
                          }))
                        }
                        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                      <span>Alt (EN)</span>
                      <input
                        value={image.alt.en}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            gallery: previous.gallery.map((item) =>
                              item.id === image.id
                                ? { ...item, alt: { ...item.alt, en: event.target.value } }
                                : item,
                            ),
                          }))
                        }
                        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                Descripción
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    description: [...previous.description, createDescriptionField(randomId())],
                  }))
                }
                className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
              >
                Añadir párrafo
              </button>
            </div>

            <div className="space-y-4">
              {form.description.map((paragraph) => (
                <div key={paragraph.id} className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                    <span>Texto (ES)</span>
                    <textarea
                      value={paragraph.text.es}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          description: previous.description.map((item) =>
                            item.id === paragraph.id
                              ? { ...item, text: { ...item.text, es: event.target.value } }
                              : item,
                          ),
                        }))
                      }
                      className="min-h-[96px] w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                    />
                  </label>

                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                    <span>Texto (EN)</span>
                    <textarea
                      value={paragraph.text.en}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          description: previous.description.map((item) =>
                            item.id === paragraph.id
                              ? { ...item, text: { ...item.text, en: event.target.value } }
                              : item,
                          ),
                        }))
                      }
                      className="min-h-[96px] w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                    />
                  </label>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          description: previous.description.filter((item) => item.id !== paragraph.id),
                        }))
                      }
                      className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
                    >
                      Quitar párrafo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                Campos adicionales
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    meta: [...previous.meta, createMetaField(randomId())],
                  }))
                }
                className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
              >
                Añadir campo
              </button>
            </div>

            <div className="space-y-4">
              {form.meta.map((item) => (
                <div key={item.id} className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                    <span>Etiqueta (ES)</span>
                    <input
                      value={item.label.es}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          meta: previous.meta.map((metaItem) =>
                            metaItem.id === item.id
                              ? { ...metaItem, label: { ...metaItem.label, es: event.target.value } }
                              : metaItem,
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                    />
                  </label>

                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                    <span>Etiqueta (EN)</span>
                    <input
                      value={item.label.en}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          meta: previous.meta.map((metaItem) =>
                            metaItem.id === item.id
                              ? { ...metaItem, label: { ...metaItem.label, en: event.target.value } }
                              : metaItem,
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                    />
                  </label>

                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                    <span>Valor (ES)</span>
                    <input
                      value={item.value.es}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          meta: previous.meta.map((metaItem) =>
                            metaItem.id === item.id
                              ? { ...metaItem, value: { ...metaItem.value, es: event.target.value } }
                              : metaItem,
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                    />
                  </label>

                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                    <span>Valor (EN)</span>
                    <input
                      value={item.value.en}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          meta: previous.meta.map((metaItem) =>
                            metaItem.id === item.id
                              ? { ...metaItem, value: { ...metaItem.value, en: event.target.value } }
                              : metaItem,
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                    />
                  </label>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          meta: previous.meta.filter((metaItem) => metaItem.id !== item.id),
                        }))
                      }
                      className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
                    >
                      Quitar campo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              Video (opcional)
            </span>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>URL (YouTube o Vimeo)</span>
                <input
                  value={form.video?.url ?? ""}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      video: {
                        url: event.target.value,
                        title: previous.video ? previous.video.title : createLocaleField(),
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>Título (ES)</span>
                <input
                  value={form.video?.title.es ?? ""}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      video: {
                        url: previous.video?.url ?? "",
                        title: {
                          es: event.target.value,
                          en: previous.video?.title.en ?? "",
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <span>Título (EN)</span>
                <input
                  value={form.video?.title.en ?? ""}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      video: {
                        url: previous.video?.url ?? "",
                        title: {
                          es: previous.video?.title.es ?? "",
                          en: event.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background"
                />
              </label>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      video: null,
                    }))
                  }
                  className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
                >
                  Quitar video
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              Organizaciones asociadas
            </span>
            <div className="grid gap-2 md:grid-cols-2">
              {clients.map((client) => (
                <label
                  key={client.slug}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                    form.entities.includes(client.slug)
                      ? "border-foreground bg-foreground/10 text-foreground"
                      : "border-foreground/15 text-foreground/70 hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.entities.includes(client.slug)}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        entities: event.target.checked
                          ? [...previous.entities, client.slug]
                          : previous.entities.filter((slug) => slug !== client.slug),
                      }))
                    }
                  />
                  <span>{client.name}</span>
                </label>
              ))}
            </div>
          </div>

          {message && (
            <p className="rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground/70">
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status !== "idle"}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-60"
            >
              {status === "saving" ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={status === "saving"}
              className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {status === "deleting" ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const AdminDashboard = ({
  clients,
  projects,
  databaseReady,
  cloudinaryReady,
}: AdminDashboardProps) => {
  const [picker, setPicker] = useState<CloudinaryPickerState>({ open: false });

  const closePicker = useCallback(() => {
    setPicker((previous) => ({ ...previous, open: false }));
  }, []);

  const openPicker = useCallback((options: CloudinaryPickerOptions) => {
    setPicker({ open: true, folder: options.folder, onSelect: options.onSelect });
  }, []);

  return (
    <div className="space-y-12">
      {!databaseReady && (
        <div className="rounded-3xl border border-yellow-300 bg-yellow-50 px-6 py-5 text-sm text-yellow-900">
          Configura las variables <code>MONGODB_URI</code> y <code>MONGODB_DB</code> para habilitar el guardado en la base de
          datos. Mientras tanto, el sitio seguirá usando el contenido estático del repositorio.
        </div>
      )}

      {!cloudinaryReady && (
        <div className="rounded-3xl border border-blue-300 bg-blue-50 px-6 py-5 text-sm text-blue-900">
          Añade <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code> y <code>CLOUDINARY_API_SECRET</code> en tu
          entorno para habilitar las cargas directas de medios. Puedes pegar URLs manualmente si ya tienes tus activos.
        </div>
      )}

      <ClientManager
        clients={clients}
        cloudinaryReady={cloudinaryReady}
        openCloudinaryPicker={cloudinaryReady ? openPicker : undefined}
      />
      <ProjectManager
        projects={projects}
        clients={clients}
        cloudinaryReady={cloudinaryReady}
        openCloudinaryPicker={cloudinaryReady ? openPicker : undefined}
      />

      <CloudinaryLibraryDialog
        isOpen={cloudinaryReady && picker.open}
        folder={picker.folder}
        onSelect={(asset) => {
          picker.onSelect?.(asset);
        }}
        onClose={closePicker}
      />
    </div>
  );
};

export default AdminDashboard;
